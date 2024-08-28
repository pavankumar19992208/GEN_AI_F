// App.js
import React from 'react';
import MonacoEditorComponent from './components/MonacoEditorComponent';
import PsUpdate from './components/PsUpdate';
import PsArea from './components/PsArea/PsArea';

const App = () => {
  return (
    <div className="App">
      {/* <h1>Monaco Editor with Multiple Languages</h1> */}
       {/* <MonacoEditorComponent /> */}
      {/* <PsUpdate /> */}
      <PsArea/>
    </div>
  );
};

export default App;