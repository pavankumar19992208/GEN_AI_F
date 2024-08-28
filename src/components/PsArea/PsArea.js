import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import MonacoEditorComponent from '../MonacoEditorComponent';
import IconButton from '@mui/material/IconButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';

const PsArea = () => {
  const [code, setCode] = useState('');
  const [fullListData, setFullListData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openItems, setOpenItems] = useState({});
  const [psDetails, setPsDetails] = useState(null);
  const [testCases, setTestCases] = useState([]);

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
    fetch('http://localhost:8000/api/runcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        language: 'javascript', // Replace with the selected language
        testCases,
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Run Code Response:', data);
      // Handle the response from the backend
    })
    .catch(error => console.error('Error running code:', error));
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
      <IconButton
        sx={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '50px',
          height: '100%',
        }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <ChevronRightIcon />
      </IconButton>
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
          }}
        >
          <Paper elevation={3} sx={{ height: '100%', padding: '10px' }}>
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
      <Box
        sx={{
          width:'60vw',
          height: '75vh',
          marginLeft: sidebarOpen ? '0' : '40px',
        }}
      >
        <Paper elevation={3} sx={{ height: '100%' }}>
          <MonacoEditorComponent code={code} setCode={setCode} psDetails={psDetails} />
        </Paper>
      </Box>
      <Box
        sx={{
          width: sidebarOpen ? '60vw' : '100%',
          height: '100%',
          marginLeft: sidebarOpen ? '28.5vw' : '0',
        }}
      >
        <Paper elevation={3} sx={{ height: '100%' }}>
          <Button variant="contained" color="primary" onClick={runCode} sx={{ margin: '10px' }}>
            Run Code
          </Button>
          {testCases.map((testCase, index) => (
            <Accordion key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                Test Case {index + 1}
              </AccordionSummary>
              <AccordionDetails>
                <pre>{JSON.stringify(testCase, null, 2)}</pre>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      </Box>
    </Box>
  );
};

export default PsArea;