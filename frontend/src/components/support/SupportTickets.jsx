import { useNavigate } from "react-router-dom"
import { useEffect } from 'react';
import Footer from "../Footer";
import SupportNavbar from "./SupportNavbar";
import { useState } from "react";
import axios from "axios";
import getUserId from "../getUserId";

function SupportTickets() {

    const [tickets, setTickets] = useState([])
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
        const loadingTickets = async () => {
        try {
            let id = userId
            let response = await axios.post(`/support/${id}`)
            setTickets(response.data)
        } catch (e) {
            console.log(e)
        }
        }
        loadingTickets()
    }, [userId])

  return (
    <div className="me-5 ms-5">
          <div>
              <SupportNavbar></SupportNavbar>
          </div>
          <div>
              <h1>Ваши запросы</h1>
              <div className="d-flex flex-column">
                {tickets.map(ticket => (
                    <a href={`/support/ticket/${ticket.id}`} key={ticket.id} className="btn btn-primary m-2 w-25">Тикет номер: {ticket.id}</a>
                 ))}
                </div>
          </div>
          <Footer></Footer>
    </div>
  )
}
export default SupportTickets