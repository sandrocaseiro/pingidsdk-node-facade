const express = require('express');

const app = express();
app.use(express.json());

const testController = require('./controllers/test-controller');
app.use(testController);

const port = process.env.PORT || 4400;

app.listen({port}, () => {
    console.log(`Server running at http://localhost:${port}`);
});
