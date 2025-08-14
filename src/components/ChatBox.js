import '../chatbox.css'
import { useRef, useState } from 'react';

const ChatBox = ({chatHistory, setChatHistory}) => {
    const inpRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    
    // Get API key from environment variables
    const API_KEY = "AIzaSyBFFJ-l_m1-vmJVDUGtIOK94IZhH6-Ltr8";

    // Function to format AI responses with proper HTML
    const formatAIResponse = (text) => {
        if (!text) return '';
        
        // Convert markdown-style formatting to HTML
        let formatted = text
            // Convert **bold** to <strong>
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Convert *italic* to <em>
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Convert _italic_ to <em> (alternative markdown)
            .replace(/_(.*?)_/g, '<em>$1</em>')
            // Convert ***bold italic*** to <strong><em>
            .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
            // Convert `code` to <code>
            .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>')
            // Convert numbered lists (1. 2. 3.)
            .replace(/^(\d+\.\s+)(.+)$/gm, '<li class="numbered-item">$2</li>')
            // Convert bullet points (- or *)
            .replace(/^[-*]\s+(.+)$/gm, '<li class="bullet-item">$1</li>')
            // Convert line breaks to <br>
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
        
        // Wrap consecutive <li> items in appropriate lists
        formatted = formatted
            .replace(/(<li class="numbered-item">.*?<\/li>)/gs, (match) => {
                const items = match.match(/<li class="numbered-item">(.*?)<\/li>/g);
                if (items && items.length > 1) {
                    return '<ol class="ai-numbered-list">' + match.replace(/class="numbered-item"/g, '') + '</ol>';
                }
                return '<ol class="ai-numbered-list">' + match.replace(/class="numbered-item"/g, '') + '</ol>';
            })
            .replace(/(<li class="bullet-item">.*?<\/li>)/gs, (match) => {
                const items = match.match(/<li class="bullet-item">(.*?)<\/li>/g);
                if (items && items.length > 1) {
                    return '<ul class="ai-bullet-list">' + match.replace(/class="bullet-item"/g, '') + '</ul>';
                }
                return '<ul class="ai-bullet-list">' + match.replace(/class="bullet-item"/g, '') + '</ul>';
            });
        
        // Wrap in paragraphs if not already wrapped
        if (!formatted.includes('<p>') && !formatted.includes('<li>')) {
            formatted = '<p>' + formatted + '</p>';
        }
        
        return formatted;
    };

    const generateResponse = async (userMessage) => {
        if (!API_KEY) {
            return "Please add your Gemini API key to your .env file as REACT_APP_GEMINI_API_KEY to enable AI responses.";
        }

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
        
        // Create a medical-focused prompt
        const medicalPrompt = `You are a helpful AI health assistant. Keep your response under 250 words. The user is asking about: "${userMessage}". 

Please provide helpful health information while being clear that:
1. You are not a doctor and cannot provide medical diagnosis
2. For serious concerns, they should consult a healthcare professional
3. This is for informational purposes only

Respond in a friendly, helpful manner with relevant health information. Keep it concise and complete.`;

        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: medicalPrompt
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000, // Further reduced to ensure complete responses
                topP: 0.9,
                topK: 40,
                stopSequences: [] // Ensure no premature stopping
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_NONE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH", 
                    threshold: "BLOCK_NONE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_NONE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_NONE"
                }
            ]
        };

        try {
            console.log('Sending request to Gemini API...');
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
                signal: AbortSignal.timeout(15000) // 15 second timeout
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error Response:', errorData);
                
                if (response.status === 429) {
                    return "I'm receiving too many requests right now. Please wait a moment and try again.";
                } else if (response.status === 403) {
                    return "There seems to be an authentication issue. Please check the API key configuration.";
                } else if (response.status === 400) {
                    return "There was an issue with the request format. Please try rephrasing your question.";
                }
                
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Full API response:', data);
            
            // Extract the generated text from Gemini response
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
                const responseText = data.candidates[0].content.parts[0].text;
                console.log('Extracted response text:', responseText);
                
                if (!responseText || responseText.trim() === '') {
                    return "I received an empty response. Please try asking your question again.";
                }
                
                return responseText;
            } else if (data.candidates && data.candidates[0] && data.candidates[0].finishReason) {
                console.log('Response finish reason:', data.candidates[0].finishReason);
                if (data.candidates[0].finishReason === 'SAFETY') {
                    return "I'm sorry, but I cannot provide a response to that particular query due to safety guidelines. Please try rephrasing your health question.";
                } else if (data.candidates[0].finishReason === 'MAX_TOKENS') {
                    return "My response was cut short due to length limits. Please ask a more specific question, and I'll provide a more focused answer.";
                }
            }
            
            console.error('Unexpected response format:', data);
            throw new Error('Unexpected response format from Gemini API');
        } catch (error) {
            if (error.name === 'TimeoutError') {
                console.error('Request timeout:', error);
                return "The request timed out. Please try again with a shorter question.";
            }
            console.error('Error generating response:', error);
            return "I'm sorry, I'm having trouble connecting right now. Please try again later or consult with a healthcare professional for medical concerns.";
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const userMessage = inpRef.current.value.trim();
        if (!userMessage) return;
        
        // Clear input
        inpRef.current.value = "";
        
        // Add user message to chat
        setChatHistory((history) => [...history, { role: "user", text: userMessage}]);
        
        // Set loading state
        setIsLoading(true);
        
        // Add typing indicator
        setChatHistory((history) => [...history, { role: "bot", text: "typing", isTyping: true}]);
        
        try {
            // Generate AI response
            const aiResponse = await generateResponse(userMessage);
            
            // Remove typing indicator and add actual response
            setChatHistory((history) => {
                const updatedHistory = history.filter(msg => !msg.isTyping);
                return [...updatedHistory, { role: "bot", text: aiResponse}];
            });
        } catch (error) {
            // Remove typing indicator and add error message
            setChatHistory((history) => {
                const updatedHistory = history.filter(msg => !msg.isTyping);
                return [...updatedHistory, { 
                    role: "bot", 
                    text: "I apologize, but I'm experiencing technical difficulties. Please try again later."
                }];
            });
        } finally {
            setIsLoading(false);
        }
    }

    return(
        <div className="chat-container">
            <div className="chat-header">
                <h1>Your Virtual AI Health Check</h1>
            </div>
            <div className="chat-body">
                {chatHistory.map((message, index) => (
                    <div key={index} className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}>
                        {message.isTyping ? (
                            <div className="typing-indicator">
                                <span>AI is thinking</span>
                                <div className="typing-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        ) : (
                            <div className="message-text" 
                                 dangerouslySetInnerHTML={{
                                     __html: formatAIResponse(message.text)
                                 }}>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="chat-footer">
                <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
                    <input 
                        ref={inpRef} 
                        type="text" 
                        placeholder="Describe your symptoms or health concerns..." 
                        className="message-input" 
                        required
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        className="material-symbols-outlined"
                        disabled={isLoading}
                    >
                        {isLoading ? 'hourglass_empty' : 'arrow_upward'}
                    </button>
                </form>
            </div>
        </div>
    )
};

export default ChatBox;