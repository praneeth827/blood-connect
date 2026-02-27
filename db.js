const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'bloodconnect.sqlite');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function migrate(db) {
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      role TEXT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS donors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      blood_type TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      contact TEXT NOT NULL,
      occupation TEXT NOT NULL,
      location TEXT NOT NULL,
      state TEXT NOT NULL DEFAULT '',
      latitude REAL NULL,
      longitude REAL NULL,
      availability TEXT NOT NULL DEFAULT 'available',
      reliability REAL NOT NULL DEFAULT 0.75,
      gov_id_path TEXT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seeker_user_id INTEGER NOT NULL,
      donor_id INTEGER NOT NULL,
      blood_type TEXT NOT NULL,
      urgency TEXT NOT NULL,
      location TEXT NOT NULL,
      message TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(seeker_user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(donor_id) REFERENCES donors(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_donors_blood_type ON donors(blood_type);
    CREATE INDEX IF NOT EXISTS idx_donors_availability ON donors(availability);
    CREATE INDEX IF NOT EXISTS idx_requests_seeker ON requests(seeker_user_id);
    CREATE INDEX IF NOT EXISTS idx_requests_donor ON requests(donor_id);
    CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
  `);
}

let _db = null;

function getDb() {
  if (_db) return _db;
  ensureDir(DATA_DIR);
  _db = new Database(DB_PATH);
  migrate(_db);
  
  // Add gov_id_path column if it doesn't exist (for existing databases)
  try {
    const columns = _db.prepare("PRAGMA table_info(donors)").all();
    const hasGovIdPath = columns.some(col => col.name === 'gov_id_path');
    if (!hasGovIdPath) {
      _db.exec(`ALTER TABLE donors ADD COLUMN gov_id_path TEXT NULL;`);
    }
  } catch (err) {
    console.error('Error checking/adding gov_id_path column:', err);
  }
  
  return _db;
}

module.exports = { getDb, DB_PATH };


