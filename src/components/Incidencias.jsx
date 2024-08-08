import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import '../styles/TotalDays.css'; // Import your CSS file

function Incidencias() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [employeeOccurrences, setEmployeeOccurrences] = useState([]);

  const countOccurrencesByEmployee = (data) => {
    return data.map(row => {
      const occurrences = {
        daysNotWorked: 0,
        daysWorked: 0,
        nightShiftDays: 0,
      };

      const nightShifts = ['P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13', 'P15'];

      Object.keys(row).forEach(key => {
        if (key.startsWith('__EMPTY_')) {
          const value = row[key];
          if (typeof value === 'string') {
            if (value === 'D' || value === 'F' || value === 'V' || value === 'DV'  || value === 'PR'|| value === 'AP' || value === 'IT') {
              occurrences.daysNotWorked++;
            } else {
              occurrences.daysWorked++;
              if (nightShifts.includes(value)) {
                occurrences.nightShiftDays++;
              }
            }
          }
        }
      });

      return {
        name: row["__EMPTY"], // Employee name
        occurrences // Occurrences by this employee
      };
    });
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetNames = workbook.SheetNames;
      setSheetNames(sheetNames);
      setSelectedSheet(sheetNames[0]);

      const worksheet = workbook.Sheets[sheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData);

      // Extract employee names and occurrences
      const occurrencesByEmployee = countOccurrencesByEmployee(jsonData);
      setEmployeeOccurrences(occurrencesByEmployee);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleSheetChange = (event) => {
    const selectedSheet = event.target.value;
    setSelectedSheet(selectedSheet);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[selectedSheet];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData);

      // Extract employee names and occurrences
      const occurrencesByEmployee = countOccurrencesByEmployee(jsonData);
      setEmployeeOccurrences(occurrencesByEmployee);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDownload = () => {
    const wsData = [
      ["NOMBRES Y APELLIDOS", "DÍAS TRABAJADOS", "DÍAS NOCTURNIDAD", "HORAS NOCTURNIDAD"],
      ...employeeOccurrences.map(entry => [
        entry.name,
        entry.occurrences.daysWorked,
        entry.occurrences.nightShiftDays,
        entry.occurrences.nightShiftDays * 1.5
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Incidencias');

    XLSX.writeFile(wb, 'incidencias.xlsx');
  };

  return (
    <div>
      <h2>Incidencias</h2>
      <input type="file" onChange={handleFileChange} />
      {sheetNames.length > 0 && (
        <div>
          <label htmlFor="sheet-select">Selecciona una hoja:</label>
          <select id="sheet-select" onChange={handleSheetChange} value={selectedSheet}>
            {sheetNames.map((name, index) => (
              <option key={index} value={name}>{name}</option>
            ))}
          </select>
        </div>
      )}
      {employeeOccurrences.length > 0 && (
        <div>
          <h3>Detalles de Empleados</h3>
          <button onClick={handleDownload}>Descargar Excel</button>
          <ul>
            {employeeOccurrences.map((entry, index) => (
              <li key={index}>
                <strong>{entry.name}</strong>
                <ul>
                  <li>Días No Trabajados: {entry.occurrences.daysNotWorked}</li>
                  <li>Días Trabajados: {entry.occurrences.daysWorked}</li>
                  <li>Días de Nocturnidad: {entry.occurrences.nightShiftDays}</li>
                  <li>Horas Nocturnidad: {entry.occurrences.nightShiftDays * 1.5}</li>
                </ul>
              </li>
            ))}
          </ul>
        
        </div>
      )}
    </div>
  );
}

export default Incidencias;
