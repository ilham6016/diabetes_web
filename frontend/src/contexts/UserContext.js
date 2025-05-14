import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null); // รีเซ็ตข้อมูลผู้ใช้
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
