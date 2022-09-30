const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
require('dotenv').config();
const app = express();

app.use((req, res, next) => { res.header({ "Access-Control-Allow-Origin": "*" }); next(); });
app.use(bodyParser.json());


app.get("/", (req, res) => {
    res.send("Working Fine!");
});


// for whatsapp auto reply.

app.post("/chatbot", async (req, res) => {

    const message = req.body.query.message.toUpperCase().replace("CB", "");
    const sender = req.body.query.sender;

    console.log(message);

    try {
        const { data } = await axios.get(`http://api.brainshop.ai/get?bid=${process.env.BID}&key=${process.env.KEY}&uid=[uid]&msg=[${message}]`);
        res.json({
            "replies": [
                {
                    "message": `${sender === undefined ? "" : sender} ${data.cnt}`
                }
            ]
        })
    } catch (error) {
        res.json({
            "replies": [
                {
                    "message": `There is a problem in the BOT server! (@Butcher)`
                },
                {
                    "message": `Error: ${error}`
                }
            ]
        })
    }

});

app.post("/saatscore", async (req, res) => {

    const AN = req.body.query.message.split("-")[1];
    const url = `http://saat.soa.ac.in/2022/score-card-print.php?APPLNO=${AN}`;
    console.log(AN)

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const userName = $("tr:nth-of-type(1) td.col:nth-of-type(1)").text().trim().split("NAME OF THE CANDIDATE :")[1].trim().toUpperCase();
        const userCourse = $("div:nth-of-type(5) tr:nth-of-type(2) td:nth-of-type(1)").text().trim();
        const userPercentile = $("div:nth-of-type(5) tr:nth-of-type(2) td:nth-of-type(2)").text().trim();

        res.json({
            "replies": [
                {
                    "message": `*Name:* ${userName} *Course:* ${userCourse} *Percentile:* ${userPercentile}`
                }
            ]
        })


    } catch (error) {
        res.json({
            "replies": [
                {
                    "message": `There is a problem in the BOT server! (@Butcher)`
                },
                {
                    "message": `Error: ${error}`
                }
            ]
        })
    }

})

app.listen(process.env.PORT || 4000, () => {
    console.log("Active on PORT 4000 ✅");
});