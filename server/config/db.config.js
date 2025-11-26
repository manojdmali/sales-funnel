module.exports = {
    // Database Selection
    DB_TYPE: process.env.DB_TYPE || 'mongodb', // 'mongodb' or 'mysql'

    // MongoDB Configuration
    MONGODB: {
        URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/sales_dashboard',
        OPTIONS: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },

    // MySQL Configuration
    MYSQL: {
        HOST: process.env.MYSQL_HOST || 'localhost',
        USER: process.env.MYSQL_USER || 'root',
        PASSWORD: process.env.MYSQL_PASSWORD || 'password',
        DB: process.env.MYSQL_DB || 'sales_dashboard',
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
};
