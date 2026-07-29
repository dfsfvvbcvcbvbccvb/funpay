import { Link } from 'react-router-dom';
import logo from './images/logo.svg'
import axios from 'axios';
import { Dropdown } from 'bootstrap/dist/js/bootstrap.bundle';
import getUserId from './getUserId';
import { useState, useEffect } from 'react';

function Navbar() {

    let loginned = Boolean(localStorage.getItem('loginned'))
    let language = localStorage.getItem('language')
    let [userId, setUserId] = useState()
    let [amountUnread, setAmountUnread] = useState('')

    useEffect(() => {
    const loadingUserId = async () => {
      try {
        let id = await getUserId()
        setUserId(id)
      } catch (e) {
        console.log(e)
      }
    }
        loadingUserId()
    }, [])

    useEffect(() => {
    const loadingUnreadMessages = async () => {
      try {
        let formdata = {
            userId: userId
        }
        let response = await axios.post(`/api/messages/unread`, formdata)
        let tempNumber = 0
        for (let a = 0; a < response.data.length; a++) {
            if (!response.data[a].readed) {
                tempNumber++
            }
        }
        setAmountUnread(tempNumber)
        isOnline()
      } catch (e) {
        console.log(e)
      }
    }
        loadingUnreadMessages()
    }, [userId])

    
    async function isOnline() {
        
        if (userId === '' || userId === undefined) {
            return
        }

        setInterval(async () => {
            let formdata = {
                userId: userId
            }

            let response = await axios.post(`/api/online`, formdata)
        }, 2000)

        
    }

    function changeValue(value) {
        localStorage.setItem('value', value)
        return
    }

    async function logout() {
        localStorage.removeItem('loginned')
        let response = await axios.post('/api/logout')
        return
    }

    function changeLanguage(language) {
        if (language === 'en') {
            localStorage.setItem('language', 'en')
            return
        }
        if (language === 'ru') {
            localStorage.setItem('language', 'ru')
            return
        }
    }

    return (
    <div className='border-bottom'>
        <nav className="navbar navbar-light bg-light">
            <div className='container-fluid'>
                <div className='d-flex'>
                <a href="/">
                <img src={logo} alt="" width="59" height="37" className="d-inline-block align-text-top me-2"></img>
                </a>
                <div className="dropdown">
                <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    Помощь
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li><a className="dropdown-item" href="/trade/info">Правила</a></li>
                    <li><a className="dropdown-item" href="/support">Центр помощи</a></li>
                    <li><a className="dropdown-item" href="/support/create">Отправить запрос</a></li>
                    {loginned ? ( <li><a className="dropdown-item" href="/support/tickets">Мои запросы</a></li>) : ( <></> ) }
                </ul>
                </div>
                </div>
                <div className='d-flex'>
                    {loginned ? (
                        <>
                        <a className='text-decoration-none link-secondary me-2' href='/orders'>Покупки</a>
                        <a className='text-decoration-none link-secondary me-2' href='/orders/trade'>Продажи</a>
                        <a className='text-decoration-none link-secondary me-2' href='/account/balance'>Финансы</a>
                        <a type="button" href='/messages' class="btn btn-primary btn-sm" style={{width: 130, height: 30}}>
                        Messages <span class="badge bg-info">{amountUnread}</span>
                        </a>
                        <a className='text-decoration-none link-secondary me-2' href={`/accounts/profile/${userId}`}>Профиль</a>
                        <a className='text-decoration-none link-secondary me-2' onClick={logout} href='/'>Выход</a>
                        </>
                        ) : (
                            <>
                            <a className='text-decoration-none link-secondary me-2 mt-2' href='/account/login'>Войти</a>
                            <a className='text-decoration-none link-secondary me-2 mt-2' href='/account/register'>Зарегестрироваться</a>
                            <div className="dropdown">
                            <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                По русски
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><a className="dropdown-item" href="#">English</a></li>
                            </ul>
                            </div>
                            <div className="dropdown">
                            <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                Рубли
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><button onClick={changeValue('dollar')} className="dropdown-item">Доллары</button></li>
                                <li><button onClick={changeValue('euro')} className="dropdown-item">Евро</button></li>
                            </ul>
                            </div>
                            </>
                    )}
                </div>
            </div>
        </nav>
    </div>
    )
}

export default Navbar;