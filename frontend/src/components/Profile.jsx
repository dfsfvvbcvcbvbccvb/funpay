import Navbar from "./Navbar"
import Footer from "./Footer"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

function Profile() {

    let id = useParams()
    const [user, setUser] = useState([])
    const [lots, setLots] = useState([])

    useEffect(() => {
    const loadingProfile = async () => {
      try {
        console.log(id.id)
        let response = await axios.post(`/api/user/${id.id}`)
        let response2 = await axios.post(`/api/lots/user/${id.id}`)
        setUser(response.data)
        setLots(response2.data)
      } catch (e) {
        console.log(e)
      }
      }
      loadingProfile()
    }, [])

    return (
    <div className="ms-5 me-5">

    <div>
      <Navbar></Navbar>
    </div>
    <div>
        <h2 className="border-bottom mt-3">Профиль пользователя: {user[0]?.login}</h2>
    </div>
        <div>
            <h4>Все лоты пользователя:</h4>
                <table class="table">
                <thead className="table-dark">
                    <tr>
                    <th scope="col">Описание</th>
                    <th scope="col">Продавец</th>
                    <th scope="col">Цена</th>
                    </tr>
                </thead>
                <tbody>
                    {lots.map(lot => (
                    <tr>
                    <td className="position-relative">
                    <a className="stretched-link fs-3 text-decoration-none link-secondary" href={`/lots/${lot.game_id}/${lot.category_id}/${lot.id}`}><td>{lot.name}</td></a>
                    </td>
                    <td className="position-relative">
                    <a className="stretched-link fs-3 text-decoration-none link-secondary" href={`/lots/${lot.game_id}/${lot.category_id}/${lot.id}`}><td>{lot.ownerUsername}</td></a>
                    </td>
                    <td className="position-relative">
                    <a className="stretched-link fs-3 text-decoration-none link-secondary" href={`/lots/${lot.game_id}/${lot.category_id}/${lot.id}`}><td>{lot.price}</td></a>
                    </td>
                    
                    </tr>
                    ))}
                </tbody>
                </table>
                <Footer></Footer>
        </div>
    </div>
    )
    
}

export default Profile