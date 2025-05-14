import React, { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function GoogleRegister() {
  // Initialize Google Login
  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: "1096231308218-5bd1op2fctg1gljjskpl1qaa2uhfm5h1.apps.googleusercontent.com", // ใส่ Client ID จาก Google Developer Console
      callback: handleCallbackResponse,
    });

    // Render Google Button
    window.google.accounts.id.renderButton(
      document.getElementById("google-register-button"), // จุดที่ปุ่ม Google จะปรากฏ
      { theme: "outline", size: "large" }
    );
  }, []);

  const handleCallbackResponse = (response) => {
    const user = jwtDecode(response.credential);
    console.log("Google User:", user);

    // เก็บข้อมูล Google ลง localStorage
    window.localStorage.setItem("googleRegister", JSON.stringify({
      googleIdToken: response.credential,
      name: user.name,
      email: user.email,
      picture: user.picture,
    }));

    // เปลี่ยนหน้าไปยังหน้า "Provide Additional Info"
    window.location.href = "/additional-info"; // แก้ไข URL ที่ต้องการ
  };

  return (
    <div>
      <h2>Register with Google</h2>
      <div id="google-register-button"></div> {/* ตำแหน่งปุ่ม Google */}
    </div>
  );
}

export default GoogleRegister;
