import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const Incidencias = () => {
  const [report, setReport] = useState([]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Find the "anual" sheet
      const sheetName = workbook.SheetNames.find(name => name.toLowerCase() === 'anual');
      if (!sheetName) {
        console.error('No se encontró la pestaña "anual".');
        return;
      }
      
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Process the data
      processSheetData(jsonData);
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const processSheetData = (data) => {
    const headers = data[0];
    const rows = data.slice(1);

    const startIdx = headers.indexOf('ENERO');
    const endIdx = headers.indexOf('DICIEMBRE');
    
    if (startIdx === -1 || endIdx === -1) {
      console.error('No se encontraron las columnas de fecha.');
      return;
    }

    const report = rows.map(row => {
      const name = row[0];
      const values = row.slice(startIdx, endIdx + 1);
      const counts = { P6: 0, P7: 0, P8: 0, P9: 0, P10: 0 };

      values.forEach(value => {
        if (typeof value === 'string') {
          if (value === 'P6') counts.P6++;
          else if (value === 'P7') counts.P7++;
          else if (value === 'P8') counts.P8++;
          else if (value === 'P9') counts.P9++;
          else if (value === 'P10') counts.P10++;
        }
      });

      return { name, counts };
    });

    setReport(report);
  };

  return (
    <div>
      <h2>Incidencias</h2>
      <input type="file" accept=".xlsx" onChange={handleFileChange} />
      <div>
        <h3>Reporte de Incidencias</h3>
        {report.length > 0 && (
          <ul>
            {report.map((entry, index) => (
              <li key={index}>
                <strong>{entry.name}</strong>
                <ul>
                  <li>P6: {entry.counts.P6}</li>
                  <li>P7: {entry.counts.P7}</li>
                  <li>P8: {entry.counts.P8}</li>
                  <li>P9: {entry.counts.P9}</li>
                  <li>P10: {entry.counts.P10}</li>
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Incidencias;
