import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // Import all exports from xlsx
import '../styles/ExcelReader.css'; // Import your CSS file

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

      // Now you can access the data
      setData(jsonData);
      console.log("Imprimimos JSON")
      console.log(JSON.stringify(data))
    };
    reader.readAsArrayBuffer(selectedFile);
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
      <h2>Lector de Excel</h2>
      <input type="file" onChange={handleFileChange} />
      {data.length > 0 && (
        
        <ul>
          {data.map((item, index) => (
            // <li key={index}>{JSON.stringify(item)}</li>
            <li key={index}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      )}

      <button onClick={() => handleSaveData(data)}>Descargar datos</button>
    </div>
  );
}

export default ExcelReader;
