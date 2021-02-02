const express = require("express");
const result_route = express.Router();
const {
  decrypt
} = require('../tools/encrypt-decrypt');

result_route.use(function timeLog(req, res, next) {
  //console.log(req.ip, " => Time: ", new Date().toUTCString());
  next();
});

result_route.post('/result-by-id', (req, res) => {

  let cat_id = parseInt(decrypt(req.body.cat_id));
  let query = "select results.result,results.uid,students.name from `results` INNER JOIN `students` on students.cat_id=? and students.uid = results.uid";
  db.query(query, cat_id, (err, result) => {
    if (err) {
      return res.status(500).send({
        msg: "Some Error Occured !",
        success: false
      });
    }
    res.status(200).send({
      success: true,
      results: result
    });
  });
})

module.exports = result_route;