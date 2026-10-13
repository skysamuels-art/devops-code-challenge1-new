import React, { useEffect, useState } from 'react';
import './App.css';
import config from './config';

function App() {
  const [successMessage, setSuccessMessage] = useState('');
  const [failureMessage, setFailureMessage] = useState('');

  useEffect(() => {
    const getMessage = async () => {
      try {
        const resp = await fetch(config.backendUrl);

        if (!resp.ok) {
          throw new Error(`Backend returned HTTP ${resp.status}`);
        }

        const data = await resp.json();
        setSuccessMessage(data.message);
      } catch (e) {
        setFailureMessage(e.message);
      }
    };

    getMessage();
  }, []);

  return (
    <div className="App">
      {failureMessage || successMessage || 'Fetching...'}
    </div>
  );
}

export default App;