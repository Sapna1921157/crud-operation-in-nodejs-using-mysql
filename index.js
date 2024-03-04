const express = require("express");
const app = express();
const mysql = require("mysql2");
var bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const connection = require("./config/db");

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/Public"));
app.use(express.static(__dirname + "/views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.redirect("/index.html");
});

app.get("/delete-data", (req,res) =>{
    const deleteQuery = "delete from youtube_table where id =?";

    connection.query(deleteQuery, [req.query.id], (err,rows) => {
        if(err){
            console.log(err);
        }else{
            res.redirect("/data"); 
        }
    });
});

//passing data to update page
app.get("/update-data", (req, res) => {
    const updateData = "select * from  youtube_table where id=?";
    connection.query(updateData, req.query.id, (err, eachRow) => {
      if (err) {
        res.send(err);
      } else {
        // console.log(eachRow[0]);
        result = JSON.parse(JSON.stringify(eachRow[0]));  //in case if it dint work 
        console.log(result);
        res.render("edit.ejs", { result });
      }
    });
  });

app.get("/data", (req,res) => {
    connection.query("select * from youtube_table", (err,rows) => {
        if(err){
            console.log(err);
        }else {
            res.render("read.ejs",{rows});
        }
    });
});

//update query

app.post("/final-update", (req, res) => {
    console.log(req.body);
    const id = req.body.hidden_id;
    const name = req.body.name;
    const email = req.body.email;
    try {
        const updateQuery = "update youtube_table set name=?, email=? where id=?";
        connection.query(
          updateQuery,
        [name, email, id],
        (err, rows) => {
          if (err) {
            console.log(err);
          } else {
              res.redirect("/data");
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  });

//create

app.post("/index", (req, res) => {
  console.log(req.body);
  const name = req.body.name;
  const email = req.body.email;
  try {
    connection.query(
      "INSERT into youtube_table (name,email)  VALUES(?,?)",
      [name, email],
      (err, rows) => {
        if (err) {
          console.log(err);
        } else {
            res.redirect("/data");
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.listen(process.env.PORT || 5000, (error) => {
  if (error) throw error;
  console.log(`Server is running on port ${process.env.PORT}`);
});
