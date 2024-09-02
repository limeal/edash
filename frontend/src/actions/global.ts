'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function redirectWithCacheCleaning(path: string, query?: Record<string, string>) {
    redirect(path + (query ? '?' + new URLSearchParams(query).toString() : ''));
    revalidatePath(path);
}