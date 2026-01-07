import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';


// MMKV requires native build (expo prebuild), use lazy initialization
let storage: any = null;
try {
    const { MMKV } = require('react-native-mmkv');
    storage = new MMKV();
} catch (e) {
    console.warn('MMKV not available, falling back to AsyncStorage');
}

// Helper để track các keys của SecureStore (vì SecureStore không có phương thức clear all)
const trackSecureStoreKey = async (key: string) => {
    const keysJson = await AsyncStorage.getItem('__secure_store_keys__');
    const keys: string[] = keysJson ? JSON.parse(keysJson) : [];
    if (!keys.includes(key)) {
        keys.push(key);
        await AsyncStorage.setItem('__secure_store_keys__', JSON.stringify(keys));
    }
}

const untrackSecureStoreKey = async (key: string) => {
    const keysJson = await AsyncStorage.getItem('__secure_store_keys__');
    if (keysJson) {
        const keys: string[] = JSON.parse(keysJson);
        const newKeys = keys.filter(k => k !== key);
        await AsyncStorage.setItem('__secure_store_keys__', JSON.stringify(newKeys));
    }
}

const getStore = async ({ key, typeStorage }: { key: string, typeStorage: 'cookie' | 'mmkv' }) => {
    switch (typeStorage) {
        case 'cookie':
            return await SecureStore.getItemAsync(key);
        case 'mmkv':
            if (storage) {
                return storage.getString(key);
            }
        default:
            return await AsyncStorage.getItem(key);
    }
}

const setStore = async ({ key, value, typeStorage }: { key: string, value?: string, typeStorage: 'cookie' | 'mmkv' }) => {
    switch (typeStorage) {
        case 'cookie':
            await trackSecureStoreKey(key);
            return await SecureStore.setItemAsync(key, value || '');
        case 'mmkv':
            if (storage) {
                return storage.set(key, value || '');
            }
        default:
            return await AsyncStorage.setItem(key, value || '');
    }
}

const removeStore = async ({ key, typeStorage }: { key: string, typeStorage: 'cookie' | 'mmkv' }) => {
    switch (typeStorage) {
        case 'cookie':
            await untrackSecureStoreKey(key);
            return await SecureStore.deleteItemAsync(key);
        case 'mmkv':
            if (storage) {
                return storage.delete(key);
            }
        default:
            return await AsyncStorage.removeItem(key);
    }
}

const clearStore = async ({ typeStorage }: { typeStorage: 'cookie' | 'mmkv' }) => {
    switch (typeStorage) {
        case 'cookie':
            // SecureStore không có phương thức clear all
            // Xóa tất cả keys đã được track
            const keysJson = await AsyncStorage.getItem('__secure_store_keys__');
            if (keysJson) {
                const keys: string[] = JSON.parse(keysJson);
                await Promise.all(keys.map(key => SecureStore.deleteItemAsync(key)));
                await AsyncStorage.removeItem('__secure_store_keys__');
            }
            return;
        case 'mmkv':
            if (storage) {
                return storage.clearAll();
            }
        default:
            return await AsyncStorage.clear();
    }
}

export { clearStore, getStore, removeStore, setStore };

