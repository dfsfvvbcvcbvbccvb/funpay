import Navbar from "./Navbar"
import Footer from "./Footer"
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function CreateLot() {

    const navigate = useNavigate()
    const [categories, setCategories] = useState('')
    const [name, setName] = useState('')
    const [englishName, setEnglishName] = useState('')
    const [description, setDescription] = useState('')
    const [englishDescription, setEnglishDescription] = useState('')
    const [english, setEnglish] = useState('')
    const [category, setCategory] = useState('')
    const [game, setGame] = useState('')
    const [error, setError] = useState('')
    const [price, setPrice] = useState('')
    const gameId = useParams()

    function handleChange(e) {
        setCategory(e.target.value)
    }

    async function handleFormSubmit(e) {
        e.preventDefault()

        if (name === '' || description === '' || price === '') {
            setError('Заполните все поля!')
            return
        }

        let id = localStorage.getItem('userId')
        let res2 = await axios.post(`/api/user/${id}`)

        let formdata = {
            name: name,
            description: description,
            englishName: englishName,
            englishDescription: englishDescription,
            price: price,
            category_id: category,
            game_id: gameId,
            ownerUsername: res2.data[0].login,
            ownerId: id
        }

        let res = await axios.post('/lots/create', formdata)

        if (res.data === 'Успешно!') {
            navigate('/')
        }
    }

    useEffect(() => {
    const loadingCategories = async () => {
      try {
        let id = localStorage.getItem('userId')
        let response = await axios.post(`/api/game/${gameId.id}`)
        let response2 = await axios.post(`/api/user/${id}`)
        if (response2.data[0].trustedSeller !== 'true') {
            navigate('/seller/test')
            return
        }
        setGame(response.data)
      } catch (e) {
        console.log(e)
      }
    }
    loadingCategories()
  }, [])

    return (
    <div className="container">
        <div className="ms-3 me-3">

            <div>
                <Navbar></Navbar>
            </div>

            <div>
                <h1>Создание лота для игры {game.name}</h1>
                <form onSubmit={handleFormSubmit}>
                <div>
                    <input className="form-control form-control-lg m-2" onChange={(e) => setName(e.target.value)} type="text" placeholder="Name" aria-label=".form-control-lg example" required></input>
                    <input className="form-control m-2" type="text" onChange={(e) => setDescription(e.target.value)} placeholder="Description" aria-label="default input example" required></input>
                    <input className="form-control m-2" type="number" onChange={(e) => setPrice(e.target.value)} placeholder="Price" aria-label="default input example" required></input>
                    <label>Категория</label>
                    <select className="form-select form-select mb-2" onChange={handleChange}>
                    {game.categories && game.categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
                <button className="btn btn-primary" type="submit">Создать</button>
                {error && (
                <div class="alert alert-danger mt-2">
                    <h3>{error}</h3>
                </div>
                )}
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

export default CreateLot;