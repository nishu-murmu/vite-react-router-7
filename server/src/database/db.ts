import { createPool } from "mysql2";
import { Kysely, MysqlDialect } from "kysely";
import mysql from "mysql2";

const dialect = new MysqlDialect({
  pool: createPool({
    database: "book_store",
    host: "localhost",
    user: "root",
    password: "",
    connectionLimit: 10,
  }),
});

export const connect = async () => {
  try {
    var database = mysql.createConnection({
      database: "book_store",
      host: "localhost",
      user: "root",
      password: "",
    });
    database.connect((err) => {
      if (err) {
        throw err;
      }
      console.log("MySQL Connected");
    });
  } catch (err) {
    console.log(`Error while connecting to MySql ==> ${err}`);
  }
};

export const db = new Kysely<any>({
  dialect,
});
