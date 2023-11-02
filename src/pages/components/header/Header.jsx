import React, {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from "sweetalert2";
import ConfigData from '../../../../config.json'
import { NavDropdown } from "react-bootstrap";
import Img1 from '../../../images/img1.jpg'
import Img2 from '../../../images/ACFFinalLogo.png'
import Loader from '../loader/Loader'

function Header() {
  const [loading, setLoading] = useState(false);
  const [userDetails,setuserDetails] = useState();

  const navigate = useNavigate();
  const logout = () =>{
    Swal.fire({
      title: "Are you sure?",
      text: "You want to logout!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#107832",
      cancelButtonColor: "#e65c4f",
      confirmButtonText: "Yes, log me out!",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(false);
       // navigate("/login");
        sessionStorage.removeItem('userInfo');
        window.location.href="/";
      }
    });
  }



  useEffect(() => {
    const storeduserData = sessionStorage.getItem('userInfo');
    if (storeduserData) {
      setuserDetails(JSON.parse(storeduserData));
    }
  },[])
  return (
    <>
    <Loader loading={loading} />
    <header className='header-wrap header-stciky'>
      <div className="container">
        <div className="equil-header d-flex justify-content-between align-items-center">
          <div className="left-logo-sapn">
            <a href="#" className='navbar-brand navbar-brand-autodark'>
              <img src={Img2} alt="logo" width={40} className="img-fluid" />
            </a>
          </div>
          <div className="righ-welcome">
            <div className="personbox">
              <NavDropdown
                title={
                  <span className="personsvg">
                    <div className="avatarimg">
                    {((userDetails && userDetails.employeeProfile.empPhotoIm) =="") ? <img src={Img1} width={40} height={40} className="img-fluid" alt="logo" /> : <img src={`data:image/jpeg;base64,${userDetails&&userDetails.employeeProfile.empPhotoIm}`} width={40} height={40} className="img-fluid" alt="logo" />}
                    </div>
                  </span>
                }
                id="nav-dropdown"
              >
                <div className="dropdown-item-text">
                  <div className="d-flex align-items-center">
                    
                    <div className="flex-grow-1">
                      <h5 className="fw-bold mb-0 persontexthead">Welcome <span className='text-lowercase'>{userDetails && userDetails.employeeProfile.loginUserIdVc}</span></h5>
                    </div>
                  </div>
                </div>
                <NavDropdown.Divider />
          
                <NavDropdown.Item onClick={() => logout()}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </div>
          </div>
        </div>
      </div>
    </header>
    </>
  )
}

export default Header