import Navbar from "./Navbar"
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {

    const [usernameOrEmail, setUsernameOrEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate('')

    async function handleFormSubmit(e) {
        e.preventDefault()

        if (usernameOrEmail === '') {
            return
        }
        if (password === '') {
            return
        }

        let formdata = {
            usernameOrEmail: usernameOrEmail,
            password, password
        }

        await axios.post('/api/login', formdata)
        navigate('/')
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
                        <input onChange={(e) => setUsernameOrEmail(e.target.value)} type="email" className="form-control mt-2" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Имя или почта"></input>
                        <input onChange={(e) => setPassword(e.target.value)} type="password" className="form-control mt-2" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Пароль"></input>
                        <a href="/account/recover" className="link-primary text-decoration-none mt-2">Забыли пароль?</a>
                    </div>
                    <button type="submit" className="btn btn-primary">Войти</button>
                </div>
            </div>
            </form>
        </div>
    )
}
export default LoginPage;