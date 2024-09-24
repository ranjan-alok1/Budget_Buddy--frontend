import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { message } from "antd";
import "../../styles/HeaderStyles.css";

const Header = () => {
  const [loginUser, setLoginUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setLoginUser(user);
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("user");
    message.success("Logout Successfully");
    navigate("/login");
  };

  return (
    <header className="nav_bar">
      <div className="nav-container">
        <div className="logo">
          <Link to="/">Budget Buddy</Link>
        </div>
        <div className="nav-links">
          <h6 className="nav-user">
            <UserOutlined /> {loginUser && loginUser.name}
          </h6>
          <button className="btn-logout" onClick={logoutHandler}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
