let fs = require('fs'); //import Node.js fs module
let mysql = require('mysql'); //import MySQL module

exports.serveStaticFile = (filename, res) => {
    if (filename == "/") {
        filename = "/index.html";
    }
    let readStaticFile = (ct, filename) => {
        fs.readFile("." + filename, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' }); //if there is eroor sends 404 code (not found)
                res.end("file not found");
                return;
            }
            res.writeHead(200, { 'Content-Type': ct }); //if there is no error send 200 code (ok)
            return res.end(data);
        });
    };
    let extToCT = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "application/javascript",
        ".jpg": "image/jpeg",
        ".png": "image/png"
    };
    let indexOfDot = filename.lastIndexOf("."); //get the index of the dot
    if (indexOfDot == -1) {
        res.writeHead(400, { "Content-Type": "text/plain" }); //if there is no dot sends 400 code (bad request)
        res.end("invalid file name (no extension).");
        return;
    }
    //"mypage.html"
    //indexOfDot => 6
    let ext = filename.substring(indexOfDot); //get the part of the string that strating by the dot
    let ct = extToCT[ext];
    if (!ct) {
        res.writeHead(400, { "Content-Type": "text/plain" }); //if ct is empty sends 400 code (bad request)
        res.end("invalid file name (unknown extension).");
        return;
    }
    readStaticFile(ct, filename);
};

exports.query = (sql, params, callback) => {
    let conn = mysql.createConnection({ //create a MySQL connection with the specified connection details
        host: "localhost",
        user: "root",
        password: "roei7912",
        database: "connectfour"
    });
    conn.connect((err) => { //connect to the MySQL database
        if (err) {
            callback(null, err);
            return;
        }
        conn.query(sql, params, (err, result, fields) => {
            callback(result, err);
        });
        conn.end(); //close the database connection
    });
};