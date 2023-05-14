import express from 'express'
import AmazonCognitoIdentity from "amazon-cognito-identity-js"

const router = express.Router()
// import {global.fetch} from 'node-fetch'


const poolData ={
    UserPoolId: 'us-east-2_7N3RaWOvI',
    ClientId: '2bf82eju4veutp5hmfbmpv3tc'
}

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

router.get("/",(req,res) => {
    res.render("signup.ejs")
})

router.post("/",(req,res) => {
    const email = req.body.email
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword
    // console.log(password + "......"+confirm_password)
    if(password !== confirmPassword){
      return  res.redirect('/cognito?error=password')
    }
   const emailData = {
       Name : 'email',
       value : email
   }
   const emailAttribute = new AmazonCognitoIdentity.CognitoUserAttribute(emailData)
   userPool.signUp(email,password ,[ emailAttribute ],null,(err,data)=>{
       if(err){
           return console.log(err)
       }
       console.log(data.user)
   })
})

router.get("/signin",(req,res)=>{
    res.render("signin.ejs")
})
router.post("/signin",(req,res)=>{
    const loginDetails={
        Username: req.body.email,
        Password: req.body.password
    }
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(loginDetails)
    const userDetails={
        Username : req.body.email,
        Pool: userPool
    }
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userDetails)

    cognitoUser.authenticateUser(authenticationDetails,{
        onSuccess: data =>{
            console.log(data)
            res.redirect('/login-success')
        },
        onFailure: err =>{
            console.error(err)
            res.redirect('/login')
        }
    })
})
export default router 