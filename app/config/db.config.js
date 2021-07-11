module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "sakiv@0708",
    DB: "testDB",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
