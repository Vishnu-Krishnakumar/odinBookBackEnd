const {Router} = require("express");
const { body, validationResult } = require("express-validator");
const alphaErr = "must contain letters only";
const lengthErr = "must be at least 1 character";

const validateUser = [
    body("firstname").trim().escape()
      .isAlpha().withMessage(`First name ${alphaErr}`)
      .isLength({min:1}).withMessage(`First name ${lengthErr}`),

    body("lastname").trim().escape()
      .isAlpha().withMessage(`Last name ${alphaErr}`)
      .isLength({min:1}).withMessage(`Last name ${lengthErr}`),
      
    body("email").trim().escape()
      .isLength({min:1}).withMessage(`Email ${lengthErr}`)
      .isEmail().withMessage(`This is not a proper email`),

    body("password").trim().escape()
      .isLength({min:6}).withMessage('Your password needs to be at least 6 characters'),

    body("passwordRepeat").trim().escape()
      .custom((value,{req})=> value === req.body.password)
      .withMessage("Passwords do not match"),
  ];
  

  module.exports = [
    ...validateUser, (req,res,next)=>{

      const errors = validationResult(req);
        if(!errors.isEmpty()){
          return res.status(400).json({
            title: "Validation failed",
            errors: errors.array(),
          });
      }
      next();
    }
  ]