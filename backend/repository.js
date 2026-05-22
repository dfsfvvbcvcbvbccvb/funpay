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
}

