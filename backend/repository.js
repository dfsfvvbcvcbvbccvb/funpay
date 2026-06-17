import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
let saltRounds = 10

async function getConnection() {
    return await mysql.createConnection({
           host: 'localhost',
           user: 'root',
           password: 'ez123',
           database: 'funpay'
           })
}

export async function registration(formdata) {
    let connection = await getConnection()
    let [rows] = await connection.execute(
        'SELECT * FROM accounts WHERE login = ?', 
        [formdata.login]
    )
    if (rows.length > 0) {
        return 'Аккаунт с таким названием уже существует!'
    }
    let hashedPassword = ''
    try {
        hashedPassword = await bcrypt.hash(formdata.password, saltRounds)
    } catch (e) {
        console.error(e)
    }
    await connection.execute(
            'INSERT INTO accounts (login, password, email) VALUES (?, ?, ?)',
            [formdata.login, hashedPassword, formdata.email]
        )
    return 'Успешно!'
}

export async function login(formdata) {
    let connection = await getConnection()
    let password = formdata.password
    let [rows] = await connection.execute(
        `SELECT password, id FROM accounts WHERE login = '${formdata.usernameOrEmail}'`
    )
    if (rows.length === 0) {
        return 'Неверный логин или пароль!'
    }
    let hashedPassword = rows[0].password
    let isMatch = await bcrypt.compare(String(password), String(hashedPassword))
    if (isMatch === false) {
        return 'Неверный логин или пароль!'
    } else {
        return {
            res: 'Успешно!',
            userId: rows[0].id
        }
    }
}

export async function getBalanceByUserId(formdata) {
    let connection = await getConnection()
    
    let [rows] = await connection.execute(
        `SELECT balance FROM accounts WHERE id = ?`,
        [formdata]
    )

    return rows
}

export async function getUserById(formdata) {
    let connection = await getConnection()
    let id = formdata
    let [rows] = await connection.execute(
        `SELECT login FROM accounts WHERE id = ?`,
        [id]
    )
    return rows
}

export async function getGameById(formdata) {
    let connection = await getConnection()
    let id = formdata
    let [rows] = await connection.execute(
        `SELECT * FROM games WHERE id = ?`,
        [id]
    )

    if (rows.length === 0) {
        return
    }

    let [categories] = await connection.execute(
        `SELECT categories.id, categories.name 
         FROM categories
         INNER JOIN game_categories ON categories.id = game_categories.category_id
         WHERE game_categories.game_id = ?`,
        [id]
    )

    rows[0].categories = categories
    return rows[0]
}

export async function createGame(formdata) {
    let connection = await getConnection()
    let [rows] = await connection.execute(
        'SELECT * FROM games WHERE name = ?', 
        [formdata.name]
    )

    if (rows.length > 0) {
        return 'Игра с таким названием уже существует!'
    }

    for (let a = 0; a < formdata.categoriesIds.length; a++) {
        let [result] = await connection.execute(`SELECT * FROM categories WHERE id = ?`,
            [Number(formdata.categoriesIds[a])]
        )
        if (result.length === 0) {
            return
        }
    }

    let [res] = await connection.execute(
        `INSERT INTO games (name, description) VALUES (?, ?)`,
        [formdata.name, formdata.description]
    )

    let gameId = res.insertId

    for (let a = 0; a < formdata.categoriesIds.length; a++) {

        let categoryId = formdata.categoriesIds[a]

        await connection.execute(
            `INSERT INTO game_categories (game_id, category_id) VALUES (?, ?)`,
            [gameId, categoryId]
        )
    }

    return 'Успешно!'
}

export async function getGames() {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT * FROM games`
    )

    for (let a = 0; a < rows.length; a++) {
        let id = rows[a].id

        let [categories] = await connection.execute(
            `SELECT categories.id, categories.name 
            FROM categories
            LEFT JOIN game_categories ON categories.id = game_categories.category_id
            WHERE game_categories.game_id = ?`,
            [id]
        )
        rows[a].categories = categories
    }

    return rows
}

export async function getLotById(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT * FROM lots WHERE game_id = ? AND category_id = ? AND id = ?`,
        [formdata.game_id, formdata.category_id, formdata.lot_id]
    )
    return rows
}

export async function createLot(formdata) {
    let connection = await getConnection()
    
    await connection.execute(
        `INSERT INTO lots (name, description, price, category_id, game_id, ownerUsername, ownerId) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [formdata.name, formdata.description, formdata.price, formdata.category_id, formdata.game_id.id, formdata.ownerUsername, formdata.ownerId]
    )

    return 'Успешно!'
}

export async function getLots(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT * FROM lots WHERE game_id = ? AND category_id = ?`,
        [Number(formdata.game_id), Number(formdata.category_id)]
    )
    return rows
}

export async function getLotsByUserId(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT id, name, price, ownerUsername, game_id, category_id FROM lots WHERE ownerId = ?`,
        [formdata]
    )
    return rows
}

export async function getCategoryById(formdata) {
    let connection = await getConnection()
    let id = formdata
    let [rows] = await connection.execute(
        `SELECT name FROM categories WHERE id = ?`,
        [id]
    )
    return rows
}

export async function createCategory(formdata) {
    let connection = await getConnection()

    await connection.execute(
        `INSERT INTO categories (name) VALUES (?)`,
        [formdata.name]
    )

    return 'Успешно!'
}

export async function getCategories() {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT * FROM categories`
    )

    return rows
}

export async function getOrdersByUserId(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT * FROM orders WHERE buyerId = ?`,
        [formdata]
    )

    return rows
}
