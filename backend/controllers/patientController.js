// controllers/patientController.js
const db = require('../config/db');

// ดึงรายชื่อผู้ป่วยทั้งหมด
exports.getPatients = (req, res) => {
  const query = 'SELECT * FROM patient';
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching patients', error: err });
    }
    res.status(200).json(result);
  });
};

// เพิ่มผู้ป่วยใหม่
exports.addPatient = (req, res) => {
  const {
    P_Name,
    Address,
    Phone_Number,
    Age,
    Gender,
    Birthdate,
    Underlying_Disease
  } = req.body;
  const query = `
  INSERT INTO patient (
    P_Name, Address, Phone_Number, Age, Gender, Birthdate, Underlying_Disease
  ) VALUES (?, ?, ?, ?, ?, ?, ?)
`;
db.query(
  query,
  [P_Name, Address, Phone_Number, Age, Gender, Birthdate, Underlying_Disease],
  (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding patient', error: err });
    }
    res.status(201).json({ message: 'Patient added successfully', patientId: result.insertId });
  }
);
};

// ดึงข้อมูลผู้ป่วยตาม ID
exports.getPatientById = (req, res) => {
  const patientId = req.params.id; // รับค่า id จาก URL เช่น /patients/123

  const query = 'SELECT * FROM patient WHERE Patient_ID = ?';

  db.query(query, [patientId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving patient', error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json(results[0]);
  });
};


// แก้ไขข้อมูลผู้ป่วย
exports.updatePatient = (req, res) => {
  const patientId = req.params.id; // รับค่า Patient_ID จาก URL เช่น /patients/123
  const {
    P_Name,
    Address,
    Phone_Number,
    Age,
    Gender,
    Birthdate,
    Underlying_Disease
  } = req.body;

  // คำสั่ง SQL สำหรับการอัพเดตข้อมูลผู้ป่วย
  const query = `
    UPDATE patient
    SET 
      P_Name = ?, 
      Address = ?, 
      Phone_Number = ?, 
      Age = ?, 
      Gender = ?, 
      Birthdate = ?, 
      Underlying_Disease = ?
    WHERE Patient_ID = ?
  `;

  db.query(
    query,
    [P_Name, Address, Phone_Number, Age, Gender, Birthdate, Underlying_Disease, patientId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating patient', error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      res.status(200).json({ message: 'Patient updated successfully' });
    }
  );
};


// ลบข้อมูลผู้ป่วย
exports.deletePatient = (req, res) => {
  const patientId = req.params.id; // รับค่า Patient_ID จาก URL เช่น /patients/123

  const query = 'DELETE FROM patient WHERE Patient_ID = ?';

  db.query(query, [patientId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting patient', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json({ message: 'Patient deleted successfully' });
  });
};

