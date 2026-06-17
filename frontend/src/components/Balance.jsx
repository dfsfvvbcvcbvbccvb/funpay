import { useState, useEffect } from "react"
import axios from "axios"
import Navbar from "./Navbar"
import Footer from "./Footer"

function Balance() {

    const [balance, setBalance] = useState('')
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

    return (
    <div className="ms-5 me-5">
        <div>
            <Navbar></Navbar>
        </div>
        <div>
            <h3>Ваш баланс: {balance}</h3>
        </div>
        <div>
        <Footer></Footer>
        </div>
    </div> 
    )
}

export default Balance