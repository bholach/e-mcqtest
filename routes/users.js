const express = require("express");
const user_route = express.Router();
const md5 = require("md5");
let jwt = require("jsonwebtoken");
const RSA_PRIVATE_KEY = "sdfgsudfsgautwevrgwefuiytwefgcdsuifvysduv";
const {encrypt, decrypt} = require('../tools/encrypt-decrypt');

// middleware that is specific to this router
user_route.use(function timeLog(req, res, next) {
  //console.log(req.ip, " => Time: ", new Date().toUTCString());
  next();
});
// define the user route

user_route.post("/add", function(req, res) {
  let name = req.body.name;
  let uid = req.body.uid;
  let password = md5(req.body.password);
  let category = parseInt(decrypt(req.body.cat_id));

  let valid = validateForm(req.body);
  if(!valid.status){
return res.status(200).send({
        msg: valid.msg,
        success: false
      });
  }

  let usernameQuery = "SELECT * FROM `students` WHERE uid = ?";

  db.query(usernameQuery, uid,(err, result) => {
    if (err) {
      return res.status(200).send({
        msg: "Some Error Occured !",
        success: false
      });
    }
    if (result.length > 0) {
      message = "Already Registered. Please try to login";
      res.status(200).send({ msg:message, success: false });
    } else {
      let query =
        "INSERT INTO `students` (uid, name, password, cat_id) VALUES (?,?,?,?)";
      db.query(query,[uid,name,password,category] ,(err, result) => {
        if (err) {
          return res.status(200).send({
            msg: "Some Error Occured !",
            success: false
          });
        }
        res.status(200).send({
          msg: "Registration Successfull! Please wait page will be redirected to login page.",
          success: true
        });
      });
    }
  });
});

user_route.post("/check-status",(req,res)=>{
  let uid = req.body.uid;
  let query = "SELECT status from `students` WHERE uid = ?";
  
  db.query(query,uid,(err,result)=>{
    if (err) {
      return res.status(200).send({
        msg: "Some Error Occured !",
        success: false
      });
    }else{
      if(result.length > 0){
        return res.status(200).send({
        success:true,
        data:result[0]
      });
      }else{
         return res.status(200).send({
        msg: "Unauthorize Access !",
        success: false
      });
      }
    }
  });

})
// define the login route
user_route.post("/login", function(req, res) {
  let uid = req.body.uid;
  let password = md5(req.body.password);

  let query =
    "SELECT uid,name,status,cat_id FROM `students` WHERE uid = '" +
    uid +
    "' and password = '" +
    password +
    "'"; // query database to get all the players

  // execute query
  db.query(query, (err, result) => {
    if (err) {
      return res.status(200).send({
        msg: "Some Error Occured !",
        success: false
      });
    }
    if (result.length > 0) {
      const jwtBearerToken = jwt.sign({ jwt: result[0].uid }, RSA_PRIVATE_KEY, {
        expiresIn: 120
      });
      let data = {
        success: true,
        student: {
          uid: result[0].uid,
          name: result[0].name,
          status: result[0].status,
          category: encrypt(result[0].cat_id)
        },
        token: jwtBearerToken
      };
      res.json(data);
    } else {
      let data = {
        success: false,
        student: null
      };
      res.json(data);
    }
  });
});

user_route.post("/add-result", function(req, res) {
  let results = req.body.result;
  let uid = req.body.uid;

  let usernameQuery = "SELECT * FROM `results` WHERE uid = '" + uid + "'";

  db.query(usernameQuery, (err, result) => {
    if (err) {
      return res.status(500).send({
        msg: "Some Error Occured !",
        success: false
      });
    }
    if (result.length > 0) {
      message = "Result Already Submitted";
      res.send({ msg:message, success: false });
    } else {
      let query =
        "INSERT INTO `results` (result,uid) VALUES ('" +
        JSON.stringify(results) +
        "','" +
        uid +
        "')";
      db.query(query, (err, result) => {
        if (err) {
          return res.status(500).send({
            msg: "Some Error Occured ",
            success: false
          });
        } else {
          let update_status = "update students set status = ? where uid = ?";
          db.query(update_status, [true, uid], (err, result) => {
            if (err) {
              return res.status(500).send({
                msg: "Some Error Occured ",
                success: false
              });
            }
            res.status(200).send({
              msg: "Exam submitted successfully !",
              success: true
            });
          });
        }
      });
    }
  });
});

user_route.post("/get-result",(req,res)=>{

  let uid = req.body.uid;
  let query = "SELECT * from `results` WHERE uid = ?";
  db.query(query,uid,(err,result)=>{
    if (err) {
      return res.status(500).send({
        msg: "Some Error Occured !",
        success: false
      });
    }
    if (result.length > 0) {
      res.status(200).send({
        success: true,
        result: result
      });
    } else {
      res.status(200).send({
        success: false,
        student: null,
        msg:"No Result Found"
      });
    }

  })
});

function validateForm(data) {
    if (
      (data.name == undefined || data.name == null) &&
      (data.uid == undefined || data.uid == null) &&
      (data.password == undefined || data.password == null)
    ) {
      msg = "All fields are required";
      return {msg,status:false};
    }
    if (data.name == undefined || data.name == null) {
      msg = "Name cannot be empty";
      return {msg,status:false};
    }
    if (data.uid == undefined && data.uid == null) {
      msg = "Uid cannot be empty";
      return {msg,status:false};
    }
    if (data.password == undefined && data.password == null) {
      msg = "Password cannot be empty";
      return {msg,status:false};
    }
    if (
      (data.cat_id == undefined && data.cat_id == null) ||
      data.cat_id == -1
    ) {
      msg = "Please select exam category";
      return {msg,status:false};
    }
    return {msg:"",status:true};
  }

module.exports = user_route;
