import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import crypto from 'crypto'
import { isGeneratorFunction } from 'util/types';

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

        await connection.end()

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

        let sessionId = crypto.randomBytes(32).toString('hex')
        await connection.execute(
            `INSERT INTO sessions (sessionId, userId) VALUES (?, ?)`,
            [sessionId, rows[0].id]
        )

        await connection.end()

        return {
            res: 'Успешно!',
            userId: rows[0].id,
            sessionId: sessionId
        }
    }
}

export async function getBalanceByUserId(formdata) {
    let connection = await getConnection()
    
    let [rows] = await connection.execute(
        `SELECT balance FROM accounts WHERE id = ?`,
        [formdata]
    )

    await connection.end()

    return rows
}

export async function getUserById(formdata) {
    let connection = await getConnection()
    let id = formdata
    let [rows] = await connection.execute(
        `SELECT login, trustedSeller, admin FROM accounts WHERE id = ?`,
        [id]
    )

    await connection.end()

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

    await connection.end()

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

    await connection.end()

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

    await connection.end()

    return rows
}

export async function getLotById(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT * FROM lots WHERE game_id = ? AND category_id = ? AND id = ?`,
        [formdata.game_id, formdata.category_id, formdata.lot_id]
    )

    await connection.end()

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
        `INSERT INTO lots (name, description, price, category_id, game_id, ownerUsername, ownerId, confirmation, confirmed, quantity, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [formdata.name, formdata.description, formdata.price, formdata.category_id, formdata.game_id.id, formdata.ownerUsername, formdata.ownerId, 'false', 'false', formdata.quantity, formdata.active]
    )
   
    await connection.end()

    return 'Успешно!'
}

export async function confirmLot(formdata) {
    let connection = await getConnection()

    await connection.execute(
        `UPDATE lots SET confirmed='false' WHERE id = ?`,
        [formdata.lotId]
    )
    await connection.execute(
        `UPDATE lots SET confirmation='false' WHERE id = ?`,
        [formdata.lotId]
    )
    await connection.execute(
        `UPDATE lots SET tempBuyerId='null' WHERE id = ?`,
        [formdata.lotId]
    )
    let [rows] = await connection.execute(
        `SELECT amount, quantity FROM orders WHERE lotId = ?`,
        [formdata.lotId]
    )
    let [rows3] = await connection.execute(
        `SELECT * FROM lots WHERE id = ?`,
        [formdata.lotId]
    )

    await connection.execute(
        `UPDATE orders SET confirm='true' WHERE lotId = ?`,
        [formdata.lotId]
    )

    if (rows3[0].quantity <= 0) {
        await connection.execute(
            `DELETE FROM lots WHERE id = ${rows3[0].id}`
        )
    }
    let [rows2] = await connection.execute(
        `SELECT balance FROM accounts WHERE id = ?`,
        [rows3[0].ownerId]
    )
    
    let newBalance = Number(rows2[0].balance) + Number(rows[0].amount * Number(rows[0].quantity))
    await connection.execute(
        `UPDATE accounts SET balance=${newBalance} WHERE id = ?`,
        [rows3[0].ownerId]
    )

    await connection.end()

    return 'Успешно!'
}

export async function getLots(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT * FROM lots WHERE game_id = ? AND category_id = ?`,
        [Number(formdata.game_id), Number(formdata.category_id)]
    )

    await connection.end()

    return rows
}

export async function getLotsByUserId(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT id, name, price, ownerUsername, game_id, category_id, active FROM lots WHERE ownerId = ?`,
        [formdata]
    )

    await connection.end()

    return rows
}

export async function getCategoryById(formdata) {
    let connection = await getConnection()
    let id = formdata
    let [rows] = await connection.execute(
        `SELECT name FROM categories WHERE id = ?`,
        [id]
    )

    await connection.end()

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

    await connection.end()

    return 'Успешно!'
}

export async function getCategories() {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT * FROM categories`
    )

    await connection.end()

    return rows
}

export async function getOrdersByUserId(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT * FROM orders WHERE buyerId = ?`,
        [formdata]
    )

    await connection.end()

    return rows
}

export async function getFinancesByUserId(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT * FROM orders WHERE buyerId = ? OR sellerId = ?`,
        [formdata, formdata]
    )

    await connection.end()

    return rows
}

export async function getSalesByUserId(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT * FROM orders WHERE sellerId = ?`,
        [formdata]
    )

    await connection.end()

    return rows
}

