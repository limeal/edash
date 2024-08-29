'use server';

import fs from 'fs';
import csv from 'csv-parser';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function convertToDate(dateString: string) {
    return new Date(`${dateString.split(', ')[0].split('/').reverse().join('-')}T${dateString.split(', ')[1] || '00:00:00'}`);
}

export async function getModules(): Promise<Module[]> {
    return new Promise((resolve, reject) => {
        const results: Module[] = [];
        let i = 0;
        fs.createReadStream('modules.csv')
            .pipe(csv())
            .on('data', (data) => {
                const moduleid = i++;

                results.push({
                    moduleid,
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
                    activities: data.module_activities.split(','),
                    appointements: data.module_appointements.split(','),
                    locations: data.module_locations.split(','),
                })
            })
            .on('end', () => {
                resolve(results);
            }).on('error', (error) => {
                reject(error);
            });
    });
}