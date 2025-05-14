import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ExportPage.css';

const ExportPage = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [exportFormat, setExportFormat] = useState(null);
  const [isConfirmingExport, setIsConfirmingExport] = useState(false);

  const itemsPerPage = 8;

  // โหลดข้อมูลจาก backend
  useEffect(() => {
    const token = localStorage.getItem('token'); // รับ token จาก localStorage

    // ตรวจสอบว่า Token มีอยู่หรือไม่
    if (!token) {
      alert('กรุณาเข้าสู่ระบบเพื่อดำเนินการ');
      return;
    }

    // ส่งคำขอ GET พร้อมกับ Token ใน Authorization header
    axios.get('http://localhost:5000/api/export/all-patients', {
      headers: {
        Authorization: `Bearer ${token}`, // ส่ง token ใน header
      },
    })
      .then((res) => {
        const mapped = res.data.map((p) => ({
          id: p.ID,
          name: p.Name,
          hn: p.HN || `HN: ${p.ID}`,
        }));
        setPatients(mapped);
      })
      .catch((err) => console.error('โหลดผู้ป่วยล้มเหลว', err));
  }, []);

  const filteredPatients = patients.filter(
    (p) => p.name.includes(search) || p.hn.includes(search)
  );

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = (format) => {
    if (selectedPatients.length === 0) {
      alert('กรุณาเลือกผู้ป่วยที่ต้องการ export');
      return;
    }
    setExportFormat(format);
    setIsConfirmingExport(true);
  };

  const confirmExport = async () => {
    const baseUrl = 'http://localhost:5000/api/export';
    const queryParam = selectedPatients.join(',');
    const url =
      exportFormat === 'PDF'
        ? `${baseUrl}/pdf?id=${queryParam}`
        : `${baseUrl}/excel?ids=${queryParam}`;
  
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert('กรุณาเข้าสู่ระบบเพื่อดำเนินการ');
      return;
    }
  
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', // สำคัญ!
      });
  
      // สร้าง blob เพื่อดาวน์โหลด
      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
  
      // ตั้งชื่อไฟล์ให้สื่อความหมาย
      const date = new Date().toLocaleDateString('th-TH').replace(/\//g, '-');
      const idsLabel = selectedPatients.join(',');
      link.download = `${date} ข้อมูลผู้ป่วย ${idsLabel}.${exportFormat === 'PDF' ? 'pdf' : 'xlsx'}`;
  
      link.click();
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('เกิดข้อผิดพลาดในการส่งออกข้อมูล');
    }
  
    setIsConfirmingExport(false);
  };
  

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPatients([]);
    } else {
      setSelectedPatients(filteredPatients.map((p) => p.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelect = (id) => {
    setSelectedPatients((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  return (
    <div className="export-container">
      <h2>Export ข้อมูล</h2>
      <div className="export-controls">
        <input
          type="text"
          placeholder="ค้นหา"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button onClick={handleSelectAll}>
          {selectAll ? 'ยกเลิกเลือกทั้งหมด' : 'เลือกทั้งหมด'}
        </button>
        <button onClick={() => handleExport('PDF')}>Export PDF</button>
        <button onClick={() => handleExport('XLSX')}>Export XLSX</button>
      </div>

      <div className="patient-cards-grid">
        {paginatedPatients.map((patient) => (
          <div
            key={patient.id}
            className={`patient-card ${selectedPatients.includes(patient.id) ? 'selected' : ''}`}
          >
            <input
              type="checkbox"
              className="card-checkbox"
              checked={selectedPatients.includes(patient.id)}
              onChange={() => handleSelect(patient.id)}
            />
            <div className="avatar">{patient.name.charAt(0)}</div>
            <div className="patient-info">
              <div className="name-line">{patient.name}</div>
              <div className="hn">{patient.hn}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        หน้าที่ {currentPage} จาก {totalPages}
        <div className="pagination-buttons">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>ก่อนหน้า</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>ถัดไป</button>
        </div>
      </div>

      {isConfirmingExport && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>คุณกำลังจะส่งออกเป็น {exportFormat}</h3>
            <ul className="export-patient-list">
              {patients
                .filter((p) => selectedPatients.includes(p.id))
                .map((p) => (
                  <li key={p.id}>
                    <span className="patient-name">{p.name}</span>
                    <span className="patient-hn">({p.hn})</span>
                  </li>
                ))}
            </ul>
            <div className="modal-actions">
              <button className="confirm" onClick={confirmExport}>
                ยืนยันส่งออก
              </button>
              <button className="cancel" onClick={() => setIsConfirmingExport(false)}>
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportPage;
