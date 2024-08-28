import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import MonacoEditorComponent from '../MonacoEditorComponent';

const PsArea = () => {
  const [code, setCode] = useState('');

  return (
    <Box
      sx={{
        marginTop:'20px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '20px',
        width: '90vw',
        height: '80vh',
      }}
    >
      <Box
        sx={{
            // padding: '20px',
          width: '60vw',
          height: '75vh',
          marginLeft:'40px',
        }}
      >
        <Paper elevation={3} sx={{ height: '100%' }}>
          <MonacoEditorComponent code={code} setCode={setCode} />
        </Paper>
      </Box>
      <Box
        sx={{
          width: '100%',
          height: '100%',
        }}
      >
        <Paper elevation={3} sx={{ height: '100%' }} />
      </Box>
      <Box
        sx={{
            marginLeft:'40px',
            width: '60vw',
          height: '100%',
        }}
      >
        <Paper elevation={3} sx={{ height: '100%' }} />
      </Box>

    </Box>
  );
};

export default PsArea;