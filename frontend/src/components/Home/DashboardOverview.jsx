import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  UserGroupIcon,
  ExclamationCircleIcon,
  CalendarIcon,
  UserIcon,
} from '@heroicons/react/solid';
import './DashboardOverview.css';
import { getLocalISODate } from '../../components/utils';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    highRisk: 0,
    todayAppointments: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patientsRes, appointmentsRes, usersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/appointments/patients'),
          axios.get('http://localhost:5000/api/appointments'),
          axios.get('http://localhost:5000/api/user'), // 🔗 เปลี่ยน path ถ้าคุณใช้ route อื่น
        ]);

        const totalPatients = patientsRes.data.length;

        const highRisk = patientsRes.data.filter(
          (p) => p.Risk_Level === 'สูง' || p.Risk_Level === 'High'
        ).length;

        const today = getLocalISODate(new Date());

        const todayAppointments = appointmentsRes.data.filter(
          (a) => getLocalISODate(a.Appointment_Date) === today
        ).length;

        const totalUsers = usersRes.data.length;

        setStats({ totalPatients, highRisk, todayAppointments, totalUsers });
      } catch (err) {
        console.error('โหลดข้อมูล overview ล้มเหลว:', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-grid">
      {/* ผู้ป่วยทั้งหมด */}
      <div className="stat-card">
        <div className="card-header">
          <div className="icon blue-bg">
            <UserGroupIcon className="icon-size blue" />
          </div>
          <div>
            <h3 className="label">ผู้ป่วยทั้งหมด</h3>
            <p className="value">{stats.totalPatients}</p>
          </div>
        </div>
      </div>

      {/* กลุ่มเสี่ยงสูง */}
      <div className="stat-card">
        <div className="card-header">
          <div className="icon red-bg">
            <ExclamationCircleIcon className="icon-size red" />
          </div>
          <div>
            <h3 className="label">กลุ่มเสี่ยงสูง</h3>
            <p className="value">{stats.highRisk}</p>
          </div>
        </div>
      </div>

      {/* นัดหมายวันนี้ */}
      <div className="stat-card">
        <div className="card-header">
          <div className="icon yellow-bg">
            <CalendarIcon className="icon-size yellow" />
          </div>
          <div>
            <h3 className="label">นัดหมายวันนี้</h3>
            <p className="value">{stats.todayAppointments}</p>
          </div>
        </div>
      </div>

      {/* ✅ ผู้ใช้งานทั้งหมด */}
      <div className="stat-card">
        <div className="card-header">
          <div className="icon green-bg">
            <UserIcon className="icon-size green" />
          </div>
          <div>
            <h3 className="label">ผู้ใช้งานทั้งหมด</h3>
            <p className="value">{stats.totalUsers}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
