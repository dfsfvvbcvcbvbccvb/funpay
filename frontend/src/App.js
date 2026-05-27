import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Rules from './components/Rules';
import SupportDashboard from './components/support/SupportDashboard';
import GameInfo from './components/GameInfo';

function AppRoutes() {

    return (
        <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/account/login" element={<LoginPage/>}/>
            <Route path="/account/register" element={<RegisterPage/>}/>
            <Route path="/trade/info" element={<Rules/>}/>
            <Route path="/support" element={<SupportDashboard/>}/>
            <Route path="/lots" element={<GameInfo/>}/>
        </Routes>
    )
}


function App() {
    return (
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
    )
}

export default App;
