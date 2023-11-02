import React, { useEffect, useState } from 'react'
import ConfigData from '../../../config.json'
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import Img2 from '../../images/ACFFinalLogo.png'
import Loader from '../components/loader/Loader'

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [loading, setLoading] = useState(false);
    const generateToken = () => {
        console.log(ConfigData.API_ENDPOINT);

        let data = JSON.stringify({
            "username": email,
            "password": pass
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: ConfigData.API_ENDPOINT + "Account/MachineLogin",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        setLoading(true);

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                setLoading(false);
                navigate('/admin/dashboard');
                sessionStorage.setItem('userInfo', JSON.stringify(response.data))

            })
            .catch((error) => {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Invalid Credentials',
                    text: 'Please try again...',
                    showConfirmButton: false,
                    timer: 2000,
                    width: 350,
                });
                setLoading(false);
            });
    }
    return (
        <>
            <Loader loading={loading} />
            <div className="bg-grey full-height">
                <div className='bg-grey centerbox mx-auto'>
                    <div className='container-tight py-4'>
                        <div className='text-center mb-4'>
                            <a href="#" className='navbar-brand navbar-brand-autodark'>
                                <img src={Img2} alt="logo" width={60} className="img-fluid" />
                            </a>
                        </div>
                        <Form className='card card-md'>
                            <div className='card-body'>
                                <h4 className='card-title text-center mb-4'>Login to your account</h4>
                                <Form.Group className="mb-4" controlId="formBasicuser">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" placeholder="Username" onChange={(e) => setEmail(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-4" controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" onChange={(e) => setPass(e.target.value)} />
                                </Form.Group>

                                <Button className="btn btn-primary" onClick={generateToken} style={{ width: "100%" }}  >Login</Button>
                            </div>
                        </Form>


                    </div>

                </div>
            </div>
        </>
    )
}

export default Login