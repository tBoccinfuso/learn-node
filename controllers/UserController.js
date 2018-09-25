const mongoose = require('mongoose')

// MIDDLEWARE
// Handles the register form
exports.validateRegister = (req,res,next) => {
  req.sanitizeBody('name') //sanitize name
  req.checkBody('name', 'You must supply a name').notEmpty()
  req.checkBody('email', 'Email not valid').isEmail()
  req.sanitizeBody('email').normalizeEmail({ // normalize an email so it fits proper email structure
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  })
  req.checkBody('password', 'Password cannot be blank').noEmpty() // make sure passwords are not empty
  req.checkBody('password-confirm', 'Password cannot be blank').noEmpty() 
  req.checkBody('password-confirm', 'Passwords do not match!').equals(req.body.password) // Make sure passwords match

  const errors = req.validationErrors() // check all the validators
  if (errors) {
    req.flash('error', errors.map(err => err.msg))
    res.render('register', {
      title: 'Register',
      body: req.body,
      flashes: req.flash()
    })
    return
  }
  next() // no errors
}

exports.loginForm = (req, res) => {
  res.render('login', {
    title: 'Login Form'
  })
}

exports.registerForm = (req, res) => {
  res.render('register', {
    title: 'Register Form'
  })
}