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
    const isGroup = req.body.query.isGroup;

    console.log(message);

    try {
        const { data } = await axios.get(`http://api.brainshop.ai/get?bid=${process.env.BID}&key=${process.env.KEY}&uid=[uid]&msg=[${message}]`);
        res.json({
            "replies": [
                {
                    "message": `@${isGroup ? "" : sender} : ${data.cnt}`
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

app.post('/soa/:path', async (req, res) => {
    const path = req.params.path;
    let pathUrl = "";
    switch (path) {
        case "en":
            pathUrl = "iter-exam-notice";
            break;
        case "gn":
            pathUrl = "iter-student-notice";
            break;
        case "sn":
            pathUrl = "general-notifications"
            break;

        default:
            res.json({
                "replies": [
                    {
                        "message": `Error server path! ${path}`
                    }
                ]
            })
    }
    const url = `https://www.soa.ac.in/${pathUrl}`;

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        res.json({
            "replies": [
                {
                    "message": `*Event Name:* ${$(`.article-index-${1} a.BlogList-item-title`).text()} *Date:* ${$(`.article-index-${1} time`).text()} *Link:* ${'https://www.soa.ac.in' + $(`.article-index-${1} a.BlogList-item-title`).attr('href')}`
                },
                {
                    "message": `*Event Name:* ${$(`.article-index-${2} a.BlogList-item-title`).text()} *Date:* ${$(`.article-index-${2} time`).text()} *Link:* ${'https://www.soa.ac.in' + $(`.article-index-${2} a.BlogList-item-title`).attr('href')}`
                },
                {
                    "message": `*Event Name:* ${$(`.article-index-${3} a.BlogList-item-title`).text()} *Date:* ${$(`.article-index-${3} time`).text()} *Link:* ${'https://www.soa.ac.in' + $(`.article-index-${3} a.BlogList-item-title`).attr('href')}`
                },
                {
                    "message": `*Event Name:* ${$(`.article-index-${4} a.BlogList-item-title`).text()} *Date:* ${$(`.article-index-${4} time`).text()} *Link:* ${'https://www.soa.ac.in' + $(`.article-index-${4} a.BlogList-item-title`).attr('href')}`
                },
                {
                    "message": `*Event Name:* ${$(`.article-index-${5} a.BlogList-item-title`).text()} *Date:* ${$(`.article-index-${5} time`).text()} *Link:* ${'https://www.soa.ac.in' + $(`.article-index-${5} a.BlogList-item-title`).attr('href')}`
                }
            ]
        })
    }

    catch (error) {
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

app.listen(process.env.PORT || 4000, () => {
    console.log("Active on PORT 4000 ✅");
});