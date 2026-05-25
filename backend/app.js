import express from 'express';
import mysql from 'mysql2/promise';
import { registration, login } from './repository.js';
const app = express()
const PORT = 4000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/api/login', async (req, res) => {
    let formdata = req.body

    let response = await login(formdata)
    console.log(response)
    res.json(response)
});

app.post('/api/register', async (req, res) => {
    let formdata = req.body

    let response = await registration(formdata)
    res.json({ success: true, message: response });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`)
})