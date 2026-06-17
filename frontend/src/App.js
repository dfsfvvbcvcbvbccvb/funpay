import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Rules from './components/Rules';
import SupportDashboard from './components/support/SupportDashboard';
import GameInfo from './components/GameInfo';
import CreateGame from './components/CreateGame';
import CreateCategory from './components/CreateCategory';
import CreateLot from './components/CreateLot';
import Orders from './components/Orders';
import CategoriesLots from './components/CategoriesLots';
import LotInfo from './components/LotInfo';
import Profile from './components/Profile';
import Balance from './components/Balance';

function AppRoutes() {

    return (
        <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/account/login" element={<LoginPage/>}/>
            <Route path="/account/register" element={<RegisterPage/>}/>
            <Route path="/trade/info" element={<Rules/>}/>
            <Route path="/support" element={<SupportDashboard/>}/>
            <Route path="/lots/:id" element={<GameInfo/>}/>
            <Route path="/game/create" element={<CreateGame/>}/>
            <Route path="/category/create" element={<CreateCategory/>}/>
            <Route path="/lots/create/:id" element={<CreateLot/>}/>
            <Route path="/lots/:game_id/:category_id" element={<CategoriesLots/>}/>
            <Route path="/lots/:game_id/:category_id/:lot_id" element={<LotInfo/>}/>
            <Route path="/accounts/profile/:id" element={<Profile/>}/>
            <Route path="/account/balance" element={<Balance/>}/>
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
