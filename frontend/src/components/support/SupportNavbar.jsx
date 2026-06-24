import { Link } from 'react-router-dom';
import logo from '../images/logo.svg'
import { Dropdown } from 'bootstrap/dist/js/bootstrap.bundle';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function SupportNavbar() {

    let loginned = Boolean(localStorage.getItem('loginned'))
    let language = localStorage.getItem('language')
    let userId = localStorage.getItem('userId')
    const navigate = useNavigate('')

    function logout() {
        localStorage.removeItem('loginned')
        localStorage.removeItem('userId')
        return
    }
    
  useEffect(() => {
    if (!loginned) {
      navigate('/account/login')
    }
  }, [loginned, navigate])

    return (
    <div className='border-bottom'>
        <nav className="navbar navbar-light bg-light">
            <div className='container-fluid'>
                <div className='d-flex'>
                <a href="/">
                <img src={logo} alt="" width="59" height="37" className="d-inline-block align-text-top me-2"></img>
                </a>
                <h5 className='mt-2'>Поддержка</h5>
                </div>
                <div className='d-flex'>
                    {loginned ? (
                        <>
                        <a className='text-decoration-none link-secondary me-2' href='/support/tickets'>Заявки</a>
                        <a className='text-decoration-none link-secondary me-2' href='/support/create'>Отправить заявку</a>
                        <a className='text-decoration-none link-secondary me-2' onClick={logout} href='/'>Выход</a>
                        </>
                        ) : (
                            <>
                            <a className='text-decoration-none link-secondary me-2 mt-2' href='/account/login'>Войти</a>
                            <a className='text-decoration-none link-secondary me-2 mt-2' href='/account/register'>Зарегестрироваться</a>
                            </>
                    )}
                </div>
            </div>
        </nav>
    </div>
    )
}

export default SupportNavbar;