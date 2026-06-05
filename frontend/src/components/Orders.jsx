import Navbar from "./Navbar"
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

function Orders() {

    async function getAllOrders() {
        //
    }

    return (
        <div className="me-5 ms-5">
            <div>
                <Navbar></Navbar>
            </div>
            <div>
                <div>
                    <h1>Ваши заказы</h1>
                    <div>
                        <div>
                            <button></button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    )
}
export default Orders;