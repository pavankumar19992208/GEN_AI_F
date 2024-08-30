import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';

const PsUpdate = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState({ javascript: '', python: '', c: '', cpp: '', java: '' });
  const [listTopics, setListTopics] = useState({});
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSubTopic, setSelectedSubTopic] = useState('');
  const [problemStatementTitle, setProblemStatementTitle] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [testCases, setTestCases] = useState([{ input: '', expectedOutput: '' }]);
  const [isOtherTopic, setIsOtherTopic] = useState(false);
  const [isOtherSubTopic, setIsOtherSubTopic] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/getList');
        const data = await response.json();
        setListTopics(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
      topic: selectedTopic,
      subTopic: selectedSubTopic,
      problemStatementTitle,
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

  const handleTopicChange = (event) => {
    const value = event.target.value;
    setSelectedTopic(value);
    setIsOtherTopic(value === 'other');
    if (value !== 'other') {
      setSelectedSubTopic('');
      setIsOtherSubTopic(false);
    }
  };

  const handleSubTopicChange = (event) => {
    const value = event.target.value;
    setSelectedSubTopic(value);
    setIsOtherSubTopic(value === 'other');
  };

  const handleImportJson = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const jsonData = JSON.parse(e.target.result);
        setSelectedTopic(jsonData.topic);
        setSelectedSubTopic(jsonData.subTopic);
        setProblemStatementTitle(jsonData.problemStatementTitle);
        setProblemStatement(jsonData.problemStatement);
        setCode(jsonData.code);
        setTestCases(jsonData.testCases);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
      <div style={{ width: '50%', padding: '10px', overflowY: 'auto' }}>
        <div>
          <label>Topic Title:</label>
          <select
            value={selectedTopic}
            onChange={handleTopicChange}
          >
            <option value="">Select Topic</option>
            {Object.keys(listTopics).map((topic) => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
            <option value="other">Other</option>
          </select>
          {isOtherTopic && (
            <input
              type="text"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              placeholder="Enter topic"
            />
          )}
        </div>
        <div>
          <label>Sub Topic Title:</label>
          {isOtherSubTopic ? (
            <input
              type="text"
              value={selectedSubTopic}
              onChange={(e) => setSelectedSubTopic(e.target.value)}
              placeholder="Enter sub-topic"
            />
          ) : (
            <select
              value={selectedSubTopic}
              onChange={handleSubTopicChange}
              disabled={!selectedTopic}
            >
              <option value="">Select Sub-Topic</option>
              {selectedTopic && listTopics[selectedTopic]?.map((subTopic) => (
                <option key={subTopic} value={subTopic}>{subTopic}</option>
              ))}
              <option value="other">Other</option>
            </select>
          )}
        </div>
        <div>
          <label>Problem Statement Title:</label>
          <input
            type="text"
            value={problemStatementTitle}
            onChange={(e) => setProblemStatementTitle(e.target.value)}
            placeholder="Enter problem statement title"
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
        <div>
          <label>Import JSON File:</label>
          <input type="file" accept=".json" onChange={handleImportJson} />
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