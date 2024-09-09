import React, { useState, useEffect } from 'react';
import './ChatBot.css';
import botIcon from '../../images/svg/boticon.png'; // Import the SVG file
import refreshIcon from '../../images/svg/refresh.png'; // Import the refresh icon
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import IconButton from '@mui/material/IconButton'; // Updated import from @mui/material

const ChatBot = ({ code, selectedLanguage, testCases, results, problemStatement }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('help');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [textareaHeight, setTextareaHeight] = useState('50px'); // Set initial height to 50px
  const [array, setArray] = useState([5, 3, 8, 1, 2]); // Example array for visualization
  const [steps, setSteps] = useState([]); // Steps for visualization

  useEffect(() => {
    if (selectedLanguage === 'javascript' && code.includes('bubbleSort')) {
      const newSteps = [];
      const arr = [...array];
      bubbleSort(arr, newSteps);
      setSteps(newSteps);
    }
  }, [code, selectedLanguage, array]);

  const bubbleSort = (arr, steps) => {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          steps.push([...arr]);
        }
      }
    }
  };

  const toggleChatBot = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      sendDataToBackend();
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, type: 'user' }]);
      setInput('');
      sendDataToBackend();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
    setTextareaHeight(event.target.scrollHeight <= 60 ? '50px' : '60px'); // Adjust height based on content
  };

  const sendDataToBackend = () => {
    const conversationHistory = messages.map(message => `${message.type === 'user' ? 'User' : 'Bot'}: ${message.text}`).join('\n');

    const data = {
      code,
      testCases,
      results,
      userInput: input,
      problemStatement,
      conversationHistory
    };

    fetch('http://localhost:8000/assist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      setMessages(prevMessages => [
        ...prevMessages,
        { text: data.response, type: 'bot' } // Assuming the response from the backend is in data.response
      ]);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      {!isOpen && (
        <div className="chatbot-icon" onClick={toggleChatBot}>
          <img src={botIcon} alt="Chat Bot Icon" className="bot-icon" /> {/* Use the SVG file */}
        </div>
      )}
      {isOpen && (
        <div className="chatbot">
          <div className="chatbot-header">
            <div className="chatbot-tabs">
              <button
                className={`tab ${activeTab === 'help' ? 'active' : ''}`}
                onClick={() => handleTabChange('help')}
              >
                Help
              </button>
              <button
                className={`tab ${activeTab === 'visualize' ? 'active' : ''}`}
                onClick={() => handleTabChange('visualize')}
              >
                Visualize
              </button>
            </div>
            <div className="header-buttons">
              <IconButton onClick={sendDataToBackend} className="refresh-button">
                <img src={refreshIcon} alt="Refresh Icon" className="refresh-icon" />
              </IconButton>
              <button className="hide-button" onClick={toggleChatBot}>
                Hide
              </button>
            </div>
          </div>
          <div className="chatbot-content">
            {activeTab === 'help' && (
              <div className="chatbot-messages">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${message.type}`}
                  >
                    {message.text}
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'visualize' && (
              <div className="visualize-content">
                <SyntaxHighlighter language={selectedLanguage} style={dark} customStyle={{ maxWidth: '33vw' }}>
                  {code}
                </SyntaxHighlighter>
                <BarChart width={300} height={150} data={array.map((val, idx) => ({ name: idx, value: val }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
                <button onClick={() => setArray(steps.shift() || array)}>Next Step</button>
              </div>
            )}
          </div>
          {activeTab === 'help' && (
            <div className="chatbot-input">
              <textarea
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                style={{ height: textareaHeight }}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBot;