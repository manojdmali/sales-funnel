export const appConfig = {
    // Toggle between 'local' (IndexedDB) and 'remote' (Database via API)
    storageMode: 'local', // Options: 'local', 'remote'

    // API Configuration (for remote mode)
    api: {
        baseUrl: 'http://localhost:5000/api',
        endpoints: {
            datasets: '/datasets',
            save: '/datasets/save'
        },
        timeout: 5000 // 5 seconds timeout
    },

    // Database Connection Details (for Backend usage)
    // These would be used by your Node.js/Python backend
    database: {
        type: 'mongodb', // Options: 'mongodb', 'mysql'

        mongodb: {
            uri: 'mongodb://localhost:27017/sales_dashboard',
            options: {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        },

        mysql: {
            host: 'localhost',
            user: 'root',
            password: 'password',
            database: 'sales_dashboard',
            port: 3306
        }
    }
};
