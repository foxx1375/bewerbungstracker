import React, { useState } from 'react';
import axios from 'axios';

const UploadFile = ({ applicationId, onSuccess }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Bitte eine Datei auswählen.');
      return;
    }

    const formData = new FormData();
    formData.append('coverLetter', file);
    formData.append('applicationId', applicationId);

    try {
      await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Anschreiben erfolgreich hochgeladen!');
      onSuccess();
    } catch (error) {
      console.error('Fehler beim Hochladen:', error);
      alert('Fehler beim Hochladen der Datei.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Hochladen</button>
    </form>
  );
};

export default UploadFile;