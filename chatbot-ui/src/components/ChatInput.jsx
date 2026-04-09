import React, { useState, useRef, useEffect } from "react";

const SUGGESTIONS = [
  "What courses are available?",
  "Tell me about fees",
  "Admission eligibility?",
  "Scholarship details"
];

const ChatInput = ({ onSend, onStop, loading, messages }) => {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isVoiceInput, setIsVoiceInput] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-IN"; // Set to Indian English for better accuracy

        recognitionRef.current.onresult = (event) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          // We only update if there's actual content to prevent clearing input on every result
          if (transcript) {
            setInput(transcript);
            setIsVoiceInput(true);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          
          let errorMessage = "";
          switch(event.error) {
            case 'not-allowed':
              errorMessage = "Microphone access denied. Please enable it in browser settings.";
              break;
            case 'no-speech':
              errorMessage = "No speech detected. Please try again.";
              break;
            case 'network':
              errorMessage = "Network error. Please check your connection.";
              break;
            default:
              errorMessage = `Voice input error: ${event.error}`;
          }
          if (errorMessage && event.error !== 'no-speech') alert(errorMessage);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (!recognitionRef.current) {
        alert("Speech recognition is not supported in this browser. Please try Chrome or Edge.");
        return;
      }
      
      try {
        setInput("");
        setIsVoiceInput(true);
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Recognition start error:", err);
        setIsListening(false);
      }
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSend(input, { isVoice: isVoiceInput });
    setInput("");
    setIsVoiceInput(false);
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") {
      setIsVoiceInput(false);
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-area-wrapper">
      {!loading && messages?.length < 2 && (
        <div className="suggestions">
          {SUGGESTIONS.map((s, i) => (
            <button key={i} className="suggestion-chip" onClick={() => onSend(s)}>
              {s}
            </button>
          ))}
        </div>
      )}
      <div className="input-area">
        <textarea
          ref={textareaRef}
          rows="1"
          placeholder={loading ? "Avith is thinking..." : "Message Avith..."}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setIsVoiceInput(false);
          }}
          onKeyDown={handleKeyDown}
          disabled={loading}
          autoFocus
          autoComplete="off"
        />
        {loading ? (
          <button
            onClick={onStop}
            className="stop-btn"
            aria-label="Stop generating"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          </button>
        ) : (
          <>
            <button
              onClick={toggleListening}
              className={`mic-btn ${isListening ? 'listening' : ''}`}
              aria-label="Toggle voice input"
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#C62828'}}>
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="22"></line>
                  <line x1="8" y1="2" x2="16" y2="22" stroke="#C62828" strokeWidth="2" className="slash"></line>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="22"></line>
                </svg>
              )}
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim() && !isListening}
              className="send-btn"
              aria-label="Send message"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
              </svg>
            </button>
          </>
        )}
      </div>
      <p className="input-footer">AI can make mistakes. Check important info.</p>
    </div>
  );
};

export default ChatInput;
