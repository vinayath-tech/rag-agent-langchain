const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

// Function to add a message to the chat box
function addMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.className = sender;
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}

// Handle the send button click
sendButton.addEventListener("click", async () => {
    const question = userInput.value.trim();
    if (!question) return;

    // Add user's message to the chat
    addMessage("user", question);
    userInput.value = "";

    try {
        // Send the question to the backend
        const response = await fetch("/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ question }),
        });

        const data = await response.json();

        // Add the agent's response to the chat
        if (data.answer) {
            let totMessage = data.answer.messages.length - 1;
            addMessage("agent", data.answer.messages[totMessage].kwargs.content);
        } else {
            addMessage("agent", "Sorry, I couldn't understand that.");
        }
    } catch (error) {
        console.error("Error:", error);
        addMessage("agent", "An error occurred. Please try again.");
    }
});