import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import MonacoEditorComponent from '../MonacoEditorComponent';
import IconButton from '@mui/material/IconButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import TestCases from './TestCases'; // Import the new component
import ChatBot from '../Gen_ai/Bot'; // Import the ChatBot component

const PsArea = () => {
  const [code, setCode] = useState('');
  const [fullListData, setFullListData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openItems, setOpenItems] = useState({});
  const [psDetails, setPsDetails] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript'); // Add state for selected language
  const [results, setResults] = useState([]); // Add state for results
  const [loading, setLoading] = useState(false); // Add state for loading
  const [syntaxError, setSyntaxError] = useState(null); // Add state for syntax error

  useEffect(() => {
    fetch('http://localhost:8000/api/getFullList')
      .then(response => response.json())
      .then(data => setFullListData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleToggle = (key) => {
    setOpenItems(prevState => ({ ...prevState, [key]: !prevState[key] }));
  };

  const fetchPsDetails = (id) => {
    console.log(id);
    fetch(`http://localhost:8000/api/psDetails`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    })
    .then(response => response.json())
    .then(data => {
      setPsDetails(data);
      console.log('Problem Statement Details:', data);
      // Set the code in the Monaco editor to the JavaScript code by default
      setCode(data.code.javascript);
      setTestCases(data.testCases || []);
      setResults([]); // Reset results when new problem statement is fetched
      setSyntaxError(null); // Reset syntax error when new problem statement is fetched
    })
    .catch(error => console.error('Error fetching problem statement details:', error));
  };

  const renderListItems = (items, level = 0) => {
    return items.map((item, index) => {
      const key = `${level}-${index}`;
      const isOpen = openItems[key] || false;
      const hasChildren = item.problemStatements || item.subTopic;

      return (
        <React.Fragment key={key}>
          <ListItemButton
            onClick={() => {
              handleToggle(key);
              if (!hasChildren) {
                fetchPsDetails(item.id);
              }
            }}
            sx={{ pl: level * 4 }}
          >
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={item.subTopic || item.title} />
            {hasChildren ? (isOpen ? <ExpandLess /> : <ExpandMore />) : null}
          </ListItemButton>
          {hasChildren && (
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.problemStatements
                  ? renderListItems(item.problemStatements, level + 1)
                  : renderListItems(fullListData[item.subTopic], level + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  const runCode = () => {
    console.log('Run Code button clicked'); // Add log to check if function is called
    setLoading(true); // Set loading to true when run code is clicked
    const payload = {
      code,
      language: selectedLanguage, // Include the selected language
      testCases,
    };
  
    console.log('Payload:', payload); // Print the payload to the console
  
    fetch('http://localhost:8000/api/runTests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Run Code Response:', data);
      if (data[0].error) {
        console.log("entered")
        setSyntaxError(data[0].error); // Set syntax error if present
        setResults(testCases.map(() => ({ output: '-', result: '' }))); // Set output to "-" in red for all test cases
      } else {
        setSyntaxError(null); // Clear syntax error if not present
        setResults(data); // Update results with the response from the backend
      }
      setLoading(false); // Set loading to false after receiving the response
    })
    .catch(error => {
      console.error('Error running code:', error);
      setLoading(false); // Set loading to false in case of error
    });
  };
const renderProblemStatement = () => {
  if (!psDetails) return null;

  const { title, problemStatement } = psDetails;
  const formattedProblemStatement = problemStatement
    .replace(/### /g, '\n')
    .replace(/#### /g, '\n')
    .replace(/#/g, '');

  const [statement, ...examples] = formattedProblemStatement.split(/Example \d:/);

  return (
    <div>
      <h2 style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', marginBottom: '10px' }}>{title}</h2>
      <p style={{ fontFamily: 'Georgia, serif', fontSize: '16px', lineHeight: '1.6' }}>{statement.trim()}</p>
      {examples.length > 0 && (
        <div>
          {examples.map((example, index) => {
            const [input, output] = example.split('Output:');
            return (
              <div key={index} style={{ marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', marginTop: '20px' }}>Example {index + 1}:</h3>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Input:</strong>
                  <Box component="pre" sx={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
                    {input.replace('Input:', '').trim()}
                  </Box>
                </div>
                <div>
                  <strong>Output:</strong>
                  <Box component="pre" sx={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
                    {output.trim()}
                  </Box>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
  return (
    <Box
      sx={{
        marginTop: '20px',
        display: 'grid',
        gridTemplateColumns: sidebarOpen ? '30% 1fr' : '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '20px',
        width: '90vw',
        height: '80vh',
      }}
    >
      
      {sidebarOpen && (
        <Box
          sx={{
            width: '100%',
            height: '75vh',
            overflowY: 'auto',
            borderRight: '1px solid #ccc',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            '-ms-overflow-style': 'none',  // IE and Edge
            'scrollbar-width': 'none',  // Firefox
            position: 'relative', // Ensure the close button is positioned relative to the sidebar
          }}
        >
          <IconButton
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              transform: 'translateY(0)',
              width: '50px',
              height: '50px',
              margin: '10px',
              zIndex: 1, // Ensure the button is above other elements
            }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <ChevronLeftIcon />
          </IconButton>
          <Paper elevation={3} sx={{ height: '50vh', padding: '10px', marginTop: '70px' }}>
            {psDetails ? (
              <div>
                {renderProblemStatement()}
              </div>
            ) : (
              <List
                sx={{ width: '100%', bgcolor: 'background.paper' }}
                component="nav"
              >
                {fullListData && renderListItems(Object.keys(fullListData).map(key => ({ subTopic: key, problemStatements: fullListData[key] })))}
              </List>
            )}
          </Paper>
        </Box>
      )}
      {!sidebarOpen && (
        <IconButton
          sx={{
            marginLeft:'5px',
            position: 'absolute',
            left: 0,
            top: '7%',
            transform: 'translateY(-50%)',
            width: '50px',
            height: '100%',
          }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <ChevronRightIcon />
        </IconButton>
      )}
      <Box
        sx={{
          width:'60vw',
          height: '75vh',
          marginLeft: sidebarOpen ? '0' : '40px',
        }}
      >
        <Paper elevation={3} sx={{ height: '100%',marginLeft: sidebarOpen ? '0' : '20px' }}>
          <MonacoEditorComponent code={code} setCode={setCode} psDetails={psDetails} selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
        </Paper>
      </Box>
      <Box
        sx={{
          width: sidebarOpen ? '60vw' : '30vw',
          height: '100%',
          marginLeft: sidebarOpen ? '28.5vw' : '0',
        }}
      >
        <Paper elevation={3} sx={{ height: '100%' }}>
          <Button variant="contained" color="primary" onClick={runCode} sx={{ margin: '10px' }}>
            Run Code
          </Button>
          {syntaxError && (
            <Box sx={{ color: 'red', margin: '10px', fontSize: '11.5px' }}>
              <pre><code>{syntaxError}</code></pre>
            </Box>
          )}
          <TestCases testCases={testCases} results={results} loading={loading} /> {/* Pass loading state to TestCases component */}
        </Paper>
      
        <ChatBot code={code} selectedLanguage={selectedLanguage} testCases={testCases} results={results} psDetails={psDetails} /> {/* Add the ChatBot component here */}

      </Box>
    </Box>
  );
};

export default PsArea;