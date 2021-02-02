const express = require("express");
const category_route = express.Router();
const { encrypt, decrypt } = require("../tools/encrypt-decrypt");

// middleware that is specific to this router
category_route.use(function timeLog(req, res, next) {
  //console.log(req.ip, " => Time: ", new Date().toUTCString());
  next();
});

category_route.post("/add", function(req, res) {
  let start_time = req.body.date;
  let category = req.body.category;
  let query = "SELECT * FROM `category` WHERE category = '" + category + "'";

  db.query(query, (err, result) => {
    if (err) {
      return res.status(200).send({
        msg: "Some Error Occured !",
        success: false
      });
    }
    if (result.length > 0) {
      res.status(200).send({
        msg: "Category already exists",
        success: false
      });
    } else {
      let query = "INSERT INTO `category` (category,start_time) VALUES (?,?)";
      db.query(query, [category, start_time], (err, result) => {
        if (err) {
          return res.status(200).send({
            msg: "Some Error Occured !",
            success: false
          });
        }
        res.status(200).send({
          msg: "Category Added Successfully !",
          success: true
        });
      });
    }
  });
});
// define the about route
category_route.get("/categories", function(req, res) {
  let query = "SELECT * FROM `category`";

  // execute query
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).send({
        message: "Some Error Occured !",
        success: false
      });
    }
    if (result.length > 0) {
      let data = [];
      result.forEach(elmt => {
        elmt.cat_id = encrypt(elmt.cat_id);
        data.push(elmt);
      });
      res.json({
        success: true,
        categories: data
      });
    } else {
      let data = {
        success: false,
        student: null,
        msg: "no category found"
      };
      res.json(data);
    }
  });
});

category_route.post("/cat-by-id", function(req, res) {
  let cat_id = parseInt(decrypt(req.body.cat_id));
  let query = "select category,start_time from category where cat_id = ?";
  db.query(query, cat_id, (err, result) => {
    if (err) {
      return res.status(500).send({
        message: "Some Error Occured !",
        success: false
      });
    }
    if (result.length > 0) {
      let data = {
        success: true,
        category: result[0]
      };
      res.json(data);
    } else {
      let data = {
        success: false,
        category: null,
        msg: "no category found"
      };
      res.json(data);
    }
  });
});

category_route.post("/delete", function(req, res) {
  let cat_id = parseInt(decrypt(req.body.cat_id));
  let query = "delete from category where cat_id = ?";
  db.query(query, cat_id, (err, result) => {
    if (err) {
      return res.status(500).send({
        message: "Some Error Occured !",
        success: false
      });
    }
    res.status(200).send({
      success: true,
      msg: "category deleted"
    });
  });
});

module.exports = category_route;
