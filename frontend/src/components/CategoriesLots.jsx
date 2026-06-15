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
        <h1>{game.name}</h1>
        <p>{game.description}</p>
        <div className="d-flex flex-column w-25">
        {lots.map(lot => (
            <a href={`/lots/${game.id}/${params.category_id}/${lot.id}`} className="btn btn-primary mt-3">{lot.name} {lot.price}</a>
        ))}
        </div>
        <Footer></Footer>
        </div>
    )
}

export default CategoriesLots