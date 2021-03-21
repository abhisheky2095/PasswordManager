var express = require("express");
var mysql = require('mysql');
var app = express();
var path = require("path");
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));


// Mysql database connection
var pool        = mysql.createPool({
    connectionLimit : 10, // default = 10
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'password_storage'
});


// This application is listening on 3000 port
app.listen(3000, () => {
    console.log("Server running on port 3000");
});



// APi to call html file on which information will be filled for any server
app.get("/insert/server", (req, res, next) => {
    res.sendFile(path.join(__dirname,'./form.html'));
});


// Api to add server info
app.post("/add", (req, res, next) => {
    console.log("Working some...");
    insert_in_database(req, function(err, resp){
        console.log("hi...")
        res.json("Successfully inserted in database.");
    })
});


//Get Server Info by api
app.get("/fetch/server/:host", (req, res, next) => {
   
    console.log(req.params.host)
    read_database(req.params.host, function(err, response) {
    res.json(response)
    })

});



// function which will connect to Mysql Table and insert the info to table "server_info"
function insert_in_database(req, callback) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        console.log("Connected!");
        var sql = "INSERT INTO server_info (server, username, password) VALUES (?, ?, ?)";
        connection.query(sql, [req.body.id, req.body.name, req.body.password], function (err, result) {
            connection.release();
            if (err) throw err;
            console.log("1 record inserted");
            callback("", "success")
        });
    });
}

// function which will read the info from mysql database.
function read_database(server_ip, callback) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        if(server_ip=="all") {
            connection.query("SELECT server, username, password FROM server_info", function (err, result, fields) {
                connection.release();
                if (err) throw err;
                callback("", result)
            });
        }else{
        connection.query("SELECT server, username, password FROM server_info where server="+server_ip+"", function (err, result, fields) {
            connection.release();
            if (err) throw err;
            callback("", result)
        });
    }
    });
}

