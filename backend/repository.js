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
        [formdata.name]
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
    return 'Успешно'
}

export async function login(formdata) {
    let connection = await getConnection()
    let password = formdata.password
    let [rows] = await connection.execute(
        `SELECT password FROM accounts WHERE login = '${formdata.usernameOrEmail}'`
    )
    if (rows.length === 0) {
        return 'Неверный логин или пароль!'
    }
    let hashedPassword = rows[0].password
    let isMatch = await bcrypt.compare(String(password), String(hashedPassword))
    if (isMatch === false) {
        return 'Неверный логин или пароль!'
    } else {
        return 'Успешно!'
    }
}

export async function getGameById(formdata) {
    let connection = await getConnection()
    let id = formdata.id
    let [rows] = await connection.execute(
        `SELECT * FROM games WHERE id = ?`,
        [id]
    )

    if (rows.length === 0) {
        return
    }

    let categories = await connection.execute(
        `SELECT categories.id, categories.name 
         FROM categories
         INNER JOIN game_categories ON categories.id = game_categories.category_id
         WHERE game_categories.game_id = ?`,
        [id]
    )

    rows[0].categories = categories

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

export async function createGame(formdata) {
    let connection = await getConnection()
    let [rows] = await connection.execute(
        'SELECT * FROM games WHERE name = ?', 
        [formdata.name]
    )
    if (rows.length > 0) {
        return 'Игра с таким названием уже существует!'
    }
    let res = await connection.execute(
        `INSERT INTO games (name, description) VALUES (?, ?)`,
        [formdata.name, formdata.description]
    )
    let gameId = res.insertId

    let createCategory = await connection.execute(
        `INSERT INTO categories (name) VALUES (?)`,
        [formdata.categoryName]
    )
    let categoryId = createCategory.insertId

    await connection.query(
        `INSERT INTO game_categories (game_id, category_id) VALUES ?`,
        [gameId, categoryId]
    )

    return 'Успешно!'
}

export async function getGames() {
    let connection = await getConnection()
    let [rows] = await connection.execute(
        `SELECT * FROM games`
    )
    return rows
}

