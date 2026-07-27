import express, { response } from 'express';
import mysql from 'mysql2/promise';
import cookieParser from 'cookie-parser';
import { WebSocketServer } from 'ws';

import { registration, login, getGames, getGameById, createGame, createCategory, getCategories, createLot, getLots, getLotById, getUserById, getCategoryById, getLotsByUserId, getBalanceByUserId, getOrdersByUserId, buyOrder, sendMessage, getMessages, trustSellerCheck, getFinancesByUserId, getSalesByUserId, confirmLot, createTicket, getTicketsByUserId, getTicketInfo, sendSupportMessage, getSupportMessages, deleteTicket, changeTicketStatus, getOrderByLotId, orderMoneyBack, deleteLotById, getUserBySessionId, logout, getUnreadMessages, messagesRead, makeOnline, getOnlineUsers, addReview, getReviews, getAutoIssueByLotId, getAllReviews, editLot, getTabMessages } from './repository.js';
const app = express()
const PORT = 4000
const server = new WebSocketServer({ port: 8080 })

app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
let activeClients = new Map()

server.on('connection', async (ws) => {
    let currentUserId = null
    ws.on('message', async (message) => {
        let parsed = JSON.parse(message)
        let messageString = message.toString();
        messageString = JSON.parse(messageString)
        activeClients.set(Number(messageString.senderId), ws)
        let response = ''
        if (messageString.get === true) {
            response = await getMessages(messageString)
        }
        if (messageString.getTab === true) {
            response = await getTabMessages(messageString)
        } else if (messageString.get !== true) {
            await sendMessage(messageString)
            response = await getTabMessages(messageString)
            messageString.get = true
        }
        
        if (messageString.get === true || messageString.getTab === true) {
            let receiverWs = activeClients.get(Number(messageString.senderId))
            let receiverWs2 = activeClients.get(Number(messageString.receiverId))
            receiverWs.send(JSON.stringify(response))
            if (receiverWs2 !== undefined) {
                receiverWs2.send(JSON.stringify(response))
            }
            
            
            
        }
    })
    ws.on('close', () => {
    })
})

app.post('/api/login', async (req, res) => {
    let formdata = req.body
    if (formdata.usernameOrEmail === '' || formdata.password === '') {
        res.json('Заполните все поля')
        return
    }
    let response = await login(formdata)

    if (response.res !== 'Успешно!') {
        res.json('Неверный логин или пароль!')
        return
    }

    res.cookie('login', response.sessionId, {
        maxAge: 3600000 * 24,
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    });

    res.json(response)
});

app.post('/api/logout', async (req, res) => {
    let formdata = req.cookies?.login
    res.clearCookie('login')
    let response = await logout(formdata)
    res.json(response)
});

app.post('/api/register', async (req, res) => {
    if (req.body?.login === '' || req.body?.password === '' || req.body?.email === '') {
        res.json('Заполните все поля!')
    }

    let formdata = req.body
    let response = await registration(formdata)
    res.json(response)
});

app.post('/api/getUserId', async (req, res) => {
    let formdata = req.cookies?.login
    if (formdata === undefined) {
        return
    }
    let response = await getUserBySessionId(formdata)
    res.json(response)
});

app.post('/api/user/balance/:id', async (req, res) => {
    let formdata = req.params.id

    let response = await getBalanceByUserId(formdata)
    res.json(response)
});

app.post('/api/user/:id', async (req,res) => {
    let formdata = req.params.id

    let response = await getUserById(formdata)
    res.json(response)
})

app.post('/api/categories', async (req, res) => {
    let response = await getCategories()
    res.json(response)
});

app.post('/api/category/:id', async (req, res) => {
    let formdata = req.params.id

    let response = await getCategoryById(formdata)
    res.json(response)
});

app.post('/category/create', async (req,res) => {
    if (req.body.name === '' || req.body.description === '') {
        res.json('Заполните все поля!')
    }

    let response = await createCategory(req.body)
    res.json(response)
})

app.post('/game/create', async (req,res) => {
    if (req.body.name === '' || req.body.description === '') {
        res.json('Заполните все поля!')
    }

    let response = await createGame(req.body)
    res.json(response)
})

app.post('/api/game/:id', async (req, res) => {
    let formdata = req.params.id

    let response = await getGameById(formdata)
    res.json(response)
});

app.post('/support/ticket/delete', async (req,res) => {
    let formdata = req.body
    let response = await deleteTicket(formdata)
    res.json(response)
});

app.post('/api/lots/confirm/:id/:userId', async (req,res) => {
    let formdata = {
        lotId: Number(req.params.id),
        userId: Number(req.params.userId)
    }
    let response = await confirmLot(formdata)
    res.json(response)
});

app.post('/api/games', async (req, res) => {
    let response = await getGames()
    res.json(response)
});

app.post('/lots/create', async (req,res) => {
    if (req.body.name === '' || req.body.description === '' || req.body.price === '' || req.body.ownerUsername === '' || req.body.quantity === '') {
        res.json('Заполните все поля!')
    }

    let response = await createLot(req.body)
    res.json(response)
});

app.post('/api/orders/buy', async (req, res) => {
    let formdata = {
        lotId: req.body.lotId,
        price: req.body.price,
        game_id: req.body.game_id,
        category_id: req.body.category_id,
        userId: req.body.userId,
        quantity: req.body.quantity,
        sellerId: req.body.sellerId
    }
    let response = await buyOrder(formdata)
    res.json(response)
});

