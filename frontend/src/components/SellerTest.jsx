import { useState } from "react"
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SellerTest() {

    const [answer1, setAnswer1] = useState('answer1')
    const [answer2, setAnswer2] = useState('answer4')
    const [answer3, setAnswer3] = useState('answer7')
    const [answer4, setAnswer4] = useState('answer10')
    const [answer5, setAnswer5] = useState('answer13')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    async function handleFormSubmit(e) {
        e.preventDefault()

        if (answer1 !== 'answer2' || answer2 !== 'answer4' || answer3 !== 'answer9' || answer4 !== 'answer12' || answer5 !== 'answer13') {
            setError('Неверный ответ на какой-то вопрос!')
            return
        }
        let id = localStorage.getItem('userId')

        let formdata = {
            answer1: answer1,
            answer2: answer2,
            answer3: answer3,
            answer4: answer4,
            answer5: answer5,
            userId: id
        }

        let response = await axios.post('/api/seller/check', formdata)
        if (response.data === 'Успешно!') {
            navigate('/')
        }
    }

    return (
        <div className="me-5 ms-5">
            <div>
                <Navbar></Navbar>
            </div>
            <div>
                <div>
                    <h1>Отвечайте на вопросы!</h1>
                    <div>
                        <div className="d-flex flex-column">
                            <form onSubmit={handleFormSubmit}>
                            <label className="m-2">Клиент предложил перейти в Skype</label>
                            <select onChange={(e) => setAnswer1(e.target.value)} className="form-select m-2">
                                <option value='answer1'>Мой аккаунт FunPay НЕ будет заблокирован</option>
                                <option value='answer2'>Мой аккаунт FunPay будет заблокирован, но только тогда, когда у него будет положительный баланс.</option>
                                <option value='answer3'>Мой аккаунт FunPay будет заблокирован</option>
                            </select>
                            <label className="m-2">Покупатель оплатил заказ через FunPay, вы его выполнили. В процессе выполнения заказа покупатель узнал ваш игровой ник. Через некоторое время он написал вам и попросил продать что-либо или оказать услугу без проведения платежа через FunPay. Вы согласились.</label>
                            <select onChange={(e) => setAnswer2(e.target.value)} className="form-select m-2">
                                <option value='answer4'>Мой аккаунт FunPay будет заблокирован, но только тогда, когда у него будет положительный баланс.</option>
                                <option value='answer5'>Мой аккаунт FunPay будет заблокирован</option>
                                <option value='answer6'>Мой аккаунт FunPay НЕ будет заблокирован</option>
                            </select>
                            <label className="m-2">Вы увидели в чате сообщение о том, что покупатель оплатил заказ.</label>
                            <select onChange={(e) => setAnswer3(e.target.value)} className="form-select m-2">
                                <option value='answer7'>Сразу проведу сделку</option>
                                <option value='answer8'>Подам жалобу</option>
                                <option value='answer9'>Открою раздел «Продажи» и проверю, действительно ли покупатель оплатил заказ. После этого приступлю к выполнению заказа.</option>
                            </select>
                            <label className="m-2">Вы разместили объявления о продаже товаров не только на FunPay, но и на своей странице «ВКонтакте».</label>
                            <select onChange={(e) => setAnswer4(e.target.value)} className="form-select m-2">
                                <option value='answer10'>Мой аккаунт FunPay будет заблокирован, но только тогда, когда у него будет положительный баланс.</option>
                                <option value='answer11'>Мой аккаунт FunPay будет заблокирован</option>
                                <option value='answer12'>Никаких санкций не последует, поскольку правила FunPay запрещают продажу только на других биржах, а «ВКонтакте» биржей не является.</option>
                            </select>
                            <label className="m-2">Вы решили перепродавать на FunPay недорогие аккаунты, купленные вами где-то в интернете.</label>
                            <select onChange={(e) => setAnswer5(e.target.value)} className="form-select m-2">
                                <option value='answer13'>В интернете продаётся много «брут» аккаунтов, и их нельзя перепродавать на FunPay. Администрация FunPay может потребовать доказательства легальности происхождения товаров.</option>
                                <option value='answer14'>Продавать можно</option>
                                <option value='answer15'>Мой аккаунт FunPay будет заблокирован</option>
                            </select>
                            <button type="submit" className="btn btn-primary">Завершить</button>
                                {error && (
                                <div class="alert alert-danger mt-2">
                                    <h3>{error}</h3>
                                </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>

    )
}

export default SellerTest;