const fetch = require("node-fetch");
const cheerio = require("cheerio");
const express = require("express");
const app = express();
const PORT = 5000;
var url = "https://www.dictionary.com/browse/";
var synonymUrl = "https://www.synonyms.com/synonym/";
var words = ""; 

app.use(express.urlencoded({ extended: false}));

app.use(express.static('public'));
app.set('views', './views');
app.set('view-engine', 'ejs');

app.get("/", function(req, res){
    res.render('index.ejs');
});
app.get("/blog", function(req, res){
    res.render('blog.ejs');
});
app.post("/", function(req, res){

    url = "https://www.dictionary.com/browse/"
    words = req.body.word;
    url = url + words;

    synonymUrl = "https://www.synonyms.com/synonym/"
    synonymUrl = synonymUrl + words;

    // promise based function to render to ejs
    const printJSON = async (url) => {

        var data = await getData(url);
        res.render('result.ejs', {word : data.word, pronunciation: data.pronunciation, meaningOne: data.meaningOne, meaningTwo: data.meaningTwo, meaningThree: data.meaningThree, synonymLink: synonymUrl});
    };

    data = printJSON(url);
});

// function to get the raw data
const getRawData = (URL) => {
    
    return fetch(URL)
        .then((response) => response.text())
        .then((data) => {
            return data;
        });
};

const getData = async (url) => {
   
    // collecting raw data
    const rawData = await getRawData(url);

    // parsing the data
    const parsedData = cheerio.load(rawData);

    var word = parsedData("h1.css-1sprl0b");
    word = (word[0].children[0].data);

    var pronunciation = parsedData("span.pron-spell-content");
    pronunciation = (pronunciation[0].children[0].data);

    var meaning = parsedData("span.one-click-content");
    meaningOne = (meaning[0].children[0].data);
    meaningTwo = (meaning[1].children[0].data);
    meaningThree = (meaning[2].children[0].data);  

    // JSON for word info
    var data = {

        "word" : word,
        "pronunciation" : pronunciation,
        "meaningOne" : meaningOne,
        "meaningTwo" : meaningTwo,
        "meaningThree" : meaningThree
    }

    return data;
};

app.listen(PORT, function(){
    console.log("Server running on PORT", PORT);
});