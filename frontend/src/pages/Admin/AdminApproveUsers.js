// src/components/admin/AdminApproveUsers.js
import React from "react";
import "./AdminApproveUsers.css";

function AdminApproveUsers({ pendingUsers, handleApprove, handleReject, error, successMessage }) {
  return (
    <div className="admin-approve-container">
      <h2>รายการผู้ใช้ที่รออนุมัติ</h2>

      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}

      {pendingUsers.length === 0 ? (
        <p>ไม่มีผู้ใช้ที่รออนุมัติ</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button className="approve" onClick={() => handleApprove(user.id)}>
                    อนุมัติ
                  </button>
                  <button className="reject" onClick={() => handleReject(user.id)}>
                    ปฏิเสธ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminApproveUsers;
