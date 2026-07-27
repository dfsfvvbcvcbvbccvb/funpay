import Navbar from "./Navbar"
import Footer from "./Footer"
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import getUserId from "./getUserId";

function CreateLot() {

    const navigate = useNavigate()
    const [categories, setCategories] = useState('')
    const [name, setName] = useState('')
    const [englishName, setEnglishName] = useState('')
    const [description, setDescription] = useState('')
    const [quantity, setQuantity] = useState('')
    const [englishDescription, setEnglishDescription] = useState('')
    const [english, setEnglish] = useState('')
    const [category, setCategory] = useState('')
    const [game, setGame] = useState('')
    const [active, setActive] = useState(false)
    const [autoIssue, setAutoIssue] = useState(false)
    const [autoIssueValue, setAutoIssueValue] = useState('')
    const [error, setError] = useState('')
    const [price, setPrice] = useState('')
    const gameId = useParams()
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

    function handleChange(e) {
        setCategory(e.target.value)
    }

    async function handleFormSubmit(e) {
        e.preventDefault()

        if (name === '' || description === '' || price === '') {
            setError('Заполните все поля!')
            return
        }

        let id = userId
        let res2 = await axios.post(`/api/user/${userId}`)
        let formdata = {} 
        if (autoIssue === true) {
            formdata = {
                name: name,
                description: description,
                englishName: englishName,
                englishDescription: englishDescription,
                price: price,
                quantity: quantity,
                category_id: category,
                game_id: gameId,
                ownerUsername: res2.data[0].login,
                ownerId: id,
                active: active,
                autoIssueValue: autoIssueValue,
                autoIssue: autoIssue
            }
        } else {
            formdata = {
                name: name,
                description: description,
                englishName: englishName,
                englishDescription: englishDescription,
                price: price,
                quantity: quantity,
                category_id: category,
                game_id: gameId,
                ownerUsername: res2.data[0].login,
                ownerId: id,
                active: active
            }
        }

        if (name.length > 25 || description.length > 25 || price.length > 25 || quantity.length > 25) {
            setError('Слишком много символов!')
            return
        }

        if (formdata.price <= 0) {
            setError('Цена не может быть равна нулю или быть меньше нуля')
            return
        }

        let res = await axios.post('/lots/create', formdata)

        if (res.data === 'Успешно!') {
            navigate('/')
        }
    }

    useEffect(() => {
    const loadingCategories = async () => {
      try {
        let id = userId
        let response = await axios.post(`/api/game/${gameId.id}`)
        setCategory(response.data.categories[0].id)
        let response2 = await axios.post(`/api/user/${userId}`)
        if (response2.data[0].trustedSeller !== 'true') {
            navigate('/seller/test')
            return
        }
        setGame(response.data)
      } catch (e) {
      }
    }
    loadingCategories()
  }, [userId])

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
                    <div className="form-floating mb-3">
                        <input className="form-control form-control-lg m-2" onChange={(e) => setName(e.target.value)} id="floatingPassword" type="text" placeholder="Название" aria-label=".form-control-lg example" required></input>
                        <label>Название</label>
                    </div>
                    
                    <div className="form-floating mb-3">
                        <input className="form-control m-2" type="text" onChange={(e) => setDescription(e.target.value)} id="floatingPassword" placeholder="Описание" aria-label="default input example" required></input>
                        <label>Описание</label>
                    </div>
                    
                    <div className="form-floating mb-3">
                        <input className="form-control m-2" type="number" onChange={(e) => setQuantity(e.target.value)} id="floatingPassword" placeholder="Количество" aria-label="default input example" required></input>
                        <label>Количество</label>
                    </div>
                    
                    <div className="form-floating mb-3">
                        <input className="form-control m-2" type="number" onChange={(e) => setPrice(e.target.value)} id="floatingPassword" placeholder="Цена за 1 штуку" aria-label="default input example" required></input>
                        <label>Цена за 1 штуку</label>
                    </div>

                    <div className="form-check">
                    <input onChange={(e) => setActive(e.target.checked)} className="form-check-input" type="checkbox" id="flexCheckChecked"></input>
                    <label className="form-check-label">
                        Активный
                    </label>
                    </div>

                    <div className="form-check">
                    <input onChange={(e) => setAutoIssue(e.target.checked)} className="form-check-input" type="checkbox" id="flexCheckChecked"></input>
                    <label className="form-check-label">
                        Автовыдача
                    </label>
                    </div>
                    {autoIssue && (
                        <div className="border rounded p-2 d-flex flex-column">
                            <div classNaame="mb-3">
                                <label className="form-label">Поле для автовыдачи</label>
                                <textarea onChange={(e) => setAutoIssueValue(e.target.value)} className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                            </div>
                        </div>
                    )}
                    
                    <span>Категория</span>
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