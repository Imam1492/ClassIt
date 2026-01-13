import '../css/chatbot.css';

document.addEventListener("DOMContentLoaded", () => {
    // --- 1. HTML INJECTION (The "Self-Install" Logic) ---
    // If the chatbot HTML isn't on the page, we create it right here.
    if (!document.getElementById("chatbotToggle")) {
        const chatbotHTML = `
          <div id="chatbotToggle" aria-label="Open Chatbot">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
          </div>
          <div id="chatbotWindow" class="hidden">
            <div id="chatbotHeader">
              <span>ClassIt AI</span>
              <button id="chatbotClose">&times;</button>
            </div>
            <div id="chatbotMessages"></div>
            <div id="chatbotInputArea">
              <input id="chatbotInput" type="text" placeholder="Ask me anything..." />
              <button id="chatbotSend">➤</button>
            </div>
          </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    // --- 2. SELECTORS ---
    const chatbotToggle = document.getElementById("chatbotToggle");
    const chatbotWindow = document.getElementById("chatbotWindow");
    const closeChatbot = document.getElementById("chatbotClose");
    const chatLog = document.getElementById("chatbotMessages");
    const userInput = document.getElementById("chatbotInput");
    const sendBtn = document.getElementById("chatbotSend");

    // --- 3. STATE ---
    let hasGreeted = false; 
    const fallbackResponse = "I can only help with questions about ClassIt's products, how it works, and contact info.";

    // --- 4. KNOWLEDGE BASE ---
    const knowledgeBase = [
        { keywords: ["hi", "hello", "hey"], response: "Hi there! 👋" },
        { keywords: ["how are you"], response: "I am just a bot, but I'm doing great!" },
        { keywords: ["contact", "help"], response: "You can reach us via the Contact Us page." },
        { keywords: ["products", "buy"], response: "We curate the best tech and lifestyle products." },
        { keywords: ["shipping", "delivery"], response: "Shipping is handled by Amazon/Flipkart." },
        { keywords: ["thanks"], response: "You're welcome! 😊" }
    ];

    // --- 5. FUNCTIONS ---
    const toggleChatbotWindow = () => {
        chatbotWindow.classList.toggle("hidden");
        // Auto-greet on first open
        if (!chatbotWindow.classList.contains("hidden") && !hasGreeted) {
            hasGreeted = true;
            setTimeout(() => {
                addMessage("bot", "Hello! 👋 I am ClassIt's AI. How can I help you?");
            }, 500);
        }
    };

    function addMessage(role, text) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `msg ${role}`;
        msgDiv.textContent = text;
        chatLog.appendChild(msgDiv);
        chatLog.scrollTop = chatLog.scrollHeight; 
    }

    function handleUserMessage() {
        const userText = userInput.value.trim();
        if (!userText) return;

        addMessage("user", userText);
        userInput.value = "";
        
        // Simple Search
        let botResponse = fallbackResponse;
        const inputLower = userText.toLowerCase();
        
        for (const entry of knowledgeBase) {
            if (entry.keywords.some(k => inputLower.includes(k))) {
                botResponse = entry.response;
                break;
            }
        }

        setTimeout(() => addMessage("bot", botResponse), 600);
    }

    // --- 6. EVENT LISTENERS ---
    if(sendBtn) sendBtn.addEventListener("click", handleUserMessage);
    if(chatbotToggle) chatbotToggle.addEventListener("click", toggleChatbotWindow);
    
    if(userInput) {
        userInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") handleUserMessage();
        });
    }

    if (closeChatbot) {
        closeChatbot.addEventListener('click', (e) => {
            e.stopPropagation();
            chatbotWindow.classList.add('hidden');
        });
    }

    // Close on outside click
    document.addEventListener('pointerdown', (event) => {
        if (!chatbotWindow || chatbotWindow.classList.contains('hidden')) return;
        const clickedInside = chatbotWindow.contains(event.target);
        const clickedToggle = chatbotToggle && chatbotToggle.contains(event.target);
        if (!clickedInside && !clickedToggle) {
            chatbotWindow.classList.add('hidden');
        }
    });
});