import Navbar from "./Navbar"
import Footer from "./Footer"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import getUserId from "./getUserId";

function CreateCategory() {

    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState('')
    let [userId, setUserId] = useState()

    useEffect(() => {
    const loadingUserId = async () => {
      try {
        let id = await getUserId()
        if (id === undefined) {
            navigate('/login')
        }
        setUserId(id)
      } catch (e) {
        console.log(e)
      }
    }
        loadingUserId()
    }, [])

    async function handleFormSubmit(e) {
        e.preventDefault()
        let formdata = {
            name: name,
            description: description,
            creatorId: userId
        }
        if (name.length > 25 || description.length > 25) {
            setError('Сделайте название или описание игры меньше!')
            return
        }
        let response = await axios.post('/category/create', formdata)
        if (response.data !== 'Успешно!') {
            setError(response.data)
            return
        }
        if (response.data === 'Успешно!') {
            navigate('/')
        }
    }

    useEffect(() => {
        const loadingInformation = async () => {
        try {
            let id = userId
            let response = await axios.post(`/api/user/${id}`)
            if (response.data[0].admin !== 'true') {
                navigate('/')
            }
        } catch (e) {
            console.log(e)
        }
        }
        loadingInformation()
    }, [userId])

    return (
    <div className="container">
        <div className="ms-5 me-5">

            <div>
                <Navbar></Navbar>
            </div>

            <div>
                <h1>Создание категории</h1>
                <form onSubmit={handleFormSubmit}>
                <div>
                    <input className="form-control form-control-lg m-2" onChange={(e) => setName(e.target.value)} type="text" placeholder="Name" aria-label=".form-control-lg example"></input>
                    <input className="form-control m-2" type="text" onChange={(e) => setDescription(e.target.value)} placeholder="Description" aria-label="default input example"></input>
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

export default CreateCategory;