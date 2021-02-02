const express = require("express");
const admin_route = express.Router();
const md5 = require("md5");
let jwt = require("jsonwebtoken");
const RSA_PRIVATE_KEY = "sdfgsudfsgautwevrgwefuiytwefgcdsuifvysduv";

admin_route.post("/add", function(req, res) {
    
    let admin_id = req.body.admin_id;
    let password = md5(req.body.password);
    let admin_pin = req.body.admin_pin;
  
    let adminQuery = "SELECT * FROM `admin` WHERE admin_id = ?";
  
    db.query(adminQuery, admin_id,(err, result) => {
      if (err) {
        return res.status(200).send({
          msg: "Some Error Occured !",
          success: false
        });
      }
      if (result.length > 0) {
        message = "Already available. Please try to login";
        res.status(200).send({ msg:message, success: false });
      } else {
        let query =
          "INSERT INTO `admin` (admin_id, password, admin_pin) VALUES (?,?,?)";
        db.query(query,[admin_id,password,admin_pin] ,(err) => {
          if (err) {
            return res.status(200).send({
              msg: "Some Error Occured !",
              success: false
            });
          }
          res.status(201).send({
            msg: "Registration Successfull!",
            success: true
          });
        });
      }
    });
  });

admin_route.post("/login", function(req, res) {
    let aid = req.body.admin_id;
    let password = md5(req.body.password);
  
    let query =
      "SELECT admin_id FROM `admin` WHERE admin_id = ? and password = ?"; 
  
    // execute query
    db.query(query,[aid,password] ,(err, result) => {
      if (err) {
        return res.status(200).send({
          msg: "Some Error Occured !",
          success: false
        });
      }
      if (result.length > 0) {
        const jwtBearerToken = jwt.sign({ jwt: result[0].admin_id }, RSA_PRIVATE_KEY, {
          expiresIn: 36000
        });
        let data = {
          success: true,
          admin: {
            aid: result[0].admin_id,
          },
          token: jwtBearerToken
        };
        res.status(200).json(data);
      } else {
        let data = {
          success: false,
          student: null
        };
        res.status(401).json(data);
      }
    });
  });


module.exports = admin_route;
