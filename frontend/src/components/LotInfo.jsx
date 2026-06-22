import { useState, useEffect  } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { useNavigate } from "react-router-dom"

function LotInfo() {

    const [lot, setLot] = useState('')
    const [confirmation, setConfirmation] = useState('')
    const params = useParams()
    const navigate = useNavigate('')
    const [error, setError] = useState('')
    const [content, setContent] = useState('')
    const [messages, setMessages] = useState([])

    useEffect(() => {
        const loadingLot = async () => {
        try {
            let id = localStorage.getItem('userId')
            let response = await axios.post(`/api/lots/${params.game_id}/${params.category_id}/${params.lot_id}`)
            console.log(response.data)
            if (response.data[0].confirmation === "true") {
              setConfirmation(true)
            } else {
              setConfirmation(false)
            }
            
            setLot(response.data)
            let id2 = lot[0]?.ownerId
            let response2 = await axios.post(`/api/getMessages/sender/${id}/receiver/${id2}`)
            setMessages(response2.data)
        } catch (e) {
            console.log(e)
        }
        }
        loadingLot()
    }, [])


    async function handleConfirmOrder() {
      let formdata = localStorage.getItem('userId')
      let response = await axios.post(`/api/lots/confirm/${lot[0].id}/${formdata}`)
    }

    async function handleBuy() {
      let formdata = {
        userId: localStorage.getItem('userId'),
        sellerId: lot[0]?.ownerId,
        lotId: lot[0]?.id,
        game_id: params?.game_id,
        category_id: params?.category_id,
        price: lot[0]?.price
      }
      if (Number(formdata.sellerId) === Number(formdata.userId)) {
        setError('У самого себя купить нельзя!')
      }
      let response = await axios.post('/api/orders/buy', formdata)
      if (response.data === 'Успешно!') {
        navigate('/')
      } else {
        setError(response.data)
      }
    }

    async function handleSendMessage() {
      let senderId = localStorage.getItem('userId')
      let receiverId = lot[0]?.ownerId
      let formdata = {
        content: content
      }
      let response = await axios.post(`/api/messages/sender/${senderId}/receiver/${receiverId}`, formdata)
      
      if (response.data === 'Успешно!') {
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

    <div>
      <div className="border mt-2">
        <label>Краткое описание</label>
        <h2>{lot[0]?.name}</h2>
      </div>
      <div className="border mt-2">
        <label>Подробное описание</label>
        <p>{lot[0]?.description}</p>
      </div>
      <div className="border mt-2">
        <label>Цена</label>
        <p>{lot[0]?.price}</p>
      </div>
      {confirmation ? (
        <button onClick={handleConfirmOrder} className="btn btn-primary mt-2">Подтвердить успешное выполнение заказа</button>
       ) : (
        <button onClick={handleBuy} className="btn btn-primary mt-2">Купить</button>
       )}
      <div>
        <div className="d-flex flex-column">
        {messages.map(message => (
          <span className="mt-2 mb-2">Отправитель: {message.senderUsername} Содержимое: {message.content}</span>
        ))}
        </div>
        <input onChange={(e) => setContent(e.target.value)} type="text" className="form-control mt-2" placeholder="Контент"></input>
        <button className="mt-2 mb-2 btn btn-outline-primary" onClick={handleSendMessage}>Отправить</button>
      </div>
          {error && (
            <div className="alert alert-danger mt-2">
                <h3>{error}</h3>
            </div>
          )}
      <Footer></Footer>
      </div>
    </div>
  )
}

export default LotInfo