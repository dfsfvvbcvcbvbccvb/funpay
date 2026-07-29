import SupportNavbar from "./SupportNavbar"
import Footer from "../Footer"
import axios from "axios"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import getUserId from "../getUserId"

function SupportTicketInfo() {

    let id = useParams()
    const [ticket, setTicket] = useState('')
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const [admin, setAdmin] = useState(false)
    const [resolved, setResolved] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    let [userId, setUserId] = useState()

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
        const loadingTicketInfo = async () => {
        try {
            let response = await axios.post(`/support/ticket/${id.id}`)
            let response2 = await axios.post(`/support/messages/${id.id}`)
            let response3 = await axios.post(`/api/user/${userId}`)
            if (response3.data[0]?.admin === 'true') {
                setAdmin(true)
            }
            if (response.data.length === 0) {
                navigate('/support/tickets')
                return
            }
            if (response.data[0].status === 'resolved') {
                setResolved(true)
            }
            setTicket(response.data)
            setMessages(response2.data)
        } catch (e) {
            console.log(e)
        }
        }
        loadingTicketInfo()
    }, [userId])

    async function handleSendMessage() {

        if (message === '') {
            setError('Сообщение не должно быть пустым')
            return
        }

        let formdata = {
            senderId: userId,
            ticketId: id.id,
            content: message
        }

        let response = await axios.post('/support/message/send', formdata)
        window.location.reload()
    }

    async function handleFormDelete() {

        let formdata = {
            userId: userId,
            ticketId: id.id
        }

        let response = await axios.post(`/support/ticket/delete`, formdata)
        if (response.data === 'Успешно!') {
            navigate('/support/tickets')
        }
    }

    async function handleChangeStatus() {
        let id = ticket[0].id

        let response = await axios.post(`/support/tickets/status/${id}`)
        if (!resolved) {
            if (response.data === 'Успешно!') {
                setResolved(true)
                return
            }
        }
        if (resolved) {
            if (response.data === 'Успешно!') {
                setResolved(false)
                return
            }
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
                    {resolved ? (
                      <button onClick={handleChangeStatus} className="btn btn-success me-2 ms-2">Открыть снова</button>
                        ) : (
                      <button onClick={handleChangeStatus} className="btn btn-success me-2 ms-2">Решено</button>
                    )}
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
              <span className="">{ticket[0]?.content}</span>
          </div>       
          <div className="d-flex flex-column">
            <label className="mt-4">Сообщения:</label>
          {messages.map(message => (
            <div key={message.id} className="border mt-2 w-50">
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
          <>
          {resolved ? (
            <div className="alert alert-danger mt-2">
                <h3>Тикет закрыт.</h3>
            </div>
            ) : (
           <div className="d-flex flex-column">
            <input className="form-control mt-2 w-25" placeholder="Сообщение:" onChange={(e) => setMessage(e.target.value)}></input>
            <button className="btn btn-primary mt-2 w-25" onClick={handleSendMessage}>Отправить</button>
          </div>
           )}
            {error && (
                <div class="alert alert-danger mt-2">
                    <h3>{error}</h3>
                </div>
            )} 
           </>
          
          <Footer></Footer>
        </div> 
    )
}

export default SupportTicketInfo