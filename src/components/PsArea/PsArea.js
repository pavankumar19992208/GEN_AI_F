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
import { green, lightBlue } from '@mui/material/colors';

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
            backgroundColor: 'darkcyan',
            boxShadow: '4px 4px 5px 2px grey'
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
              color: '#D2042D'
            }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            onMouseOver={({target})=>target.style.backgroundColor='lawngreen'}
            onMouseOut={({target})=>target.style.backgroundColor='transparent'}
          >
            <ChevronLeftIcon />
          </IconButton>
          <Paper elevation={3} sx={{ height: '100%', padding: '10px', marginTop: '70px', color: 'darkred'}}>
            {psDetails ? (
              <div>
                <h2>{psDetails.title}</h2>
                <p>{psDetails.problemStatement}</p>
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
            height: '50px',
            color: '#D2042D'
          }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          onMouseOver={({target})=>target.style.backgroundColor='lawngreen'}
          onMouseOut={({target})=>target.style.backgroundColor='transparent'}
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
        <Paper elevation={24} sx={{ height: '100%',marginLeft: sidebarOpen ? '0' : '20px',backgroundColor: '#132855', boxShadow: '50', perspective:'100px', boxShadow: '5px 5px 10px 2px grey'}}>
          <MonacoEditorComponent code={code} setCode={setCode} psDetails={psDetails} selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
        </Paper>
      </Box>
      <Box
        sx={{
          width: sidebarOpen ? '60vw' : '30vw',
          height: '100%',
          marginLeft: sidebarOpen ? '28.5vw' : '0',
          boxShadow: 20,
        }}
      >
        <Paper elevation={24} sx={{ height: '100%', backgroundColor: 'transparent', boxShadow: '100', perspective: '200px'}}>
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
      </Box>
    </Box>
  );
};

export default PsArea;