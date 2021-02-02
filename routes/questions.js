const express = require("express");
const mysql = require('mysql');
const question_route = express.Router();
const {
  decrypt
} = require('../tools/encrypt-decrypt');

// middleware that is specific to this router
question_route.use(function timeLog(req, res, next) {
  //console.log(req.ip, " => Time: ", new Date().toUTCString());
  next();
});
// define the home page route
question_route.get("/add", function (req, res) {
  res.render("addQuestion.ejs", {
    title: "Welcome to CU Exam",
    message: "",
    success: true
  });
});

question_route.post("/add", function (req, res) {

  let question = req.body.question;
  let opt1 = req.body.option1;
  let opt2 = req.body.option2;
  let opt3 = req.body.option3;
  let opt4 = req.body.option4;
  let answer = req.body.answer;
  let cat_id = parseInt(decrypt(req.body.cat_id));

  let query = "SELECT * FROM `questions` WHERE question = ? and cat_id = ?";

  db.query(query, [question, cat_id], (err, result) => {
    if (err) {
      return res.status(200).send({
        msg: "Some Error Occured !",
        success: false
      });
    }
    if (result.length > 0) {
      msg = "Question already exists";
      res.status(200).send({
        msg: msg,
        success: false
      });
    } else {
      let query =
        'INSERT INTO `questions` (question,option1,option2,option3,option4,answer,cat_id) VALUES (?,?,?,?,?,?,?)';
      db.query(mysql.format(query, [question, opt1, opt2, opt3, opt4, answer, cat_id]), (err, result) => {
        if (err) {
          return res.status(200).send({
            msg: "Some Error Occured !" + err,
            success: false
          });
        }
        res.status(200).send({
          msg: "Question Added Successfully !",
          success: true
        });
      });
    }
  });
});

//update question
question_route.post("/update", function (req, res) {
  let ques_id = req.body.ques_id;
  let question = req.body.question;
  let opt1 = req.body.option1;
  let opt2 = req.body.option2;
  let opt3 = req.body.option3;
  let opt4 = req.body.option4;
  let answer = req.body.answer;
  //let cat_id = decrypt(req.body.cat_id);

  let query = `UPDATE questions SET question=?,option1=?,option2=?,option3=?,option4=?,answer=? WHERE question_id = ? `;

  db.query(query, [question, opt1, opt2, opt3, opt4, answer, ques_id], (err, result) => {
    if (err) {
      return res.status(200).send({
        msg: "Some Error Occured !" + err.message,
        success: false
      });
    }
    if (result.affectedRows > 0) {
      msg = "Question updated successfully";
      res.status(200).send({
        msg: msg,
        success: true
      });
    } else {
      return res.status(200).send({
        msg: "Failed to update question !",
        success: false
      });
    }
  });
});

question_route.post("/delete", (req, res) => {
  let ques_id = req.body.ques_id;

  let query = "DELETE from `questions` WHERE question_id = ?";
  db.query(query, ques_id, (err, result) => {
    if (err) {
      return res.status(200).send({
        msg: "Some Error Occured !",
        success: false
      });
    }
    msg = "Question deleted successfully";
    res.status(200).send({
      msg: msg,
      success: true
    });

  });
})
// define the about route
question_route.post("/ques-by-id", function (req, res) {

  let cat_id = parseInt(decrypt(req.body.cat_id));

  let query = "SELECT * FROM `questions` WHERE cat_id = ?";

  // execute query
  db.query(query, cat_id, (err, result) => {
    if (err) {
      return res.status(200).send({
        msg: "Some Error Occured !",
        success: false
      });
    }
    if (result.length > 0) {
      res.status(200).send({
        success: true,
        questions: result
      });
    } else {
      res.status(200).send({
        success: false,
        student: null,
        msg: "No Question Found"
      });
    }
  });
});

question_route.post("/random-ques", function (req, res) {

  let cat_id = parseInt(decrypt(req.body.cat_id));

  let query = "SELECT * FROM `questions` WHERE cat_id = ? order by rand() limit 30";

  // execute query
  db.query(query, cat_id, (err, result) => {
    if (err) {
      return res.status(200).send({
        msg: "Some Error Occured !",
        success: false
      });
    }
    if (result.length > 0) {
      res.status(200).send({
        success: true,
        questions: result
      });
    } else {
      res.status(200).send({
        success: false,
        student: null,
        msg: "No Question Found"
      });
    }
  });
});

question_route.post("/add-result", function (req, res) {
  let results = req.body.result;
  let uid = req.body.uid;

  let usernameQuery = "SELECT * FROM `results` WHERE uid = ?";

  db.query(usernameQuery, uid, (err, result) => {
    if (err) {
      return res.status(200).send({
        msg: "Some Error Occured !",
        success: false
      });
    }
    if (result.length > 0) {
      message = "Result Already Submitted";
      res.send({
        msg: message,
        success: true
      });
    } else {
      let query =
        "INSERT INTO `results` (result,uid) VALUES ('" +
        JSON.stringify(results) +
        "','" +
        uid +
        "')";
      db.query(query, (err, result) => {
        if (err) {
          return res.status(200).send({
            msg: "Some Error Occured ",
            success: false
          });
        } else {
          let update_status = "update students set status = ? where uid = ?";
          db.query(update_status, [1, uid], (err, result) => {
            if (err) {
              return res.status(200).send({
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

question_route.post("/get-result", (req, res) => {

  let uid = req.body.uid;
  let query = "SELECT * from `results` WHERE uid = ?";
  db.query(query, uid, (err, result) => {
    if (err) {
      return res.status(200).send({
        msg: "Some Error Occured !",
        success: false
      });
    }
    if (result.length > 0) {
      res.status(200).send({
        success: true,
        result: result[0]
      });
    } else {
      res.status(200).send({
        success: false,
        result: null,
        msg: "No Result Found"
      });
    }

  })
});

question_route.get("/get-count", (req, res) => {

  let query = "SELECT category.category,COUNT(questions.cat_id)as added FROM questions JOIN category on questions.cat_id = category.cat_id GROUP BY questions.cat_id";
  db.query(query, (err, result) => {
    if (err) {
      return res.status(200).send({
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
        result: null,
        msg: "No Record Found"
      });
    }

  })
});

module.exports = question_route;