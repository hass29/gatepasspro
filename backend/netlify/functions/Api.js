const serverless = require('serverless-http');
// Update the path below to point to your main Express app file
const app = require('../../server.js'); 

// Important: Export the wrapped app as the 'handler' function
exports.handler = serverless(app); 