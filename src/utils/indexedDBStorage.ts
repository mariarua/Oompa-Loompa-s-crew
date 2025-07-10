import type { OompaLoompa } from "../types/oompaLoompa";

interface MinimalOompaLoompa {
  id: number;
  first_name: string;
  last_name: string;
  gender: string;
  profession: string;
  image: string;
}

class OompaLoompaDB {
  private dbName = "OompaLoompaDB";
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains("characters")) {
          const store = db.createObjectStore("characters", { keyPath: "id" });
          store.createIndex("profession", "profession", { unique: false });
        }

        if (!db.objectStoreNames.contains("details")) {
          db.createObjectStore("details", { keyPath: "id" });
        }

        if (!db.objectStoreNames.contains("metadata")) {
          db.createObjectStore("metadata", { keyPath: "key" });
        }
      };
    });
  }

  async saveCharacterList(characters: MinimalOompaLoompa[]): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(["characters"], "readwrite");
    const store = transaction.objectStore("characters");

    for (const character of characters) {
      await store.put(character);
    }
  }

  async saveCharacterDetail(detail: OompaLoompa): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(["details"], "readwrite");
    const store = transaction.objectStore("details");

    await store.put({
      ...detail,
      savedAt: Date.now(),
    });
  }

  async getCharacterList(): Promise<MinimalOompaLoompa[]> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(["characters"], "readonly");
    const store = transaction.objectStore("characters");

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getCharacterDetail(id: number): Promise<OompaLoompa | null> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(["details"], "readonly");
    const store = transaction.objectStore("details");

    return new Promise((resolve) => {
      const request = store.get(id);
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
          if (result.savedAt > oneDayAgo) {
            resolve(result);
          } else {
            store.delete(id);
            resolve(null);
          }
        } else {
          resolve(null);
        }
      };
    });
  }
}

export const oompaDB = new OompaLoompaDB();
