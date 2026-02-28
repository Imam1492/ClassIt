document.addEventListener("DOMContentLoaded", () => {
    // --- SELECTORS ---
    const chatbotToggle = document.getElementById("chatbotToggle");
    const chatbotWindow = document.getElementById("chatbotWindow");
    const closeChatbot = document.getElementById("chatbotClose");
    const chatLog = document.getElementById("chatbotMessages");
    const userInput = document.getElementById("chatbotInput");
    const sendBtn = document.getElementById("chatbotSend");

    // ✅ CHECK IF ELEMENTS EXIST
    if (!chatbotToggle || !chatbotWindow || !chatLog || !userInput || !sendBtn) return;

    // --- 1. CONFIG ---
    const STOP_WORDS = ["is", "the", "a", "an", "for", "to", "in", "at", "on", "my", "your", "please", "can", "you", "i", "do", "does", "want", "need", "find", "show", "me", "buy", "get"];

    // --- 2. HELPERS ---
    
    // ✅ ADDED: The missing helper function that caused the crash
    const isCloseMatch = (input, trigger) => {
        // Pads with spaces to ensure we match whole words (e.g., "hi" won't match inside "this")
        return ` ${input} `.includes(` ${trigger} `) || input.includes(trigger);
    };

    // --- CONCEPT MAPPING (The Bridge) ---
    const conceptMap = [
        {
            triggers: ["laptop setup", "desk upgrade", "work from home"], 
            searchFor: ["mouse", "keyboard", "stand", "desk mat"] 
        },
        {
            triggers: ["gym", "protein", "muscle", "workout"],
            searchFor: ["whey", "creatine", "shaker"]
        },
        {
             triggers: ["trip", "travel", "vacation"],
             searchFor: ["bag", "backpack", "lock"]
        },
          {
             triggers: ["something for muscle growth"],
             searchFor: ["whey", "creatine", "shaker"]
        },
        {
             triggers: ["going on a trip", "traveling soon"],
             searchFor: ["bag", "backpack", "lock"]
        },
    ];
    
    const createId = (name) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const getInternalLink = (product) => {
        const cat = (product.category || '').toLowerCase();
        let folder = '';
        
        if (cat.includes('tech')) folder = 'tech';
        else if (cat.includes('livogue')) folder = 'Livogue';
        else if (cat.includes('fit')) folder = 'wellfit';
        
        const id = createId(product.title);
        return folder ? `/${folder}/#${id}` : `/#${id}`;
    };

    const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const cleanInput = (text) => {
        return text.toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .split(' ')
            .filter(word => !STOP_WORDS.includes(word))
            .join(' ');
    };
    
    const APP_TIME_ZONE = "Asia/Kolkata";

    const getNowParts = () => {
        const now = new Date();
        const parts = new Intl.DateTimeFormat("en-US", {
            timeZone: APP_TIME_ZONE,
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long"
        }).formatToParts(now);

        const read = (type) => parts.find(p => p.type === type)?.value || "";
        const hour24 = Number(new Intl.DateTimeFormat("en-US", {
            timeZone: APP_TIME_ZONE,
            hour: "2-digit",
            hourCycle: "h23"
        }).format(now));

        return {
            hour24,
            timeString: `${read("hour")}:${read("minute")} ${read("dayPeriod")}`.trim(),
            dateString: `${read("month")} ${read("day")}, ${read("year")}`.trim(),
            dayString: read("weekday")
        };
    };

    const getGreeting = () => {
        const { hour24 } = getNowParts();
        
        // Between 12:00 AM and 3:59 AM (Late night / very early morning)
        if (hour24 >= 0 && hour24 < 4) return "Hello!"; 
        
        // Between 4:00 AM and 11:59 AM
        if (hour24 >= 4 && hour24 < 12) return "Good morning!";
        
        // Between 12:00 PM and 5:59 PM
        if (hour24 >= 12 && hour24 < 18) return "Good afternoon!";
        
        // From 6:00 PM to 11:59 PM
        return "Good evening!";
    };

    // --- 3. KNOWLEDGE BASE ---
    const knowledgeBase = [
        // --- Greetings ---
        {
            triggers: ["hi", "hello", "hey", "start", "greetings"],
            response: () => `${getGreeting()} Welcome to ClassIt! I can help you find products, check hours, or answer support questions.`
        },
        {
            triggers: ["how are you", "how r u", "how are u"],
            responses: ["I am an AI chatbot, but I'm feeling great! How about you?", "I'm doing well, thanks for asking!"]
        },
        {
            triggers: ["i am fine", "i am good", "i am great", "iam good"],
            responses: ["Nice! How may I help you today?", "That's great to hear!"]
        },
        // --- Identity ---
        {
            triggers: ["who are you", "what are you", "who it is","who r u","who are you"],
            response: () => "I am ClassIt's Smart AI assistant."
        },
        {
            triggers: ["founder", "owner", "who made", "created by"],
            response: () => "ClassIt was founded by A.I.M."
        },
        // --- Ordering & Status ---
        {
            triggers: ["when will i get my order", "where is my order", "order status"],
            response: () => "Order timelines depend on the platform (Amazon, Flipkart, etc.). Please check their website or support for exact updates."
        },
        {
            triggers: ["how do i order", "order product", "place order", "how to buy"],
            response: () => "You can order your favourite product by clicking on the 'Buy Now' button. It will redirect you to the safe purchase page."
        },
        // --- Time & Date ---
        {
            triggers: ["time", "current time"],
            response: () => {
                const { timeString } = getNowParts();
                return `The current time is ${timeString} IST.`;
            }
        },
        {
            triggers: ["date", "today date"],
            response: () => {
                const { dateString } = getNowParts();
                return `Today's date is ${dateString}.`;
            }
        },
        {
            triggers: ["day", "what day"],
            response: () => {
                const { dayString } = getNowParts();
                return `Today is ${dayString}.`;
            }
        },
        // --- Islamic / Cultural Greetings ---
        {
            triggers: ["assalamualikum", "asalamalikum", "salam"],
            response: () => "Wa'alikum Assalam wa rahmatullah hi wa barakatuhu."
        },
        {
            triggers: ["khairiyat", "kairiat", "kaise ho"],
            response: () => "Alhamdulillah."
        },
        {
            triggers: ["jazakallah", "jazakallah khair", "jazak allah"],
            response: () => "Waiyyakum."
        },
        // --- Info & Support ---
        {
            triggers: ["about", "what is classit"],
            response: () => "ClassIt is a site that shares high-quality, personally-vetted products in Livogue, Wellfit, and Tech."
        },
        {
            triggers: ["location", "where", "address", "office", "located"],
            response: () => "We are located at:<br><b>ClassIt</b><br>Bahadurpura, Old City<br>Hyderabad, Telangana 500064<br>India 🇮🇳"
        },
        {
            triggers: ["contact", "email", "get in touch", "help", "support"],
            response: () => "You can reach us through the 'Contact Us' page or email <a href='mailto:contact@classit.co.in' class='chat-link'>contact@classit.co.in</a>."
        },
        {
            triggers: ["shipping", "delivery", "track", "arrive", "ship"],
            response: () => "All deliveries are handled by the platforms like Amazon/Flipkart as per their standards. ClassIt is not involved in shipping."
        },
        {
            triggers: ["defect", "damaged", "wrong order", "return"],
            response: () => "If you get a damaged or wrong item, contact the support of the site you ordered from with photos. They’ll provide a solution."
        },
        // --- Specific Support Emails ---
        { triggers: ["flipkart"], response: () => "Flipkart Support: <a href='mailto:cs@flipkart.com' class='chat-link'>cs@flipkart.com</a>" },
        { triggers: ["meesho"], response: () => "Meesho Support: <a href='mailto:help@meesho.com' class='chat-link'>help@meesho.com</a>" },
        { triggers: ["muscleblaze", "mb"], response: () => "MuscleBlaze: <a href='mailto:info@muscleblaze.com' class='chat-link'>info@muscleblaze.com</a>" },
        {
            triggers: ["thank", "thx", "cool", "ok"],
            responses: ["You're welcome! 😊", "Happy to help!", "Let me know if you need anything else."]
        },
        {
             triggers: ["bye", "goodbye"],
             responses: ["Goodbye! Come back soon! 👋"]
        },
        // Broad Category matching
        {
            triggers: ["categories", "products", "sell", "livogue", "wellfit", "tech"],
            response: "We feature curated products in Livogue, Wellfit, and Tech. Which are you most interested in?"
        },
          // --- Business Info ---
        {
            triggers: ["time", "business hours", "open", "close", "working"],
            response: () => "<b>Business Hours:</b><br>Sat – Thu: 1:00 PM – 9:00 PM IST<br>Sun & Fri: Closed"
        },
    ];

    // --- 4. DYNAMIC PRODUCT SEARCH (PERFORMANCE OPTIMIZED) ---
    function searchRealProducts(cleanQuery) {
        const products = window.CLASSIT_PRODUCTS || [];
        if (products.length === 0 || !cleanQuery) return null;

        const queryWords = cleanQuery.split(' ');

        // 1. Exact Title Matches (Fastest)
        const exactMatch = products.find(p => p.title.toLowerCase().includes(cleanQuery));
        if (exactMatch) {
            const link = getInternalLink(exactMatch);
            return `I found exactly what you're looking for! The <b>${exactMatch.title}</b>.<br><br>${exactMatch.description.substring(0, 60)}...<br><a href="${link}" class="chat-link view-product-btn">View Product</a>`;
        }

        // 2. Optimized Smart Search
        const matches = products.filter(p => {
            const titleCat = (p.title + " " + p.category).toLowerCase();
            const desc = (p.description || "").toLowerCase();

            return queryWords.some(word => {
                if (isCloseMatch(titleCat, word)) return true;
                if (word.length > 3 && desc.includes(word)) return true; 
                return false;
            });
        });

        if (matches.length > 0) {
            const p = matches[0]; 
            const link = getInternalLink(p);
            return `We have something like that! Check out the <b>${p.title}</b>.<br><br><a href="${link}" class="chat-link view-product-btn">Check it out</a>`;
        }

        return null;
    }

    // --- 5. CORE LOGIC ---
    function findSmartResponse(rawInput) {
        if (rawInput.length > 200) return "I can't understand, please rephrase.";

        const lowerInput = rawInput.toLowerCase();
        
        // 1. Check Smart Negation
       if (lowerInput.includes("clear") && lowerInput.includes("chat")) {
            if (/don['’]?t|do\s*not|never|not|dnt/i.test(lowerInput)) {
                return "Okay, I will keep the chat history safe! 🛡️";
            }
            return "CLEAR_COMMAND";
        }

        // 2. CHECK KNOWLEDGE BASE (Using RAW Input)
        for (const entry of knowledgeBase) {
            if (entry.triggers.some(t => isCloseMatch(lowerInput, t))) {
                // ✅ FIXED: Safely handles both functions, static strings, and arrays
                if (entry.response) return typeof entry.response === "function" ? entry.response() : entry.response;
                if (entry.responses) return pickRandom(entry.responses);
            }
        }

        // Check Concept Map (The Bridge)
        for (const concept of conceptMap) {
            if (concept.triggers.some(t => isCloseMatch(lowerInput, t))) {
                const termToSearch = pickRandom(concept.searchFor);
                const result = searchRealProducts(termToSearch);
                if (result) return result;
            }
        }
        
        // 3. PRODUCT SEARCH (Using CLEAN Input)
        const cleanText = cleanInput(rawInput);
        const productResult = searchRealProducts(cleanText);
        if (productResult) return productResult;

        // 4. FINAL FALLBACK
        return "I can't understand, please rephrase.";
    }

    function handleUserMessage() {
        const userText = userInput.value.trim();
        if (!userText) return;

        addMessage("user", userText);
        userInput.value = "";
        setFormState(false);

        const typingIndicator = showTypingIndicator();
        const thinkTime = Math.floor(Math.random() * 400) + 500; 

        setTimeout(() => {
            try {
                const botResponse = findSmartResponse(userText);
                typingIndicator.remove(); 

                if (botResponse === "CLEAR_COMMAND") {
                    chatLog.innerHTML = '';
                    const confirm = addMessage('bot', 'Chat history cleared. ✨');
                    setTimeout(() => {
                        confirm.classList.add('fade-out');
                        setTimeout(() => confirm.remove(), 300);
                    }, 2000);
                } else {
                    addMessage("bot", botResponse);
                }
            } catch (error) {
                console.error("Chatbot Error:", error);
                typingIndicator.remove();
                addMessage("bot", "I encountered a temporary error. Please try again.");
            }

            setFormState(true);
            userInput.focus();
        }, thinkTime);
    }

    // --- 6. UI HELPERS ---
    function addMessage(role, text) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `msg ${role}`;
        msgDiv.innerHTML = `<div class="content">${text}</div>`;
        chatLog.appendChild(msgDiv);
        chatLog.scrollTop = chatLog.scrollHeight;
        return msgDiv;
    }

    function showTypingIndicator() {
        const msgDiv = document.createElement("div");
        msgDiv.className = "msg bot typing";
        msgDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        chatLog.appendChild(msgDiv);
        chatLog.scrollTop = chatLog.scrollHeight;
        return msgDiv;
    }

    function setFormState(enabled) {
        userInput.disabled = !enabled;
        sendBtn.disabled = !enabled;
        userInput.placeholder = enabled ? "Ask anything..." : "ClassIt AI is thinking...";
    }

    const toggleChatbotWindow = () => chatbotWindow.classList.toggle("hidden");

    userInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleUserMessage();
        }
    });

    sendBtn.addEventListener("click", handleUserMessage);
    chatbotToggle.addEventListener("click", toggleChatbotWindow);
    
    if (closeChatbot) {
        closeChatbot.addEventListener('click', (e) => {
            e.stopPropagation();
            chatbotWindow.classList.add('hidden');
        });
    }
    
    document.addEventListener('pointerdown', (event) => {
        const isOpen = !chatbotWindow.classList.contains('hidden');
        if (!isOpen) return;
        const clickedInside = chatbotWindow.contains(event.target);
        const clickedToggle = chatbotToggle.contains(event.target);
        if (!clickedInside && !clickedToggle) {
            chatbotWindow.classList.add('hidden');
        }
    });
});