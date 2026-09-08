Oui, dans ce cas il faut adapter l'architecture. Netlify héberge surtout ton frontend statique (HTML/CSS/JS), donc tu ne peux pas simplement mettre chatbot.php sur ton hébergement Netlify comme sur WAMP.

Pour ton chatbot, tu as deux bonnes options :

Option 1 — Netlify Functions + OpenAI API

Tu gardes ton site sur Netlify :

Netlify
│
├── index.html
├── css/
├── js/
│
└── netlify/
    └── functions/
        └── chatbot.js

Le fonctionnement devient :

Visiteur
   ↓
chatbot.js
   ↓
Netlify Function
   ↓
OpenAI API
   ↓
Réponse

La clé API est stockée dans les variables d'environnement Netlify, pas dans ton JavaScript.

Option 2 — Backend PHP séparé

Tu gardes :

Netlify
   ↓
HTML/CSS/JS

et tu héberges ton backend PHP sur un serveur qui accepte PHP/MySQL :

Netlify
   ↓
PHP Backend
   ↓
OpenAI API

Mais si ton objectif est de garder ton portfolio entièrement sur Netlify, je te conseille Netlify Functions. On n'a alors pas besoin d'un serveur PHP juste pour le chatbot.

Ce que je te conseille pour ton portfolio

Comme tu veux ensuite avoir un backend avec PHP + MySQL, tu peux aussi séparer les choses :

                  PORTFOLIO
                     │
             ┌───────┴───────┐
             ↓               ↓
          Netlify        Backend PHP
             │               │
          Frontend         MySQL
             │
        Chatbot Function
             │
             ↓
        OpenAI API

Mais pour commencer, faisons le chatbot sur Netlify avec Netlify Functions. C'est plus simple pour ton site actuel.

Et OPENAI_API_KEY ?

Tu ne dois pas écrire ceci dans chatbot.js :

const OPENAI_API_KEY = "sk-xxxxx";

À la place, dans Netlify, tu ajoutes une variable d'environnement :

OPENAI_API_KEY = sk-xxxxxxxx

Puis ta Netlify Function la récupère côté serveur.

Si tu veux, 
je peux maintenant te donner le code complet exact pour Netlify :

portfolio/
├── index.html
├── css/chatbot.css
├── js/chatbot.js
└── netlify/functions/chatbot.js

avec le chatbot fonctionnel + connexion OpenAI + clé protégée + connaissances sur toi.

Donne-moi le code complet exact pour Netlify

Oui. Puisque ton site est déjà hébergé sur Netlify, on va faire une version 100 % adaptée à Netlify : frontend HTML/CSS/JS + Netlify Function côté serveur + OpenAI API.

Netlify permet aux Functions d'utiliser des variables d'environnement avec process.env, ce qui est justement adapté pour protéger une clé API.

Je vais te donner une version que tu peux copier directement dans ton projet.

1. Structure du projet

Ajoute ceci à ton portfolio :

mon-portfolio/
│
├── index.html
├── ...
│
├── css/
│   ├── style.css
│   └── chatbot.css
│
├── js/
│   ├── main.js
│   └── chatbot.js
│
├── netlify/
│   └── functions/
│       └── chatbot.mjs
│
├── netlify.toml
└── package.json

Netlify utilise par défaut netlify/functions/ pour les Functions. Le fichier .mjs permet d'utiliser la syntaxe JavaScript moderne.

2. package.json

À la racine du projet :

{
  "name": "portfolio-yahye",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@netlify/functions": "latest"
  }
}
3. netlify.toml

À la racine :

[build]
  publish = "."
  functions = "netlify/functions"

[functions]
  node_bundler = "esbuild"
4. La fonction Netlify

Crée :

netlify/functions/chatbot.mjs

Mets exactement ceci :

