const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');
const agentSelect = document.getElementById('agent-select');
const resultContent = document.getElementById('result-content');
const copyBtn = document.getElementById('copy-btn');
const clearChatBtn = document.getElementById('clear-chat-btn');

// Port mapping for different agents
const agentPorts = {
    'nike-question-agent': 3000,
    'jira-test-case-agent': 3001
};

// Auto-resize textarea
userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});

// Copy to clipboard
copyBtn.addEventListener('click', async () => {
    const text = resultContent.textContent;
    if (text && text !== 'Your response will appear here...') {
        try {
            await navigator.clipboard.writeText(text);
            showToast('Copied to clipboard!');
        } catch (err) {
            showToast('Failed to copy', 'error');
        }
    }
});

// Clear chat
clearChatBtn.addEventListener('click', () => {
    chatMessages.innerHTML = '';
    addMessage('Chat cleared. Ready for new conversation!', false);
});

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: ${type === 'success' ? 'var(--success)' : 'var(--error)'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        animation: slideIn 0.3s ease-out;
        z-index: 1000;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function updateResultBox(content) {
    resultContent.classList.add('has-content');
    resultContent.innerHTML = `<pre>${content}</pre>`;
}

function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'agent-message'}`;
    
    // For agent messages, use pre tag for better formatting
    if (!isUser) {
        const pre = document.createElement('pre');
        pre.textContent = content;
        pre.style.cssText = `
            margin: 0;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            line-height: 1.6;
        `;
        messageDiv.appendChild(pre);
    } else {
        messageDiv.textContent = content;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addLoadingMessage() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.id = 'loading-message';
    loadingDiv.textContent = '🤔 Agent is thinking...';
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
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

    addMessage(message, true);
    userInput.value = '';
    userInput.style.height = 'auto';
    
    submitBtn.disabled = true;
    userInput.disabled = true;
    
    addLoadingMessage();

    try {
        const endpoint = `http://localhost:${port}/${selectedAgent}`;
        const body = selectedAgent === 'nike-question-agent'
            ? { question: message }
            : { query: message };

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
        
        let agentResponse = '';

        if (selectedAgent === 'nike-question-agent') {
            if (data.answer && data.answer.messages && data.answer.messages.length > 0) {
                const lastMessageIndex = data.answer.messages.length - 1;
                agentResponse = data.answer.messages[lastMessageIndex].kwargs.content;
            } else if (typeof data.answer === 'string') {
                agentResponse = data.answer;
            } else {
                agentResponse = JSON.stringify(data.answer, null, 2);
            }
        } else if (selectedAgent === 'jira-test-case-agent') {
            if (data.result) {
                agentResponse = typeof data.result === 'string' 
                    ? data.result 
                    : JSON.stringify(data.result, null, 2);
            } else if (data.answer) {
                agentResponse = typeof data.answer === 'string' 
                    ? data.answer 
                    : JSON.stringify(data.answer, null, 2);
            }
        }
        
        if (!agentResponse || agentResponse.trim() === '') {
            agentResponse = "No response generated. Please check the backend logs.";
        }
        
        addMessage(agentResponse, false);
        updateResultBox(agentResponse);
    } catch (error) {
        removeLoadingMessage();
        const errorMsg = `❌ Error: ${error.message}`;
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

userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Add welcome message
addMessage('👋 Welcome! Select an agent and start asking questions.', false);