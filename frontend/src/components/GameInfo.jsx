import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function GameInfo() {

    let { id } = useParams()
    const navigate = useNavigate()
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

    function handleNavigate(url) {
      navigate(url)
    }

  return (
    <div className="ms-5 me-5">

    <div>
      <Navbar></Navbar>
    </div>

    <div className="d-flex flex-column">
      <h3 className="text-break">Игра {game.name}</h3>
      <span className="text-break text-secondary">Описание: {game.description}</span>
      <h4 className="border-top fs-2">Категории:</h4>
      <div className="d-flex">
        {game.categories?.map(category => (
          <a key={category.id} style={{width: 120}} href={`/lots/${game.id}/${category.id}`} className="btn btn-primary mt-2 mb-2 me-2 btn-lg">{category.name}</a>
        ))}
      </div>
      <a href={`/lots/create/${game.id}`}>Создать Лот</a>
    </div>
      <Footer></Footer>
    </div>
  )
}

export default GameInfo;