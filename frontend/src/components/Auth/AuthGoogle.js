// src/components/auth/AuthGoogle.js
import React, { useState } from 'react';
import { useGoogleLogin, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import GoogleRegisterForm from './GoogleRegisterForm';
import { useNavigate } from 'react-router-dom';

const AuthGoogle = () => {
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [googleData, setGoogleData] = useState(null);
  const navigate = useNavigate();

  const googleRegisterLogin = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      console.log(credentialResponse);
      setGoogleData(credentialResponse);
      setShowAdditionalInfo(true);
    },
    onError: (error) => {
      console.error('Google Sign-In Error:', error);
    },
    scope: 'openid profile email', // Make sure 'openid' is included
  });

  const handleRegisterWithAdditionalInfo = (formData) => {
    const payload = {
      googleIdToken: googleData?.credential,
      username: formData.username,
      password: formData.password,
      // phone: formData.phone, // Removed
      // birthdate: formData.birthdate, // Removed
    };

    console.log('Payload ที่ส่งไปยัง Backend (Register):', payload);

    axios
      .post('http://localhost:5000/api/auth/google/register', payload)
      .then((res) => {
        console.log('Google Register Success:', res);
        navigate('/login');
      })
      .catch((err) => {
        console.error('Google Register Error:', err);
      });
  };

  const handleGoogleLoginOnly = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      console.log('Google Login Credential Response:', credentialResponse);
      axios
        .post('http://localhost:5000/api/auth/google/login', { googleIdToken: credentialResponse.credential })
        .then((res) => {
          console.log('Google Login Success:', res);
          localStorage.setItem('token', res.data.token);
          navigate('/dashboard');
        })
        .catch((err) => {
          console.error('Google Login Error:', err);
        });
    },
    onError: (error) => {
      console.error('Google Sign-In Error (Login):', error);
    },
    scope: 'openid profile email', // Make sure 'openid' is included for login as well
  });

  return (
    <div>
      <h2>สมัครสมาชิกด้วย Google</h2>
      {!showAdditionalInfo ? (
        <GoogleLogin onSuccess={googleRegisterLogin} onError={() => console.log('Login Failed (Register)')} />
      ) : (
        <GoogleRegisterForm onSubmit={handleRegisterWithAdditionalInfo} />
      )}

      <h2>เข้าสู่ระบบด้วย Google</h2>
      <GoogleLogin onSuccess={handleGoogleLoginOnly} onError={() => console.log('Login Failed (Login)')} />
    </div>
  );
};

export default AuthGoogle;