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

  function generateLots(lot) {
    if (String(lot.active) === '0') {
      return
    }
    if (String(lot.active) === "1") {
      return (
        <tr key={lot.id}>
            <td className="position-relative">
              <a className="stretched-link fs-3 text-decoration-none link-info" href={`/lots/${game.id}/${params.category_id}/${lot.id}`}>{lot.name}</a>
            </td>
            <td className="position-relative">
              <a className="stretched-link fs-3 text-decoration-none link-secondary" href={`/lots/${game.id}/${params.category_id}/${lot.id}`}>{lot.ownerUsername}</a>
            </td>
            <td className="position-relative">
              <a className="stretched-link fs-3 text-decoration-none link-secondary" href={`/lots/${game.id}/${params.category_id}/${lot.id}`}>{lot.price}₽</a>
            </td>
             <td className="position-relative">
              <a className="stretched-link fs-3 text-decoration-none link-secondary" href={`/lots/${game.id}/${params.category_id}/${lot.id}`}>{lot.quantity}</a>
            </td>
            <td className="position-relative">
              <a className="stretched-link fs-3 text-decoration-none link-secondary" href={`/lots/${game.id}/${params.category_id}/${lot.id}`}>{lot.online}</a>
            </td>
            <td className="position-relative">
              <a className="stretched-link fs-3 text-decoration-none link-secondary" href={`/lots/${game.id}/${params.category_id}/${lot.id}`}>{lot.autoIssueJsx}</a>
            </td>
        </tr>
      )
    }
  }

    return (
        <div className="ms-5 me-5">

        <div>
        <Navbar></Navbar>
        </div>
        <h2 className="text-break">Игра {game.name}</h2>
        <h4 className="text-break border-top">Описание: {game.description}</h4>
        <div className="d-flex flex-column w-75">
        <table className="table">
          <thead className="table-dark">
            <tr>
              <th scope="col">Описание</th>
              <th scope="col">Продавец</th>
              <th scope="col">Цена за 1 штуку</th>
              <th scope="col">Штук в наличии</th>
              <th scope="col">Статус продавца</th>
              <th scope="col">Автовыдача</th>
            </tr>
          </thead>
          <tbody>
            {lots.map(lot => (
            <>
            {generateLots(lot)}
            </>
            ))}
          </tbody>
        </table>
        
        </div>
        <Footer></Footer>
        </div>
    )
}

export default CategoriesLots