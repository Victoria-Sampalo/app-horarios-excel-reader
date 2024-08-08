import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // Import all exports from xlsx
import '../styles/TotalDays.css'; // Import your CSS file

function TotalDays() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [employeeOccurrences, setEmployeeOccurrences] = useState([]);

  const countOccurrencesByEmployee = (data) => {
    return data.map(row => {
      const occurrences = {};

      Object.keys(row).forEach(key => {
        if (key.startsWith('__EMPTY_')) {
          const value = row[key];
          if (typeof value === 'string' && !Number.isFinite(+value)) { // Check for non-numeric values
            if (!occurrences[value]) {
              occurrences[value] = 0;
            }
            occurrences[value]++;
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

  const handleSaveData = (data) => {
    try {
      // Attempt to create a copy to avoid circular references
      const dataCopy = JSON.parse(JSON.stringify(data));

      // Option 1: Download the file as JSON
      const blob = new Blob([JSON.stringify(dataCopy)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'mis_datos.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al guardar o descargar los datos:', error);
    }
  };

  return (
    <div>
      <h2>Lector días totales</h2>
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
          <button onClick={() => handleSaveData(data)}>Descargar datos</button>
          <ul>
            {employeeOccurrences.map((entry, index) => (
              <li key={index}>
                <strong>{entry.name}</strong>
                <ul>
                  {Object.keys(entry.occurrences).map((key, subIndex) => (
                    <li key={subIndex}>
                      {key}: {entry.occurrences[key]}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* {data.length > 0 && (
        <ul>
          {data.map((item, index) => (
            <li key={index}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      )} */}
    
    </div>
  );
}

export default TotalDays;
