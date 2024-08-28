import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';

const PsUpdate = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState({ javascript: '', python: '', c: '', cpp: '', java: '' });
  const [topic, setTopic] = useState('');
  const [subTopic, setSubTopic] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [testCases, setTestCases] = useState([{ input: '', expectedOutput: '' }]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleEditorChange = (value) => {
    setCode({ ...code, [language]: value });
  };

  const handleProblemStatementChange = (event) => {
    setProblemStatement(event.target.value);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '' }]);
  };

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  const handleSubmit = async () => {
    const data = {
      topic,
      subTopic,
      problemStatement,
      code,
      testCases,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/saveData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Data saved successfully!');
      } else {
        alert('Failed to save data.');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data.');
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
      <div style={{ width: '50%', padding: '10px', overflowY: 'auto' }}>
        <div>
          <label>Topic Title:</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic"
          />
        </div>
        <div>
          <label>Sub Topic Title:</label>
          <input
            type="text"
            value={subTopic}
            onChange={(e) => setSubTopic(e.target.value)}
            placeholder="Enter sub-topic"
          />
        </div>
        <div>
          <label>Problem Statement:</label>
          <textarea
            value={problemStatement}
            onChange={handleProblemStatementChange}
            style={{ width: '100%', height: '100px' }}
          />
        </div>
      </div>
      <div style={{ width: '50%', padding: '10px', overflowY: 'auto' }}>
        <div style={{ height: '50%' }}>
          <div>
            <label>Language:</label>
            <select onChange={handleLanguageChange} value={language}>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </div>
          <Editor
            height="60vh"
            width="100%"
            language={language}
            value={code[language]}
            onChange={handleEditorChange}
            theme="vs-dark"
          />
        </div>
        <div style={{ height: '40%', marginTop: '80px', overflowY: 'auto' }}>
          {testCases.map((testCase, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <h4>Test Case {index + 1}</h4>
              <div>
                <label>Input:</label>
                <input
                  type="text"
                  value={testCase.input}
                  onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                />
              </div>
              <div>
                <label>Expected Output:</label>
                <input
                  type="text"
                  value={testCase.expectedOutput}
                  onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                />
              </div>
            </div>
          ))}
          <button onClick={addTestCase}>+ Add Another Test Case</button>
          <button onClick={handleSubmit} style={{ marginTop: '10px' }}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PsUpdate;