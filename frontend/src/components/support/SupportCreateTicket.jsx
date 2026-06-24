import Footer from "../Footer"
import SupportNavbar from "./SupportNavbar"
import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function SupportCreateTicket() {

    const [login, setLogin] = useState('')
    const [problem, setProblem] = useState('')
    const [content, setContent] = useState('')
    const navigate = useNavigate()

    async function handleFormSubmit(e) {
        e.preventDefault()

        if (login === '' || problem === '' || content === '') {
            return
        }

        let id = localStorage.getItem('userId')
        console.log(id)

        let formdata = {
            login: login,
            problem: problem,
            content: content,
            senderId: id
        }

        let response = await axios.post('/support/create', formdata)
        if (response.data === 'Успешно!') {
            navigate('/support/tickets')
        }
    }

    return (
    <div className="me-5 ms-5">
          <div>
              <SupportNavbar></SupportNavbar>
          </div>
          <div>
            <form onSubmit={handleFormSubmit}>
            <div class="form-group">
                <label for="exampleFormControlInput1">Ваш логин</label>
                <input onChange={(e) => setLogin(e.target.value)} type="text" class="form-control" placeholder="Login"></input>
            </div>
            <div class="form-group">
                <label for="exampleFormControlSelect1">Что привело вас сюда</label>
                <select onChange={(e) => setProblem(e.target.value)} class="form-control">
                <option><span className="text-secondary">Выберите вариант...</span></option>
                <option value={'orderProblem'}>Проблема с заказом</option>
                <option value={'paymentProblem'}>Проблема с платежом</option>
                <option value={'accountProblem'}>Проблема с аккаунтом FunPay</option>
                <option value={'otherProblem'}>Другое</option>
                </select>
            </div>
            <div class="form-group">
                <label for="exampleFormControlTextarea1">Опишите ситуацию и с чем нужно помочь</label>
                <textarea onChange={(e) => setContent(e.target.value)} className="form-control" rows="3"></textarea>
            </div>
            <button type="submit" className="mt-2 mb-2 btn btn-primary">Отправить</button>
            </form>
          </div>
          <Footer></Footer>
    </div>
    )
}

export default SupportCreateTicket