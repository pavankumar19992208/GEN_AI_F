import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const TestCases = ({ testCases, results, loading }) => {
  return (
    <>
      {testCases.map((testCase, index) => (
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
          >
            Test Case {index + 1}
            {loading ? (
              <CircularProgress size={20} style={{ marginLeft: '10px', color: 'green' }} />
            ) : results[index] ? (
            <span style={{ marginLeft: '10px', color: results[index]?.result === 'pass' ? 'green' : 'red' }}>
              {results[index]?.result ? results[index].result.toUpperCase() : ''}
            </span>
            ) : null}
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ marginBottom: '10px' }}>
              <strong>INPUT:</strong>
              <Box sx={{ backgroundColor: 'black', color: 'white', padding: '10px', borderRadius: '5px' }}>
                {testCase.input}
              </Box>
            </Box>
            <Box sx={{ marginBottom: '10px' }}>
              <strong>EXPECTED OUTPUT:</strong>
              <Box sx={{ backgroundColor: 'black', color: 'white', padding: '10px', borderRadius: '5px' }}>
                {testCase.expectedOutput}
              </Box>
            </Box>
            <Box sx={{ marginBottom: '10px' }}>
              <strong>OUTPUT:</strong>
              <Box sx={{ backgroundColor: 'white', color: results[index] && results[index].output === '-' ? 'red' : 'black', padding: '10px', borderRadius: '5px' }}>
                {results[index] ? results[index].output : 'Loading...'}
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default TestCases;