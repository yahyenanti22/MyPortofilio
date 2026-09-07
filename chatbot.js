document.addEventListener("DOMContentLoaded", () => {

    const toggle = document.getElementById("chatbotToggle");
    const windowChat = document.getElementById("chatbotWindow");
    const close = document.getElementById("chatbotClose");

    const form = document.getElementById("chatbotForm");
    const input = document.getElementById("chatbotInput");
    const messages = document.getElementById("chatbotMessages");


    /*
     * Ouvrir
     */

    toggle.addEventListener("click", () => {
        windowChat.classList.add("active");
        input.focus();
    });


    /*
     * Fermer
     */

    close.addEventListener("click", () => {
        windowChat.classList.remove("active");
    });


    /*
     * Ajouter un message
     */

    function addMessage(text, type) {

        const message = document.createElement("div");

        message.className =
            type === "user"
                ? "chat-message user-message"
                : "chat-message bot-message";

        message.textContent = text;

        messages.appendChild(message);

        messages.scrollTop = messages.scrollHeight;

        return message;
    }


    /*
     * Envoyer
     */

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const message = input.value.trim();

        if (!message) {
            return;
        }


        /*
         * Message utilisateur
         */

        addMessage(message, "user");

        input.value = "";

        input.disabled = true;


        /*
         * Message temporaire
         */

        const loading = addMessage(
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
                        message: message
                    })
                }
            );


            const data = await response.json();


            /*
             * Supprimer le chargement
             */

            loading.remove();


            if (!response.ok) {

                addMessage(
                    data.error ||
                    "Une erreur est survenue.",
                    "bot"
                );

                return;
            }


            /*
             * Réponse du chatbot
             */

            addMessage(
                data.answer,
                "bot"
            );


        } catch (error) {

            console.error(error);

            loading.remove();

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