'use server';

import fs from 'fs';
import csv from 'csv-parser';

function convertToDate(dateString: string) {
    return new Date(Date.parse(`${dateString.split("/").reverse().join("-")}`));
}

export async function getModules(): Promise<Module[]> {
    return new Promise((resolve, reject) => {
        const results: Module[] = [];
        fs.createReadStream('modules.csv')
            .pipe(csv())
            .on('data', (data) => results.push({
                title: data.module_title,
                url: data.module_url,
                code: data.module_code,
                instance: data.module_instance,
                credits: parseInt(data.module_credits, 10),
                skills: data.module_skills.split(','),
                startDate: convertToDate(data.module_start_date),
                endDate: convertToDate(data.module_end_date),
                endRegistrationDate: convertToDate(data.module_end_registration_date),
                remote: data.on_site === 'False',
                project: data.project_name !== 'N/A' ? {
                    name: data.project_name,
                    url: data.project_link,
                    startDate: convertToDate(data.project_start_date),
                    endDate: convertToDate(data.project_end_date),
                } : undefined,
                appointements: data.module_appointements.split(','),
            }))
            .on('end', () => {
                resolve(results);
            }).on('error', (error) => {
                reject(error);
            });
    });
}