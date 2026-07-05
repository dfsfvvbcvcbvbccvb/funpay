import Navbar from "./Navbar";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

  const [games, setGames] = useState([])

  useEffect(() => {
    const loadingGames = async () => {
      try {
        let response = await axios.post('/api/games')
        setGames(response.data)
      } catch (e) {
        console.log(e)
      }
    }
    loadingGames()
  }, [])

  return (
    <div className="ms-5 me-5">

    <div>
      <Navbar></Navbar>
    </div>

    <div className="d-flex row text-break">
      <span className="m-2">ВАШИ ИГРЫ</span>
      {games.map(game => (
        <div key={game.id} className="m-2 p-2 m-2 border w-25">
          <a className="text-decoration-none link-secondary" href={`/lots/${game.id}`}>Игра {game.name}</a>
          <div className="d-flex flex-column">
            <label className="border-top">Категории:</label>
            {game.categories?.map(category => (
              <a href={`/lots/${game.id}/${category.id}`} key={category.id}>{category.name}</a>
            ))}
            </div>
      </div>
      ))}
    </div>
      <Footer></Footer>
    </div>
  )
}

export default Dashboard;