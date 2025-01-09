import React from 'react';
import ApplicationList from './components/ApplicationList';
import ApplicationForm from './components/ApplicationForm';

const App = () => {
  return (
    <div>
      <h1>Bewerbungstracker</h1>
      <ApplicationForm onSuccess={() => console.log('Form submitted!')} />
      <ApplicationList />
    </div>
  );
};

export default App;