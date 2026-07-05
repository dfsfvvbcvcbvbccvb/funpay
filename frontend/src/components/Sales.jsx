import Navbar from "./Navbar"
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useEffect } from "react";
import getUserId from "./getUserId";

function Sales() {

    const [sales, setSales] = useState([])
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
    const loadingSales = async () => {
      try {
        let response = await axios.post(`/api/sales/${userId}`)
        setSales(response.data)
      } catch (e) {
        console.log(e)
      }
    }
        loadingSales()
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
                                {sales.map(sale => (
                                <tr key={sale.id}>
                                <td className="position-relative">
                                <a className="stretched-link fs-3 text-decoration-none link-secondary"><td>Заказ: {sale.id}</td></a>
                                </td>
                                <td className="position-relative">
                                <a className="stretched-link fs-3 text-decoration-none link-secondary"><td className="text-success">+{sale.amount * sale.quantity}</td></a>
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
export default Sales;