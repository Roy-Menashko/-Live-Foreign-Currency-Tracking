import express from "express";
import axios from "axios";
import bodyParser from "body-parser";


const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/search", async (req, res) => {
    try {
        const result = await axios.get("https://v6.exchangerate-api.com/v6/7ce8cc82f59dea77fd7627c8/latest/ILS");
        const rates = result.data.conversion_rates;

        const searchedCurrency = req.query.currency ? req.query.currency.toUpperCase() : null;
        let currencyValue = null;

        if (searchedCurrency) {
            if (rates.hasOwnProperty(searchedCurrency)) {
                currencyValue = rates[searchedCurrency];
            }
        }

        res.render("index.ejs", {
            searchedCurrency: searchedCurrency,
            currencyValue: currencyValue,
            rates: rates
        });
    } catch (error) {
        res.status(404).send(error.message);
    }
});

app.get("/", async (req, res) => {
    try {
        const result = await axios.get("https://v6.exchangerate-api.com/v6/7ce8cc82f59dea77fd7627c8/latest/ILS");
        res.render("index.ejs", {
            rates: result.data.conversion_rates 
        });
    } catch (error) {
        res.status(404).send(error.message);
    }
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});