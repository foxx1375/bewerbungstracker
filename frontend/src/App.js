import React from 'react';
import ApplicationList from './components/ApplicationList';
import ApplicationForm from './components/ApplicationForm';
import './App.css';  // Stelle sicher, dass die CSS-Datei importiert wird

const App = () => {
  return (
    <div className="app-container"> {/* Um den gesamten Inhalt zentrieren */}
      <h1>Bewerbungstracker</h1>
      <ApplicationForm onSuccess={() => console.log('Form submitted!')} />
      <ApplicationList />
    </div>
  );
};

export default App;