export async function buyOrder(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT balance, login FROM accounts WHERE id = ?`,
        [formdata.userId]
    )
    let [rows2] = await connection.execute(
        `SELECT * FROM lots WHERE id = ?`,
        [formdata.lotId]
    )
    let [rows3] = await connection.execute(
        `SELECT * FROM games WHERE id = ?`,
        [formdata.game_id]
    )
    if (rows.length === 0) {
        return 'Пользователя с таким id не существует!'
    }
    if (Number(formdata.userId) === Number(formdata.sellerId)) {
        return 'У самого себя купить нельзя!'
    }
    if (rows[0].balance >= formdata.price * formdata.quantity) {
       let newBalance = rows[0].balance - formdata.price * formdata.quantity
       await connection.execute(`UPDATE accounts SET balance=? WHERE id = ?`,
        [newBalance, formdata.userId]
       )
       await connection.execute(
        `INSERT INTO orders (amount, category_id, game_id, buyerId, sellerId, confirm, lotId, quantity, sellerUsername, gameName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [formdata.price, formdata.category_id, formdata.game_id, formdata.userId, formdata.sellerId, 'false', formdata.lotId, formdata.quantity, rows2[0].ownerUsername, rows3[0].name]
        )

        await connection.execute(
            `INSERT INTO unreadMessages (content, senderUsername, receiverId, lotId, gameId, categoryId, gameName, buyerUsername) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [`У вас купили лот с айди: ${formdata.lotId}`, 'FunPay', formdata.sellerId, formdata.lotId, formdata.game_id, formdata.category_id, rows3[0].name, rows[0].login]
        )

       await connection.execute(
        `UPDATE lots SET confirmation='true' WHERE id = ?`,
        [formdata.lotId]
       )


       let newQuantity = Number(rows2[0].quantity) - Number(formdata.quantity)
       await connection.execute(
        `UPDATE lots SET quantity=${newQuantity} WHERE id = ?`,
        [formdata.lotId]
       )

       await connection.execute(
        `UPDATE lots SET tempBuyerId = ?`,
        [formdata.userId]
       )

       await connection.end()

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
        `INSERT INTO messages (senderId, receiverId, content, senderUsername, receiverUsername, lotId) VALUES (?, ?, ?, ?, ?, ?)`,
        [formdata.senderId, formdata.receiverId, formdata.content, rows[0].login, rows2[0].login, formdata.lotId]
    )

    await connection.end()

    return 'Успешно!'
}

export async function getMessages(formdata) {
    let connection = await getConnection()
    let [rows] = await connection.execute(
        `SELECT * FROM messages WHERE lotId = ?`,
        [formdata.lotId]
    )
    let tempRows = []
    for (let a = 0; a < rows.length; a++) {
        if (Number(rows[a].senderId) === Number(formdata.receiverId) || Number(rows[a].senderId) === Number(formdata.senderId) || Number(rows[a].receiverId) === Number(formdata.senderId)) {
            tempRows.push(rows[a])
        }
    }

    await connection.end()

    return tempRows
}

export async function trustSellerCheck(formdata) {
    let connection = await getConnection()
    await connection.execute(
        `UPDATE accounts SET trustedSeller='true' WHERE id = ?`,
        [formdata.userId]
    )

    await connection.end()

    return 'Успешно!'
}

export async function createTicket(formdata) {
    let connection = await getConnection()
    await connection.execute(
        `INSERT INTO tickets (content, login, problem, senderId, status) VALUES (?, ?, ?, ?, ?)`,
        [formdata.content, formdata.login, formdata.problem, formdata.senderId, 'approval']
    )

    await connection.end()

    return 'Успешно!'
}

export async function getTicketsByUserId(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT * FROM tickets WHERE senderId = ?`,
        [formdata]
    )

    await connection.end()

    return rows
}

export async function getTicketInfo(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT * FROM tickets WHERE id = ?`,
        [formdata]
    )

    await connection.end()

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

    await connection.end()

    return 'Успешно!'
}

export async function getSupportMessages(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT * FROM supportMessages WHERE ticketId = ?`,
        [formdata]
    )

    await connection.end()

    return rows
}

export async function changeSupportTicketStatus(formdata) {
    let connection = await getConnection()

    await connection.execute(
        `UPDATE tickets SET status=? WHERE id = ?`,
        [formdata.status, formdata.ticketId]
    )

    await connection.end()
    
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

        await connection.end()

        return 'Успешно!'
    }
}

