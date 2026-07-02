import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import Navbar from "./Navbar"
import Footer from "./Footer"

function CategoriesLots() {

    const [lots, setLots] = useState([])
    const [game, setGame] = useState('')
    let params = useParams()

    useEffect(() => {
    const loadingLots = async () => {
      try {
        let response = await axios.post(`/api/lots/${params.game_id}/${params.category_id}`)
        let response2 = await await axios.post(`/api/game/${params.game_id}`)
        setLots(response.data)
        setGame(response2.data)
      } catch (e) {
        console.log(e)
      }
    }
    loadingLots()
  }, [])

    return (
        <div className="ms-5 me-5">

        <div>
        <Navbar></Navbar>
        </div>
        <h1>Игра {game.name}</h1>
        <h4>{game.description}</h4>
        <div className="d-flex flex-column w-25">
        <table className="table">
          <thead className="table-dark">
            <tr>
              <th scope="col">Описание</th>
              <th scope="col">Продавец</th>
              <th scope="col">Цена</th>
            </tr>
          </thead>
          <tbody>
            {lots.map(lot => (
            <tr key={lot.id}>
              <td className="position-relative">
              <a className="stretched-link fs-3 text-decoration-none link-secondary" href={`/lots/${game.id}/${params.category_id}/${lot.id}`}>{lot.name}</a>
              </td>
              <td className="position-relative">
              <a className="stretched-link fs-3 text-decoration-none link-secondary" href={`/lots/${game.id}/${params.category_id}/${lot.id}`}>{lot.ownerUsername}</a>
              </td>
              <td className="position-relative">
              <a className="stretched-link fs-3 text-decoration-none link-secondary" href={`/lots/${game.id}/${params.category_id}/${lot.id}`}>{lot.price}</a>
              </td>
              
            </tr>
            ))}
          </tbody>
        </table>
        
        </div>
        <Footer></Footer>
        </div>
    )
}

export default CategoriesLots