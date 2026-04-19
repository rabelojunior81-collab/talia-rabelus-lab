
const API_KEY_STORAGE_KEY = 'talia_gemini_api_key';

export const getApiKey = (): string => {
    return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
};

export const setApiKey = (key: string): void => {
    if (key.trim()) {
        localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
    } else {
        localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
};

export const hasApiKey = (): boolean => {
    return !!localStorage.getItem(API_KEY_STORAGE_KEY)?.trim();
};

export const clearApiKey = (): void => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
};
