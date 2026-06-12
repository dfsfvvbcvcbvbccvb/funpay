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
        console.log(response.data)
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

    <div className="d-flex">
      <span className="m-2">ВАШИ ИГРЫ</span>
      {games.map(game => (
        <div className="m-2 row">
          <a className="col-9 text-decoration-none link-secondary" href={`/lots/${game.id}`}>{game.name}</a>
            {game.categories?.map(category => (
              <a href={`/lots/${game.id}/category/${category.id}`} key={category.id}>{category.name}</a>
            ))}
      </div>
      ))}
      <div className="m-2 row">
          <a className="col-9 text-decoration-none link-secondary" href="/lots/id">Test</a>
          <a href="/" className="col-sm-6">Test1</a>
          <a href="/" className="col-sm-6">Test2</a>
          <a href="/" className="col-sm-6">Test3</a>
      </div>
    </div>
      <Footer></Footer>
    </div>
  )
}

export default Dashboard;