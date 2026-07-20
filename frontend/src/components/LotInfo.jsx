import { useState, useEffect, useRef  } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { useNavigate } from "react-router-dom"
import getUserId from "./getUserId"

function LotInfo() {

    const [lot, setLot] = useState('')
    const [confirmation, setConfirmation] = useState('')
    const [seller, setSeller] = useState('')
    const [contentJSX, setContentJSX] = useState('')
    const params = useParams()
    const navigate = useNavigate('')
    const [error, setError] = useState('')
    const [quantity, setQuantity] = useState('')
    const [content, setContent] = useState('')
    const [comment, setComment] = useState('')
    const [amountStars, setAmountStars] = useState('')
    const [autoIssue, setAutoIssue] = useState('')
    const [autoIssueJSX, setAutoIssueJSX] = useState(false)
    const [messages, setMessages] = useState([])
    const [userId, setUserId] = useState('')
    let socket = null

    const ws = useRef(null);

    useEffect(() => {
    const loadingUserId = async () => {
      try {
        let id = await getUserId()
        if (id === undefined) {
            navigate('/login')
        }
        setUserId(id)
      } catch (e) {
        console.log(e)
      }
    }
        loadingUserId()
    }, [])

    useEffect(() => {
        const loadingLot = async () => {
        try {
            let response = await axios.post(`/api/lots/${params.game_id}/${params.category_id}/${params.lot_id}`)
            if (String(response.data[0].active) === "0") {
              navigate('/')
              return
            }
            if (response.data === 'Не найдено!') {
              navigate('/')
              return
            }
            setLot(response.data)
            let id2 = response.data[0].ownerId
            let id3 = response.data[0].id
            let response3 = await axios.post(`/api/order/${response.data[0].id}`)

          if (Number(userId) === Number(response.data[0].ownerId)) {
              setSeller(true)
            }

            if (response.data[0].confirmation === 'true' && Number(userId) === Number(response3.data[0].buyerId)) {
              setConfirmation(true)
            }

            if (Number(userId) === response.data[0].ownerId && response.data[0].confirmation === 'true') {
              setConfirmation(true)
            }
            getMessages(id2, id3, userId)
        } catch (e) {
            console.log(e)
        }
        }
        loadingLot()
    }, [userId])

    async function getMessages(id2, id3, id4) {
      if (socket === null) {
        socket = new WebSocket('ws://localhost:8080')
      }
      ws.current = socket
      alert('sfdc')
      if (id4 === '') {
        return
      }
      let messageData = {
        senderId: id4,
        receiverId: id2,
        lotId: id3,
        get: true
      };
      ws.current.onopen = () => {
        ws.current.send(JSON.stringify(messageData))
        alert('123')
      }
      ws.current.onmessage = (event) => {
        alert('321')
        let response = JSON.parse(event.data)
        setMessages(response)
      }
    }


    async function handleConfirmOrder() {
      let formdata = userId
      let response = await axios.post(`/api/lots/confirm/${lot[0].id}/${formdata}`)
      if (response.data === 'Успешно!') {
        navigate('/')
      }
    }

    async function handleBackMoney() {
      let formdata = {
        sellerId: userId,
        lotId: lot[0].id,
        buyerId: lot[0].tempBuyerId
      }

      let response = await axios.post('/api/order/back', formdata)
      if (response.data === 'Успешно!') {
        navigate('/')
        return
      }
    }

    async function handleBuy() {
      let formdata = {
        userId: userId,
        sellerId: lot[0]?.ownerId,
        lotId: lot[0]?.id,
        game_id: params?.game_id,
        quantity: quantity,
        category_id: params?.category_id,
        price: lot[0]?.price
      }
      if (lot[0].quantity < quantity) {
        setError('У продавца столько нету!')
        return
      }
      if (Number(formdata.sellerId) === Number(formdata.userId)) {
        setError('У самого себя купить нельзя!')
        return
      }
      let response = await axios.post('/api/orders/buy', formdata)
      if (response.data === 'Успешно!') {
        setConfirmation(true)
        let response2 = await axios.post(`/api/auto/${lot[0]?.id}`)
        setAutoIssue(response2.data)
        setAutoIssueJSX(true)
        return
      } else {
        setError(response.data)
      }
    }

    async function handleDeleteLot() {
      let id = lot[0]?.id

      let formdata = {
        lotId: id,
        userId: userId
      }

      let response = await axios.post(`/api/lots/delete`, formdata)
      if (response.data === 'Успешно!') {
        navigate('/')
        return
      }
    }

    async function handleSendReview() {
      let formdata = {
        userId: lot[0]?.ownerId,
        amountStars: amountStars,
        comment: comment,
        lotId: lot[0]?.id,
        senderId: userId
      }

      let response = await axios.post('/api/review', formdata)
      if (response.data === 'Успешно!') {
        return
      } else {
        setError(response.data)
      }
    }

    async function getAutoIssue() {
      let response = await axios.post(`/api/auto/${lot[0].id}`)
      setAutoIssue(response.data)
      return '1'
    }
    function getButtonStatus() {
      if (seller && confirmation) {
        return (
          <button onClick={handleBackMoney} className="btn btn-danger mt-2">Вернуть деньги покупателю</button>
        )
      }
      if (confirmation) {
        if (lot[0].autoIssue === 1 || lot[0].autoIssue === '1') {
          let test = (async () => {
            let res = await getAutoIssue()
            setAutoIssueJSX(true)
          })
          test()
        }
        return (
          <div>
            <div className="mb-1">
              <button onClick={handleConfirmOrder} className="btn btn-primary mt-2">Подтвердить выполнение заказа</button>
            </div>
            <div>
              <span className="text-secondary">Введите отзыв и количество звёзд</span>
              <input onChange={(e) => setComment(e.target.value)} type="text" className="form-control mt-1" placeholder="Отзыв"></input>
              <input onChange={(e) => setAmountStars(e.target.value)} type="number" className="form-control mt-1" placeholder="Количество звёзд"></input>
              <button onClick={handleSendReview} className="btn btn-primary mt-1 mb-1">Оставить отзыв</button>
            </div>
          </div>
        )
      }
      if (seller) {
        return (
          <div className="d-flex flex-column">
            <button onClick={handleDeleteLot} className="btn btn-danger mt-2">Удалить лот</button>
            <a href={`/edit/${params?.game_id}/${params?.category_id}/${lot[0]?.id}`} className="btn btn-primary mt-2">Редактировать лот</a>
          </div>
        )
      }
      if (!confirmation) {
        return (
          <div className="d-flex flex-column">
          <div class="form-floating mb-2 mt-2">
              <input className="form-control" type="number" onChange={(e) => setQuantity(e.target.value)} id="floatingPassword" placeholder="Сколько штук хотите купить" required></input>
              <label for="floatingPassword">Сколько штук хотите купить</label>
          </div>
          <div className="mt-2 mb-2">
            <span className="p-2 border rounded mb-2 mt-2 text-secondary">Итоговая цена: {lot[0]?.price * quantity}₽</span>
          </div>
          <button onClick={handleBuy} className="btn btn-primary mt-1 w-25">Купить</button>
          </div>
        )
      }
      
    }

    async function handleSendMessage() {
      let receiverId = lot[0]?.ownerId
      if (socket === null) {
        ws.current = new WebSocket('ws://localhost:8080');
      } else {
        ws.current = socket
      }
      

      const messageData = {
        content: content,
        lotId: lot[0]?.id,
        senderId: userId,
        receiverId: receiverId,
      };
      ws.current.onopen = async () => {
        ws.current.send(JSON.stringify(messageData))
      }
      
    }

  return (
    <div className="ms-5 me-5">

    <div>
      <Navbar></Navbar>
    </div>

    <div className="d-flex">
      <div className="w-50">
      <div className="border mt-2 rounded p-2">
        <h4>Краткое описание</h4>
        <span className="text-secondary">{lot[0]?.name}</span>
      </div>
      <div className="border mt-2 rounded p-2">
        <h4>Подробное описание</h4>
        <span className="text-secondary">{lot[0]?.description}</span>
      </div>
      <div className="border mt-2 rounded p-2">
        <h4>Количество товара</h4>
        <span className="text-secondary">{lot[0]?.quantity}</span>
      </div>
      <div className="border mt-2 rounded p-2">
        <h4>Цена за 1 штуку</h4>
        <span className="text-secondary">{lot[0]?.price}₽</span>
      </div>
      

       <div>{getButtonStatus()}</div>
       {autoIssueJSX && (
        <div className="border rounded d-flex flex-column p-2">
          <h2>Автовыдача</h2>
          <span className="mt-2 text-secondary">{autoIssue[0]?.content}</span>
        </div>
       )}
       {error && (
          <div className="alert alert-danger mt-2">
              <h3>{error}</h3>
          </div>
        )}
       <Footer></Footer>

       
       </div>
      <div className="ms-3 mt-2">
        <div className="d-flex flex-column border rounded p-5 w-75 text-break">
        {messages?.map(message => (
          <span className="mt-2 mb-2">Отправитель: {message.senderUsername} Содержимое: {message.content}</span>
        ))}
        </div>
        <input onChange={(e) => setContent(e.target.value)} type="text" className="form-control mt-2 w-75" placeholder="Контент"></input>
        <button className="mt-2 mb-2 btn btn-outline-primary w-75" onClick={handleSendMessage}>Отправить</button>
      </div>
      </div>
    </div>
  )
}

export default LotInfo