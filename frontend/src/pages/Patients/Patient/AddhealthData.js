import React, { useState } from 'react';
import './AddPatient.css'; // ใช้ style เดิมได้เลย

const AddHealthData = ({ patientId, onSuccess, closePopup }) => {
  const [formData, setFormData] = useState({
    Systolic_BP: '',
    Diastolic_BP: '',
    Blood_Sugar: '',
    Height: '',
    Weight: '',
    Waist: '', // เพิ่ม Waist ในฟอร์ม
    Note: '',
    Diabetes_Mellitus: '', // เปลี่ยนค่าเริ่มต้นเป็นค่าว่าง
    Smoke: '', // เปลี่ยนค่าเริ่มต้นเป็นค่าว่าง
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    // ตรวจสอบว่าเป็น checkbox หรือไม่
    if (type === 'checkbox') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: checked ? (name === "Diabetes_Mellitus" ? "เป็นเบาหวาน" : "สูบบุหรี่") : "" 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบค่าก่อนการคำนวณ Blood_Pressure
    const systolic = parseInt(formData.Systolic_BP, 10);
    const diastolic = parseInt(formData.Diastolic_BP, 10);

    if (isNaN(systolic) || isNaN(diastolic)) {
      alert('❌ กรุณาระบุค่าความดันโลหิตให้ถูกต้อง');
      return;
    }

    // สร้าง payload สำหรับส่งข้อมูล
    const payload = {
      Systolic_BP: systolic,
      Diastolic_BP: diastolic,
      Blood_Sugar: parseFloat(formData.Blood_Sugar) || 0, // แปลงให้เป็นเลข
      Height: parseFloat(formData.Height) || 0, // แปลงให้เป็นเลข
      Weight: parseFloat(formData.Weight) || 0, // แปลงให้เป็นเลข
      Waist: parseFloat(formData.Waist) || 0,  // เพิ่ม Waist ที่นี่
      Note: formData.Note,
      Diabetes_Mellitus: formData.Diabetes_Mellitus || "", // ส่งเป็นข้อความ
      Smoke: formData.Smoke || "", // ส่งเป็นข้อความ
      Blood_Pressure: `${systolic}/${diastolic}`, // ใช้ template literals
    };

    try {
      // ✅ 1. บันทึกข้อมูลสุขภาพ
      const res = await fetch(`http://localhost:5000/api/patient/${patientId}/health`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Error saving health data');

      // ✅ 2. อัปเดตสีตามข้อมูลสุขภาพล่าสุด
      await fetch(`http://localhost:5000/api/patient/${patientId}/update-color`, {
        method: 'POST'
      });

      alert('✅ บันทึกข้อมูลสุขภาพและอัปเดตกลุ่มสีสำเร็จ');
      if (onSuccess) onSuccess();
      if (closePopup) closePopup();
    } catch (err) {
      alert('❌ เกิดข้อผิดพลาด');
      console.error(err);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={closePopup}>✖</button>
        <h2>บันทึกข้อมูลสุขภาพ</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input type="number" name="Systolic_BP" placeholder="ค่าบน (SYS)" onChange={handleChange} required />
            <input type="number" name="Diastolic_BP" placeholder="ค่าล่าง (DIA)" onChange={handleChange} required />
            <input type="number" step="0.1" name="Blood_Sugar" placeholder="น้ำตาล (mg/dL)" onChange={handleChange} />
          </div>
          <div className="form-row">
            <input type="number" step="0.1" name="Height" placeholder="ส่วนสูง (cm)" onChange={handleChange} />
            <input type="number" step="0.1" name="Weight" placeholder="น้ำหนัก (kg)" onChange={handleChange} />
            <input type="number" step="0.1" name="Waist" placeholder="รอบเอว (cm)" onChange={handleChange} /> {/* เพิ่มฟิลด์ Waist */}
          </div>
          <label><input type="checkbox" name="Diabetes_Mellitus" checked={formData.Diabetes_Mellitus === "เป็นเบาหวาน"} onChange={handleChange} /> เป็นเบาหวาน</label>
          <label><input type="checkbox" name="Smoke" checked={formData.Smoke === "สูบบุหรี่"} onChange={handleChange} /> สูบบุหรี่</label>
          <textarea name="Note" placeholder="หมายเหตุ" onChange={handleChange} />
          <button className="submit-btn" type="submit">บันทึก</button>
        </form>
      </div>
    </div>
  );
};

export default AddHealthData;