const knowledge = {
  name: "Yahye Abdourahman Abdi",

  presentation: `
Yahye Abdourahman Abdi est étudiant en informatique.
Il s'intéresse à l'Intelligence Artificielle, à la Data Science,
à l'analyse de données et au développement logiciel.
`,

  education: [
    "Licence en Informatique à l'Université de Djibouti",
    "Master en Intelligence Artificielle et Data Modeling"
  ],

  skills: {
    programming: [
      "Python",
      "Java",
      "SQL"
    ],

    web: [
      "HTML",
      "CSS",
      "JavaScript",
      "PHP"
    ],

    database: [
      "MySQL",
      "SQL"
    ],

    data: [
      "NumPy",
      "Pandas",
      "Analyse de données",
      "Jupyter Notebook"
    ],

    tools: [
      "Git",
      "GitHub"
    ]
  },

  projects: [
    {
      name: "Analyse exploratoire des ventes",
      description: `
Projet d'analyse de données portant sur les ventes
d'une chaîne de vente d'électronique.
`
    },

    {
      name: "Portfolio personnel",
      description: `
Site personnel permettant de présenter son parcours,
ses compétences et ses projets.
`
    }
  ],

  interests: [
    "Intelligence Artificielle",
    "Data Science",
    "Développement logiciel",
    "Analyse de données",
    "Technologies web"
  ],

  goals: `
Développer ses compétences en Intelligence Artificielle,
Data Science et développement logiciel afin de créer
des solutions technologiques utiles.
`,

  contact: {
    github: "TON_GITHUB",
    linkedin: "TON_LINKEDIN",
    email: "TON_EMAIL"
  }
};


const instructions = `
Tu es l'assistant personnel de Yahye Abdourahman Abdi.

Tu es intégré à son portfolio.

Ton rôle est de répondre aux visiteurs qui souhaitent
connaître Yahye, son parcours, ses compétences, ses projets,
sa formation, ses centres d'intérêt et ses objectifs.

Voici les règles que tu dois respecter :

1. Réponds uniquement avec les informations présentes
   dans la base de connaissances.

2. Ne jamais inventer une information.

3. Si une information n'est pas présente, dis :
   "Je ne dispose pas de cette information."

4. Ne crée jamais une fausse expérience professionnelle.

5. Ne crée jamais une fausse certification.

6. Ne crée jamais un diplôme qui n'est pas présent.

7. Ne crée jamais une compétence qui n'est pas présente.

8. Si le visiteur demande une information personnelle
   qui n'est pas destinée au public, refuse poliment.

9. Réponds dans la langue du visiteur.

10. Tes réponses doivent être courtes, naturelles et faciles
    à comprendre.

11. Si la question concerne un projet, explique le projet
    avec les informations disponibles.

12. Si le visiteur demande comment contacter Yahye,
    donne uniquement les coordonnées présentes dans
    la base de connaissances.

13. Ne dis jamais que tu es ChatGPT.
    Présente-toi comme l'assistant du portfolio de Yahye.

14. Si quelqu'un demande "Qui est Yahye ?",
    présente brièvement son profil.

BASE DE CONNAISSANCES :

${JSON.stringify(knowledge, null, 2)}
`;


