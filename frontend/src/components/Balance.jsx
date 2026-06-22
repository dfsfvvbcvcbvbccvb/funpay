import { useState, useEffect } from "react"
import axios from "axios"
import Navbar from "./Navbar"
import Footer from "./Footer"

function Balance() {

    const [balance, setBalance] = useState('')
    const [orders, setOrders] = useState([])
    let id = localStorage.getItem('userId')

    useEffect(() => {
    const loadingBalance = async () => {
      try {
        let response = await axios.post(`/api/user/balance/${id}`)
        setBalance(response.data[0].balance)
      } catch (e) {
        console.log(e)
      }
      }
      loadingBalance()
    }, [])

    useEffect(() => {
    const loadingOrders = async () => {
      try {
        let id = localStorage.getItem('userId')
        let response = await axios.post(`/api/finances/${id}`)
        for (let a = 0; a < response.data.length; a++) {
          if (Number(response.data[a].sellerId) === Number(id)) {
            response.data[a].sellerId = true
          } else {
            response.data[a].sellerId = false
          }
        }
        console.log(response.data)
        setOrders(response.data)
      } catch (e) {
        console.log(e)
      }
    }
        loadingOrders()
    }, [])

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
                      <a className="stretched-link fs-3 text-decoration-none link-secondary"><td className="text-success">+{order.amount}</td></a>
                    ) : (
                      <a className="stretched-link fs-3 text-decoration-none link-secondary"><td className="text-danger">-{order.amount}</td></a>
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