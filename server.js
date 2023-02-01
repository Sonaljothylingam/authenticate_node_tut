/*//loading environment variables

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}




const express = require('express')
const app = express()
//bcrypt a package for hashing of password
const bcrypt = require('bcrypt')
//passport package installed to authenticate users
const passport = require('passport')

//initializePassport is a function in the file named passport-config
const initializePassport = require('./passport-config')
const flash = require('express-flash')
const session = require('express-session')
//calling the function 

initializePassport(
    passport,
    email =>users.find(user =>user.email === email),
    id =>users.find(user =>user.id === id)
)
// we are using a local variable to store instead of connecting to a database
const users = [] 



//to tell the browser we are using ejs

app.set('view-engine', 'ejs')

//tells the application that the form data we get should be able to access them using post method
//eg:: to use req.body.email under post method

app.use(express.urlencoded({ extended: false }))
//setting a route for home page

app.use(flash())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave:false,   //should we resave our session variable it is not changed
    saveUninitialized:false //do u wanna save a empty value in a session
}))

app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req,res) => {
  //render the home page as a respone for request

    res.render('index.ejs' , { name: 'Kyle'})
})

app.get('/login', (req,res) => {

    res.render('login.ejs')
})


app.get('/register', (req,res) => {

    res.render('register.ejs')
})

app.post('/login', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true  
 }))


app.post('/register', async (req,res) => {
   try{
     //hashes the password and stores it in a variable and hash value here is 10 which says how seccure we want the password to be
         const hashedPassword = await  bcrypt.hash(req.body.password,10)
         users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
         })
         //once registered with credentials go to login page to login with same credentials
         res.redirect('/login')
   } catch {
    //if an error has occured redirect to register page only    
    res.redirect('/register')
   }
   
    console.log(users)
})

//when we put only this sentence without the app.get('/') we get an error, i.e , empty page because we havent set a route 
app.listen(3000) 
*/


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  
  const express = require('express')
  const app = express()
  const bcrypt = require('bcrypt')
  const passport = require('passport')
  const flash = require('express-flash')
  const session = require('express-session')
  const methodOverride = require('method-override')
  
  const initializePassport = require('./passport-config')
  initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
  )
  
  const users = []
  
  app.set('view-engine', 'ejs')
  app.use(express.urlencoded({ extended: false }))
  app.use(flash())
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(methodOverride('_method'))
  
  app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name })
  })
  
  app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
  })
  
  app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))
  
  app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
  })
  
  app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      })
      res.redirect('/login')
    } catch {
      res.redirect('/register')
    }
  })
  
  app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })
  
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }
  
  app.listen(3000)