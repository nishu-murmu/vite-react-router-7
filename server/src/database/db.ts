import { createPool } from "mysql2";
import { Kysely, MysqlDialect } from "kysely";
import mysql from "mysql2";
import { DB } from "../types/db";
import dotenv from "dotenv";

dotenv.config({
  debug: true,
});

const dialect = new MysqlDialect({
  pool: createPool({
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    connectionLimit: Number(process.env.DATABASE_CONNECTION_LIMIT) || 10,
  }),
});

export const connect = async () => {
  try {
    var database = mysql.createConnection({
      database: process.env.DATABASE_NAME,
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
    });

    database.connect((err) => {
      if (err) {
        throw err;
      }
      console.log("MySQL Connected");
    });
  } catch (err) {
    console.log(`Error while connecting to MySQL ==> ${err}`);
  }
};

export const db = new Kysely<DB>({
  dialect,
});
