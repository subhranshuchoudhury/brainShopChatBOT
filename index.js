const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();

app.use((req, res, next) => { res.header({ "Access-Control-Allow-Origin": "*" }); next(); });
app.use(bodyParser.json());


app.get("/", (req, res) => {
    res.send("Working Fine!");
});


// for whatsapp auto reply.

app.post("/chatbot", async (req, res) => {

    const message = req.body.query.message;
    // const app = req.body.app;
    // const sender = req.body.sender;
    // const group_name = req.body.group_name;
    // const phone = req.body.phone;

    console.log(message);

    try {
        const { data } = await axios.get(`http://api.brainshop.ai/get?bid=169550&key=qUo7wn5htJ3HmkNz&uid=[uid]&msg=[${message}]`);
        // res.json({ reply: `@${phone === undefined ? "BOT" : phone}: ${data.cnt}` })
        res.json({
            "replies": [
                {
                    "message": `BOT: ${data.cnt}`
                }
            ]
        })
    } catch (error) {
        res.json({ reply: "The AI BOT server is down! Kindly contact ADMIN @Butcher." });
    }

});

app.listen(process.env.PORT || 4000, () => {
    console.log("Active on PORT 4000 ✅");
});