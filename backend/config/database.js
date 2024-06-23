const config = require("./index");

module.exports = {
  development: {
    storage: config.dbFile,
    dialect: "sqlite",
    seederStorage: "sequelize",
    logQueryParameters: true,
    typeValidation: true,
  },
  production: {
    use_env_variable:
      "postgres://app_academy_projects_0hmn_user:wGCGbYH3rvz5kWtKdSQU9gZAR4AOfl1y@dpg-cp391jg21fec73b3ling-a/app_academy_projects_0hmn",
    dialect: "postgres",
    seederStorage: "sequelize",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    define: {
      schema: process.env.SCHEMA,
    },
  },
};
