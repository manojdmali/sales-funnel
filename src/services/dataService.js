import localforage from 'localforage';
import { appConfig } from '../config/appConfig';

// Configure LocalForage (IndexedDB)
const localDB = localforage.createInstance({
    name: 'SalesDashboardDB',
    storeName: 'datasets',
    description: 'Sales Funnel Dashboard Data Storage'
});

const STORAGE_KEY = 'sales_dashboard_datasets';

/**
 * Service to handle data persistence strategies (Local vs Remote)
 */
export const dataService = {
    /**
     * Load datasets from the configured storage
     * @returns {Promise<Array>} List of datasets
     */
    async loadDatasets() {
        try {
            if (appConfig.storageMode === 'remote') {
                return await this.loadFromRemote();
            } else {
                return await this.loadFromLocal();
            }
        } catch (error) {
            console.error('Data Load Error:', error);
            // Fallback to local if remote fails (optional, depending on requirements)
            if (appConfig.storageMode === 'remote') {
                console.warn('Falling back to local storage due to remote error.');
                return await this.loadFromLocal();
            }
            throw error;
        }
    },

    /**
     * Save datasets to the configured storage
     * @param {Array} datasets - Datasets to save
     * @returns {Promise<void>}
     */
    async saveDatasets(datasets) {
        try {
            if (appConfig.storageMode === 'remote') {
                await this.saveToRemote(datasets);
            } else {
                await this.saveToLocal(datasets);
            }
        } catch (error) {
            console.error('Data Save Error:', error);
            // Fallback to local if remote fails
            if (appConfig.storageMode === 'remote') {
                console.warn('Falling back to local storage save due to remote error.');
                await this.saveToLocal(datasets);
            }
            throw error;
        }
    },

    // --- Local Storage Implementation ---

    async loadFromLocal() {
        try {
            const savedDatasets = await localDB.getItem(STORAGE_KEY);
            return Array.isArray(savedDatasets) ? savedDatasets : [];
        } catch (error) {
            console.error('IndexedDB Load Error:', error);
            return [];
        }
    },

    async saveToLocal(datasets) {
        try {
            await localDB.setItem(STORAGE_KEY, datasets);
        } catch (error) {
            console.error('IndexedDB Save Error:', error);
            throw error;
        }
    },

    // --- Remote Storage Implementation ---

    async loadFromRemote() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), appConfig.api.timeout);

            const response = await fetch(`${appConfig.api.baseUrl}${appConfig.api.endpoints.datasets}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Remote API Load Error:', error);
            throw error;
        }
    },

    async saveToRemote(datasets) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), appConfig.api.timeout);

            const response = await fetch(`${appConfig.api.baseUrl}${appConfig.api.endpoints.save}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ datasets }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Remote API Save Error:', error);
            throw error;
        }
    }
};
