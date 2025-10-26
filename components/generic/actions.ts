'use server';

import { updateTag } from 'next/cache';


export async function refresh(tag: string) {
  updateTag(tag);
}
