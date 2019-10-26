var http = require("http");
var express = require("express");

var app = express();



// CONFIGURATION 

// enable CORS security

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-ALlow-Methods", "GET, PUT, POST, DELETE, PATCH");
    res.header("Access-Control-Allow-Headers", "ORigin, X-Requested_With, Content-Type, Accept");
    next();
});



// (read req body as object)
var bodyParser = require("body-parser");
app.use(bodyParser.json());

// moongoose connection
var mongoose = require("mongoose");
mongoose.connect('mongodb://ThiIsAPassword:TheRealPassword@cluster0-shard-00-00-euadh.mongodb.net:27017,cluster0-shard-00-01-euadh.mongodb.net:27017,cluster0-shard-00-02-euadh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');
var db = mongoose.connection;

// Db onject constructor
var itemDB;




// WEB SERVER  FUNCTIONALITY

app.get("/", function(req, res){
    res.send("<h1 style='color:darkblue;'> Hello from my own server </h1>");
});

app.get("/contact", function(req, res){
    res.send("My contact info is: CLASSIFIED!");
});

app.get("/about", function(req, res){
    res.send("My voice is my passport, verify me");
});



// API FUNCTIONALITY

var items = [];
var count = 0;

app.get('/api/products', function(req, res){
    console.log("User wants the catalog");
    
    itemDB.find({}, function(error, data){
        if (error){
            console.log("**Error on retrieving", error);
            res.status(500);
            res.send(error);        
        }

        res.status(200);
        res.json(data);
    });
});

app.get('/api/products/:user', function(req, res){
    var name = req.params.user;
    
    itemDB.find({ user: name }, function(error, data){
        if (error){
            console.log("**Error on retrieving", error);
            res.status(500);
            res.send(error);        
        }

        res.status(200);
        res.json(data);
    });
});

app.post('/api/products', function(req, res){
    console.log("User wants to save item");
    
    // perform validation

    
    // create database item
    var itemForMongo = itemDB(req.body);
    itemForMongo.save(function(error, savedItem){
        if(error){
            console.log("**Error saving item to DB**", error);
            res.status(500);
            res.send(error);
        }

        // if no error, send saved item back to client
        console.log("Item saved correctly!");
        res.status(201);
        res.json(savedItem);
    });

    
});

db.on('error', function(error){
    console.log("**error connecting to MongoDB**");
});

db.on("open", function(){
    console.log("It's ALIVE!!!");

    // Schema types: String, NUmber, Date, Buffer, Boolean, Mixed, ObjectID, Array
    // define schema for the collection (table)
    var itemSchema = mongoose.Schema({
        code: String,
        title: String,
        price: Number,
        description: String,
        category: String,
        rating: Number,
        image: String,
        user: String,

    });

    // create construcotrs for the schema
    itemDB = mongoose.model("ItemsCH5", itemSchema);
});



app.listen(8080, function(){
    console.log("Server running at http://localhost:8080");
});