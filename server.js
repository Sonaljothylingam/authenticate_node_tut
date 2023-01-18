const express = require('express')
const app = express()
//bcrypt a package for hashing of password
const bcrypt = require('bcrypt')


// we are using a local variable to store instead of connecting to a database
const users = [] 



//to tell the browser we are using ejs

app.set('view-engine', 'ejs')

//tells the application that the form data we get should be able to access them using post method
//eg:: to use req.body.email under post method

app.use(express.urlencoded({ extended: false }))
//setting a route for home page

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

app.post('/login', (req,res) => {

})


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