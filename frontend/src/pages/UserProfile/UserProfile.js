import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  TextField,
  Button,
} from "@mui/material";

const API_URL = process.env.REACT_APP_API;

// ดึงอักษรย่อจากชื่อ
const getInitials = (name) => {
  if (!name) return "";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
};

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", picture: "" });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axios.get(`${API_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProfile(response.data.profile);
        setFormData({
          name: response.data.profile.name || "",
          email: response.data.profile.email || "",
          picture: response.data.profile.picture || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    setEditable(!editable);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.patch(`${API_URL}/api/user/me`,
        { ...formData },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("อัปเดตข้อมูลสำเร็จ!");
      setEditable(false);
    } catch (error) {
      alert("ไม่สามารถอัปเดตข้อมูลได้!");
    }
  };

  return (
    <Container
      sx={{
        marginTop: "20px",
        textAlign: "center",
        padding: "20px",
        maxWidth: "800px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h4" sx={{ color: "#333", marginBottom: "20px" }}>
        ข้อมูลผู้ใช้
      </Typography>

      {profile ? (
        <Box>
          {/* Avatar */}
          <Box sx={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
            {formData.picture ? (
              <img
                src={formData.picture}
                alt="User Avatar"
                style={{ borderRadius: "50%", width: "150px", height: "150px" }}
              />
            ) : (
              <Box
                sx={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  backgroundColor: "#cbd5e1",
                  color: "#1e293b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "48px",
                  fontWeight: "bold",
                }}
              >
                {getInitials(formData.name)}
              </Box>
            )}
          </Box>

          {/* Display or Edit */}
          {editable ? (
            <Box>
              <TextField
                name="name"
                label="ชื่อ"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="email"
                label="อีเมล"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="picture"
                label="รูปภาพ (URL)"
                value={formData.picture}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
                บันทึกข้อมูล
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6">ชื่อผู้ใช้: <strong>{profile.username}</strong></Typography>
              <Typography variant="h6">ชื่อ: <strong>{profile.name}</strong></Typography>
              <Typography variant="h6">อีเมล: <strong>{profile.email}</strong></Typography>
              <Button variant="contained" color="secondary" sx={{ mt: 3 }} onClick={handleEditToggle}>
                แก้ไขข้อมูล
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        <CircularProgress color="primary" />
      )}
    </Container>
  );
}

export default UserProfile;
