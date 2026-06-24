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
            'INSERT INTO accounts (login, password, email, trustedSeller, admin) VALUES (?, ?, ?, ?, ?)',
            [formdata.login, hashedPassword, formdata.email, 'false', 'false']
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
        `SELECT login, trustedSeller, admin FROM accounts WHERE id = ?`,
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

    let [rows2] = await connection.execute(
        `SELECT admin FROM accounts WHERE id = ?`,
        [formdata.creatorId]
    )
    if (rows2[0].length === 0) {
        return
    }
    if (rows2[0].admin !== 'true') {
        return
    }

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
    
    let [rows2] = await connection.execute(
        `SELECT trustedSeller FROM accounts WHERE id = ?`,
        [formdata.ownerId]
    )
    if (rows2[0].length === 0) {
        return
    }
    if (rows2[0].trustedSeller !== 'true') {
        return 'Вы должны пройти тест на продавца!'
    }

    await connection.execute(
        `INSERT INTO lots (name, description, price, category_id, game_id, ownerUsername, ownerId, confirmation, confirmed, buyerId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [formdata.name, formdata.description, formdata.price, formdata.category_id, formdata.game_id.id, formdata.ownerUsername, formdata.ownerId, 'false', 'false', '0']
    )
   

    return 'Успешно!'
}

export async function confirmLot(formdata) {
    let connection = await getConnection()

    await connection.execute(
        `UPDATE lots SET confirmed='true' WHERE id = ?`,
        [formdata.lotId]
    )
    let [rows] = await connection.execute(
        `SELECT * FROM lots WHERE id = ?`,
        [formdata.lotId]
    )

    await connection.execute(`
    INSERT INTO orders (amount, category_id, game_id, buyerId, sellerId) VALUES (?, ?, ?, ?, ?)`,
    [rows[0].price, rows[0].category_id, rows[0].game_id, formdata.userId, rows[0].ownerId])
    await connection.execute(
        `DELETE FROM lots WHERE id = ${rows[0].id}`
    )
    let [rows2] = await connection.execute(
        `SELECT balance FROM accounts WHERE id = ?`,
        rows[0].ownerId
    )
    let newBalance = Number(rows2[0].balance) + Number(rows[0].price)
    await connection.execute(
        `UPDATE accounts SET balance=${newBalance} WHERE id = ?`,
        rows[0].ownerId
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

    let [rows2] = await connection.execute(
        `SELECT admin FROM accounts WHERE id = ?`,
        [formdata.creatorId]
    )
    if (rows2[0].length === 0) {
        return
    }
    if (rows2[0].admin !== 'true') {
        return
    }

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

export async function getFinancesByUserId(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT * FROM orders WHERE buyerId = ? OR sellerId = ?`,
        [formdata, formdata]
    )

    return rows
}

export async function getSalesByUserId(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT * FROM orders WHERE sellerId = ?`,
        [formdata, formdata]
    )

    return rows
}

export async function buyOrder(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT balance FROM accounts WHERE id = ?`,
        [formdata.userId]
    )
    if (rows.length === 0) {
        return 'Пользователя с таким id не существует!'
    }
    if (Number(formdata.userId) === Number(formdata.sellerId)) {
        return 'У самого себя купить нельзя!'
    }
    if (rows[0].balance >= formdata.price) {
       let newBalance = rows[0].balance - formdata.price
       await connection.execute(`UPDATE accounts SET balance=${newBalance} WHERE id = ${formdata.userId}`)
       await connection.execute(
        `UPDATE lots SET confirmation='true' WHERE id = ?`,
        [formdata.lotId]
       )
       return 'Успешно!'
    }
}

export async function sendMessage(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT login FROM accounts WHERE id = ?`,
        [formdata.senderId]
    )


    let [rows2] = await connection.execute(
        `SELECT login FROM accounts WHERE id = ?`,
        [formdata.receiverId]
    )
    if (rows2.length === 0 || rows.length === 0) {
        return 'Пользователя с таким id не существует!'
    }

    await connection.execute(
        `INSERT INTO messages (senderId, receiverId, content, senderUsername, receiverUsername) VALUES (?, ?, ?, ?, ?)`,
        [formdata.senderId, formdata.receiverId, formdata.content, rows[0].login, rows2[0].login]
    )

    return 'Успешно!'
}

export async function getMessages(formdata) {
    let connection = await getConnection()
    let [rows] = await connection.execute(
        `SELECT * FROM messages WHERE senderId = ? OR receiverId = ?`,
        [formdata.senderId, formdata.receiverId]
    )
    return rows
}

export async function trustSellerCheck(formdata) {
    let connection = await getConnection()
    await connection.execute(
        `UPDATE accounts SET trustedSeller='true' WHERE id = ?`,
        [formdata.userId]
    )
    return 'Успешно!'
}

export async function createTicket(formdata) {
    let connection = await getConnection()
    await connection.execute(
        `INSERT INTO tickets (content, login, problem, senderId, status) VALUES (?, ?, ?, ?, ?)`,
        [formdata.content, formdata.login, formdata.problem, formdata.senderId, 'approval']
    )
    return 'Успешно!'
}

export async function getTicketsByUserId(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT * FROM tickets WHERE senderId = ?`,
        [formdata]
    )

    return rows
}

export async function getTicketInfo(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT * FROM tickets WHERE id = ?`,
        [formdata]
    )

    return rows
}

export async function sendSupportMessage(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT login FROM accounts WHERE id = ?`,
        [formdata.senderId]
    )

    await connection.execute(
        `INSERT INTO supportMessages (content, senderId, ticketId, senderUsername) VALUES (?, ?, ?, ?)`,
        [formdata.content, formdata.senderId, formdata.ticketId, rows[0].login]
    )
    return 'Успешно!'
}

export async function getSupportMessages(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT * FROM supportMessages WHERE ticketId = ?`,
        [formdata]
    )

    return rows
}

export async function changeSupportTicketStatus(formdata) {
    let connection = await getConnection()

    await connection.execute(
        `UPDATE tickets SET status=? WHERE id = ?`,
        [formdata.status, formdata.ticketId]
    )
    
    return 'Успешно!'
}

export async function deleteTicket(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT admin FROM accounts WHERE id = ?`,
        [formdata.userId]
    )
    if (rows[0].admin !== 'true') {
        return
    } else {
        await connection.execute(
            `DELETE FROM tickets WHERE id = ?`,
            [formdata.ticketId]
        )
        return 'Успешно!'
    }
}