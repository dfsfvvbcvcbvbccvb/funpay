import SupportNavbar from "./SupportNavbar"
import Footer from "../Footer"
import axios from "axios"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

function SupportTicketInfo() {

    let id = useParams()
    const [ticket, setTicket] = useState('')
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const [admin, setAdmin] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const loadingTicketInfo = async () => {
        try {
            let userId = localStorage.getItem('userId')
            let response = await axios.post(`/support/ticket/${id.id}`)
            let response2 = await axios.post(`/support/messages/${id.id}`)
            let response3 = await axios.post(`/api/user/${userId}`)
            console.log(response3)
            if (response3.data[0].admin === 'true') {
                setAdmin(true)
            }
            setTicket(response.data)
            setMessages(response2.data)
        } catch (e) {
            console.log(e)
        }
        }
        loadingTicketInfo()
    }, [])

    async function handleSendMessage() {
        let userId = localStorage.getItem('userId')

        let formdata = {
            senderId: userId,
            ticketId: id.id,
            content: message
        }

        let response = await axios.post('/support/message/send', formdata)
        window.location.reload()
    }

    async function handleFormDelete() {
        let userId = localStorage.getItem('userId')

        let formdata = {
            userId: userId,
            ticketId: id.id
        }

        let response = await axios.post(`/support/ticket/delete`, formdata)
        if (response === 'Успешно!') {
            navigate('/support/tickets')
        }
    }

    return (
       <div className="me-5 ms-5">
          <div>
              <SupportNavbar></SupportNavbar>
          </div>
          <div className="d-flex flex-column">
                {admin ? (
                 <div className="d-flex mt-2">
                    <button onClick={handleFormDelete} className="btn btn-danger me-2">Удалить тикет</button>
                    <button className="btn btn-success me-2 ms-2">Решено</button>
                 </div>
                ) : (
                 <></>
                )}
              <div className="mb-2 mt-2">
                <span>Отправитель заявки: {ticket[0]?.login}</span>
              </div>
              <div className="mb-2 mt-2">
                <span>{ticket[0]?.problem}</span>
              </div>
              <label className="border-top">Описание проблемы:</label>
              <span className="border p-2">{ticket[0]?.content}</span>
          </div>
          <div className="d-flex flex-column">
            <label className="border-top border-primary mt-4">Сообщения:</label>
          {messages.map(message => (
            <div key={message.id} className="border mt-2">
            <label>Отправитель: {message.senderUsername}</label>
            <div>
            <label className="mt-3">Содержимое:</label>
            </div>
            <div className="mb-2 mt-2">
                <span>{message.content}</span>
            </div>
            </div>
          ))}
          </div>
          <div className="d-flex flex-column">
          <input className="form-control mt-2 w-25" placeholder="Сообщение:" onChange={(e) => setMessage(e.target.value)}></input>
          <button className="btn btn-primary mt-2 w-25" onClick={handleSendMessage}>Отправить</button>
          </div>
          <Footer></Footer>
        </div> 
    )
}

export default SupportTicketInfo