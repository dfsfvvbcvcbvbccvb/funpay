export function up(db) {
  return db.runSql(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INT PRIMARY KEY AUTO_INCREMENT,
      login VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      balance INT,
      trustedSeller VARCHAR(255) NOT NULL,
      admin VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS games (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL UNIQUE,
      description TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INT PRIMARY KEY AUTO_INCREMENT,
      sessionId VARCHAR(255) NOT NULL UNIQUE,
      userId INT
    );

    CREATE TABLE IF NOT EXISTS lots (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      price INT NOT NULL,
      category_id INT NOT NULL,
      game_id INT NOT NULL,
      ownerUsername VARCHAR(255) NOT NULL,
      ownerId INT,
      confirmation VARCHAR(255) NOT NULL,
      confirmed VARCHAR(255) NOT NULL,
      tempBuyerId VARCHAR(255),
      quantity INT NOT NULL
    );

     CREATE TABLE IF NOT EXISTS tickets (
      id INT PRIMARY KEY AUTO_INCREMENT,
      content VARCHAR(255) NOT NULL,
      login VARCHAR(255) NOT NULL,
      problem VARCHAR(255) NOT NULL,
      senderId INT,
      status VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS supportMessages (
      id INT PRIMARY KEY AUTO_INCREMENT,
      content VARCHAR(255) NOT NULL,
      senderId INT,
      ticketId INT,
      senderUsername VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INT PRIMARY KEY AUTO_INCREMENT,
      amount INT,
      category_id INT,
      game_id INT,
      buyerId INT,
      sellerId INT,
      confirm VARCHAR(255),
      lotId INT,
      quantity INT NOT NULL,
      sellerUsername VARCHAR(255),
      gameName VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS unreadMessages (
      id INT PRIMARY KEY AUTO_INCREMENT,
      content VARCHAR(255) NOT NULL,
      senderUsername VARCHAR(255) NOT NULL,
      receiverId INT NOT NULL,
      lotId INT,
      readed VARCHAR(255),
      gameId INT,
      categoryId INT,
      gameName VARCHAR(255),
      buyerUsername VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INT PRIMARY KEY AUTO_INCREMENT,
      senderId INT,
      receiverId INT,
      content VARCHAR(255) NOT NULL,
      senderUsername VARCHAR(255) NOT NULL,
      receiverUsername VARCHAR(255) NOT NULL,
      lotId INT
    );

    CREATE TABLE IF NOT EXISTS game_categories (
      game_id INT,
      category_id INT,
      PRIMARY KEY (game_id, category_id),
      FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );
  `);
}

export function down(db) {
  return db.runSql(`DROP TABLE IF EXISTS accounts`);
}