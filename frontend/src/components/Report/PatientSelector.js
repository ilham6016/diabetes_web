import React from 'react';
import Select from 'react-select';

const PatientSelector = ({ patients, selectedId, onChange }) => {
  const patientOptions = patients.map(p => ({ value: p.Patient_ID, label: p.P_Name }));
  const selectedOption = patientOptions.find(opt => opt.value === selectedId);

  return (
    <div className="header-row">
      <Select
        className="patient-select"
        options={patientOptions}
        value={selectedOption}
        onChange={(selected) => onChange(selected.value)}
        placeholder="ค้นหาผู้ป่วย..."
        isSearchable
        noOptionsMessage={() => 'ไม่พบชื่อผู้ป่วย'}
      />
    </div>
  );
};

export default PatientSelector;