export async function changeTicketStatus(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT status FROM tickets WHERE id = ?`,
        [formdata]
    )
    if (rows[0].status === 'approval') {
        await connection.execute(
            `UPDATE tickets SET status='resolved' WHERE id = ?`,
            [formdata]
        )
    }
    if (rows[0].status === 'resolved') {
        await connection.execute(
            `UPDATE tickets SET status='approval' WHERE id = ?`,
            [formdata]
        )
    }

    await connection.end()

    return 'Успешно!'
}

export async function orderMoneyBack(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT balance FROM accounts WHERE id = ?`,
        [formdata.buyerId]
    )
    let [rows2] = await connection.execute(
        `SELECT amount, quantity FROM orders WHERE lotId = ?`,
        [formdata.lotId]
    )
    let [rows3] = await connection.execute(
        `SELECT quantity FROM lots WHERE id = ?`,
        [formdata.lotId]
    )

    let newBalance = Number(rows[0].balance) + Number(rows2[0].amount)

    await connection.execute(
        `UPDATE accounts SET balance=${newBalance} WHERE id = ?`,
        [formdata.buyerId]
    )
    await connection.execute(
        `UPDATE lots SET tempBuyerId='null' WHERE id = ?`,
        [formdata.lotId]
    )
    let newQuantity = Number(rows3[0].quantity) + Number(rows2[0].quantity)
    await connection.execute(
        `UPDATE lots SET quantity=${newQuantity} WHERE id = ?`,
        [formdata.lotId]
    )
    await connection.execute(
        `DELETE FROM orders WHERE lotId = ?`,
        [formdata.lotId]
    )

    await connection.end()

    return 'Успешно!'
}

export async function getOrderByLotId(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT * FROM orders WHERE lotId = ?`,
        [formdata.lotId]
    )

    await connection.end()

    return rows
}

export async function deleteLotById(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT ownerId FROM lots WHERE id = ?`,
        [formdata.lotId]
    )

    if (Number(rows[0].ownerId) !== Number(formdata.userId)) {
        return
    }

    if (rows.length === 0) {
        return
    }

    await connection.execute(
        `DELETE FROM lots WHERE id = ?`,
        [formdata.lotId]
    )

    await connection.end()

    return 'Успешно!'
}

export async function getUserBySessionId(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT userId FROM sessions WHERE sessionId = ?`,
        [formdata]
    )

    await connection.end()

    return rows
}

export async function logout(formdata) {
    let connection = await getConnection()

    await connection.execute(
        `DELETE FROM sessions WHERE sessionId = ?`,
        [formdata]
    )

    await connection.end()

    return 'Успешно!'
}

export async function getUnreadMessages(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT * FROM unreadMessages WHERE receiverId = ?`,
        [formdata.userId]
    )

    await connection.end()

    return rows
}

export async function messagesRead(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT * FROM unreadMessages WHERE receiverId = ?`,
        [formdata.userId]
    )

    if (rows.length === 0) {
        return
    }

    await connection.execute(
        `UPDATE unreadMessages SET readed='true' WHERE receiverId = ?`,
        [formdata.userId]
    )

    await connection.end()

    return 'Успешно!'
}

export async function makeOnline(formdata) {
    let connection = await getConnection()

    await connection.execute(
        `UPDATE accounts SET isOnline='true', last_active=NOW() WHERE id = ?`,
        [formdata.userId]
    )
    await connection.end()
    return 'Успешно!'
}

export async function getOnlineUsers(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT last_active, isOnline FROM accounts WHERE id = ?`,
        [formdata.userId]
    )
    let newDate = new Date(String(rows[0].last_active))
    let currentDate = new Date()
    await connection.end()
    if (currentDate - newDate > 300000) {
        return false
    } else {
        return true
    }
}

export async function addReview(formdata) {
    let connection = await getConnection()

    if (formdata.amountStars > 5 || formdata.amountStars < 1) {
        return 'Звёзд должно быть от 1 до 5!'
    }

    let [rows] = await connection.execute(
        `SELECT * FROM reviews WHERE lotId = ? AND senderId = ?`,
        [Number(formdata.lotId), Number(formdata.senderId)]
    )
    

    if (rows.length === 0) {
        let [rows2] = await connection.execute(
            `SELECT login FROM accounts WHERE id = ?`,
            [Number(formdata.senderId)]
        )
        await connection.execute(
            `INSERT INTO reviews (userId, amountStars, comment, senderId, senderUsername, lotId) VALUES (?, ?, ?, ?, ?, ?)`,
            [Number(formdata.userId), Number(formdata.amountStars), formdata.comment, Number(formdata.senderId), rows2[0].login, Number(formdata.lotId)]
        )
        return 'Успешно!'
    } else if (rows.length > 0) {
        return 'Вы уже отправляли отзыв об этом заказе!'
    }
}

export async function getReviews(formdata) {
    let connection = await getConnection()

    let [rows] = await connection.execute(
        `SELECT amountStars FROM reviews WHERE userId = ?`,
        [formdata.userId]
    )

    if (rows.length === 0) {
        return 'Отзывов нету!'
    }

    let rating = 0
    let tempStars = 0

    for (let a = 0; a < rows.length; a++) {
        if (rows[a].amountStars === 1) {
            tempStars = tempStars + rows[a].amountStars
            tempStars = tempStars - 1
        }
        if (rows[a].amountStars === 2) {
            tempStars = tempStars + rows[a].amountStars
            tempStars = tempStars - 2
        } else {
            tempStars = tempStars + rows[a].amountStars
        }
    }
    
    rating = Number(tempStars) / Number(rows.length)
    return rating
}