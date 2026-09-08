document.addEventListener("DOMContentLoaded", function () {

    const toggle = document.getElementById("chatbotToggle");
    const chatWindow = document.getElementById("chatbotWindow");
    const close = document.getElementById("chatbotClose");

    const form = document.getElementById("chatbotForm");
    const input = document.getElementById("chatbotInput");
    const messages = document.getElementById("chatbotMessages");


    // Vérification
    if (!toggle || !chatWindow || !close) {
        console.error("Chatbot : éléments HTML introuvables.");
        return;
    }


    // Ouvrir le chatbot
    toggle.addEventListener("click", function () {

        chatWindow.classList.add("active");

        input.focus();

    });


    // Fermer le chatbot
    close.addEventListener("click", function () {

        chatWindow.classList.remove("active");

    });


    // Ajouter un message
    function addMessage(text, type) {

        const message = document.createElement("div");

        message.classList.add("chat-message");

        if (type === "user") {
            message.classList.add("user-message");
        } else {
            message.classList.add("bot-message");
        }

        message.textContent = text;

        messages.appendChild(message);

        messages.scrollTop = messages.scrollHeight;

        return message;
    }


    // Envoyer un message
    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const userMessage = input.value.trim();

        if (!userMessage) {
            return;
        }


        // Afficher le message de l'utilisateur
        addMessage(userMessage, "user");

        input.value = "";
        input.disabled = true;


        // Message temporaire
        const loadingMessage = addMessage(
            "Je réfléchis...",
            "bot"
        );


        try {

            const response = await fetch(
                "/.netlify/functions/chatbot",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        message: userMessage
                    })
                }
            );


            const data = await response.json();


            loadingMessage.remove();


            if (!response.ok) {

                addMessage(
                    data.error || "Une erreur est survenue.",
                    "bot"
                );

                return;
            }


            addMessage(
                data.answer,
                "bot"
            );


        } catch (error) {

            console.error("Erreur chatbot :", error);

            loadingMessage.remove();

            addMessage(
                "Impossible de contacter le serveur.",
                "bot"
            );

        } finally {

            input.disabled = false;

            input.focus();

        }

    });

});