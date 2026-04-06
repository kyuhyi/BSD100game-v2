const STORAGE_KEY = 'pdf-ebook-generator-book';

export function hasSavedBook(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) !== null;
}

export function clearSavedBook(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
