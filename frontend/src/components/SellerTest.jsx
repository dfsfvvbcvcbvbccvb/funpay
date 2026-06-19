import { useState } from "react"
import Navbar from "./Navbar";
import Footer from "./Footer";

function SellerTest() {
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
                            <label className="m-2">Клиент предложил перейти в Skype</label>
                            <select className="form-select m-2">
                                <option value='answer1'>Мой аккаунт FunPay НЕ будет заблокирован</option>
                                <option value='answer2'>Мой аккаунт FunPay будет заблокирован, но только тогда, когда у него будет положительный баланс.</option>
                                <option value='answer3'>Мой аккаунт FunPay будет заблокирован</option>
                            </select>
                            <label className="m-2">Покупатель оплатил заказ через FunPay, вы его выполнили. В процессе выполнения заказа покупатель узнал ваш игровой ник. Через некоторое время он написал вам и попросил продать что-либо или оказать услугу без проведения платежа через FunPay. Вы согласились.</label>
                            <select className="form-select m-2">
                                <option value='answer4'>Мой аккаунт FunPay будет заблокирован, но только тогда, когда у него будет положительный баланс.</option>
                                <option value='answer5'>Мой аккаунт FunPay будет заблокирован</option>
                                <option value='answer6'>Мой аккаунт FunPay НЕ будет заблокирован</option>
                            </select>
                            <label className="m-2">Вы увидели в чате сообщение о том, что покупатель оплатил заказ.</label>
                            <select className="form-select m-2">
                                <option value='answer7'>Сразу проведу сделку</option>
                                <option value='answer8'>Подам жалобу</option>
                                <option value='answer9'>Открою раздел «Продажи» и проверю, действительно ли покупатель оплатил заказ. После этого приступлю к выполнению заказа.</option>
                            </select>
                            <label className="m-2">Вы разместили объявления о продаже товаров не только на FunPay, но и на своей странице «ВКонтакте».</label>
                            <select className="form-select m-2">
                                <option value='answer10'>Мой аккаунт FunPay будет заблокирован, но только тогда, когда у него будет положительный баланс.</option>
                                <option value='answer11'>Мой аккаунт FunPay будет заблокирован</option>
                                <option value='answer12'>Никаких санкций не последует, поскольку правила FunPay запрещают продажу только на других биржах, а «‎ВКонтакте»‎ биржей не является.</option>
                            </select>
                            <label className="m-2">Вы решили перепродавать на FunPay недорогие аккаунты, купленные вами где-то в интернете.</label>
                            <select className="form-select m-2">
                                <option value='answer13'>В интернете продаётся много «брут» аккаунтов, и их нельзя перепродавать на FunPay. Администрация FunPay может потребовать доказательства легальности происхождения товаров.</option>
                                <option value='answer14'>Продавать можно</option>
                                <option value='answer15'>Мой аккаунт FunPay будет заблокирован</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>

    )
}

export default SellerTest;