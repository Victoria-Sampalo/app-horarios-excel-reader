import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // Import all exports from xlsx

function ExcelReader() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' }); // Read file as an array of bytes

      // Get the first sheet (change this if you have multiple sheets)
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert sheet to a JSON object
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Now you can access the data and save it to localStorage
      setData(jsonData);
      handleSaveData(jsonData); // Call handleSaveData function
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleSaveData = (data) => {
    // Save data to localStorage using JSON.stringify
    localStorage.setItem('excelData', JSON.stringify(data));
    console.log('Datos guardados en localStorage'); // Inform user about successful save
  };

  return (
    <div>
      <h2>Lector de Excel</h2>
      <input type="file" onChange={handleFileChange} />
      {data.length > 0 && (
        <ul>
          {data.map((item, index) => (
            <li key={index}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      )}
      <button onClick={handleSaveData}>Guardar datos</button>
    </div>
  );
}

export default ExcelReader;
