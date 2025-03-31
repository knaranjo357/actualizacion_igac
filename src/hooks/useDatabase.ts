import { useState, useCallback } from 'react';
import { DatabaseResponse, ENDPOINTS, findMatchingR2Record } from '../types/database';
import { useAuth } from '../context/AuthContext';

// Create IndexedDB database
const dbName = 'matriculasDB';
const dbVersion = 1;
const storeName = 'databases';

const initDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName);
      }
    };
  });
};

const getFromDB = async (key: string) => {
  const db = await initDB() as IDBDatabase;
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

const setInDB = async (key: string, value: any) => {
  const db = await initDB() as IDBDatabase;
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(value, key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

const clearFromDB = async (key?: string) => {
  const db = await initDB() as IDBDatabase;
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    
    const request = key ? store.delete(key) : store.clear();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

// Local Storage helpers with size check
const MAX_LOCAL_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB limit

const getFromLocalStorage = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

const setInLocalStorage = (key: string, value: any) => {
  try {
    const serializedValue = JSON.stringify(value);
    if (serializedValue.length > MAX_LOCAL_STORAGE_SIZE) {
      console.warn(`Data for ${key} exceeds localStorage size limit, skipping localStorage cache`);
      return false;
    }
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.warn(`Failed to store ${key} in localStorage:`, error);
    return false;
  }
};

export function useDatabase() {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const { currentUser } = useAuth();

  const fetchDatabase = useCallback(async (key: string): Promise<DatabaseResponse | null> => {
    // Check localStorage first for smaller datasets
    const localData = getFromLocalStorage(`database_${key}`);
    if (localData) {
      return localData;
    }

    // If not in localStorage, check IndexedDB
    const cachedData = await getFromDB(`database_${key}`);
    if (cachedData) {
      // Try to store in localStorage for faster future access, but don't fail if it doesn't work
      setInLocalStorage(`database_${key}`, cachedData);
      return cachedData;
    }

    setLoading(prev => ({ ...prev, [key]: true }));
    
    try {
      const response = await fetch(ENDPOINTS[key as keyof typeof ENDPOINTS]);
      const data = await response.json();

      // If this is R1, we need to fetch R2 to add MATRICULA_INMOBILIARIA
      if (key === 'r1') {
        const r2Response = await fetch(ENDPOINTS.r2);
        const r2Data = await r2Response.json();

        // Add MATRICULA_INMOBILIARIA to R1 records
        data.data = data.data.map((record: any) => {
          const matchingR2 = findMatchingR2Record(record, r2Data.data);
          return {
            ...record,
            MATRICULA_INMOBILIARIA: matchingR2?.MATRICULA_INMOBILIARIA || ''
          };
        });
      }

      // Always store in IndexedDB first
      await setInDB(`database_${key}`, data);
      
      // Try to store in localStorage, but don't fail if it doesn't work
      setInLocalStorage(`database_${key}`, data);

      return data;
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      return null;
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  const clearCache = useCallback(async (key?: string) => {
    if (key) {
      await clearFromDB(`database_${key}`);
      localStorage.removeItem(`database_${key}`);
    } else {
      await clearFromDB();
      localStorage.clear();
    }
  }, []);

  const hasPermission = useCallback((requiredRole: string): boolean => {
    const roleHierarchy = {
      root: 4,
      admin: 3,
      recognizer: 2,
      viewer: 1
    };

    const userRole = currentUser?.role || 'viewer';
    return roleHierarchy[userRole as keyof typeof roleHierarchy] >= 
           roleHierarchy[requiredRole as keyof typeof roleHierarchy];
  }, [currentUser]);

  return {
    loading,
    fetchDatabase,
    clearCache,
    hasPermission
  };
}