const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');
const agentSelect = document.getElementById('agent-select');
const resultContent = document.getElementById('result-content');

// Port mapping for different agents
const agentPorts = {
    'nike-question-agent': 3000,
    'jira-test-case-agent': 3001
};

function updateResultBox(content) {
    resultContent.classList.add('has-content');
    resultContent.innerHTML = `<p>${content}</p>`;
}

function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'agent-message'}`;
    messageDiv.textContent = content;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addLoadingMessage() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.id = 'loading-message';
    loadingDiv.textContent = 'Agent is thinking...';
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Also update result box
    updateResultBox('Agent is thinking...');
}

function removeLoadingMessage() {
    const loadingDiv = document.getElementById('loading-message');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    const selectedAgent = agentSelect.value;
    const port = agentPorts[selectedAgent];

    // Add user message to chat
    addMessage(message, true);
    userInput.value = '';
    
    // Disable input while processing
    submitBtn.disabled = true;
    userInput.disabled = true;
    
    addLoadingMessage();

    try {
        const endpoint = `http://localhost:${port}/${selectedAgent}`;
        
        // Create the correct request body based on agent type
        const body = selectedAgent === 'nike-question-agent'
            ? { question: message }
            : { query: message };

        console.log('Sending request to:', endpoint);
        console.log('Request body:', body);

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        removeLoadingMessage();

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data);

        // Add the agent's response to the chat
        if (data.answer) {
            let totMessage = data.answer.messages.length - 1;
            const agentResponse = data.answer.messages[totMessage].kwargs.content;
            
            // Add to chat messages (false = agent message, not user message)
            addMessage(agentResponse, false);
            // Also update result box
            updateResultBox(agentResponse);
        } else {
            addMessage("agent", "Sorry, I couldn't understand that.");
        }
        
        const result = data.answer || data.result || 'No response from agent';
        
        // Update both chat and result box
        // addMessage(result, false);
        // updateResultBox(result);
    } catch (error) {
        removeLoadingMessage();
        const errorMsg = `Error: ${error.message}. Make sure the ${selectedAgent} is running on port ${port}.`;
        addMessage(errorMsg, false);
        updateResultBox(errorMsg);
        console.error('Error:', error);
    } finally {
        submitBtn.disabled = false;
        userInput.disabled = false;
        userInput.focus();
    }
}

// Event listeners
submitBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Add welcome message
addMessage('Welcome! Select an agent and start asking questions.', false);