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

    // --- CONCEPT MAPPING (The Bridge) ---
    const conceptMap = [
        // ---------------------------------------------------------
        // COPY START: Copy from this line down to the next comment
        // ---------------------------------------------------------
        {
            // 1. What the User types (The "X")
            triggers: ["laptop setup", "desk upgrade", "work from home"], 
            
            // 2. What the Bot searches for (The "Things of X")
            // The bot will randomly pick ONE of these to show a product.
            searchFor: ["mouse", "keyboard", "stand", "desk mat"] 
        },
        // ---------------------------------------------------------
        // COPY END: Paste as many copies as you want below this line
        // ---------------------------------------------------------

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
    
    // Copy of createId from main.js to ensure IDs match perfectly
    const createId = (name) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const getInternalLink = (product) => {
        const cat = (product.category || '').toLowerCase();
        let folder = '';
        
        // Match exact folder names from your sidebar
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

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning! ☀️";
        if (hour < 18) return "Good afternoon! 🌤️";
        return "Good evening! 🌙";
    };

    // Levenshtein Distance (Typos)
    const getDistance = (a, b) => {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        const matrix = [];
        for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
        for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) == a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    };

    const isCloseMatch = (text, keyword) => {
        // STRICTER RULE: Short words (like "hi") must match exactly
        if (keyword.length < 3) {
            const regex = new RegExp(`\\b${keyword}\\b`, 'i');
            return regex.test(text);
        }
        
        if (text.includes(keyword)) return true;
        
        const words = text.split(" ");
        for (let word of words) {
            if (Math.abs(word.length - keyword.length) > 2) continue;
            const dist = getDistance(word, keyword);
            const allowedErrors = keyword.length > 5 ? 2 : 1; 
            if (dist <= allowedErrors) return true;
        }
        return false;
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
                const now = new Date();
                const timeString = now.toLocaleTimeString('en-US', { hour: "numeric", minute: "2-digit", hour12: true });
                return `The current time is ${timeString}.`;
            }
        },
        {
            triggers: ["date", "today date"],
            response: () => {
                const now = new Date();
                const dateString = now.toLocaleDateString([], { year: "numeric", month: "long", day: "numeric" });
                return `Today's date is ${dateString}.`;
            }
        },
        {
            triggers: ["day", "what day"],
            response: () => {
                const now = new Date();
                const dayString = now.toLocaleDateString([], { weekday: "long" });
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
            triggers: ["location", "where", "address", "office", "located"],
            response: () => "We are located at:<br><b>ClassIt</b><br>Bahadurpura, Old City<br>Hyderabad, Telangana 500064<br>India 🇮🇳"
        },
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
        // We only use heavy fuzzy matching on TITLE and CATEGORY.
        // For Description, we use strict matching. This prevents the "stuck" feeling.
        const matches = products.filter(p => {
            const titleCat = (p.title + " " + p.category).toLowerCase();
            const desc = (p.description || "").toLowerCase();

            return queryWords.some(word => {
                // Allow typos in Title/Category (Levenshtein)
                if (isCloseMatch(titleCat, word)) return true;
                
                // STRICT match for Description (Faster than calculating distance for 500+ words)
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
        // Safety: Limit input length to prevent lag attacks
        if (rawInput.length > 200) return "I can't understand, please rephrase.";

        const lowerInput = rawInput.toLowerCase();
        
        // 1. Check Smart Negation
       if (lowerInput.includes("clear") && lowerInput.includes("chat")) {
            // Checks for: don't, dont, do not, donot, never, not, dnt
            if (/don['’]?t|do\s*not|never|not|dnt/i.test(lowerInput)) {
                return "Okay, I will keep the chat history safe! 🛡️";
            }
            return "CLEAR_COMMAND";
        }

        // 2. CHECK KNOWLEDGE BASE (Using RAW Input)
        for (const entry of knowledgeBase) {
            if (entry.triggers.some(t => isCloseMatch(lowerInput, t))) {
                if (typeof entry.response === "function") return entry.response();
                return pickRandom(entry.responses);
            }
        }

        // --- PASTE THIS INSIDE findSmartResponse() ---

        // Check Concept Map (The Bridge)
        for (const concept of conceptMap) {
            // If the user's text matches one of the triggers...
            if (concept.triggers.some(t => isCloseMatch(lowerInput, t))) {
                
                // ...Pick a random product keyword from the list...
                const termToSearch = pickRandom(concept.searchFor);
                
                // ...And search for it!
                const result = searchRealProducts(termToSearch);
                if (result) return result;
            }
        }
        
        // --- END PASTE ---

        // 3. PRODUCT SEARCH (Using CLEAN Input)
        const cleanText = cleanInput(rawInput);
        const productResult = searchRealProducts(cleanText);
        if (productResult) return productResult;

        // 4. FINAL FALLBACK (As requested)
        return "I can't understand, please rephrase.";
    }

    function handleUserMessage() {
        const userText = userInput.value.trim();
        if (!userText) return;

        addMessage("user", userText);
        userInput.value = "";
        setFormState(false);

        const typingIndicator = showTypingIndicator();
        // Reduced max think time slightly to feel snappier
        const thinkTime = Math.floor(Math.random() * 400) + 500; 

        setTimeout(() => {
            // SAFETY TRY-CATCH to prevent "Stuck" state
            try {
                const botResponse = findSmartResponse(userText);
                typingIndicator.remove(); // Always remove loading dots

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