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