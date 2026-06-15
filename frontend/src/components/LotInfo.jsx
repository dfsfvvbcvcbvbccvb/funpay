import { useState, useEffect  } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import Navbar from "./Navbar"
import Footer from "./Footer"

function LotInfo() {

    const [lot, setLot] = useState('')
    const params = useParams()

    useEffect(() => {
        const loadingLot = async () => {
        try {
            let response = await axios.post(`/api/lots/${params.game_id}/${params.category_id}/${params.lot_id}`)
            setLot(response.data)
        } catch (e) {
            console.log(e)
        }
        }
        loadingLot()
    }, [])

  return (
    <div className="ms-5 me-5">

    <div>
      <Navbar></Navbar>
    </div>

    <div>
      <div className="border mt-2">
        <label>Краткое описание</label>
        <h2>{lot[0]?.name}</h2>
      </div>
      <div className="border mt-2">
        <label>Подробное описание</label>
        <p>{lot[0]?.description}</p>
      </div>
      <div className="border mt-2">
        <label>Цена</label>
        <p>{lot[0]?.price}</p>
      </div>
      <button className="btn btn-primary mt-2">Купить</button>
      <Footer></Footer>
      </div>
    </div>
  )
}

export default LotInfo