//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express()

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));


mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


const User = new mongoose.model("user", userSchema);


app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.post("/login",function(req,res){
  const username = req.body.username;
  const pwd = req.body.password;
  User.findOne({email: username},function(err,result){
    if(!err){
      if(result.password === md5(pwd)) res.render("secrets");
      else console.log("incorrect password");
    }
    else{
      console.log("Invalid username or password");
    }
  });
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const user = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });
  user.save();
  res.render("secrets");
})




app.listen(3000, function(){
  console.log("server started successfully");
});
