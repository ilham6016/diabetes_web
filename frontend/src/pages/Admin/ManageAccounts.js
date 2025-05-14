import React, { useState, useEffect } from "react";
import axios from "axios";
import UserForm from "./UserForm";
import UserEditForm from "./UserEditForm";
import UserTable from "./UserTable";
import "./ManageAccounts.css";

// Font Awesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowLeft,
  faUserCog,
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

function ManageAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("กรุณาเข้าสู่ระบบเพื่อดำเนินการ");
        return;
      }

      const currentUser = JSON.parse(atob(token.split(".")[1]));
      const response = await axios.get("http://localhost:5000/api/admin/accounts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredAccounts = response.data.accounts.filter(
        (account) => account.id !== currentUser.id
      );

      setAccounts(filteredAccounts);
    } catch (error) {
      alert("ไม่สามารถดึงข้อมูลบัญชีได้!");
    }
  };

  const handleAddUser = async (user) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/admin/accounts", user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAccounts();
      setIsAddingUser(false);
      alert("เพิ่มผู้ใช้สำเร็จ!");
    } catch (error) {
      alert("ไม่สามารถเพิ่มผู้ใช้ได้!");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsAddingUser(false);
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/admin/accounts/${updatedUser.id}`,
        updatedUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAccounts();
      setEditingUser(null);
      alert("แก้ไขข้อมูลสำเร็จ!");
    } catch (error) {
      alert("ไม่สามารถแก้ไขข้อมูลได้!");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีนี้?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/admin/accounts/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchAccounts();
        alert("ลบบัญชีสำเร็จ!");
      } catch (error) {
        alert("ไม่สามารถลบบัญชีได้!");
      }
    }
  };

  const handleApprove = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:5000/api/admin/accounts/${userId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAccounts();
      alert("อนุมัติบัญชีสำเร็จ!");
    } catch (error) {
      alert("ไม่สามารถอนุมัติบัญชีได้!");
    }
  };

  const handleRevoke = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:5000/api/admin/accounts/${userId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAccounts();
      alert("ยกเลิกอนุมัติสำเร็จ!");
    } catch (error) {
      alert("ไม่สามารถยกเลิกอนุมัติได้!");
    }
  };

  return (
<div className="manage-accounts-container">
  <h1>
    <FontAwesomeIcon icon={faUserCog} />
    จัดการบัญชีผู้ใช้
  </h1>

      {!editingUser && !isAddingUser && (
        <button onClick={() => setIsAddingUser((prev) => !prev)}>
          <FontAwesomeIcon icon={isAddingUser ? faArrowLeft : faPlus} />
          {isAddingUser ? " ย้อนกลับ" : " เพิ่มผู้ใช้"}
        </button>
      )}

      {isAddingUser && (
        <UserForm handleSave={handleAddUser} handleCancel={() => setIsAddingUser(false)} />
      )}

      {editingUser && (
        <UserEditForm
          user={editingUser}
          handleSave={handleUpdateUser}
          handleCancel={() => setEditingUser(null)}
        />
      )}

      {!isAddingUser && !editingUser && (
        <UserTable
          users={accounts}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleApprove={handleApprove}
          handleRevoke={handleRevoke}
        />
      )}
    </div>
  );
}

export default ManageAccounts;
