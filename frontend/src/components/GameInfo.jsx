import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function GameInfo() {

    let { id } = useParams()
    const [game, setGame] = useState('')

    useEffect(() => {
    const loadingGame = async () => {
      try {
        let response = await axios.post(`/api/game/${id}`)
        setGame(response.data)
      } catch (e) {
        console.log(e)
      }
      }
      loadingGame()
    }, [])

  return (
    <div className="ms-5 me-5">

    <div>
      <Navbar></Navbar>
    </div>

    <div>
      <h1>Minecraft</h1>
      <p>На бирже FunPay можно купить аккаунт Minecraft напрямую у игрока, при этом мы обеспечим безопасность вашей сделки. Продавец получает оплату только после передачи данных покупателю. Нашим пользователям разрешено продавать аккаунты, полученные только легальным путем.</p>
      <div className="d-flex">
         <button className="btn btn-primary m-2">Аккаунты</button>
         <button className="btn btn-primary m-2">Ключи</button>
         <button className="btn btn-primary m-2">Minecoins</button>
         <button className="btn btn-primary m-2">Валюта</button>
      </div>
    </div>
      <Footer></Footer>
    </div>
  )
}

export default GameInfo;