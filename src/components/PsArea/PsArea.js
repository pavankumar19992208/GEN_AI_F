import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import MonacoEditorComponent from '../MonacoEditorComponent';
import IconButton from '@mui/material/IconButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Button from '@mui/material/Button';
import TestCases from './TestCases'; // Import the new component
import ChatBot from '../Gen_ai/Bot'; // Import the ChatBot component
import { useLocation } from 'react-router-dom';
import Modal from '../common/Modal'; // Import the Modal component
import Lottie from 'react-lottie-player'; // Import Lottie player
import tickAnimation from '../common/json/tick.json'; // Import the tick animation
import Typography from '@mui/material/Typography';

const PsArea = () => {
  const location = useLocation();
  const { problemStatementDetails, studentDetails } = location.state;

  // Print the data received from location.state to the console
  console.log('Location State:', location.state);
  console.log('psdetails:', problemStatementDetails);

  const {
    code: initialCode = {},
    testCases: initialTestCases = [],
    title = '',
    problemStatement = '',
  } = problemStatementDetails.problemStatementDetails || {};
  const {
    topic = '',
    subTopic = ''
  } = problemStatementDetails || {};
  console.log("code:", initialCode.javascript, "testcases:", initialTestCases, "title:", title, "ps:", problemStatement);

  const [code, setCode] = useState(initialCode?.javascript || '');
  const [testCases, setTestCases] = useState(initialTestCases);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript'); // Add state for selected language
  const [results, setResults] = useState([]); // Add state for results
  const [loading, setLoading] = useState(false); // Add state for loading
  const [syntaxError, setSyntaxError] = useState(null); // Add state for syntax error
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Add state for success modal
  const [successMessage, setSuccessMessage] = useState(''); // Add state for success message

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

  const submitCode = () => {
    console.log('Submit Code button clicked'); // Add log to check if function is called
    if (results.every(result => result.result === 'pass')) {
      const payload = {
        studentDetails: {
          email: studentDetails.data.email,
          id: studentDetails.data.id,
          name: studentDetails.data.name,
          password: studentDetails.data.password
        },
        topic,
        subTopic,
        title,
        code,
        language: selectedLanguage,
      };

      console.log('Submit Payload:', payload); // Print the payload to the console

      fetch('http://localhost:8000/api/addresult', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Submit Code Response:', data);
          setSuccessMessage('Code submitted successfully!'); // Set success message
          setShowSuccessModal(true); // Show success modal
        })
        .catch(error => {
          console.error('Error submitting code:', error);
        });
    } else {
      console.log('Not all test cases passed');
    }
  };

  const renderProblemStatement = () => {
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
            {renderProblemStatement()}
          </Paper>
        </Box>
      )}
      {!sidebarOpen && (
        <IconButton
          sx={{
            marginLeft: '5px',
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
          width: '60vw',
          height: '75vh',
          marginLeft: sidebarOpen ? '0' : '40px',
        }}
      >
        <Paper elevation={3} sx={{ height: '100%', marginLeft: sidebarOpen ? '0' : '20px' }}>
          <MonacoEditorComponent code={code} setCode={setCode} psDetails={problemStatementDetails.problemStatementDetails} selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
            <Button variant="contained" color="primary" onClick={runCode}>
              Run Code
            </Button>
            <Button variant="contained" color="secondary" onClick={submitCode}>
              Submit
            </Button>
          </Box>
          {syntaxError && (
            <Box sx={{ color: 'red', margin: '10px', fontSize: '11.5px' }}>
              <pre><code>{syntaxError}</code></pre>
            </Box>
          )}
          <TestCases testCases={testCases} results={results} loading={loading} /> {/* Pass loading state to TestCases component */}
        </Paper>

        <ChatBot code={code} selectedLanguage={selectedLanguage} testCases={testCases} results={results} psDetails={problemStatementDetails.problemStatementDetails} /> {/* Add the ChatBot component here */}
      </Box>

      <Modal show={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <Box sx={{ textAlign: 'center' }}>
          <Lottie
            loop
            animationData={tickAnimation}
            play
            style={{ width: '150px', height: '150px', margin: '0 auto' }}
          />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {successMessage}
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default PsArea;