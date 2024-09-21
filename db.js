import Database from "better-sqlite3";

let db;

export function dbInitialise() {
  try {
    db = new Database("data/minute.db");
    db.pragma("journal_mode = WAL");
    db.pragma("busy_timeout=3000");
    createTables();
  } catch (error) {
    console.log("Error opening database: ", error);
  }
}

function createTables() {
  // Initialize tables if they don't exist
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        question TEXT DEFAULT '' NOT NULL,
        answer TEXT DEFAULT '' NOT NULL,
      );`);
  } catch (error) {
    console.log("Error creating tables: ", error);
  }
}

export function dbClose() {
  db.close();
}
