import { useState, useEffect  } from "react"
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
    const [messages, setMessages] = useState([])
    const [userId, setUserId] = useState('')

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
            let response2 = await axios.post(`/api/getMessages/sender/${userId}/receiver/${id2}/${id3}`)
            setMessages(response2.data)
        } catch (e) {
            console.log(e)
        }
        }
        loadingLot()
    }, [userId])


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

    function getButtonStatus() {
      if (seller && confirmation) {
        return (
          <button onClick={handleBackMoney} className="btn btn-danger mt-2">Вернуть деньги покупателю</button>
        )
      }
      if (confirmation) {
        return (
          <button onClick={handleConfirmOrder} className="btn btn-primary mt-2">Подтвердить выполнение заказа</button>
        )
      }
      if (seller) {
        return (
          <button onClick={handleDeleteLot} className="btn btn-danger mt-2">Удалить лот</button>
        )
      }
      if (!confirmation) {
        return (
          <div>
          <div class="form-floating mb-1">
              <input className="form-control mt-2" type="number" onChange={(e) => setQuantity(e.target.value)} id="floatingPassword" placeholder="Сколько штук хотите купить" required></input>
              <label for="floatingPassword">Сколько штук хотите купить</label>
          </div>
          <button onClick={handleBuy} className="btn btn-primary mt-1">Купить</button>
          </div>
        )
      }
      
    }

    async function handleSendMessage() {
      let receiverId = lot[0]?.ownerId
      let formdata = {
        content: content,
        lotId: lot[0].id
      }
      let response = await axios.post(`/api/messages/sender/${userId}/receiver/${receiverId}`, formdata)
      
      if (response.data === 'Успешно!') {
        window.location.reload()
        return
      } else {
        setError('Ошибка при отправке сообщения!')
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
        <p className="border-top">{lot[0]?.name}</p>
      </div>
      <div className="border mt-2 rounded p-2">
        <h4>Подробное описание</h4>
        <p className="border-top">{lot[0]?.description}</p>
      </div>
      <div className="border mt-2 rounded p-2">
        <h4>Количество товара</h4>
        <p className="border-top">{lot[0]?.quantity}</p>
      </div>
      <div className="border mt-2 rounded p-2">
        <h4>Цена за 1 штуку</h4>
        <p className="border-top">{lot[0]?.price}</p>
      </div>
      

       <div>{getButtonStatus()}</div>
       {error && (
          <div className="alert alert-danger mt-2">
              <h3>{error}</h3>
          </div>
        )}
       <Footer></Footer>

       
       </div>
      <div className="ms-3 mt-2">
        <div className="d-flex flex-column border p-5 w-75 text-break">
        {messages.map(message => (
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