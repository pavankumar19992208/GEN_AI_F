import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import { TransitionGroup } from 'react-transition-group';
import './PsUpdate.css';

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

  const deleteTestCase = (index) => {
    const newTestCases = testCases.filter((_, i) => i !== index);
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

  return (
    <div className="container">
      <div className="left-pane">
        <div className="input-group">
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
              className='selected'
              type="text"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              placeholder="Enter topic"
            />
          )}
        </div>
        <div className="input-group">
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
        <div className="input-group">
          <label>Problem Statement Title:</label>
          <input
            type="text"
            value={problemStatementTitle}
            onChange={(e) => setProblemStatementTitle(e.target.value)}
            placeholder="Enter problem statement title"
          />
        </div>
        <div className="input-group">
          <label>Problem Statement:</label>
          <textarea
            value={problemStatement}
            onChange={handleProblemStatementChange}
            style={{ width: '60%', height: '100px' }}
          />
        </div>
      </div>
      <div className="right-pane">
        <div className="editor-container">
          <div className="input-group">
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
        <div className="test-cases-container">
          <List>
            <TransitionGroup>
              {testCases.map((testCase, index) => (
                <Collapse key={index}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <div className="test-case-header">
                          <span>Test Case {index + 1}</span>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            title="Delete"
                            onClick={() => deleteTestCase(index)}
                            sx={{ color: '#FF0000', marginLeft: '12px' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      }
                      secondary={
                        <>
                          <div className="input-group">
                            <label>Input:</label>
                            <input
                              type="text"
                              value={testCase.input}
                              onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                            />
                          </div>
                          <div className="input-group">
                            <label>Expected Output:</label>
                            <input
                              type="text"
                              value={testCase.expectedOutput}
                              onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                            />
                          </div>
                        </>
                      }
                    />
                  </ListItem>
                </Collapse>
              ))}
            </TransitionGroup>
          </List>
          <div className="button-container">
            <Button sx={{ backgroundColor:'#151515', borderRadius:'12px', padding:'12px 36px' }} variant="contained" onClick={addTestCase} className="add-button">
              + Add Another Test Case
            </Button>
            <Button sx={{ backgroundColor:'#151515', marginLeft: '12px', borderRadius:'12px', padding:'12px 36px' }} variant="contained" onClick={handleSubmit} className="submit-button">
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PsUpdate;