import Navbar from "./Navbar"
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import getUserId from "./getUserId";

function Orders() {

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
    const loadingOrders = async () => {
      try {
        let id = userId
        let response = await axios.post(`/api/orders/${userId}`)
        setOrders(response.data)
      } catch (e) {
        console.log(e)
      }
    }
        loadingOrders()
    }, [userId])

    return (
        <div className="me-5 ms-5">
            <div>
                <Navbar></Navbar>
            </div>
            <div>
                <div>
                    <h1>Ваши заказы</h1>
                    <div>
                        <div>
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
                                <a className="stretched-link fs-3 text-decoration-none link-secondary"><td className="text-danger">-{order.amount}</td></a>
                                </td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    )
}
export default Orders;