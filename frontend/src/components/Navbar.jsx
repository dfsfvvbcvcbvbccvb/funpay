import { Link } from 'react-router-dom';
import logo from './images/logo.svg'
import { Dropdown } from 'bootstrap/dist/js/bootstrap.bundle';

function Navbar() {

    let loginned = Boolean(localStorage.getItem('loginned'))
    let language = localStorage.getItem('language')


    function changeValue(value) {
        localStorage.setItem('value', value)
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
                    <li><a className="dropdown-item" href="/support/tickets/new">Отправить запрос</a></li>
                    {loginned ? ( <li><a className="dropdown-item" href="/">Мои запросы</a></li>) : ( <></> ) }
                </ul>
                </div>
                </div>
                <div className='d-flex'>
                    {loginned ? (
                        <>
                        <a className='text-decoration-none link-secondary me-2' href='/orders'>Покупки</a>
                        <a className='text-decoration-none link-secondary me-2' href='/orders/trade'>Продажи</a>
                        <a className='text-decoration-none link-secondary me-2' href='/chat'>Сообщения</a>
                        <a className='text-decoration-none link-secondary me-2' href='/account/balance'>Финансы</a>
                        <a className='text-decoration-none link-secondary me-2' href='/account/balance'>Профиль</a>
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