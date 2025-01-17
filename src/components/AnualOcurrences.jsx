import React, { useState } from 'react'; // Importa React y el hook useState
import * as XLSX from 'xlsx'; // Importa todas las exportaciones de xlsx
import '../styles/TotalDays.css'; // Importa tu archivo CSS

// Componente principal AnualOcurrences
function AnualOcurrences() {
  // Estados para manejar el archivo, datos, nombres de hojas, hoja seleccionada y ocurrencias de empleados
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [employeeOccurrences, setEmployeeOccurrences] = useState([]);
  const [anualEmployeeOccurrences, setAnualEmployeeOccurrences] = useState([]);

  

  // Función para contar las ocurrencias por empleado
  const countOccurrencesByEmployee = (data) => {
    return data.map(row => {
      const occurrences = {}; // Objeto para almacenar las ocurrencias de cada tipo

      // Itera sobre las claves de cada fila
      Object.keys(row).forEach(key => {
        if (key.startsWith('__EMPTY_')) { // Verifica si la clave es una columna vacía
          const value = row[key];
          // Verifica si el valor es una cadena y no es numérico
          if (typeof value === 'string' && !Number.isFinite(+value)) {
            if (!occurrences[value]) {
              occurrences[value] = 0; // Inicializa el contador si no existe
            }
            occurrences[value]++; // Incrementa el contador
          }
        }
      });

      return {
        name: row["__EMPTY"], // Nombre del empleado
        occurrences // Ocurrencias por este empleado
      };
    });
  };

    // Nueva función para clasificar las ocurrencias
    const classifyOccurrences = (occurrences) => {
      const classifications = {
        VACACIONES: [],
        INCAPACIDAD_TEMPORAL: [],
        DESCANSO: [],
        FESTIVO: [],
        DESCANSO_DEVUELTO: [],
        ASUNTOS_PROPIOS: [],
        DIAS_TRABAJADOS: []
      };
  
      // Letras para clasificar
      const validKeys = ['V', 'IT', 'D', 'F', 'DV', 'AP'];
  
      occurrences.forEach(employee => {
        const classifiedOccurrences = {
          name: employee.name,
          occurrences: {}
        };
  
        Object.keys(employee.occurrences).forEach(key => {
          if (validKeys.includes(key)) {
            classifiedOccurrences.occurrences[key] = employee.occurrences[key];
          } else {
            classifiedOccurrences.occurrences['DIAS_TRABAJADOS'] = 
              (classifiedOccurrences.occurrences['DIAS_TRABAJADOS'] || 0) + employee.occurrences[key];
          }
        });
  
        // Almacena el resultado clasificado
        setAnualEmployeeOccurrences(prev => [...prev, classifiedOccurrences]);
      });
    };

  // Función para manejar el cambio de archivo
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]; // Obtiene el archivo seleccionado
    setFile(selectedFile); // Establece el archivo en el estado

    const reader = new FileReader(); // Crea un nuevo lector de archivos
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result); // Lee el contenido del archivo
      const workbook = XLSX.read(data, { type: 'array' }); // Lee el libro de trabajo

      const sheetNames = workbook.SheetNames; // Obtiene los nombres de las hojas
      setSheetNames(sheetNames); // Establece los nombres de las hojas en el estado
      setSelectedSheet(sheetNames[0]); // Selecciona la primera hoja por defecto

      const worksheet = workbook.Sheets[sheetNames[0]]; // Obtiene la primera hoja
      const jsonData = XLSX.utils.sheet_to_json(worksheet); // Convierte la hoja a JSON
      setData(jsonData); // Establece los datos en el estado
    

      // Extrae los nombres de empleados y ocurrencias
      const occurrencesByEmployee = countOccurrencesByEmployee(jsonData).slice(3);
      
      setEmployeeOccurrences(occurrencesByEmployee); // Establece las ocurrencias en el estado
      //Imprime empleado - ocurrencias 
      console.log(occurrencesByEmployee)
       // Clasifica las ocurrencias
       classifyOccurrences(occurrencesByEmployee); // Llama a la función de clasificación
     
      
    };
    reader.readAsArrayBuffer(selectedFile); // Lee el archivo como un buffer
  };

  // Función para manejar el cambio de hoja
  const handleSheetChange = (event) => {
    const selectedSheet = event.target.value; // Obtiene la hoja seleccionada
    setSelectedSheet(selectedSheet); // Establece la hoja seleccionada en el estado

    const reader = new FileReader(); // Crea un nuevo lector de archivos
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result); // Lee el contenido del archivo
      const workbook = XLSX.read(data, { type: 'array' }); // Lee el libro de trabajo
      const worksheet = workbook.Sheets[selectedSheet]; // Obtiene la hoja seleccionada
      const jsonData = XLSX.utils.sheet_to_json(worksheet); // Convierte la hoja a JSON
      setData(jsonData); // Establece los datos en el estado

      // Extrae los nombres de empleados y ocurrencias
      const occurrencesByEmployee = countOccurrencesByEmployee(jsonData);
      setEmployeeOccurrences(occurrencesByEmployee); // Establece las ocurrencias en el estado
    
    };
    reader.readAsArrayBuffer(file); // Lee el archivo como un buffer
  };

  // Función para guardar los datos
  const handleSaveData = (data) => {
    console.log(data)
    try {
      // Intenta crear una copia para evitar referencias circulares
      const dataCopy = JSON.parse(JSON.stringify(data));

      // Opción 1: Descargar el archivo como JSON
      const blob = new Blob([JSON.stringify(dataCopy)], { type: 'application/json' });
      const url = URL.createObjectURL(blob); // Crea un objeto URL para el blob
      const link = document.createElement('a'); // Crea un enlace
      link.href = url; // Establece el href del enlace
      link.download = 'mis_datos.json'; // Establece el nombre del archivo a descargar
      document.body.appendChild(link); // Agrega el enlace al cuerpo del documento
      link.click(); // Simula un clic en el enlace para iniciar la descarga
      document.body.removeChild(link); // Elimina el enlace del cuerpo
    } catch (error) {
      console.error('Error al guardar o descargar los datos:', error); // Manejo de errores
    }
  };

  // Renderizado del componente
  return (
    <div>
      <h2>Lector computo anual</h2>
      <input type="file" onChange={handleFileChange} /> {/* Campo para seleccionar el archivo */}
      {sheetNames.length > 0 && (
        <div>
          <label htmlFor="sheet-select">Selecciona una hoja:</label>
          <select id="sheet-select" onChange={handleSheetChange} value={selectedSheet}>
            {sheetNames.map((name, index) => (
              <option key={index} value={name}>{name}</option> // Opciones de selección de hojas
            ))}
          </select>
        </div>
      )}
      
      {anualEmployeeOccurrences.length > 0 && (
        <div>
          <h3>Recuento Anual de Empleados</h3>
          <button onClick={() => handleSaveData(anualEmployeeOccurrences)}>Descargar datos</button> {/* Botón para descargar datos */}
          <ul>
            {anualEmployeeOccurrences.map((entry, index) => (
              <li key={index}>
                <strong>{entry.name}</strong>
                <ul>
                  {Object.keys(entry.occurrences).map((key, subIndex) => (
                    <li key={subIndex}>
                      {key}: {entry.occurrences[key]} {/* Muestra las ocurrencias por empleado */}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Sección comentada para mostrar datos en formato JSON */}
       {/* {data.length > 0 && (
        <ul>
          {data.map((item, index) => (
            <li key={index}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      )}  */}
    </div>
  );
}

export default AnualOcurrences; // Exporta el componente AnualOcurrences
