//The local authentication strategy authenticates users using a username and password
const LocalStrategy = require('passport-local').Strategy
//we need bcrypt package to authenticate the password in the authenticateUser function
const bcrypt = require('bcrypt')



//If email id and password submitted by the user matches with these values, we return the email id of the user. If no match is found then we return false to indicate that authentication failed.
//This is possible with the help of done() function. It is an internal passport js function that takes care of supplying user credentials after user is authenticated successfully. This function attaches the email id to the request object so that it is available on the callback url as "req.user".
function initialize(passport, getUserByEmail , getUserById) { //we need to pass the function here getUserByEmail because we are actually creatint the function
//check if user is correct or not 
 const authenticateUser = async(email, password, done) =>{
 //we start by getting the user
 const user= getUserByEmail(email) //The getUserByEmail function is a func that we need to create which gets the user by their email id. (Returns null if no user found)
 //check  if email id == null
  if(user == null) {
    return done(null, false, { meassage: 'No Email with this user'})
    //null because no erros, false because no user email , meassage to display in the end
  }
   
   try{
     //compare the password entered by user with the one in users array
     //await before bcrypt
     if(await bcrypt.compare(password , user.password)) {
     //authenticate succesfull because password correct
        return done(null, user)
   } else{
    // password inncorrect
    return done(null, false , {meassage: 'Password incorrect. (no user found)'})
   }
   
}catch (e){

  return done(e)

   }

 }

passport.use(new LocalStrategy({ usernameField: 'email'}, authenticateUser))
//passport.serializeUser() is setting id as cookie in user’s browser
//passport.deserializeUser() is getting id from the cookie, which is then used in callback to get user info or something else, based on that id or some other piece of information from the cookie…
//In deserializeUser that key is matched with the in memory array / database or any data resource.
//The fetched object is attached to the request object as req.user
passport.serializeUser((user, done) =>done(null, user.id))
passport.deserializeUser((id, done) =>{  return done(null, getUserById(id)) })
}

//calling initialize function 
module.exports = initialize