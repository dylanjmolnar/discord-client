const express = require('express');
const app = express();

app.get("/home", (req, res) => {
    res.json([1, 2, 3])
});

app.listen(5000, () => {console.log("Started")});