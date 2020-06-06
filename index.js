var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var url = require('url');
const dotenv = require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const path = require('path');


const PORT = process.env.PORT || 3000;
var client = null;

//connect to mongoDB Atlas
connectDB();

//set App Options
setAppOptions();

//check if server is working
//Get List of All Battle Locations
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/Client/build/index.html'));
});

//Get List of All Battle Locations
app.get('/api/list', (req, res) => {
    const collection = getCollection();

    collection.distinct( "location", { "location" : { $nin : ["", null] } })
        .then(result => res.send(result))
        .catch(error => res.send(error))
});

//Get Total Battle Numbers
app.get('/api/count', (req, res) => {
    const collection = getCollection();

    collection.find().count()
        .then(result => res.send(result.toString()))
        .catch(error => res.send(error))
});

//Search API for Battle Info
app.get("/api/search", (req, res) =>
{
    var url_parts = url.parse(req.url, true);
    var params = url_parts.query;

    var query = {}

    for (let [key, value] of Object.entries(params)) {

            if(key === "king")
            {
                query["$or"] = [{"attacker_king":value},{"defender_king":value}]
            }
            else if(key === "type")
            {
                query['battle_type'] = value
            }
            else{
                query[key] = value
            }

        }

    const collection = getCollection();

    collection.find(query).toArray()
        .then(result => res.send(result))
      
    });


function connectDB(){
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-saugl.mongodb.net/test?retryWrites=true&w=majority`;
    client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true});
    client.connect(err => {

        console.log("connected")

    });
}

function setAppOptions(){
    app.use(cors({ allowedHeaders: 'Content-Type, Cache-Control' }));
    app.options('*', cors());
    app.use(bodyParser.json())
    app.use(express.static('Client/build'));
}

    
function getCollection(){
    return client.db("CNinja").collection("Fights");
}

//start app
app.listen(PORT, () => console.log(`Server Running on Port - ${PORT}`))