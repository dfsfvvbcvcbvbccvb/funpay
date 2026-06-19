import Navbar from "./Navbar"
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useEffect } from "react";

function Orders() {

    const [orders, setOrders] = useState([])

    useEffect(() => {
    const loadingOrders = async () => {
      try {
        let id = localStorage.getItem('userId')
        let response = await axios.post(`/api/orders/${id}`)
        setOrders(response.data)
      } catch (e) {
        console.log(e)
      }
    }
        loadingOrders()
    }, [])

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
                            <button></button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    )
}
export default Orders;