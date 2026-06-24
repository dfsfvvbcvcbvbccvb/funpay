import { useNavigate } from "react-router-dom"
import { useEffect } from 'react';
import Footer from "../Footer";
import SupportNavbar from "./SupportNavbar";

function SupportDashboard() {
  return (
    <div className="me-5 ms-5">
          <div>
              <SupportNavbar></SupportNavbar>
          </div>
          <div>
              <h1>Центр поддержки</h1>
          </div>
          <Footer></Footer>
    </div>
  )
}
export default SupportDashboard