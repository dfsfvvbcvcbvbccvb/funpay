import Navbar from "./Navbar"
import Footer from "./Footer"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function CreateGame() {

    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [categories, setCategories] = useState('')
    const [categoriesId, setCategoriesId] = useState('')
    const [error, setError] = useState('')

    async function handleFormSubmit(e) {
        e.preventDefault()
        let formdata = {
            name: name,
            description: description,
            categoriesIds: categoriesId
        }
        let response = await axios.post('/game/create', formdata)
        if (response.data !== 'Успешно!') {
            setError(response.data)
            return
        }
        if (response.data === 'Успешно!') {
            navigate('/')
        }
    }

    async function handleChange(e) {
        let values = Array.from(e.target.selectedOptions, (option) => option.value)
        setCategoriesId(values)
    }

    useEffect(() => {
        const loadingCategories = async () => {
        try {
            let response = await axios.post('/api/categories')
            setCategories(response.data)
        } catch (e) {
            console.log(e)
        }
        }
        loadingCategories()
    }, [])

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
                    <input onChange={(e) => setName(e.target.value)} className="form-control form-control-lg m-2" type="text" placeholder="Name" aria-label=".form-control-lg example"></input>
                    <input onChange={(e) => setDescription(e.target.value)} className="form-control m-2" type="text" placeholder="Description" aria-label="default input example"></input>
                    <select className="form-select form-select-lg mb-3" multiple onChange={handleChange}>
                        {categories && categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                    <button className="btn btn-primary m-2" type="submit">Создать</button>
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

export default CreateGame;