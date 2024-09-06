import React, { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import { TransitionGroup } from "react-transition-group";
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { makeStyles } from '@mui/material/styles';
import "./PsUpdate.css"; // Import the CSS file

const PsUpdate = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState({
    javascript: "",
    python: "",
    c: "",
    cpp: "",
    java: "",
  });
  const [listTopics, setListTopics] = useState({});
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSubTopic, setSelectedSubTopic] = useState("");
  const [problemStatementTitle, setProblemStatementTitle] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [testCases, setTestCases] = useState([
    { input: "", expectedOutput: "" },
  ]);
  const [isOtherTopic, setIsOtherTopic] = useState(false);
  const [isOtherSubTopic, setIsOtherSubTopic] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [expandedTestCase, setExpandedTestCase] = useState(null);
  const [isTestCasesExpanded, setIsTestCasesExpanded] = useState(false);
  const [editorHeight, setEditorHeight] = useState(72); // Initial height in vh
  const [isDragging, setIsDragging] = useState(false);
  const [isHorizontalDragging, setIsHorizontalDragging] = useState(false);
  const [leftPaneWidth, setLeftPaneWidth] = useState(40); // Initial width in %

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/getList");
        const data = await response.json();
        setListTopics(data);
      } catch (error) {
        console.error("Error fetching data:", error);
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
    setTestCases([...testCases, { input: "", expectedOutput: "" }]);
  };

  const handleExpandClick = (index) => {
    setExpandedTestCase(expandedTestCase === index ? null : index);
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
      const response = await fetch("http://127.0.0.1:8000/api/saveData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Data saved successfully!");
      } else {
        alert("Failed to save data.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data.");
    }
  };

  const handleTopicChange = (event) => {
    const value = event.target.value;
    setSelectedTopic(value);
    setIsOtherTopic(value === "other");
    if (value !== "other") {
      setSelectedSubTopic("");
      setIsOtherSubTopic(false);
    }
  };

  const handleSubTopicChange = (event) => {
    const value = event.target.value;
    setSelectedSubTopic(value);
    setIsOtherSubTopic(value === "other");
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
  }, [isDragging, isHorizontalDragging]);

  

  return (
    <div className="main-container">
      <nav className="navbar">
        <div className="navbar-brand">GEN.ai</div>
      </nav>
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
              <input style={{ height: "34px" }} type="file" accept=".json" onChange={handleImportJson} />
            </div>
            <div className="form-group1">
              <label>Problem Statement:</label>
              <textarea
                value={problemStatement} onChange={handleProblemStatementChange} className="problem-statement-textarea" style={{ height: "54vh" }}
              />
            </div>
          </div>
        </div>
        <div
          className="divider-horizontal"
          onMouseDown={handleHorizontalMouseDown}
        ></div>
        <div className="right-pane">
          <div className="editor-language-container" style={{ height: `${editorHeight}vh`, marginBottom: "8px" }}>
            <div className="language">
              <select onChange={handleLanguageChange} value={language}>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
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
              height: "5px",
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
              height: `calc(100vh - ${editorHeight}vh - 64px)`, // Adjust height based on editor height
              overflow: "auto",
            }}
          >
            <div className="testcases-header">
              <div className="testcases-header-buttons">
                <button
                  className="dropdown-button"
                  onClick={() => setDropdownVisible(!dropdownVisible)}
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
                                    aria-label="expand"
                                    title="Expand"
                                    onClick={() => handleExpandClick(index)}
                                    className={`expand-icon ${expandedTestCase === index ? "expanded" : ""}`}
                                  >
                                    <ExpandMoreIcon />
                                  </IconButton>
                                  <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    title="Delete"
                                    onClick={() => deleteTestCase(index)}
                                    sx={{
                                      color: "#ff2929",
                                      marginLeft: "12px",
                                    }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </div>
                              }
                              secondary={
                                <Collapse
                                  in={expandedTestCase === index}
                                  timeout="auto"
                                  unmountOnExit
                                >
                                  <div className="input-group2">
                                    <div className="input-wrapper">
                                      <label>Input:</label>
                                      <input
                                        type="text"
                                        value={testCase.input}
                                        onChange={(e) =>
                                          handleTestCaseChange(
                                            index,
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
                                        value={testCase.expectedOutput}
                                        onChange={(e) =>
                                          handleTestCaseChange(
                                            index,
                                            "expectedOutput",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </Collapse>
                              }
                            />
                          </ListItem>
                        </Collapse>
                      ))}
                    </TransitionGroup>
                  </List>
                </div>
              )}
            </Collapse>
            <div className="fixed-buttons">
              <Button
                className="submit-button"
                onClick={handleSubmit}
                variant="contained"
                sx={{
                  backgroundColor: "#14305a",
                  borderRadius: "12px",
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