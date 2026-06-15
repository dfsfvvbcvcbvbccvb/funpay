import express, { response } from 'express';
import mysql from 'mysql2/promise';
import { registration, login, getGames, getGameById, createGame, createCategory, getCategories, createLot, getLots, getLotById } from './repository.js';
const app = express()
const PORT = 4000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/api/login', async (req, res) => {
    let formdata = req.body
    if (formdata.usernameOrEmail === '' || formdata.password === '') {
        res.json('Заполните все поля')
        return
    }
    let response = await login(formdata)
    if (response !== 'Успешно!') {
        res.json('Неверный логин или пароль!')
        return
    }
    res.json(response)
});

app.post('/api/register', async (req, res) => {
    if (req.body.login === '' || req.body.password === '' || req.body.email === '') {
        res.json('Заполните все поля!')
    }
    let formdata = req.body
    let response = await registration(formdata)
    res.json(response)
});

app.post('/api/games', async (req, res) => {
    let response = await getGames()
    res.json(response)
});

app.post('/api/categories', async (req, res) => {
    let response = await getCategories()
    res.json(response)
});

app.post('/api/lots/:gameId/:categoryId', async (req, res) => {
    let formdata = {
        game_id: req.params.gameId,
        category_id: req.params.categoryId
    }
    let response = await getLots(formdata)
    res.json(response)
});

app.post('/game/create', async (req,res) => {
    if (req.body.name === '' || req.body.description === '') {
        res.json('Заполните все поля!')
    }
    let response = await createGame(req.body)
    res.json(response)
})

app.post('/category/create', async (req,res) => {
    if (req.body.name === '' || req.body.description === '') {
        res.json('Заполните все поля!')
    }
    let response = await createCategory(req.body)
    res.json(response)
})

app.post('/api/game/:id', async (req, res) => {
    let formdata = req.params.id
    let response = await getGameById(formdata)
    res.json(response)
});

app.post('/lots/create', async (req,res) => {
    if (req.body.name === '' || req.body.description === '' || req.body.price === '') {
        res.json('Заполните все поля!')
    }

    let response = await createLot(req.body)
    res.json(response)
})

app.post('/api/lots/:game_id/:category_id/:lot_id', async (req, res) => {
    let formdata = {
        game_id: req.params.game_id,
        category_id: req.params.category_id,
        lot_id: req.params.lot_id
    }
    let response = await getLotById(formdata)
    res.json(response)
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`)
})