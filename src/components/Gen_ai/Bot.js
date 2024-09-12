import React, { useState, useEffect, useRef } from 'react';
import './ChatBot.css';
import botIcon from '../../images/svg/boticon.png'; // Import the SVG file
import refreshIcon from '../../images/svg/refresh.png'; // Import the refresh icon
import { FaMicrophone, FaVolumeUp, FaStop } from 'react-icons/fa'; // Import mic, speaker, and stop icons from react-icons
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import IconButton from '@mui/material/IconButton'; // Updated import from @mui/material
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; // Import SyntaxHighlighter
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Import a syntax highlighting style

const ChatBot = ({ code, selectedLanguage, testCases, results, problemStatement }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('help');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [textareaHeight, setTextareaHeight] = useState('50px'); // Set initial height to 50px
  const [array, setArray] = useState([5, 3, 8, 1, 2]); // Example array for visualization
  const [steps, setSteps] = useState([]); // Steps for visualization
  const [feedback, setFeedback] = useState(''); // State to store feedback message
  const [showFeedback, setShowFeedback] = useState(false); // State to control feedback popup
  const [isSpeaking, setIsSpeaking] = useState(false); // State to control speaking
  const [isLoading, setIsLoading] = useState(false); // State to control loading animation
  const [isMicLoading, setIsMicLoading] = useState(false); // State to control mic loading animation
  const messagesEndRef = useRef(null); // Ref to scroll to the latest message

  useEffect(() => {
    if (selectedLanguage === 'javascript' && code.includes('bubbleSort')) {
      const newSteps = [];
      const arr = [...array];
      bubbleSort(arr, newSteps);
      setSteps(newSteps);
    }
  }, [code, selectedLanguage, array]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      setIsLoading(true);
      setMessages([...messages, { text: input, type: 'user' }, { type: 'loading' }]);
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
      const [question, feedback] = data.response.split('Feedback:');
      const formattedQuestion = question.replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>').replace(/##/g, '');
      setMessages(prevMessages => [
        ...prevMessages.slice(0, -1), // Remove the loading message
        { text: formattedQuestion.trim(), type: 'bot', feedback: feedback ? feedback.trim() : "" } // Assuming the response from the backend is in data.response
      ]);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error('Error:', error);
      setIsLoading(false);
    });
  };

  const handleFeedbackClick = (feedback) => {
    setFeedback(feedback);
    setShowFeedback(true);
  };

  const closeFeedbackPopup = () => {
    setShowFeedback(false);
  };

  const startSpeechRecognition = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => {
      setIsMicLoading(true);
    };
    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setInput(speechToText);
      setIsMicLoading(false);
    };
    recognition.onerror = () => {
      setIsMicLoading(false);
    };
    recognition.start();
  };

  const speakText = (text) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
              <IconButton onClick={() => speakText(messages[messages.length - 1]?.text)} className="speaker-button">
                {isSpeaking ? <FaStop className="speaker-icon" /> : <FaVolumeUp className="speaker-icon" />}
              </IconButton>
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
                  <div key={index} className={`message ${message.type}`}>
                    {message.type === 'bot' ? (
                      <div>
                        <div className="tutor-title">TUTOR</div>
                        <div className="tutor-question" dangerouslySetInnerHTML={{ __html: message.text }} />
                        {message.feedback && (
                          <button
                            className="feedback-button"
                            onClick={() => handleFeedbackClick(message.feedback)}
                          >
                            Show Feedback
                          </button>
                        )}
                      </div>
                    ) : message.type === 'loading' ? (
                      <div className="loading-dots">
                        <span>.</span><span>.</span><span>.</span><span>.</span>
                      </div>
                    ) : (
                      message.text
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
            {activeTab === 'visualize' && (
              <div className="visualize-content">
                <SyntaxHighlighter language={selectedLanguage} style={solarizedlight}>
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
              <IconButton onClick={startSpeechRecognition} className="mic-button">
                {isMicLoading ? (
                  <div className="loading-dots">
                    <span>.</span><span>.</span><span>.</span><span>.</span>
                  </div>
                ) : (
                  <FaMicrophone className="mic-icon" />
                )}
              </IconButton>
              <button onClick={handleSendMessage}>Send</button>
            </div>
          )}
        </div>
      )}
      {showFeedback && (
        <div className="feedback-popup">
          <div className="feedback-content">
            <button className="close-feedback" onClick={closeFeedbackPopup}>X</button>
            <IconButton onClick={() => speakText(feedback)} className="speaker-button">
              <FaVolumeUp className="speaker-icon" />
            </IconButton>
            <div className="feedback-text">
              {feedback}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;