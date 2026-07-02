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
        let response2 = await axios.post(`/api/lots/user/${id.id}`)
        let response = await axios.post(`/api/user/${id.id}`)
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
                    <a className="stretched-link fs-3 text-decoration-none link-secondary" href={`/lots/${lot.game_id}/${lot.category_id}/${lot.id}`}>{lot.name}</a>
                    </td>
                    <td className="position-relative">
                    <a className="stretched-link fs-3 text-decoration-none link-secondary" href={`/lots/${lot.game_id}/${lot.category_id}/${lot.id}`}>{lot.ownerUsername}</a>
                    </td>
                    <td className="position-relative">
                    <a className="stretched-link fs-3 text-decoration-none link-secondary" href={`/lots/${lot.game_id}/${lot.category_id}/${lot.id}`}>{lot.price}</a>
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