import Navbar from "./Navbar"
import Footer from "./Footer"
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateGame() {

    const navigate = useNavigate()

    async function handleFormSubmit(e) {
        e.preventDefault()
        let response = await axios.post('/game/create')
        navigate('/')
    }

    return (
    <div className="container">
        <div className="ms-5 me-5">

            <div>
                <Navbar></Navbar>
            </div>

            <div>
                <h1>Создание игры</h1>
                <form onSubmit={handleFormSubmit}>
                <div>
                    <input className="form-control form-control-lg m-2" type="text" placeholder="Name" aria-label=".form-control-lg example"></input>
                    <input className="form-control m-2" type="text" placeholder="Description" aria-label="default input example"></input>
                    <button className="btn btn-primary m-2" type="submit">Создать</button>
                </div>
                </form>
            </div>
            <div>
                <Footer></Footer>
            </div>
        </div>
    </div>
    )
}

export default CreateGame;