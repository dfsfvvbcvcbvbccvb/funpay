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
            setMessages(response.data)
            let response2 = await axios.post(`/api/messages/read`, formdata)
        } catch (e) {
            console.log(e)
        }
        }
        loadingUnreadMessages()
    }, [userId])

    return (
        <div className="ms-5 me-5">
        <div>
            <Navbar></Navbar>
        </div>
        <div>
            <h2>Непрочитанные сообщения:</h2>
            <table className="table">
                <thead className="table-dark">
                    <tr>
                    <th scope="col">От кого</th>
                    <th scope="col">Содержимое</th>
                    </tr>
                </thead>
                <tbody>
                    {messages.map(message => (
                    <tr key={message.id}>
                    <td className="position-relative">
                    <a className="stretched-link fs-3 text-decoration-none link-secondary"><td>{message.senderUsername}</td></a>
                    </td>
                    <td className="position-relative">
                    <a className="stretched-link fs-3 text-decoration-none link-secondary"><td className="text-secondary">{message.content}</td></a>
                    </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        <Footer></Footer>
        </div>
    )
}

export default Messages