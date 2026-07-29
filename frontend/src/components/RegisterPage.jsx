import Navbar from "./Navbar"
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function RegisterPage() {

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate('')

    async function handleFormSubmit(e) {
        e.preventDefault()

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let test = regex.test(email)
        if (test === false) {
            setError('Введите корректный email!')
            return
        }

        if (login === '' || email === '' || password === '') {
            return
        }

        let formdata = {
            login: login,
            password: password,
            email: email
        }

        const response = await axios.post('/api/register', formdata)
        if (response.data !== 'Успешно!') {
            setError(response.data)
        }
        if (response.data === 'Успешно!') {
            navigate('/')
        }
    }

    return (
        <div className="me-5 ms-5">
            <div>
                <Navbar></Navbar>
            </div>
            <form onSubmit={handleFormSubmit}>
            <div className="d-flex justify-content-center">
                <div className="text-align-center align-center p-3 border">
                    <div className="d-flex align-center p-2">
                        <h2><a href="/account/login" className="link-primary text-decoration-none border-bottom m-2">Логин</a></h2>
                        <h2><a href="/account/register" className="link-primary text-decoration-none border-bottom m-2">Зарегестрироваться</a></h2>
                    </div>
                    <div>
                        
                        <span className="mt-2">Или с помощью имени, почты и пароля:</span>
                        <input onChange={(e) => setLogin(e.target.value)} type="text" className="form-control mt-2" placeholder="Имя или ник" required></input>
                        <input onChange={(e) => setEmail(e.target.value)} type="email" className="form-control mt-2" placeholder="Почта" required></input>
                        <input onChange={(e) => setPassword(e.target.value)} type="password" className="form-control mt-2" placeholder="Пароль" required></input>
                        <a href="/account/recover" className="link-primary text-decoration-none mt-2">Забыли пароль?</a>
                    </div>
                    <button type="submit" className="btn btn-primary">Зарегестрироваться</button>
                    {error && (
                    <div class="alert alert-danger mt-2">
                        <h3>{error}</h3>
                    </div>
                    )}
                </div>
            </div>
            </form>
        </div>
    )
}
export default RegisterPage;