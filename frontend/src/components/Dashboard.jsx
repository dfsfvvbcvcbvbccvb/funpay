import Navbar from "./Navbar";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

  const [games, setGames] = useState([])

  useEffect(async () => {
    let tempGames = await axios.post('/api/games')
  }, [])

  return (
    <div className="ms-5 me-5">

    <div>
      <Navbar></Navbar>
    </div>

    <div className="d-flex">
      <span className="m-2">ВАШИ ИГРЫ</span>
      {games.map(game => (
        <div className="m-2 row">
          <a className="col-9 text-decoration-none link-secondary" href={`/lots/${game.id}`}>{game.name}</a>
          {game.categories.map(category => (
            <a href={`/lots/${game.id}/${category.id}`} className="col-6">{category.name}</a>
          ))}
      </div>
      ))}
      
      <div className="m-2 row">
          <a className="col-9 text-decoration-none link-secondary" href="/lots/id">Dota 2</a>
          <a href="/" className="col-6">Аккаунты</a>
      </div>
      <div className="m-2 row">
          <a className="col-9 text-decoration-none link-secondary" href="/lots/id">Lineage</a>
          <a href="/" className="col-6">Аккаунты</a>
      </div>
      <div className="m-2 row">
          <a className="col-9 text-decoration-none link-secondary" href="/lots/id">Roblox</a>
          <a href="/" className="col-sm-6">Аккаунты</a>
          <a href="/" className="col-sm-6">Аккаунты</a>
          <a href="/" className="col-sm-6">Аккаунты</a>
      </div>
    </div>
      <Footer></Footer>
    </div>
  )
}

export default Dashboard;