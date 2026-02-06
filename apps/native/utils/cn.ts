import { twMerge } from 'tailwind-merge';

export function cn(...inputs: any[]) {
  return twMerge(inputs.filter(Boolean).join(' '));
}