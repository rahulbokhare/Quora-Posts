const express = require("express");
const app = express();
const path = require("path");
const { v4: uuidv4} = require("uuid");
const methodOverride = require('method-override');
const mysql = require('mysql2');  

app.use(express.urlencoded({ extended: true }));
app.use (methodOverride('_method'));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));

const connection = mysql.createConnection({          //database
    host : 'localhost',
    user : 'root',
    database: 'delta',
    password:'rahul@123'
});

// server
app.listen(8080,() => {
    console.log("listening to port 8080");
})

// Home Page
app.get("/posts",(req,res) => {
     let q = "SELECT * FROM user";
        try{
            connection.query(q, (err,users) => {
            if (err) throw err;
            res.render("index.ejs", {users});
        });
        }catch(err){
            console.log(err);
            res.send("there is some error in Database");
        }
    });

// To Create New Post
app.get("/posts/new", (req,res) => {
    res.render("new.ejs")
});
app.post("/posts", (req, res) => {
    let { username, content, password } = req.body;
    let q = "INSERT INTO user (username, content, password) VALUES (?, ?, ?)";
    connection.query(q, [username, content, password], (err, result) => {
        if (err) {
            console.log(err);
            return res.send("Database error");
        }
        res.redirect("/posts");
    });
})
//see in detail
app.get("/posts/:id", (req,res) => {
    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id =?`;
    connection.query(q, [id], (err,result) => {
         if (err) {
            console.log(err);
            res.send("Database error");
        }
        let user = result[0];   // because SELECT returns array
        res.render("show.ejs", { user });
    })
});
// To Edit New Post
app.get("/posts/:id/edit", ( req,res ) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id =?`;
    try{
        connection.query(q, [id], (err,result) =>{
        if (err) throw err;
        let user = result[0];
        res.render("edit.ejs",{ user });
    });
    }catch(err){
        console.log(err);
        res.send("there is some error in Database");
    } 
});
app.patch("/posts/:id",( req,res ) => {
    let {id} = req.params;
    let newContent = req.body.content;
    let q = "UPDATE user SET content = ? WHERE id = ?";
    connection.query(q, [newContent, id], (err, result) =>{
        if(err) {
            console.log(err);
            res.send("Database error")
        }
        res.redirect("/posts");
    })
});
// Delete user from database
app.delete("/posts/:id", (req,res) => {
    let {id} = req.params;
        let q = `DELETE FROM user WHERE id =?`;
        connection.query(q, [id], (err,result) => {
            if(err){
                console.log(err);
                res.send("database error");
                }
             res.redirect("/posts");
        })
     })



