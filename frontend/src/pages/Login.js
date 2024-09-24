import React, { useState, useEffect } from 'react'
import { Form, Input, message } from 'antd'
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import LoadSpinner from '../components/Layout/LoadSpinner';
import "../styles/Loginpage.css";
import imge from '../styles/19199609.jpg'

const Login = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL;

    //form submit
    const submitHandler = async (values) => {
        console.log("API_URL:", API_URL);
        try {
            setLoading(true);
            const { data } = await axios.post(`${API_URL}users/login`, values)
            setLoading(false);
            message.success("Login Successful")
            localStorage.setItem('user', JSON.stringify({ ...data.user, password: '' }))
            navigate('/')
        }
        catch (error) {
            setLoading(false);
            message.error("Something went wrong")
        }
    }

    //prevent for login user
    useEffect(() => {
        if (localStorage.getItem('user')) {
            navigate('/')
        }
    }, [navigate]);

    return (
        <>
            <div className='login-page'>
                <div >{loading && <LoadSpinner />}</div>
                <div className="row container">
                    <h1>Budget Buddy</h1>
                    <div className="col-md-6 image-cont">
                        <img src={imge} alt="login-img" width={"80%"} height="100%" />
                    </div>
                    <div className="col-md-4 login-form">
                        <Form layout="vertical" onFinish={submitHandler}>
                            <h1>Login Here</h1>
                            <Form.Item label="Email" name="email">
                                <Input type="email" />
                            </Form.Item>
                            <Form.Item label="Password" name="password">
                                <Input type="password" />
                            </Form.Item>
                            <div className="d-flex justify-content-between">
                                <Link to="/register"> Not a user ? Click Here to register </Link>
                                <button className="btn btn-primary">Login</button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login