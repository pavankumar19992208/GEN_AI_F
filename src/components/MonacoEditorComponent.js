import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';

const MonacoEditorComponent = ({ code, setCode, psDetails }) => {
  const [language, setLanguage] = useState('javascript');

  useEffect(() => {
    if (psDetails) {
      setCode(psDetails.code[language]);
    }
  }, [language, psDetails, setCode]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <select
        onChange={handleLanguageChange}
        value={language}
        style={{ marginBottom: '10px', marginTop: '15px' }}
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="c">C</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
      </select>
      <Editor
        height="65vh"
        width="95%"
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
    </div>
  );
};

export default MonacoEditorComponent;