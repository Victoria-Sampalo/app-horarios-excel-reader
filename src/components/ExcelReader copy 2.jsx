import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // Import all exports from xlsx
import '../styles/ExcelReader.css'; // Import your CSS file

function ExcelReader() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [employeeNames, setEmployeeNames] = useState([]);

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

      // Extract employee names
      const names = jsonData.map(row => row["__EMPTY"]).filter(name => name !== undefined);
      setEmployeeNames(names);
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

      // Extract employee names
      const names = jsonData.map(row => row["__EMPTY"]).filter(name => name !== undefined);
      setEmployeeNames(names);
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
      link.download = selectedSheet+'-data.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al guardar o descargar los datos:', error);
    }
  };

  return (
    <div>
      <h2>Lector de Excel</h2>
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
      {employeeNames.length > 0 && (
        <div>
          <h3>Nombres de empleados</h3>
          <ul>
            {employeeNames.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
      )}
      {data.length > 0 && (
        <ul>
          {data.map((item, index) => (
            <li key={index}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      )}
      <button onClick={() => handleSaveData(data)}>Descargar datos</button>
    </div>
  );
}

export default ExcelReader;
