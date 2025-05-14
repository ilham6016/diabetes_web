import React from "react";
import "./UserTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrashAlt,
  faCheck,
  faUndo,
  faClock,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

// ฟังก์ชันดึงอักษรย่อจากชื่อ
const getInitials = (name) => {
  if (!name) return "";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? parts[0][0] + parts[1][0]
    : parts[0].slice(0, 2);
};

const UserTable = ({ users, handleEdit, handleDelete, handleApprove, handleRevoke }) => {
  return (
    <div className="table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            <th>ชื่อผู้ใช้</th>
            <th>อีเมล</th>
            <th>สิทธิ์การใช้งาน</th>
            <th>สถานะ</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="user-avatar">
                  <div className="avatar-circle">
                    {getInitials(user.username)}
                  </div>
                  <div className="user-info-text">
                    <div className="user-name">{user.username}</div>
                  </div>
                </div>
              </td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {user.approved ? (
                  <>
                    <FontAwesomeIcon icon={faCheckCircle} style={{ color: "green", marginRight: "6px" }} />
                    อนุมัติแล้ว
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faClock} style={{ color: "orange", marginRight: "6px" }} />
                    รออนุมัติ
                  </>
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(user)} title="แก้ไข">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => handleDelete(user.id)} title="ลบ">
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
                {user.approved ? (
                  <button onClick={() => handleRevoke(user.id)} title="ยกเลิกอนุมัติ">
                    <FontAwesomeIcon icon={faUndo} />
                  </button>
                ) : (
                  <button onClick={() => handleApprove(user.id)} title="อนุมัติ">
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
