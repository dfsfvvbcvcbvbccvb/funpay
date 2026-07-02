import axios from "axios";

async function getUserId() {
    let response = await axios.post(`/api/getUserId`)
    return response.data[0].userId
}

export default getUserId;