export default async (request) => {

  /*
   * Autoriser uniquement POST
   */

  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({
        error: "Méthode non autorisée."
      }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }


  /*
   * Récupérer la clé API
   */

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: "OPENAI_API_KEY n'est pas configurée sur Netlify."
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }


  /*
   * Récupérer le message du visiteur
   */

  let body;

  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({
        error: "JSON invalide."
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }


  const message = body?.message?.trim();

  if (!message) {
    return new Response(
      JSON.stringify({
        error: "Le message est vide."
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }


  /*
   * Limiter la taille du message
   */

  if (message.length > 1000) {
    return new Response(
      JSON.stringify({
        error: "Le message est trop long."
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }


  /*
   * Appel OpenAI
   */

  try {

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },

        body: JSON.stringify({
          model: "gpt-5.6-luna",

          instructions: instructions,

          input: message,

          max_output_tokens: 300
        })
      }
    );


    const data = await openaiResponse.json();


    if (!openaiResponse.ok) {

      console.error("OpenAI error:", data);

      return new Response(
        JSON.stringify({
          error: "Erreur lors de la communication avec OpenAI."
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }


    /*
     * Récupérer le texte généré
     */

    const answer = data.output_text;


    if (!answer) {

      return new Response(
        JSON.stringify({
          error: "Aucune réponse générée."
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }


    return new Response(
      JSON.stringify({
        answer: answer
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );


  } catch (error) {

    console.error(error);

    return new Response(
      JSON.stringify({
        error: "Erreur serveur."
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};

La Responses API accepte notamment instructions et input, et la réponse texte peut être récupérée avec output_text.

5. chatbot.js

Crée :

js/chatbot.js
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
6. chatbot.css

Crée :

css/chatbot.css
.chatbot-container {
    position: fixed;
    right: 25px;
    bottom: 25px;
    z-index: 9999;
}


/* Bouton */

.chatbot-toggle {
    width: 60px;
    height: 60px;

    border: none;
    border-radius: 50%;

    background: #4F46E5;
    color: white;

    font-size: 25px;

    cursor: pointer;

    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);

    transition: transform 0.2s ease;
}

.chatbot-toggle:hover {
    transform: scale(1.05);
}


/* Fenêtre */

.chatbot-window {
    position: absolute;

    right: 0;
    bottom: 75px;

    width: 370px;
    height: 520px;

    background: white;

    border: 1px solid #e5e7eb;

    border-radius: 18px;

    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);

    display: none;

    overflow: hidden;
}

.chatbot-window.active {
    display: flex;
    flex-direction: column;
}


/* Header */

.chatbot-header {
    padding: 16px 18px;

    background: #4F46E5;

    color: white;

    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chatbot-title {
    font-size: 15px;
    font-weight: 600;
}

.chatbot-status {
    margin-top: 3px;

    font-size: 11px;

    opacity: 0.85;
}

.chatbot-close {
    border: none;

    background: transparent;

    color: white;

    font-size: 25px;

    cursor: pointer;
}


/* Messages */

.chatbot-messages {
    flex: 1;

    padding: 16px;

    overflow-y: auto;

    background: #f8fafc;
}

.chat-message {
    max-width: 82%;

    padding: 11px 13px;

    margin-bottom: 12px;

    border-radius: 14px;

    font-size: 14px;

    line-height: 1.5;

    white-space: pre-wrap;
}

.bot-message {
    margin-right: auto;

    background: white;

    color: #111827;

    border: 1px solid #e5e7eb;
}

.user-message {
    margin-left: auto;

    background: #4F46E5;

    color: white;
}


/* Input */

.chatbot-form {
    display: flex;

    gap: 8px;

    padding: 12px;

    background: white;

    border-top: 1px solid #e5e7eb;
}

.chatbot-input {
    flex: 1;

    min-width: 0;

    padding: 11px 12px;

    border: 1px solid #d1d5db;

    border-radius: 10px;

    outline: none;

    font-size: 14px;
}

.chatbot-input:focus {
    border-color: #4F46E5;
}

.chatbot-send {
    width: 45px;

    border: none;

    border-radius: 10px;

    background: #4F46E5;

    color: white;

    font-size: 18px;

    cursor: pointer;
}

.chatbot-send:disabled {
    opacity: 0.5;

    cursor: not-allowed;
}


/* Mobile */

@media (max-width: 500px) {

    .chatbot-container {
        right: 15px;
        bottom: 15px;
    }

    .chatbot-window {
        width: calc(100vw - 30px);

        height: 70vh;
    }
}
7. Ajouter le HTML du chatbot

Dans ton index.html, avant </body> :

<!-- CHATBOT -->
<div class="chatbot-container">

    <button
        id="chatbotToggle"
        class="chatbot-toggle"
        aria-label="Ouvrir le chatbot"
    >
        💬
    </button>


    <div
        id="chatbotWindow"
        class="chatbot-window"
    >

        <div class="chatbot-header">

            <div>
                <div class="chatbot-title">
                    Assistant de Yahye
                </div>

                <div class="chatbot-status">
                    ● Disponible
                </div>
            </div>

            <button
                id="chatbotClose"
                class="chatbot-close"
                aria-label="Fermer"
            >
                ×
            </button>

        </div>


        <div
            id="chatbotMessages"
            class="chatbot-messages"
        >

            <div class="chat-message bot-message">
                Bonjour 👋

                Je suis l'assistant personnel de Yahye.

                Je peux vous renseigner sur son parcours,
                ses compétences, ses projets, sa formation
                et ses objectifs.

                Que souhaitez-vous savoir ?
            </div>

        </div>


        <form
            id="chatbotForm"
            class="chatbot-form"
        >

            <input
                id="chatbotInput"
                class="chatbot-input"
                type="text"
                placeholder="Posez votre question..."
                autocomplete="off"
                maxlength="1000"
            >

            <button
                class="chatbot-send"
                type="submit"
                aria-label="Envoyer"
            >
                ➤
            </button>

        </form>

    </div>

</div>

<link rel="stylesheet" href="css/chatbot.css">
<script src="js/chatbot.js"></script>
8. Configurer ta clé API sur Netlify

C'est la partie la plus importante.

Ne mets pas la clé dans :

chatbot.js
index.html
netlify.toml
GitHub

OpenAI indique que les clés API sont secrètes et ne doivent pas être exposées dans du code côté navigateur.

Sur Netlify :

Ton site → Project configuration → Environment variables

Ajoute :

Key:
OPENAI_API_KEY

Value:
ta_clé_api_OpenAI

Pour le scope, choisis Functions si Netlify te propose le choix.

Netlify indique que les variables destinées aux Functions peuvent être lues avec :

process.env.OPENAI_API_KEY

Ensuite, redéploie ton site : les changements de variables d'environnement prennent effet au déploiement suivant.

9. Ton chatbot fonctionnera ainsi
              TON VISITEUR
                   │
                   │
                   ▼
          ┌─────────────────┐
          │  chatbot.js     │
          │                 │
          │ Question        │
          └────────┬────────┘
                   │
                   │ POST
                   ▼
       /.netlify/functions/chatbot
                   │
                   ▼
          ┌─────────────────┐
          │ chatbot.mjs     │
          │                 │
          │ Connaissances   │
          │ de Yahye        │
          └────────┬────────┘
                   │
                   │ API
                   ▼
             OPENAI API
                   │
                   ▼
              Réponse IA
                   │
                   ▼
              chatbot.js
                   │
                   ▼
              VISITEUR
10. Test avant de publier

Si ton projet est déjà connecté à Netlify, tu peux simplement faire un nouveau déploiement.

Si tu travailles avec GitHub :

git add .
git commit -m "Ajout du chatbot IA"
git push

Netlify va ensuite redéployer le site.

Tu peux tester avec :

Qui est Yahye ?

Puis :

Quelles sont ses compétences ?

Puis :

Quels projets a-t-il réalisés ?

Puis :

Que fait-il en Data Science ?

⚠️ Une chose importante dans mon code

J'ai mis :

model: "gpt-5.6-luna"

car c'est le modèle indiqué dans la documentation actuelle consultée ici pour les usages sensibles au coût.

Si ton compte API ne donne pas accès à ce modèle, ne change pas tout le code. Il faudra simplement remplacer cette ligne par un modèle auquel ton projet a accès.

11. Mais il manque encore une chose : tes vraies informations

Pour l'instant, le chatbot connaît seulement les informations que nous avons mises dans :

netlify/functions/chatbot.mjs

Tu peux maintenant remplacer :

github: "TON_GITHUB",
linkedin: "TON_LINKEDIN",
email: "TON_EMAIL"

par tes vrais liens et ajouter tes autres informations publiques.

Si tu m'envoies maintenant ton index.html et tes fichiers CSS/JS actuels, je peux te montrer exactement où intégrer ce chatbot dans TON portfolio, sans casser ta navbar, tes pages ou ton design.

Importer un fichier
qui est yahye

Aucune réponse générée.

quels sont les competences de yahye

Aucune réponse générée.

Le message « Aucune réponse générée » vient très probablement de notre code précédent : la fonction reçoit bien la requête, mais elle ne trouve pas le texte dans la réponse OpenAI.

Il y a aussi un point important : gpt-5.6-luna ne doit pas être utilisé comme nom de modèle dans l'API OpenAI. Pour ton chatbot, utilise par exemple gpt-5. Le quickstart officiel d'OpenAI utilise la Responses API avec client.responses.create() et response.output_text.

On va donc corriger ça proprement.

1. Installe le SDK OpenAI

Dans le dossier de ton portfolio :

npm install openai

Ton package.json aura ensuite une dépendance openai.

2. Remplace complètement chatbot.mjs

Fichier :

netlify/functions/chatbot.mjs

Mets ceci :

import OpenAI from "openai";


/*
|--------------------------------------------------------------------------
| Base de connaissances de Yahye
|--------------------------------------------------------------------------
*/

const knowledge = {

    name: "Yahye Abdourahman Abdi",

    presentation: `
Yahye Abdourahman Abdi est étudiant en informatique.
Il s'intéresse à l'Intelligence Artificielle, à la Data Science,
à l'analyse de données et au développement logiciel.
`,

    education: [
        "Licence en Informatique à l'Université de Djibouti",
        "Master en Intelligence Artificielle et Data Modeling"
    ],

    skills: [
        "Python",
        "Java",
        "SQL",
        "HTML",
        "CSS",
        "JavaScript",
        "PHP",
        "MySQL",
        "Pandas",
        "NumPy",
        "Analyse de données",
        "Jupyter Notebook",
        "Git",
        "GitHub"
    ],

    domains: [
        "Intelligence Artificielle",
        "Data Science",
        "Analyse de données",
        "Développement web",
        "Développement logiciel",
        "Bases de données"
    ],

    projects: [
        {
            name: "Analyse exploratoire des ventes",
            description: `
Projet d'analyse de données portant sur les ventes
d'une chaîne de vente d'électronique.
`
        },

        {
            name: "Portfolio personnel",
            description: `
Site web personnel permettant de présenter
son parcours, ses compétences et ses projets.
`
        }
    ],

    interests: [
        "Intelligence Artificielle",
        "Data Science",
        "Développement logiciel",
        "Analyse de données",
        "Technologies web"
    ],

    goals: `
Développer ses compétences en Intelligence Artificielle,
Data Science et développement logiciel afin de créer
des solutions technologiques utiles.
`,

    contact: {
        github: "TON_GITHUB",
        linkedin: "TON_LINKEDIN",
        email: "TON_EMAIL"
    }
};


/*
|--------------------------------------------------------------------------
| Instructions du chatbot
|--------------------------------------------------------------------------
*/

const instructions = `
Tu es l'assistant personnel de Yahye Abdourahman Abdi.

Tu es intégré à son portfolio personnel.

Tu dois répondre aux visiteurs qui souhaitent connaître Yahye,
son parcours, sa formation, ses compétences, ses projets,
ses domaines d'intérêt et ses objectifs.

RÈGLES :

- Réponds en français si le visiteur parle français.
- Réponds en anglais si le visiteur parle anglais.
- Ne jamais inventer une information.
- Utilise uniquement les informations présentes dans la base
  de connaissances.
- Si une information n'est pas présente, réponds :
  "Je ne dispose pas de cette information."
- Ne crée aucune expérience professionnelle.
- Ne crée aucune certification.
- Ne crée aucun diplôme.
- Ne crée aucune compétence.
- Ne donne pas d'informations privées.
- Réponds de façon naturelle et concise.
- Tu peux utiliser des listes lorsque c'est utile.
- Pour une question sur un projet, explique le projet
  avec les informations disponibles.
- Pour une question sur le contact, utilise uniquement
  les coordonnées présentes dans la base.

Tu es l'assistant du portfolio de Yahye.
Ne prétends pas être Yahye.

Voici la base de connaissances :

${JSON.stringify(knowledge, null, 2)}
`;


/*
|--------------------------------------------------------------------------
| Fonction Netlify
|--------------------------------------------------------------------------
*/

export default async (request) => {

    /*
    |--------------------------------------------------------------------------
    | Vérification de la méthode
    |--------------------------------------------------------------------------
    */

    if (request.method !== "POST") {

        return new Response(
            JSON.stringify({
                error: "Méthode non autorisée."
            }),
            {
                status: 405,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Récupération de la clé API
    |--------------------------------------------------------------------------
    */

    const apiKey = process.env.OPENAI_API_KEY;


    if (!apiKey) {

        console.error(
            "OPENAI_API_KEY est absente."
        );

        return new Response(
            JSON.stringify({
                error: "La clé OPENAI_API_KEY n'est pas configurée."
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Lecture du message
    |--------------------------------------------------------------------------
    */

    let body;

    try {

        body = await request.json();

    } catch (error) {

        return new Response(
            JSON.stringify({
                error: "La requête JSON est invalide."
            }),
            {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }


    const message = body?.message?.trim();


    if (!message) {

        return new Response(
            JSON.stringify({
                error: "Le message est vide."
            }),
            {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Création du client OpenAI
    |--------------------------------------------------------------------------
    */

    const openai = new OpenAI({
        apiKey: apiKey
    });


    /*
    |--------------------------------------------------------------------------
    | Appel de l'API OpenAI
    |--------------------------------------------------------------------------
    */

    try {

        const response = await openai.responses.create({

            model: "gpt-5",

            instructions: instructions,

            input: message

        });


        /*
        |--------------------------------------------------------------------------
        | Récupérer directement le texte
        |--------------------------------------------------------------------------
        */

        const answer = response.output_text;


        if (!answer) {

            console.error(
                "Réponse OpenAI sans output_text :",
                response
            );

            return new Response(
                JSON.stringify({
                    error: "OpenAI n'a retourné aucun texte."
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Envoyer la réponse au navigateur
        |--------------------------------------------------------------------------
        */

        return new Response(
            JSON.stringify({
                success: true,
                answer: answer
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

    } catch (error) {

        console.error(
            "Erreur OpenAI :",
            error
        );


        return new Response(
            JSON.stringify({
                error: "Erreur lors de la communication avec OpenAI."
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
};
3. Vérifie chatbot.js

Ton fichier :

js/chatbot.js

doit appeler exactement :

fetch("/.netlify/functions/chatbot", {

Voici une version complète propre :

document.addEventListener("DOMContentLoaded", () => {

    const toggle = document.getElementById("chatbotToggle");
    const chatWindow = document.getElementById("chatbotWindow");
    const close = document.getElementById("chatbotClose");

    const form = document.getElementById("chatbotForm");
    const input = document.getElementById("chatbotInput");
    const messages = document.getElementById("chatbotMessages");


    /*
    |--------------------------------------------------------------------------
    | Ouvrir
    |--------------------------------------------------------------------------
    */

    toggle.addEventListener("click", () => {

        chatWindow.classList.add("active");

        input.focus();

    });


    /*
    |--------------------------------------------------------------------------
    | Fermer
    |--------------------------------------------------------------------------
    */

    close.addEventListener("click", () => {

        chatWindow.classList.remove("active");

    });


    /*
    |--------------------------------------------------------------------------
    | Ajouter un message
    |--------------------------------------------------------------------------
    */

    function addMessage(text, type) {

        const message = document.createElement("div");

        message.classList.add(
            "chat-message",
            type === "user"
                ? "user-message"
                : "bot-message"
        );

        message.textContent = text;

        messages.appendChild(message);

        messages.scrollTop = messages.scrollHeight;

        return message;
    }


    /*
    |--------------------------------------------------------------------------
    | Envoyer le message
    |--------------------------------------------------------------------------
    */

    form.addEventListener("submit", async (event) => {

        event.preventDefault();


        const userMessage = input.value.trim();


        if (!userMessage) {
            return;
        }


        /*
        | Afficher la question
        */

        addMessage(
            userMessage,
            "user"
        );


        input.value = "";

        input.disabled = true;


        /*
        | Loading
        */

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


            /*
            |--------------------------------------------------------------------------
            | Erreur
            |--------------------------------------------------------------------------
            */

            if (!response.ok) {

                addMessage(
                    data.error ||
                    "Une erreur est survenue.",
                    "bot"
                );

                return;
            }


            /*
            |--------------------------------------------------------------------------
            | Réponse
            |--------------------------------------------------------------------------
            */

            addMessage(
                data.answer,
                "bot"
            );


        } catch (error) {

            console.error(error);

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
4. Vérifie ta variable Netlify

Dans Netlify :

Project configuration → Environment variables

Ajoute :

OPENAI_API_KEY

Valeur :

sk-xxxxxxxxxxxxxxxxxxxxxxxx

La variable doit être accessible par les Functions. Netlify indique que les Functions peuvent lire les variables avec process.env.NOM_DE_LA_VARIABLE.

Ne mets surtout pas la clé dans GitHub.

5. Très important : redéploie après avoir ajouté la clé

Après avoir créé/modifié :

OPENAI_API_KEY

fais un nouveau déploiement.

Netlify précise que les changements des variables d'environnement sont pris en compte au prochain déploiement.

6. Vérifie netlify.toml

À la racine :

[build]
  publish = "."
  functions = "netlify/functions"

[functions]
  node_bundler = "esbuild"
7. Vérifie ton package.json

Il faut avoir :

{
  "name": "portfolio-yahye",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "openai": "^5.0.0",
    "@netlify/functions": "^4.0.0"
  }
}

Puis :

npm install
8. Test local

Si tu veux tester avant de pousser sur GitHub, installe Netlify CLI :

npm install -g netlify-cli

Puis :

netlify dev

Tu auras une adresse locale fournie par Netlify.

Le point important est que la Function doit répondre à :

/.netlify/functions/chatbot
9. Teste ensuite

Dans ton chatbot :

Question :

Qui est Yahye ?

Tu devrais avoir quelque chose comme :

Yahye Abdourahman Abdi est étudiant en informatique. Il s'intéresse à l'Intelligence Artificielle, à la Data Science, à l'analyse de données et au développement logiciel.

Puis :

Quelles sont les compétences de Yahye ?

Et il devrait répondre à partir de :

skills: [
    "Python",
    "Java",
    "SQL",
    "HTML",
    "CSS",
    "JavaScript",
    "PHP",
    "MySQL",
    "Pandas",
    "NumPy",
    "Analyse de données",
    "Jupyter Notebook",
    "Git",
    "GitHub"
]
Si tu as encore « Aucune réponse générée »

Ne modifie plus le code au hasard.

Va dans :

Netlify → ton site → Functions → chatbot → Logs

et regarde l'erreur.

Tu peux aussi me donner le message exact affiché dans les logs Netlify. Avec ça, je pourrai identifier précisément le problème.

Et surtout, ne m'envoie jamais ta valeur OPENAI_API_KEY. Netlify est justement prévu pour garder cette clé côté serveur via les variables d'environnement.