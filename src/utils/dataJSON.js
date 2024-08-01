import fs from 'fs';

export function saveDataToJSON(data, filenamePrefix = 'data') {
  const date = new Date();
  const formattedDate = date.toISOString().replace(/:/g, '-').replace(/\./g, '-');
  const filename = `${filenamePrefix}_${formattedDate}.json`;
  const filePath = './data/${filename}'; // Ajusta la ruta según tu preferencia

  const jsonString = JSON.stringify(data);

  fs.writeFile(filePath, jsonString, (err) => {
    if (err) {
      console.error('Error al guardar el archivo:', err);
    } else {
      console.log(`Archivo guardado correctamente: ${filename}`);
    }
  });
}
