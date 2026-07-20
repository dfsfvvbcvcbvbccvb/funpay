import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import Footer from "./Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import getUserId from "./getUserId";

function EditLot() {

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [quantity, setQuantity] = useState('')
    const navigate = useNavigate()
    const [userId, setUserId] = useState('')
    const params = useParams()


    useEffect(() => {
    const loadingUserId = async () => {
      try {
        let id = await getUserId()
        if (id === undefined) {
            navigate('/login')
        }
        setUserId(id)
      } catch (e) {
        console.log(e)
      }
    }
        loadingUserId()
    }, [])


    useEffect(() => {
    const loadingLotInfo = async () => {
      try {
        let response = await axios.post(`/api/lots/${params.game_id}/${params.category_id}/${params.lotId}`)
        setName(response.data[0].name)
        setDescription(response.data[0].description)
        setPrice(response.data[0].price)
        setQuantity(response.data[0].quantity)
      } catch (e) {
        console.log(e)
      }
    }
        loadingLotInfo()
    }, [userId])

    async function handleEdit() {
        let formdata = {
            name: name,
            description: description,
            price: price,
            quantity: quantity,
            userId: userId
        }

        let response = await axios.post(`/edit/${params.game_id}/${params.category_id}/${params.lotId}`, formdata)
        if (response.data === 'Успешно!') {
            navigate('/')
        }
    }

    return (
        <div className="ms-5 me-5">

            <div>
            <Navbar></Navbar>
            </div>

            <div>
                <h3>Редактирование лота</h3>
                <div className="d-flex flex-column">
                    <div>
                     <label>Краткое описание</label>
                     <input onChange={(e) => setName(e.target.value)} type="text" className="form-control mt-2" value={name} placeholder="Новое краткое описание"></input>
                   </div> 
                   <div>
                     <label>Подробное описание</label>
                     <input onChange={(e) => setDescription(e.target.value)} type="text" value={description} className="form-control mt-2" placeholder="Подробное описание"></input>
                   </div>
                   <div>
                     <label>Цена</label>
                     <input onChange={(e) => setPrice(e.target.value)} type="text" value={price} className="form-control mt-2" placeholder="Цена"></input>
                   </div>
                   <div>
                     <label>Количество</label>
                     <input onChange={(e) => setQuantity(e.target.value)} type="text" value={quantity} className="form-control mt-2" placeholder="Количество"></input>
                   </div>
                   <button onClick={handleEdit} className="btn btn-primary mt-2">Редактировать лот</button>
                </div>
                
            </div>

            <Footer></Footer>

        </div>
    )
}

export default EditLot;