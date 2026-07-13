import Navbar from "./Navbar"
import Footer from "./Footer"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

function Profile() {

    let id = useParams()
    const [user, setUser] = useState([])
    const [lots, setLots] = useState([])
    const [online, setOnline] = useState('')
    const [rating, setRating] = useState('')

    useEffect(() => {
    const loadingProfile = async () => {
      try {
        let response2 = await axios.post(`/api/lots/user/${id.id}`)
        let response = await axios.post(`/api/user/${id.id}`)
        let response3 = await axios.post(`/api/online/${id.id}`)
        let response4 = await axios.post(`/api/review/${id.id}`)
        setRating(Number(response4.data))
        setOnline(response3.data)
        console.log(response3.data)
        setUser(response.data)
        setLots(response2.data)
      } catch (e) {
        console.log(e)
      }
      }
      loadingProfile()
    }, [])

    function generateLots(lot) {
      console.log(lot)
    if (Boolean(lot.active) !== true) {
      return
    }
    if (Boolean(lot.active) === true) {
      return (
        <tr key={lot.id}>
              <td className="position-relative">
                    <a className="stretched-link fs-3 text-decoration-none link-secondary" href={`/lots/${lot.game_id}/${lot.category_id}/${lot.id}`}>{lot.name}</a>
              </td>
              <td className="position-relative">
                    <a className="stretched-link fs-3 text-decoration-none link-secondary" href={`/lots/${lot.game_id}/${lot.category_id}/${lot.id}`}>{lot.ownerUsername}</a>
              </td>
              <td className="position-relative">
                    <a className="stretched-link fs-3 text-decoration-none link-secondary" href={`/lots/${lot.game_id}/${lot.category_id}/${lot.id}`}>{lot.price}</a>
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
    <div className="d-flex">
        <h2 className="mt-3">Профиль пользователя: {user[0]?.login}</h2>
        
        {online ? (
          <>
          <div className="bg-success rounded-circle mt-4 ms-2" style={{ width: '30px', height: '30px' }}></div>
          <span className="mt-4 ms-2">Онлайн</span>
          </>
        ) : (
          <>
          <div className="bg-danger rounded-circle mt-4 ms-2" style={{ width: '30px', height: '30px' }}></div>
          <span className="mt-4 ms-2">Не в сети</span>
          </>
         )}
    </div>
    <span className="text-secondary">Рейтинг пользователя: <span className="text-danger">{rating}</span></span>
        <div>
            <h4>Все лоты пользователя:</h4>
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
                    <>
                    {generateLots(lot)}
                    </>
                    ))}
                </tbody>
                </table>
                <Footer></Footer>
        </div>
    </div>
    )
    
}

export default Profile