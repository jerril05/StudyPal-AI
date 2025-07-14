import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState('summary');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleModeChange = (e) => setMode(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please upload a PDF');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', mode);

    setLoading(true);
    setOutput('');

    try {
      const res = await axios.post('http://127.0.0.1:5000/generate', formData);
      setOutput(res.data.result);
    } catch (err) {
      setOutput('Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ padding: 20 }}>
      <h2>📘 StudyPal AI</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <select value={mode} onChange={handleModeChange}>
          <option value="summary">Summarize</option>
          <option value="explain">Explain Simply</option>
          <option value="flashcards">Flashcards</option>
        </select>
        <button type="submit">Generate</button>
      </form>

      {loading && <p>Generating...</p>}
      {output && (
        <div style={{ whiteSpace: 'pre-wrap', marginTop: 20 }}>
          <h3>Result:</h3>
          <p>{output}</p>
        </div>
      )}
    </div>
  );
}

export default App;
