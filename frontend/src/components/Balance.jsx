import { useState, useEffect } from "react"
import axios from "axios"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { useNavigate } from "react-router-dom"
import getUserId from "./getUserId"

function Balance() {

    const [balance, setBalance] = useState('')
    const [orders, setOrders] = useState([])
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
    const loadingBalance = async () => {
      try {
        let response = await axios.post(`/api/user/balance/${userId}`)
        setBalance(response.data[0]?.balance)
      } catch (e) {
        console.log(e)
      }
      }
      loadingBalance()
    }, [userId])

    useEffect(() => {
    const loadingOrders = async () => {
      try {
        let response = await axios.post(`/api/finances/${userId}`)
        for (let a = 0; a < response.data.length; a++) {
          if (Number(response.data[a].sellerId) === Number(userId)) {
            response.data[a].sellerId = true
          } else {
            response.data[a].sellerId = false
          }
        }
        setOrders(response.data)
      } catch (e) {
        console.log(e)
      }
    }
        loadingOrders()
    }, [userId])

    return (
    <div className="ms-5 me-5">
        <div>
            <Navbar></Navbar>
        </div>
        <div>
            <h3>Ваш баланс: {balance}</h3>
              <table className="table">
                <thead className="table-dark">
                <tr>
                <th scope="col">ID</th>
                <th scope="col">Сумма</th>
                </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                  <tr key={order.id}>
                  <td className="position-relative">
                  <a className="stretched-link fs-3 text-decoration-none link-secondary"><td>Заказ: {order.id}</td></a>
                  </td>
                  <td className="position-relative">
                    {order.sellerId ? (
                      <a className="stretched-link fs-3 text-decoration-none link-secondary"><td className="text-success">+{order.amount * order.quantity}</td></a>
                    ) : (
                      <a className="stretched-link fs-3 text-decoration-none link-secondary"><td className="text-danger">-{order.amount * order.quantity}</td></a>
                    )}
                  </td>
                  </tr>
                  ))}
              </tbody>
            </table>
        </div>
        <div>
        <Footer></Footer>
        </div>
    </div> 
    )
}

export default Balance