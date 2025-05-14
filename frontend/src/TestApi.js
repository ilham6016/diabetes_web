import React from 'react';
import axios from 'axios';

const TestExport = () => {
  const handleExport = (type = 'excel') => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("กรุณาเข้าสู่ระบบ");
      return;
    }

    const ids = [1, 2, 3]; // ตัวอย่าง ID ที่ต้องการ export
    const queryParam = ids.join(',');

    const url =
      type === 'pdf'
        ? `http://localhost:5000/api/export/pdf?id=${queryParam}`
        : `http://localhost:5000/api/export/excel?ids=${queryParam}`;

    axios
      .get(url, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', // เพื่อให้สามารถดาวน์โหลดไฟล์ได้
      })
      .then((response) => {
        // สร้างลิงก์ดาวน์โหลด
        const file = new Blob([response.data]);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(file);
        link.download = type === 'pdf' ? 'report.pdf' : 'report.xlsx';
        link.click();
      })
      .catch((error) => {
        console.error("Export failed", error);
        alert("ส่งออกไม่สำเร็จ");
      });
  };

  return (
    <div>
      <h2>ทดสอบ Export</h2>
      <button onClick={() => handleExport('pdf')}>Export PDF</button>
      <button onClick={() => handleExport('excel')}>Export Excel (XLSX)</button>
    </div>
  );
};

export default TestExport;
