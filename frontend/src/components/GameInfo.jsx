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
        console.log(game)
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
      <h1>{game.name}</h1>
      <p>{game.description}</p>
      <div className="d-flex">
        {game.categories?.map(category => (
          <button key={category.id} className="btn btn-primary m-2">{category.name}</button>
        ))}
      </div>
    </div>
      <Footer></Footer>
    </div>
  )
}

export default GameInfo;