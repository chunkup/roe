import { Storage } from '@ionic/storage';

export const storage = new Storage();

export async function setupStorage() {
    await storage.create();
}
