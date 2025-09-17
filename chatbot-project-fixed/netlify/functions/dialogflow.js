c// netlify/functions/dialogflow.js
const dialogflow = require('@google-cloud/dialogflow');
const { Buffer } = require('buffer');

const projectId = process.env.DIALOGFLOW_PROJECT_ID;
const clientEmail = process.env.DIALOGFLOW_CLIENT_EMAIL;
const privateKey = process.env.DIALOGFLOW_PRIVATE_KEY.replace(/\\n/g, '\n'); // handle newlines

const sessionClient = new dialogflow.SessionsClient({
  credentials: {
    client_email: clientEmail,
    private_key: privateKey,
  },
});

exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);
    const message = body.message || '';

    const sessionPath = sessionClient.projectAgentSessionPath(
      projectId,
      'portfolio-session'
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'en-US',
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: result.fulfillmentText || "No reply from Dialogflow" }),
    };
  } catch (error) {
    console.error("Dialogflow error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Internal server error" }),
    };
  }
};
