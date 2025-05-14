const db = require("../../config/db");

const AppointmentModel = {
  createAppointment: (data, callback) => {
    const query = `
      INSERT INTO appointments (Patient_ID, Appointment_Date, Appointment_Time, Reason, Status)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.execute(
      query,
      [data.Patient_ID, data.Appointment_Date, data.Appointment_Time, data.Reason, data.Status],
      callback
    );
  },
  updateStatus: (Appointment_ID, Status, callback) => {
    const query = `
      UPDATE appointments SET Status = ? WHERE Appointment_ID = ?
    `;
    db.execute(query, [Status, Appointment_ID], callback);
  },
};

module.exports = AppointmentModel;
