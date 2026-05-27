import { useNavigate } from "react-router-dom"
import { useEffect } from 'react';

function SupportDashboard() {
    let loginned = Boolean(localStorage.getItem('loginned'))
    const navigate = useNavigate('')
  useEffect(() => {
    if (!loginned) {
      navigate('/account/login')
    }
  }, [loginned, navigate])

  return <h1>Центр поддержки</h1>;
}
export default SupportDashboard