import React from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";

const WelcomePage = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="welcome-page__wrapper">
      <div className="welcome-page__box">
        <h1 className="welcome-page__title">Welcome to Diabetes Management System</h1>
        <p className="welcome-page__subtitle">ยินดีต้อนรับสู่ระบบจัดการโรคเบาหวาน</p>
        <div className="welcome-page__buttons">
          <button onClick={goToLogin} className="welcome-page__btn welcome-page__btn--login">
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
