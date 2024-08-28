// MonacoEditorComponent.js
import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';

const MonacoEditorComponent = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const runCode = () => {

  };

  return (
    <div>
      <select
        onChange={handleLanguageChange}
        value={language}
        style={{ marginBottom: '10px' }}
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="c">C</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
      </select>
      <Editor
        height="60vh"
        width="50%"
        language={language}
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: true },
          lineNumbers: 'on',
          folding: true,
          automaticLayout: true,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          wordBasedSuggestions: true,
          parameterHints: true,
          formatOnType: true,
          formatOnPaste: true,
          snippetSuggestions: 'top',
          tabCompletion: 'on',
          acceptSuggestionOnEnter: 'on',
          acceptSuggestionOnCommitCharacter: true,
          cursorBlinking: 'blink',
          cursorSmoothCaretAnimation: 'on',
          cursorStyle: 'line',
          cursorWidth: 2,
          renderWhitespace: 'all',
          renderControlCharacters: true,
          renderIndentGuides: true,
          renderLineHighlight: 'all',
          renderValidationDecorations: 'on',
          scrollBeyondLastLine: true,
          smoothScrolling: true,
          mouseWheelZoom: true,
          find: {
            addExtraSpaceOnTop: true,
            autoFindInSelection: 'always',
            seedSearchStringFromSelection: 'always',
          },
        }}
      />
      <button onClick={runCode} style={{ marginTop: '10px' }}>
        Run Code
      </button>
      <div style={{ marginTop: '10px', whiteSpace: 'pre-wrap' }}>
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default MonacoEditorComponent;