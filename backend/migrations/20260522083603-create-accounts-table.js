export function up(db) {
  return db.runSql(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INT PRIMARY KEY AUTO_INCREMENT,
      login VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  return db.runSql(`
    CREATE TABLE IF NOT EXISTS games (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL UNIQUE,
      description VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  return db.runSql(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL UNIQUE
    )
  `)
}

export function down(db) {
  return db.runSql(`DROP TABLE IF EXISTS accounts`);
}