import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

    <div>
      <h1>{game.name}</h1>
      <p>{game.description}</p>
      <div className="d-flex">
        {game.categories?.map(category => (
          <a key={category.id} href={`/lots/${game.id}/${category.id}`} className="btn btn-primary m-2">{category.name}</a>
        ))}
      </div>
      <a href={`/lots/create/${game.id}`}>Создать Лот</a>
    </div>
      <Footer></Footer>
    </div>
  )
}

export default GameInfo;