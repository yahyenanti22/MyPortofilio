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

    console.error("Erreur OpenAI :", error);

    return new Response(
        JSON.stringify({
            error: error.message || "Erreur OpenAI inconnue."
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