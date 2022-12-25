import { Storage } from '@ionic/storage';

const storage = new Storage();

export async function setupStorage() {
    await storage.create();
}

export const IonicStorage = {
    getItem: async (key: string) => storage.get(key),
    setItem: async (key: string, value: string) => storage.set(key, value),
    removeItem: async (key: string) => storage.remove(key),
};
