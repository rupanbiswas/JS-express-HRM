import express from "express";
const app = express();
import cors from "cors";
import dotenv from "dotenv"
import bodyParser from "body-parser" // importing errorHandler 
import { notFound,errorHandler } from "./middleware/error.middleware.js";
import connectDB from "./config/db.js"; // importing connect database
import hrRoutes from './routes/hr.routes.js' // importing HR routes
import employeeRoutes from "./routes/employee.routes.js"
import commonRoutes from "./routes/common.routes.js"
import cognito from "./routes/cognito.routes.js"
import swaggerJsDoc from "swagger-jsdoc"
import swaggerUI from "swagger-ui-express"
import multer from "multer";
var upload = multer({dest:'uploads/'})
import {OAuth2Client} from 'google-auth-library';
const CLIENT_ID = process.env.OAuth_G
const client = new OAuth2Client({CLIENT_ID});
import AmazonCognitoIdentity from "amazon-cognito-identity-js"
// import csv from "csv-parser";
import csv from 'fast-csv'

// import uploadef from "express-fileupload"
// app.use(uploadef())


app.use(cors());
dotenv.config();
app.use(bodyParser.urlencoded({extented: true}));
app.use(bodyParser.json({extented: true}));
app.set('view engine', 'ejs');
connectDB()


const swaggerOptions={
    swaggerDefinition: {
        info: {
            title:"HrAp API",
            version:"1.0.0",
            description:"HrAp API information",
            contact:{
                name:"appycodes"
            },
            servers:[{url:"http://localhost:8080"}]
        },
        securityDefinitions: {
                "Bearer": {
                   " name": "Authorization",
                    "in": "header",
                    "type": "apiKey"
                }
        },
  
    },
    apis:["./routes/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs));

//routes
/**
 * @swagger
 * /:
 *  get:
 *   description: this is a api to check server
 *   responses:
 *    '200':
 *     description: status o f server
 */
app.get('/',(req,res)=>{
    res.status(200).send("api is working");
})
// app.get('/login',(req, res)=>{
//     res.render('login');
// })
// app.post('/login',(req, res)=>{
//     let token = req.body.token
//     console.log(token)
//     async function verify() {
//         const ticket = await client.verifyIdToken({
//             idToken: token,
//             audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
//             // Or, if multiple clients access the backend:
//             //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
//         });
//         const payload = ticket.getPayload();
//         const userid = payload['sub'];
//         // If request specified a G Suite domain:
//         // const domain = payload['hd'];
        
//         console.log(payload.email)
//       }
//       verify().catch(console.error);
// })
// HR Routes
app.use("/hr",hrRoutes)
//employee Routes
app.use('/employee',employeeRoutes)
app.use('/me',commonRoutes)
app.use('/cognito',cognito)







app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`server has been started on ${PORT}`);
})
