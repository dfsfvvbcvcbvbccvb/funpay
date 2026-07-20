import Navbar from "./Navbar"
import Footer from "./Footer"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import getUserId from "./getUserId"
import axios from "axios"

function Messages() {

    const [userId, setUserId] = useState('')
    const navigate = useNavigate()
    const [messages, setMessages] = useState([])

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
        const loadingUnreadMessages = async () => {
        try {
            let formdata = {
                userId: userId
            }
            let response = await axios.post(`/api/messages/unread`, formdata)
            if (response.data === 'Ошибка') {
                return
            }
            setMessages(response.data)
            let response2 = await axios.post(`/api/messages/read`, formdata)
        } catch (e) {
            console.log(e)
        }
        }
        loadingUnreadMessages()
    }, [userId])

    function generateMessages(message) {
        if (!message.readed || message.readed) {
            
            if (message.lotId) {
                return (
                <tr key={message.id}>
                    <td className="position-relative">
                        <a href={`/lots/${message.gameId}/${message.categoryId}/${message.lotId}`} className="stretched-link fs-3 text-decoration-none link-primary"><span>{message.senderUsername}</span></a>
                    </td>
                    <td className="position-relative">
                        <a href={`/lots/${message.gameId}/${message.categoryId}/${message.lotId}`} className="stretched-link fs-3 text-decoration-none link-secondary"><span className="text-secondary">{message.content}</span></a>
                    </td>
                    <td className="position-relative">
                        <a href={`/lots/${message.gameId}/${message.categoryId}/${message.lotId}`} className="stretched-link fs-3 text-decoration-none link-secondary"><span>{message.buyerUsername}</span></a>
                    </td>
                    <td className="position-relative">
                        <a href={`/lots/${message.gameId}/${message.categoryId}/${message.lotId}`} className="stretched-link fs-3 text-decoration-none link-secondary"><span>{message.gameName}</span></a>
                    </td>
                    <td className="position-relative">
                        <a href={`/lots/${message.gameId}/${message.categoryId}/${message.lotId}`} className="stretched-link fs-3 text-decoration-none link-secondary"><span>{message.readed}</span></a>
                    </td>
                    <td className="position-relative">
                        <a href={`/lots/${message.gameId}/${message.categoryId}/${message.lotId}`} className="stretched-link fs-3 text-decoration-none link-success"><span>{message.created_at}</span></a>
                    </td>
                </tr>
                )
            }
        }
    }

    return (
        <div className="ms-5 me-5">
        <div>
            <Navbar></Navbar>
        </div>
        <div>
            <h2>Сообщения:</h2>
            <table className="table">
                <thead className="table-dark">
                    <tr>
                    <th scope="col">От кого</th>
                    <th scope="col">Содержимое</th>
                    <th scope="col">Покупатель</th>
                    <th scope="col">Игра</th>
                    <th scope="col">Прочитано</th>
                    <th scope="col">Время</th>
                    </tr>
                </thead>
                <tbody>
                    {messages?.map(message => (
                        <>
                            {generateMessages(message)}
                        </>
                    ))}
                </tbody>
            </table>
        </div>
        
        <Footer></Footer>
        </div>
    )
}

export default Messages