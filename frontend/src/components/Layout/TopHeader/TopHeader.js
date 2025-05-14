import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useLogout from "../../../hooks/useLogout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import "./TopHeader.css";

const TopHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const navigate = useNavigate();
  const handleLogout = useLogout();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUserInfo(res.data.profile))
      .catch((err) => console.error("Failed to fetch user info:", err));
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString("th-TH", {
        weekday: "long", // วันในสัปดาห์ เช่น วันพุธ
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      setCurrentTime(formattedDate);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);
  

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleManageAccount = () => {
    navigate("/user/profile");
  };

  const getInitial = (name) => {
    return name ? name.trim().charAt(0).toUpperCase() : "?";
  };

  return (
    <div className="top-header">
<div className="logo-header">
  <span>{currentTime}</span>
</div>


      <div className="user-info1">
        <div className="dropdown">
          <div className="avatar-circle">
            {userInfo ? getInitial(userInfo.username) : "?"}
          </div>
          <span>{userInfo ? userInfo.username : "กำลังโหลด..."}</span>
          <button className="dropdown-btn" onClick={toggleDropdown}>
            <FontAwesomeIcon icon={isDropdownOpen ? faCaretUp : faCaretDown} />
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={handleManageAccount}>โปรไฟล์ของฉัน</button>
              <button onClick={handleLogout}>ออกจากระบบ</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
