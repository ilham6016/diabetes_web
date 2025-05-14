import React, { useEffect } from "react";
import axios from "axios";
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

function GoogleLogin() {
  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: "1096231308218-5bd1op2fctg1gljjskpl1qaa2uhfm5h1.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    window.google.accounts.id.renderButton(document.getElementById("google-login-button"), { theme: "outline", size: "large" });
  }, []);

  const handleCallbackResponse = async (response) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/google/login", {
        googleIdToken: response.credential,
      });
      alert("Login Successful!");
  
      const token = res.data.token;
      localStorage.setItem("token", token);
  
      const decoded = parseJwt(token); // ✨ ถอด JWT
      localStorage.setItem("role", decoded?.role); // ✨ ดึง role จาก token
  
      window.location.href = "/user/profile";
    } catch (error) {
      alert(error.response?.data?.message || "Google Login Failed!");
    }
  };
  
  
  return (
    <div>
      <h2>Login with Google</h2>
      <div id="google-login-button"></div>
    </div>
  );
}

export default GoogleLogin;
