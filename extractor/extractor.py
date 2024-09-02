#!/usr/bin/env python
# coding: utf-8

import csv
import re
from playwright.async_api import async_playwright
import asyncio


base_module_url = "https://intra.epitech.eu/module"

class Module:
    
    def __init__(
        self,
        title,
        description,
        code,
        instance,
        credits,
        skills,
        startDate,
        endDate,
        endRegistrationDate,
        project,
        activities,
        appointements,
        registered,
    ):
        # Merge location of activities and appointements
        locations = list(map(lambda activity: activity['location'], activities))
        locations += list(map(lambda appointement: appointement['location'], appointements))
        
        self.title = title
        self.description = description
        self.code = code
        self.instance = instance
        self.credits = credits
        self.skills = skills
        self.startDate = startDate
        self.endDate = endDate
        self.endRegistrationDate = endRegistrationDate
        self.isPresential = any(location.find('Visio') == -1 for location in locations)
        self.project_name = 'N/A' if project is None else project['name']
        self.project_link = 'N/A' if project is None else project['link']
        self.project_start_date = 'N/A' if project is None else project['start_date']
        self.project_end_date = 'N/A' if project is None else project['end_date']
        self.activities = list(map(lambda activity: activity['name'], activities))
        self.appointements = list(map(lambda appointement: appointement['name'], appointements))
        self.locations = locations
        self.registered = registered

    def __str__(self):
        return f"{self.title} ({self.code})"

    def __repr__(self):
        return self.__str__()
    
    def get_url(self):
        return f"{base_module_url}/2024/{self.code}/{self.instance}"


async def extract_appointements(epitechPage):
    aptLink = epitechPage.locator('//*[@id="module"]/div[3]/ul/li[1]/a')
    if aptLink is None:
        return []
    
    await aptLink.click()
    activities = epitechPage.locator('//*[@id="module"]/div[3]/div/ul/li[contains(@class, "rdv")]')
    activitiesCount = await activities.count()
    
    appointements = []
    for i in range(activitiesCount):
        activity = activities.nth(i)
        
        activityTitle = await activity.locator(f'//div[1]/h2/span/a').inner_text()
        try:
            activityLocation = await activity.locator(f'//div[2]/div[2]/div/div[2]/div/div[3]/span[2]').inner_text(timeout=1000)
        except:
            activityLocation = None
            
        appointements.append({
            'name': activityTitle,
            'location': 'N/A' if activityLocation is None else activityLocation
        })
        
    return appointements

async def extract_activities(epitechPage):
    activities = epitechPage.locator('//*[@id="module"]/div[3]/div/ul/li[contains(@class, "tp")]')
    activitiesCount = await activities.count()
    
    activitiesResult = []
    for i in range(activitiesCount):
        activity = activities.nth(i)
        
        activityTitle = await activity.locator(f'//div[1]/h2/span/a').inner_text()
        try:
            activityLocation = await activity.locator(f'//div[2]/div[2]/div/div[2]/div/div[3]/span[2]').inner_text(timeout=1000)
        except:
            activityLocation = None
            
        activitiesResult.append({
            'name': activityTitle,
            'location': 'N/A' if activityLocation is None else activityLocation
        })
        
    return activitiesResult

async def extract_project(epitechPage, code, instance):
    projectLink = epitechPage.locator('//*[@id="module"]/div[3]/ul/li[2]/a')
    if projectLink is None:
        return None
    
    try:
        await projectLink.click(timeout=1000)
    except:
        return None
    
    projects = epitechPage.locator('//*[@id="module"]/div[3]/div/ul/li[contains(@class, "proj")]')
    projectsCount = await projects.count()
    
    if projectsCount == 0:
        return None
        
    project = projects.nth(0)
        
    projectTitle = await project.locator(f'//div[1]/h2/span/a').inner_text()
    try:
        projectStartDate = await project.locator(f'//div[2]/div[1]/div[1]/div[1]/span[2]').inner_text(timeout=1000)
    except:
        projectStartDate = None
        
    try:
        projectEndDate = await project.locator(f'//div[2]/div[1]/div[1]/div[2]/span[2]').inner_text(timeout=1000)
    except:
        projectEndDate = None
        
    try:
        projectLink = await project.locator(f'//div[2]/div[1]/div[2]/div[2]/div[1]/div/ul/li[1]/a').get_attribute(name='href', timeout=1000)
        projectLink = f'{base_module_url}/2024/{code}/{instance}/{projectLink}'
    except:
        projectLink = None
        
    return {
        'name': projectTitle,
        'link': projectLink,
        'start_date': projectStartDate,
        'end_date': projectEndDate
    }
    
