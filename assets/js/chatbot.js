document.addEventListener("DOMContentLoaded", () => {
    // --- SELECTORS ---
    const chatbotToggle = document.getElementById("chatbotToggle");
    const chatbotWindow = document.getElementById("chatbotWindow");
    const closeChatbot = document.getElementById("chatbotClose");
    const chatLog = document.getElementById("chatbotMessages");
    const userInput = document.getElementById("chatbotInput");
    const sendBtn = document.getElementById("chatbotSend");

    // --- STATE ---
    let hasGreeted = false; // Tracks if the bot has said hello yet
    const fallbackResponse = "I can only help with questions about ClassIt's products, how it works, and contact info.";

    // --- KNOWLEDGE BASE ---
    const knowledgeBase = [
        {
            keywords: ["hi", "hello", "hey"],
            response: "Hi there! 👋"
        },
        {
            keywords: ["hi how are u", "hello how are you", "hey how r u", "how r u", "how are you", "how are u"],
            response: "Hi I am good! , What about you?"
        },
        {
            keywords: ["I am fine", "I am good", "I am great", "iam good", "iam great", "iam fine"],
            response: "Nice, how may i help you today?"
        },
        {
            keywords: ["how are you", "how r u", "how ru"],
            response: "I am an AI chatbot, yet I am good."
        },
        {
            keywords: ["time"],
            response: () => {
                const now = new Date();
                const timeString = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
                return `The current time is ${timeString}.`;
            }
        },
        {
            keywords: ["date"],
            response: () => {
                const now = new Date();
                const dateString = now.toLocaleDateString([], { year: "numeric", month: "long", day: "numeric" });
                return `Today's date is ${dateString}.`;
            }
        },
        {
            keywords: ["day"],
            response: () => {
                const now = new Date();
                const dayString = now.toLocaleDateString([], { weekday: "long" });
                return `Today is ${dayString}.`;
            }
        },
        {
            keywords: ["founder", "owner"],
            response: "ClassIt was founded by A.I.M."
        },
        {
            keywords: ["who are you"],
            response: "I am ClassIt's Smart AI assistant."
        },
        {
            keywords: ["about", "ClassIt"],
            response: "ClassIt is a site that shares high-quality, personally-vetted products in Livogue, wellfit, and Tech."
        },
        {
            keywords: ["contact", "email", "get in touch", "help", "support"],
            response: "You can reach us through the 'Contact Us' page for any inquiries."
        },
        {
            keywords: ["how", "work", "buy", "purchase"],
            response: "We are an intermediate site that helps you purchase perfect products."
        },
        {
            keywords: ["categories", "products", "sell", "Livogue", "wellfit", "tech"],
            response: "We feature curated products in Livogue, wellfit, and Tech. Which are you most interested in?"
        },
        {
            keywords: ["delivery", "delivary", "delievery", "delevery", "deliverey",
                "shipping", "shiping", "shippin", "shpping",
                "shipment", "shippment", "shipmant", "shipmnet"],
            response: "All deliveries are handled by the platforms like Amazon/Flipkart as per their standards. ClassIt is not involved in shipping."
        },
        {
            keywords: ["defect", "damaged", "wrong order"],
            response: "If you get a damaged or wrong item, contact the support of the site you ordered from with photos. They’ll provide a solution."
        },
        {
            keywords: ["Assalamualikum", "Asalamalikum", "assalamalikum", "asalamualikum"],
            response: "Wa'alikum Assalam wa rahmatullah hi wa barakatuhu."
        },
        {
            keywords: ["khairiyat", "khayriyat", "kairiat", "khayriat", "khayryat"],
            response: "Alhamdulillah."
        },
        {
            keywords: ["Jazakallah khair"],
            response: "Waiyyakum."
        },
        {
            keywords: ["when will i get my order", "where is my order", "order status"],
            response: "Order timelines depend on the platform (Amazon, Flipkart, etc.). Please check their website or support for exact updates."
        },
        {
            keywords: ["how do i order", "order product", "place order"],
            response: "You can order your favourite product by clicking on the 'Buy Now' button."
        },
        {
            keywords: ["thanks", "thank you", "ok"],
            response: "You're welcome! 😊"
        }
    ];

    // --- FUNCTIONS ---

    // 1. Toggle with Auto-Greeting Logic
    const toggleChatbotWindow = () => {
        chatbotWindow.classList.toggle("hidden");
        
        // If opening for the first time, say hello
        if (!chatbotWindow.classList.contains("hidden") && !hasGreeted) {
            hasGreeted = true; // Mark as greeted
            setTimeout(() => {
                showTypingIndicator();
                setTimeout(() => {
                    const typingDots = document.querySelector(".typing");
                    if(typingDots) typingDots.remove();
                    addMessage("bot", "Hello! 👋 I am ClassIt's AI. Ask me about products, shipping, or returns!");
                }, 800);
            }, 300);
        }
    };

    function addMessage(role, text) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `msg ${role}`;
        const contentDiv = document.createElement("div");
        contentDiv.className = "content";
        contentDiv.textContent = text;
        msgDiv.appendChild(contentDiv);
        chatLog.appendChild(msgDiv);
        chatLog.scrollTo({ top: chatLog.scrollHeight, behavior: "smooth" });
        return msgDiv;
    }

    function showTypingIndicator() {
        const msgDiv = document.createElement("div");
        msgDiv.className = "msg bot typing";

        const dots = document.createElement("div");
        dots.className = "typing-indicator";
        dots.innerHTML = "<span></span><span></span><span></span>";

        msgDiv.appendChild(dots);
        chatLog.appendChild(msgDiv);
        chatLog.scrollTo({ top: chatLog.scrollHeight, behavior: "smooth" });

        return msgDiv;
    }

    function setFormState(enabled) {
        userInput.disabled = !enabled;
        sendBtn.disabled = !enabled;
        userInput.placeholder = enabled ? "Ask about our products..." : "Assistant is typing...";
    }

    function findResponse(userText) {
        const input = userText.toLowerCase();

        for (const entry of knowledgeBase) {
            for (const keyword of entry.keywords) {
                // Regex checks for the word as a whole word (\b) so "ship" doesn't match "shipping"
                const regex = new RegExp(`\\b${keyword}\\b`, "i");
                if (regex.test(input)) {
                    if (typeof entry.response === "function") {
                        return entry.response();
                    }
                    return entry.response;
                }
            }
        }
        return fallbackResponse;
    }

    function handleUserMessage() {
        const userText = userInput.value.trim();
        if (!userText) return;

        // "Clear chat" command logic
        if (userText.toLowerCase() === 'clear chat') {
            chatLog.innerHTML = '';
            userInput.value = '';
            const confirmationMsg = addMessage('bot', 'Chat history cleared.');

            setTimeout(() => {
                if (confirmationMsg) {
                    confirmationMsg.classList.add('fade-out');
                    setTimeout(() => {
                        confirmationMsg.remove();
                    }, 300);
                }
            }, 3000);
            return;
        }

        // Standard Message Handling
        addMessage("user", userText);
        userInput.value = "";
        setFormState(false);

        const typingIndicator = showTypingIndicator();

        setTimeout(() => {
            const botResponse = findResponse(userText);
            typingIndicator.remove();
            addMessage("bot", botResponse);
            setFormState(true);
            userInput.focus();
        }, 1200);
    }

    // --- EVENT LISTENERS ---
    
    // Send on click
    if(sendBtn) sendBtn.addEventListener("click", handleUserMessage);
    
    // Toggle window
    if(chatbotToggle) chatbotToggle.addEventListener("click", toggleChatbotWindow);

    // Send on Enter
    if(userInput) {
        userInput.addEventListener("keydown", (e) => {
            if ((e.key === "Enter" || e.code === "Enter" || e.keyCode === 13) && !e.shiftKey) {
                e.preventDefault();
                handleUserMessage();
            }
        });
    }

    // --- CLOSING LOGIC (Close on X, Outside Click, Escape) ---

    function isChatOpen() {
        if (!chatbotWindow) return false;
        if (!chatbotWindow.classList.contains('hidden')) return true;
        const cs = getComputedStyle(chatbotWindow);
        return cs.display !== 'none' && cs.visibility !== 'hidden' && chatbotWindow.offsetParent !== null;
    }

    if (closeChatbot) {
        closeChatbot.addEventListener('click', (e) => {
            e.stopPropagation();
            chatbotWindow.classList.add('hidden');
            try { userInput.blur(); } catch (_) { }
        });
    }

    document.addEventListener('pointerdown', (event) => {
        if (!isChatOpen()) return;
        const clickedInsideChat = chatbotWindow.contains(event.target);
        const clickedToggle = chatbotToggle && chatbotToggle.contains(event.target);

        if (!clickedInsideChat && !clickedToggle) {
            chatbotWindow.classList.add('hidden');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isChatOpen()) {
            chatbotWindow.classList.add('hidden');
        }
    });
});