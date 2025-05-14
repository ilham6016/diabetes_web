import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReportPage.css';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';

import PatientSelector from '../../components/Report/PatientSelector';
import { PatientInfoCard, PatientDetails } from '../../components/Report/PatientInfoCard';
import RiskPieChart from '../../components/Report/RiskPieChart';
import HealthChartGroup from '../../components/Report/HealthChartGroup';

dayjs.extend(buddhistEra);
dayjs.locale('th');

const ReportPage = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [lineData, setLineData] = useState([]);
  const [riskColor, setRiskColor] = useState('#ff4d4f');

  const colorMap = {
    'สีแดง': '#ff4d4f',
    'สีเหลือง': '#fadb14',
    'สีเขียว': '#52c41a'
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/reports/patients')
      .then(res => {
        setPatients(res.data);
        if (res.data.length > 0) {
          const randomPatient = res.data[Math.floor(Math.random() * res.data.length)];
          setSelectedPatientId(randomPatient.Patient_ID);
        }
      });
  }, []);

  useEffect(() => {
    if (selectedPatientId === null || selectedPatientId === undefined) return;

    const fetchData = async () => {
      try {
        const patientRes = await axios.get(`http://localhost:5000/api/reports/patient/${selectedPatientId}`);
        const trendRes = await axios.get(`http://localhost:5000/api/reports/healthTrends/${selectedPatientId}`);

        const patientData = patientRes.data;
        setSelectedPatient(patientData);

        setRiskColor(colorMap[patientData["กลุ่มเสี่ยงปิงปองจราจร 7 สี"]] || '#ff4d4f');

        const trends = trendRes.data;
        const mergedData = trends.bloodSugar.map((item, idx) => ({
          date: dayjs(item.date).format('MMM'),
          sugar: parseFloat(item.value),
          systolic: trends.pressure[idx]?.value || 0,
          diastolic: (trends.pressure[idx]?.value || 0) - 45,
          weight: parseFloat(trends.weight[idx]?.value || 0),
          waist: parseFloat(trends.waist[idx]?.value || 0),
        }));

        setLineData(mergedData);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [selectedPatientId]);

  const complicationData = selectedPatient ? [
    { name: 'กลุ่มความเสี่ยง', value: selectedPatient["%โอกาสเกิดโรคแทรกซ้อน"] ?? 0 },
    { name: 'ปลอดภัย', value: 100 - (selectedPatient["%โอกาสเกิดโรคแทรกซ้อน"] ?? 0) },
  ] : [];

  return (
    <div className="report-page">
      <h2 className="report-title">รายงานผลสุขภาพ</h2>

      <PatientSelector
        patients={patients}
        selectedId={selectedPatientId}
        onChange={setSelectedPatientId}
      />

      {selectedPatient && (
        <div className="report-card">
          <PatientInfoCard patient={selectedPatient} />

          <div className="info-main">
            <PatientDetails patient={selectedPatient} />
            <RiskPieChart
              data={complicationData}
              riskPercent={selectedPatient["%โอกาสเกิดโรคแทรกซ้อน"]}
              riskColor={riskColor}
            />
          </div>

          <HealthChartGroup data={lineData} />
        </div>
      )}
    </div>
  );
};

export default ReportPage;
