import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close"; // Import Close icon
import TagFacesIcon from '@mui/icons-material/TagFaces';
import FullscreenIcon from '@mui/icons-material/Fullscreen'; // Import Fullscreen icon
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'; // Import FullscreenExit icon
import { styled } from '@mui/material/styles';
import "./PsUpdate.css"; // Import the CSS file
import NavBar from './NavBar'; // Import the Navbar component

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const PsUpdate = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState({ javascript: '', python: '', c: '', cpp: '', java: '' });
  const [listTopics, setListTopics] = useState({});
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSubTopic, setSelectedSubTopic] = useState('');
  const [problemStatementTitle, setProblemStatementTitle] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [testCases, setTestCases] = useState([{ key: 0, input: '', expectedOutput: '' }]);
  const [isOtherTopic, setIsOtherTopic] = useState(false);
  const [isOtherSubTopic, setIsOtherSubTopic] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [expandedTestCase, setExpandedTestCase] = useState(null);
  const [editorHeight, setEditorHeight] = useState(67); // Initial height in vh
  const [isDragging, setIsDragging] = useState(false);
  const [isHorizontalDragging, setIsHorizontalDragging] = useState(false);
  const [leftPaneWidth, setLeftPaneWidth] = useState(40); // Initial width in %
  const [isFullscreen, setIsFullscreen] = useState(false); // State for fullscreen mode

  useEffect(() => {
    const fetchData = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        const response = await fetch(`${backendUrl}/api/getList`);
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
    setTestCases([...testCases, { key: testCases.length, input: '', expectedOutput: '' }]);
  };

  const handleExpandClick = (index) => {
    setExpandedTestCase(expandedTestCase === index ? null : index);
  };

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  const deleteTestCase = (chipToDelete) => () => {
    setTestCases((chips) => {
      const newChips = chips.filter((chip) => chip.key !== chipToDelete.key);
      // Reset expandedTestCase if the deleted test case is the currently expanded one
      if (expandedTestCase !== null && expandedTestCase >= newChips.length) {
        setExpandedTestCase(null);
      }
      return newChips;
    });
  };

  const handleSubmit = async () => {
    const formattedTestCases = testCases.map(({ input, expectedOutput }) => ({ input, expectedOutput }));
    const data = {
      topic: selectedTopic,
      subTopic: selectedSubTopic,
      problemStatementTitle,
      problemStatement,
      code,
      testCases: formattedTestCases,
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
        setTestCases(jsonData.testCases.map((testCase, index) => ({ key: index, ...testCase })));
      };
      reader.readAsText(file);
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newHeight = Math.min(Math.max((e.clientY / window.innerHeight) * 100, 20), 80); // Constrain height between 20vh and 80vh
      setEditorHeight(newHeight);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleHorizontalMouseDown = () => {
    setIsHorizontalDragging(true);
  };

  const handleHorizontalMouseMove = (e) => {
    if (isHorizontalDragging) {
      const newWidth = (e.clientX / window.innerWidth) * 100;
      setLeftPaneWidth(newWidth);
    }
  };

  const handleHorizontalMouseUp = () => {
    setIsHorizontalDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
  
    if (isHorizontalDragging) {
      window.addEventListener("mousemove", handleHorizontalMouseMove);
      window.addEventListener("mouseup", handleHorizontalMouseUp);
    } else {
      window.removeEventListener("mousemove", handleHorizontalMouseMove);
      window.removeEventListener("mouseup", handleHorizontalMouseUp);
    }
  
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleHorizontalMouseMove);
      window.removeEventListener("mouseup", handleHorizontalMouseUp);
    };
  }, [isDragging, isHorizontalDragging, handleMouseMove, handleMouseUp, handleHorizontalMouseMove, handleHorizontalMouseUp]);
  
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
    if (dropdownVisible) {
      setExpandedTestCase(null);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  return (
    <div className="main-container">
      <NavBar /> {/* Use the Navbar component here */}
      <div className="container">
        <div className="left-pane" style={{ width: `${leftPaneWidth}%` }}>
          <div className="form-container">
            <div className="form-group1">
              <label>Topic Title:</label>
              <select value={selectedTopic} onChange={handleTopicChange}>
                <option value="">Select Topic</option>
                {Object.keys(listTopics).map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
                <option value="other">Other</option>
              </select>
              {isOtherTopic && (
                <input
                  className="selected"
                  type="text"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  placeholder="Enter topic"
                />
              )}
            </div>
            <div className="form-group1">
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
                  {selectedTopic &&
                    listTopics[selectedTopic]?.map((subTopic) => (
                      <option key={subTopic} value={subTopic}>
                        {subTopic}
                      </option>
                    ))}
                  <option value="other">Other</option>
                </select>
              )}
            </div>
            <div className="form-group1">
              <label>Problem Statement Title:</label>
              <input type="text" value={problemStatementTitle} onChange={(e) => setProblemStatementTitle(e.target.value)} placeholder="Enter problem statement title"/>
            </div>
            <div className="form-group1" >
              <label >Import JSON File:</label>
              <input style={{ height: "35px" }} type="file" accept=".json" onChange={handleImportJson} />
            </div>
            <div className="form-group1">
              <label>Problem Statement:</label>
              <div style={{ position: 'relative' }}>
                <textarea
                  value={problemStatement}
                  onChange={handleProblemStatementChange}
                  className="problem-statement-textarea"
                  style={{
                    height: isFullscreen ? "85vh" : "50vh",
                    width: isFullscreen ? "86vh" : "100%",
                    position: isFullscreen ? "fixed" : "relative",
                    top: isFullscreen ? 95 : "auto",
                    left: isFullscreen ? 8 : "auto",
                    zIndex: isFullscreen ? 1000 : "auto",
                  }}
                />
                <IconButton
                  onClick={toggleFullscreen}
                  style={{
                    position: 'absolute',
                    top: isFullscreen ? '-430px' : '8px',
                    right: isFullscreen ? '8px' : '8px',
                    zIndex: 1001,
                  }}
                >
                  {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                </IconButton>
              </div>
            </div>
          </div>
        </div>
        <div
          className="divider-horizontal"
          onMouseDown={handleHorizontalMouseDown}
        ></div>
        <div className="right-pane" style={{ width: "60%" }}>
          <div className="editor-language-container" style={{ height: `${editorHeight}vh`, marginBottom: "8px" }}>
            <div className="language" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <select onChange={handleLanguageChange} value={language}>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
              <Button
                variant="contained"
                sx={{
                 marginLeft:"12px",
                  marginRight: "16px",
                  backgroundColor: "#14305a27",
                  color:'#000',
                  height:'36px',
                  padding:'6px 20px 6px 30px ',
                  borderRadius:'8px',
                  '&:hover': {
                    backgroundColor: "#14305a",
                    color:'#fff',
                  },
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'red',
                    borderRadius: '50%',
                  }}
                ></span>
                Code
              </Button>
            </div>
           
            <Editor
              height="100%"
              width="100%"
              language={language}
              value={code[language]}
              onChange={handleEditorChange}
              theme="vs-dark"
              className="editor"
            />
          </div>
          <div
            className="divider"
            onMouseDown={handleMouseDown}
            style={{
              height: "4px",
              backgroundColor: "#ccc",
              cursor: "row-resize",
              marginBottom: "8px",
            }}
          ></div>
          <div
            className="testcases-container"
            style={{
              border: "1px solid #ccc",
              padding: "8px",
              borderRadius: "8px",
              height: `calc(100vh - ${editorHeight}vh - 30px)`, // Adjust height based on editor height
              overflow: "auto",
              backgroundColor: "#f9f9f9", // Set background color
            }}
          >
            <div className="testcases-header">
              <div className="testcases-header-buttons">
                <button
                  className="dropdown-button"
                  onClick={toggleDropdown}
                >
                  Test Cases
                </button>
                <IconButton
                  edge="end"
                  aria-label="add"
                  title="Add Test Case"
                  onClick={addTestCase}
                  className="add-icon"
                  sx={{
                    background:"#14305a",
                    color:"#fff",
                    fontWeight: '800',
                    '&:hover': {
                      color:'#000',
                      backgroundColor: "#14305a27", // Darker green on hover
                    },
                    marginLeft: "8px", // Add some margin
                    height: '31px',
                    width: '31px',
                  }}
                >
                  <AddIcon />
                </IconButton>
              </div>
            </div>
            <Collapse in={dropdownVisible}>
              {dropdownVisible && (
                <div className="dropdown-content">
                  <Paper
                    sx={{
                      display: 'flex',
                      justifyContent: 'left',
                      flexWrap: 'wrap',
                      listStyle: 'none',
                      p: 0.5,
                      m: 0,
                      boxShadow:'none',
                      backgroundColor: '#e0f7fa00', // Set background color to desired color
                    }}
                    component="ul"
                  >
                    {testCases.map((data, index) => {
                      let icon;

                      if (data.label === 'React') {
                        icon = <TagFacesIcon />;
                      }

                      return (
                        <ListItem key={data.key}>
                          <Chip
                            icon={icon}
                            label={`Test Case ${index + 1}`}
                            onDelete={deleteTestCase(data)}
                            onClick={() => handleExpandClick(index)}
                          />
                        </ListItem>
                      );
                    })}
                  </Paper>
                </div>
              )}
            </Collapse>
            {expandedTestCase !== null && (
              <div className="input-fields">
                <div className="input-group2">
                  <div className="input-wrapper">
                    <label>Input:</label>
                    <input
                      type="text"
                      value={testCases[expandedTestCase]?.input || ''}
                      onChange={(e) =>
                        handleTestCaseChange(
                          expandedTestCase,
                          "input",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                <div className="input-group2">
                  <div className="input-wrapper">
                    <label>Expected Output:</label>
                    <input
                      type="text"
                      value={testCases[expandedTestCase]?.expectedOutput || ''}
                      onChange={(e) =>
                        handleTestCaseChange(
                          expandedTestCase,
                          "expectedOutput",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="fixed-buttons">
              <Button
                className="submit-button"
                onClick={handleSubmit}
                variant="contained"
                sx={{
                  backgroundColor: "#14305a",
                  borderRadius: "8px",
                  padding: "8px",
                  width: "16%",
                }}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PsUpdate;