app.post('/api/order/back', async (req,res) => {
    let formdata = {
        lotId: req.body.lotId,
        buyerId: req.body.buyerId,
        sellerId: req.body.sellerId
    }
    let response = await orderMoneyBack(formdata)
    res.json(response)
});


app.post('/api/lots/user/:id', async (req, res) => {
    let formdata = req.params.id
    let response = await getLotsByUserId(formdata)
    res.json(response)
});

app.post('/api/lots/:game_id/:category_id/:lot_id', async (req, res) => {
    let formdata = {
        game_id: req.params.game_id,
        category_id: req.params.category_id,
        lot_id: req.params.lot_id
    }

    let response = await getLotById(formdata)
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

app.post('/api/orders/:id', async (req, res) => {
    let formdata = req.params.id

    let response = await getOrdersByUserId(formdata)
    res.json(response)
});
app.post('/api/messages/sender/:id1/receiver/:id2/', async (req, res) => {
    let formdata = {
        senderId: req.params.id1,
        receiverId: req.params.id2,
        content: req.body.content,
        lotId: req.body.lotId
    }

    let response = await sendMessage(formdata)
    res.json(response)
});

app.post('/api/getMessages/sender/:id1/receiver/:id2/:id3', async (req,res) => {
    let formdata = {
        senderId: req.params.id1,
        receiverId: req.params.id2,
        lotId: req.params.id3
    }
    let response = await getMessages(formdata)
    res.json(response)
});

app.post('/api/seller/check', async (req,res) => {
    let formdata = req.body
    let response = await trustSellerCheck(formdata)
    res.json(response)
});

app.post('/api/finances/:id', async (req,res) => {
    let formdata = req.params.id
    let response = await getFinancesByUserId(formdata)
    res.json(response)
});

app.post('/api/sales/:id', async (req,res) => {
    let formdata = req.params.id
    let response = await getSalesByUserId(formdata)
    res.json(response)
});

app.post('/support/create', async (req,res) => {
    let formdata = req.body
    let response = await createTicket(formdata)
    res.json(response)
});

app.post('/support/:id', async (req,res) => {
    let formdata = req.params.id
    let response = await getTicketsByUserId(formdata)
    res.json(response)
});

app.post('/support/ticket/:id', async (req,res) => {
    let formdata = req.params.id
    let response = await getTicketInfo(formdata)
    res.json(response)
});

app.post('/support/message/send', async (req,res) => {
    let formdata = req.body
    let response = await sendSupportMessage(formdata)
    res.json(response)
});

app.post('/support/messages/:id', async (req,res) => {
    let formdata = req.params.id
    let response = await getSupportMessages(formdata)
    res.json(response)
});
app.post('/support/tickets/status/:id', async (req,res) => {
    let formdata = req.params.id
    let response = await changeTicketStatus(formdata)
    res.json(response)
});
app.post('/api/order/:id', async (req,res) => {
    let formdata = {
        lotId: req.params.id
    }
    let response = await getOrderByLotId(formdata)
    res.json(response)
});

app.post('/api/lots/delete', async (req,res) => {
    let formdata = {
        lotId: req.body.lotId,
        userId: req.body.userId
    }
    let response = await deleteLotById(formdata)
    res.json(response)
});

app.post('/api/messages/unread', async (req,res) => {
    let formdata = {
        userId: req.body?.userId
    }
    if (!formdata.userId) {
        res.json('Ошибка')
        return
    }
    let response = await getUnreadMessages(formdata)
    res.json(response)
});

app.post('/api/messages/read', async (req,res) => {
    let formdata = {
        userId: req.body.userId
    }
    if (!formdata.userId) {
        res.json('Ошибка')
        return
    }
    let response = await messagesRead(formdata)
    res.json(response)
});

app.post('/api/online', async (req,res) => {
    let formdata = {
        userId: req.body.userId
    }
    if (formdata.userId === undefined) {
        res.json('Ошибка')
    }
    let response = await makeOnline(formdata)
    res.json(response)
});
app.post('/api/online/:id', async (req,res) => {
    let formdata = {
        userId: req.params.id
    }
    if (formdata.userId === undefined) {
        res.json('Ошибка')
    }
    let response = await getOnlineUsers(formdata)
    res.json(response)
});
app.post('/api/review', async (req,res) => {
    let formdata = {
        userId: req.body.userId,
        amountStars: req.body.amountStars,
        comment: req.body.comment,
        lotId: req.body.lotId,
        senderId: req.body.senderId
    }

    let response = await addReview(formdata)
    res.json(response)
})
app.post('/api/review/:id', async (req,res) => {
    let formdata = {
        userId: req.params.id
    }

    let response = await getReviews(formdata)
    res.json(response)
})

app.post('/api/auto/:id', async (req,res) => {
    let formdata = {
        lotId: req.params.id
    }

    let response = await getAutoIssueByLotId(formdata)
    res.json(response)
})

app.post('/api/reviews/:id', async (req, res) => {
    let formdata = {
        userId: req.params.id
    }

    let response = await getAllReviews(formdata)
    res.json(response)
})

app.post('/edit/:game_id/:category_id/:lotId', async (req, res) => {
    let formdata = {
        lotId: req.params.lotId,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        userId: req.body.userId
    }

    let response = await editLot(formdata)
    res.json(response)
})

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`)
})