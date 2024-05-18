const { Pool } = require("pg");
const { config } = require("dotenv");

config();

const pool = new Pool({
  user: "postgres",
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: 5432,
  database: process.env.DATABASE,
});

module.exports = { pool };
