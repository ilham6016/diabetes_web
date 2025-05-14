import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const navigate = useNavigate();

  return () => {
    localStorage.removeItem("token"); // ลบ token
    navigate("/login"); // เปลี่ยนเส้นทางไปหน้า login
  };
};
export default useLogout;
