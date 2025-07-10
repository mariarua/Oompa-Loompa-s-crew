import type { OompaLoompa, MinimalOompaLoompa } from "../types/oompaLoompa";

interface CachedPage {
  page: number;
  data: MinimalOompaLoompa[];
  savedAt: number;
}

interface CachedDetail extends OompaLoompa {
  savedAt: number;
}

interface CachedMetadata {
  key: string;
  value: string | number;
  savedAt: number;
}

class OompaLoompaDB {
  private readonly dbName = "OompaLoompaDB";
  private readonly version = 1;
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
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
        if (!db.objectStoreNames.contains("pages")) {
          db.createObjectStore("pages", { keyPath: "page" });
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

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) await this.init();
    return this.db!;
  }

  private isDataFresh(savedAt: number): boolean {
    return Date.now() - savedAt < this.CACHE_DURATION;
  }

  async savePage(
    page: number,
    characters: MinimalOompaLoompa[]
  ): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["pages"], "readwrite");
    const store = transaction.objectStore("pages");

    const cachedPage: CachedPage = {
      page,
      data: characters,
      savedAt: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const request = store.put(cachedPage);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getPage(page: number): Promise<MinimalOompaLoompa[] | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["pages"], "readonly");
    const store = transaction.objectStore("pages");

    return new Promise((resolve) => {
      const request = store.get(page);
      request.onsuccess = () => {
        const result = request.result as CachedPage;
        if (result && this.isDataFresh(result.savedAt)) {
          resolve(result.data);
        } else {
          if (result) {
            const deleteTransaction = db.transaction(["pages"], "readwrite");
            deleteTransaction.objectStore("pages").delete(page);
          }
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  }

  async getAllCachedPages(): Promise<{
    allCharacters: MinimalOompaLoompa[];
    lastPage: number;
  }> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["pages"], "readonly");
    const store = transaction.objectStore("pages");

    return new Promise((resolve) => {
      const request = store.getAll();
      request.onsuccess = () => {
        try {
          const pages = request.result as CachedPage[];

          if (!pages?.length) {
            resolve({ allCharacters: [], lastPage: 0 });
            return;
          }

          const validPages: CachedPage[] = [];
          const expiredPages: number[] = [];
          pages.forEach((page) => {
            if (this.isDataFresh(page.savedAt)) {
              validPages.push(page);
            } else {
              expiredPages.push(page.page);
            }
          });

          if (expiredPages.length > 0) {
            const deleteTransaction = db.transaction(["pages"], "readwrite");
            const deleteStore = deleteTransaction.objectStore("pages");
            expiredPages.forEach((pageNum) => deleteStore.delete(pageNum));
          }

          validPages.sort((a, b) => a.page - b.page);
          const allCharacters = validPages.flatMap((page) => page.data || []);
          const lastPage =
            validPages.length > 0
              ? Math.max(...validPages.map((p) => p.page))
              : 0;

          resolve({ allCharacters, lastPage });
        } catch (error) {
          console.error("Error processing cached pages:", error);
          resolve({ allCharacters: [], lastPage: 0 });
        }
      };
      request.onerror = () => {
        console.error("Error fetching cached pages:", request.error);
        resolve({ allCharacters: [], lastPage: 0 });
      };
    });
  }

  async saveCharacterDetail(detail: OompaLoompa): Promise<void> {
    if (!detail?.id) {
      throw new Error("Character detail must have a valid ID");
    }

    const db = await this.ensureDB();
    const transaction = db.transaction(["details"], "readwrite");
    const store = transaction.objectStore("details");

    const cachedDetail: CachedDetail = {
      ...detail,
      savedAt: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const request = store.put(cachedDetail);
      request.onsuccess = () => {
        console.log(`💾 Saved character ${detail.id} to IndexedDB`);
        resolve();
      };
      request.onerror = () => {
        console.error(`❌ Error saving character ${detail.id}:`, request.error);
        reject(request.error);
      };
    });
  }

  async getCharacterDetail(id: number): Promise<OompaLoompa | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["details"], "readonly");
    const store = transaction.objectStore("details");

    return new Promise((resolve) => {
      const request = store.get(id);
      request.onsuccess = () => {
        const result = request.result as CachedDetail;

        if (result && this.isDataFresh(result.savedAt)) {
          const { ...cleanDetail } = result;
          console.log(`🗃️ Retrieved character ${id} from cache`);
          resolve(cleanDetail);
        } else {
          if (result) {
            console.log(`🗑️ Removing expired cache for character ${id}`);
            const deleteTransaction = db.transaction(["details"], "readwrite");
            deleteTransaction.objectStore("details").delete(id);
          }
          resolve(null);
        }
      };
      request.onerror = () => {
        console.error(
          "❌ Error retrieving character from IndexedDB:",
          request.error
        );
        resolve(null);
      };
    });
  }

  async saveMetadata(key: string, value: string | number): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["metadata"], "readwrite");
    const store = transaction.objectStore("metadata");

    const metadata: CachedMetadata = { key, value, savedAt: Date.now() };

    return new Promise((resolve, reject) => {
      const request = store.put(metadata);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getMetadata(key: string): Promise<string | number | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(["metadata"], "readonly");
    const store = transaction.objectStore("metadata");

    return new Promise((resolve) => {
      const request = store.get(key);
      request.onsuccess = () => {
        const result = request.result as CachedMetadata;

        if (result && this.isDataFresh(result.savedAt)) {
          resolve(result.value);
        } else {
          if (result) {
            const deleteTransaction = db.transaction(["metadata"], "readwrite");
            deleteTransaction.objectStore("metadata").delete(key);
          }
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  }

  async cleanExpiredData(): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(
      ["pages", "details", "metadata"],
      "readwrite"
    );

    const stores = {
      pages: transaction.objectStore("pages"),
      details: transaction.objectStore("details"),
      metadata: transaction.objectStore("metadata"),
    };

    const cleanStore = (store: IDBObjectStore) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const items = request.result as (
          | CachedPage
          | CachedDetail
          | CachedMetadata
        )[];
        items.forEach((item: CachedPage | CachedDetail | CachedMetadata) => {
          if (!this.isDataFresh(item.savedAt)) {
            const key =
              "page" in item ? item.page : "id" in item ? item.id : item.key;
            store.delete(key);
          }
        });
      };
    };

    Object.values(stores).forEach(cleanStore);
  }

  async clearAllData(): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(
      ["pages", "details", "metadata"],
      "readwrite"
    );

    const clearPromises = ["pages", "details", "metadata"].map(
      (storeName) =>
        new Promise<void>((resolve) => {
          const request = transaction.objectStore(storeName).clear();
          request.onsuccess = () => resolve();
        })
    );

    await Promise.all(clearPromises);
  }
}

export const oompaDB = new OompaLoompaDB();

oompaDB.init().catch(console.error);

setInterval(() => {
  oompaDB.cleanExpiredData().catch(console.error);
}, 60 * 60 * 1000);
