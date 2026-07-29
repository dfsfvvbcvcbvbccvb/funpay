import Navbar from "./Navbar"
import Footer from "./Footer"
import { useState } from "react"
import axios from "axios"

function AccountRecovery() {

    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    async function handleFormSubmit(e) {
        e.preventDefault()

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let test = regex.test(email)
        if (test === false) {
            setError('Введите корректный Email')
            return
        }
        let formdata = {
            email: email
        }

        let response = await axios.post('/api/recovery', email)
        if (response.data === 'Аккаунт не найден') {
            setError(response.data)
            return
        } else if (response.data === 'Успешно!') {

        }
    }  

    return (
    <div className="ms-5 me-5">

    <div>
      <Navbar></Navbar>
    </div>
    <div className="d-flex flex-column">


        <form onSubmit={handleFormSubmit}>
        <div>
            <h2>Восстановление пароля</h2>
        </div>
        <div>
             <input onChange={(e) => setEmail(e.target.value)} type="email" className="form-control mt-2" placeholder="Почта"></input>
        </div>
        <button type="submit" className="btn btn-primary">Отправить</button>
        </form>
        {error && (
            <div class="alert alert-danger mt-2">
                <h3>{error}</h3>
            </div>
        )}
    </div>
    <Footer></Footer>
    </div>  
    )
}

export default AccountRecovery