async def get_students(epitechPage):
    registered_btn = epitechPage.locator('//*[@id="module"]/div[1]/div[2]/a[1]')
    if registered_btn is None:
        return []
    
    try:
        await registered_btn.click(timeout=1000)
        # Wait for the page to load
        await epitechPage.wait_for_load_state('load', timeout=2000)
        
        studentsList = epitechPage.locator('//*[@id="grid-note"]/div[2]/div/table/tbody/tr')
        count = await studentsList.count()
        
        students = []
        for i in range(count):
            student = studentsList.nth(i)
            studentName = await student.locator(f'//td[1]').inner_text()
            students.append(studentName)
        
        return students
    except:
        return []
    
    
async def extract_module_data(epitechPage):
    metadata = epitechPage.locator('//*[@id="module"]/div[1]/div[2]/div[3]')

    title = await metadata.locator('//h1').inner_text()
    
    codeModule = await metadata.locator('//div[1]/span').inner_text()
    codeModule = codeModule.lstrip('(').rstrip(')')

    codeInstance = await metadata.locator('//div[2]/span').inner_text()
    codeInstance = codeInstance.lstrip('(').rstrip(')')

    creditsNumber = await metadata.locator('//div[3]/span').inner_text()
    creditsNumber = creditsNumber.lstrip('(').split(' ')[0]

    timeline = epitechPage.locator('//*[@id="timeline"]/span/span')
    description = await epitechPage.locator('//*[@id="module"]/div[2]/div[2]/div[1]/div').inner_text()

    skills = await epitechPage.locator('//*[@id="module"]/div[2]/div[2]/div[2]/div').inner_text()
    skills = [re.sub(r'[^A-Za-z ]+', '', skill.strip()) for skill in skills.split('\n') if skill != '']

    startModuleDate = await timeline.locator('span.date_start.bulle').inner_text()
    endModuleDate = await timeline.locator('span.date_end.bulle').inner_text()
    endRegistration = await timeline.locator('span.wrapper-timeleft > span.end_reg > span').inner_text()
    
    appointements = await extract_appointements(epitechPage)
    activities = await extract_activities(epitechPage)
    project = await extract_project(epitechPage, codeModule, codeInstance)
    registered = await get_students(epitechPage)
    return Module(
        title,
        description,
        codeModule,
        codeInstance,
        creditsNumber,
        skills,
        startModuleDate.split(', ')[0],
        endModuleDate.split(', ')[0],
        endRegistration.split(', ')[0],
        project,
        activities,
        appointements,
        registered
    )


def write_csv(modules):
    with open('modules.csv', 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["module_title", "module_url", "module_code", "module_instance", "module_credits", "module_skills", "module_start_date", "module_end_date", "module_end_registration_date", "on_site", "project_name", "project_link", "project_start_date", "project_end_date", "module_activities", "module_appointements", "module_locations", "module_registered"])
        for module in modules:
            writer.writerow([module.title, module.get_url(), module.code, module.instance, module.credits, ','.join(module.skills), module.startDate, module.endDate, module.endRegistrationDate, module.isPresential, module.project_name, module.project_link, module.project_start_date, module.project_end_date, ','.join(module.activities),  ','.join(module.appointements), ','.join(module.locations), ','.join(module.registered)])



async def main():
    async with async_playwright() as p:
        browser = await p.chromium.connect_over_cdp("http://localhost:9222")
        default_context = browser.contexts[0]
        pages = default_context.pages

        epitechPage = next((page for page in pages if page.url.startswith(base_module_url)), None)

        if epitechPage is None:
            print("Can't find epitech page")
            exit(1)

        base_node = epitechPage.locator('//*[@id="sidebar"]/form/div[3]/dl')
        moduleLocator = base_node.locator('//dd/dl/dt/a[2]')
        count = await moduleLocator.count()
    
        modules = []

        for i in range(count):
            await moduleLocator.nth(i).click()
            modules.append(await extract_module_data(epitechPage))
        write_csv(modules)
        

asyncio.run(main())