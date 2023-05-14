import asyncHandler from "express-async-handler";
import HR from "../models/HR.model.js";
import verify from "../models/hr.verification.js";
import forgotPasswordToken from "../models/hr.forgotPasssword.verification.js";
import organisationModel from "../models/organisation.js";
import generateToken from "../utils/generate.token.js";
import mail from "../utils/verification.mail.js";
import randomStr from "../utils/random.str.js";
import timeDiff from "../utils/timeDifference.js";
import allotedLeaves from "../models/alloted.leaves.js";
import employeeAttendence from "../models/employee.attendence.js"
import {
  parse
} from "json2csv"
import { uploadFile } from "../utils/s3.js";
import {website} from "../utils/enviroments.js"
import employeeLeaveAllotment from "../models/employee.leaves.allotment.js";
import holiday from "../models/holidays.js";
import fs from "fs"
// import { resolveContent } from "nodemailer/lib/shared";
// const randomnumberforsignup = Math.floor(Math.random() * 1001);
async function sendHREmailVerification(hr) {
  let email = hr.email;
  let token = randomStr(32, "123456789abcdefghi");
  const hrToken = await verify.create({
    hr: hr._id,
    email,
    token,
  });
  if (hrToken) {
    let content = {
      subject: `Email verification`,
      message: `${website}/identity-verification?token=${token}&email=${email}`
    }
    mail(email, content);
  }
}

//hr re-verification
async function sendHRReEmailVerification(token, email) {
  let content = {
    subject: `Email verification`,
    message: `${website}/identity-verification?token=${token}&email=${email}`
  }
  mail(email, content);

}

// to create token for forgotPasswordVerification
const hrVerificationForForgetPassword = async (hrEmail, id) => {
  let email = hrEmail;
  let token = randomStr(32, "123456789abcdefghi");
  const hrToken = await forgotPasswordToken.create({
    hr: id,
    email,
    token,
  });
  if (hrToken) {
    let content = {
      subject: `Reset password`,
      message: `${website}/forgot-password?token=${token}&email=${hrToken.email}`
    }
    mail(email, content);
  }
};

// access public
// /hr/register
// to register hrs
// method post

const hrRegister = asyncHandler(async (req, res) => {
  const {first_name,last_name,organisation_name, email,gender,phone_number,websiteURL,address,country,number_of_employees,password} = req.body;
  try {
    const hrExists = await HR.findOne({
      email: email,
    })
    //check if the hr is already registered and if so than re-verification mail is sent
    if (hrExists && hrExists.verified == false) {
      console.log("its present")
      // sendHREmailVerification(hrExists);
      const reverification = await verify.findOne({
        email: email
      })
      sendHRReEmailVerification(reverification.token, reverification.email)    //re email verification is
      res.status(200).send("hr exists and verification mail is sent");
    } else if (hrExists) {
      response.status(400);
      throw new Error("hr exists");

    } 
    //new hr is registered in hr database
    else
     {
      const organisationCreate = await organisationModel.create({   //organisation created
        organisationName: organisation_name,
        websiteURL: websiteURL,
        address: address,
        country: country,
        numberOfEmployees: number_of_employees,
      });

      const hr = await HR.create({     //hr created
        organisation: organisationCreate._id,
        firstName: first_name,
        lastName: last_name,
        email: email,
        phoneNumber: phone_number,
        gender: gender,
        password: password,
        verified: false,
        HR: true,
      });
      if (hr && organisationCreate) {
        const hrReason = "HREmailVErification"     //hr email verification main is sent 
        sendHREmailVerification(hr);
        res.status(201).json(hr._id);
      } else {
        res.status(404)
        throw new Error("hr not created please try again later");

      }
    }

  } catch (error) {
    res.status(500)
    throw new Error("internal server error: " + error)
  }

});

// access public
// /hr/register method PUT
// to verify hrs
// method post
const hrVerification = asyncHandler(async (req, res) => {
  const {
    token,
    email
  } = req.body;
  console.log(token+email)
  try {
    const check = await verify.findOne({
        token,
        email,
        status: false,
      })
      .populate("hr", "_id");
    if (check) {
      const min = timeDiff(check.createdAt);
      if (min < 30) {
        const hr = await HR.findById(check.hr._id).populate("organisation");
        if (hr) {
          hr.verified = true;
          const organisation = await organisationModel.findById(hr.organisation._id);
          organisation.verified = true;
          let verifiedOrganisation = await organisation.save()

        }

        const updateHR = await hr.save();
        check.status = true;
        const updatedCheck = await check.save();
        res.status(201).json({
          success: true
        });
      } else {
        res.status(404).json;
        throw new Error("email verification failed");
      }
    }
  } catch (error) {
    res.status(500)
    throw new Error("internal server error: " + error)
  }

});

//Auth hr & get token
// post /hr/login
//access public
const authHR = asyncHandler(async (req, res) => {
  const {
    email,
    password,
    method,
    token
  } = req.body;

  if(method=="google") {
    const checkAuth = authGoogle(token);
    const email = checkAuth.email;

  try {
    const hr = await HR.findOne({
      email: email
    }).populate("organisation")

    if (hr) {
      if (hr) {
        res.status(200).json({
          _id: hr._id,
          name: hr.name,
          email: hr.email,
          token: generateToken(hr._id),
          hr: hr.HR,
          organisation: hr.organisation
        });
      }
    }
  } catch (error) {
    res.status(404)
    throw new Error("invalid username or password")
  }
  }


  try {

    const hr = await HR.findOne({
      email,
    }).populate("organisation");
    if (hr && (await hr.matchPassword(password))) {
      res.status(201).json({
        _id: hr._id,
        name: hr.name,
        email: hr.email,
        isAdmin: hr.isAdmin,
        token: generateToken(hr._id),
        hr: hr.HR,
        organisation: hr.organisation
      });
    } else {
      res.status(404);
      throw new Error("invalid email or password");
    }
  } catch (error) {
    res.status(500)
    throw new Error( error)
  }
});

// enter email to get link for restore password
// path /hr/forgotpassword
// access public
// method post

const forgotPassword = asyncHandler(async (req, res, next) => {
  const email = req.body.email;
  try {
    const hr = await HR.findOne({
      email,
    });
    const reason = "hrVerificationForgotPassword"
    hrVerificationForForgetPassword(
      email,
      hr._id,
      reason
    );
    res.status(200).json({
      mailsent: true
    })
    next();
  } catch (error) {
    res.status(400);
    throw new Error("hr not found" + error);
  }
});

// tocheck the token of forget password
// method GET
const checkForgetPasswordToken = asyncHandler(async (req, res) => {
  // const {
  //     email,
  //     token
  // } = req.body
  const email = req.query.email;
  const token = req.query.token;

  try {
    const check = await forgotPasswordToken
      .findOne({
        token,
      })
      .populate("hr", "_id");

    if (check && check.status == false) {
      if (check.email == email) {
        res.status(200).json({
          success: "ture",
          id: check.hr._id,
        });
      }
    }
  } catch (error) {
    res.status(400);
    throw new Error("authentication failed" + error);
  }
});

// to reset password
// method put /hr/forgotpassword

const newForgotPasswords = asyncHandler(async (req, res) => {
  const _id = req.body._id;
  const token = req.body.token;
  const newPassword = req.body.new_password;

  try {
    const hr = await HR.findById(_id);
    const verify = await forgotPasswordToken.findOne({
      token,
    });
    const min = timeDiff(verify.createdAt);
    if (min < 30) {
      if (hr && verify) {
        if (verify.email == hr.email) {
          hr.password = newPassword;
          verify.status = true;
        }
      }
      const updatedPassword = await hr.save();
      await verify.save();
      res.status(201).json({
        success: true
      });
    }
  } catch (error) {
    res.status(400);
    throw new Error("can not reset password" + error);
  }
});

// to change password
// route hr/changepassword  PUT
//access protected
const changePassword = asyncHandler(async (req, res) => {
  const newPassword = req.body.new_password;
  try {
    const hr = await HR.findById(req.hr._id);
    if (hr) {
      hr.password = newPassword;
    }
    const updatedhr = await hr.save();
    res.status(201).json(updatedhr._id);
  } catch (error) {
    res.status(400);
    throw new Error("password not changed" + error);
  }
});



// to allot leaves to particuler employee
// access protect hrcheck 
//method POST
const allotedLeave = asyncHandler(async (req, res) => {
  const leaves = req.body.leaves
  try {
    const allotedLeavesEmployees = await allotedLeaves.create({
      hr:req.hr._id,
      organisation:req.hr.organisation,
      leaves:leaves
    }
    )
    if (allotedLeavesEmployees) {
      res.status(201).json(allotedLeavesEmployees)
    } else {
      res.status(404).json({
        success: false
      })
    }
  } catch (error) {
    res.status(500)
    throw new Error("internal error" + error)
  }

})

// to update leaves to particuler employee
// access protect hrcheck 
//method put
const updateAllotedLeave = asyncHandler(async (req, res) => {
  const leaves = req.body.leaves
  const organisation = req.hr.organisation
  try {
    const allotedLeavesEmployees = await allotedLeaves.findOne({
      organisation: organisation
    })
    if (allotedLeavesEmployees) {
      allotedLeavesEmployees.leaves = leaves
      const done = allotedLeavesEmployees.save()
      if (done) {
        res.status(201).json({success: true});
      }

    } else {
      res.status(404).json({
        success: false
      })
    }
  } catch (error) {
    res.status(500)
    throw new Error("internal error" + error)
  }

})



// route /hr/get-allotedLeaves
//method get 
//access private
const getAllotedLeaves = asyncHandler(async (req, res) => {
  try {
    const leaves = await allotedLeaves.findOne({
      organisation: req.hr.organisation
    })
    if (leaves) {
      res.status(200).json(leaves)
    } else {
      res.status(404).send("organisation not found")
    }
  } catch (error) {
    res.status(500)
    throw new Error("internal server error" + error)
  }

})

//method post to allot leaves to the employees
const allotEmployeeLeave = asyncHandler(async (req, res) => {
const {employee,leaves} = req.body
const organisation = req.hr.organisation
try {
  const allotLeave = await employeeLeaveAllotment.create(
    {
      employee: employee,
      organisation: organisation,
      allotedLeaves: leaves
    })
    if(allotLeave) {
      res.status(201).json(allotLeave)
    }else{
      res.status(404).json({success: false})
    }
  
} catch (error) {
  res.status(500)
  throw new Error("internal server error"+ error)
}
})

//method to update leave of an employee
const updateEmployeeLeave = asyncHandler(async(req, res)=>{
  const {employee,leaves}= req.body
  const organisation = req.hr.organisation
  try{
    const allotLeave = await employeeLeaveAllotment.findOne({employee:employee,organisation:organisation})
    if(allotLeave){
      allotLeave.allotedLeaves= leaves
      const success= allotLeave.save()
      if(success) {
        res.status(201).json({success:true})
      }else{
        res.status(404).json({success : false})
      }
    }
  }catch(error){
res.status(500)
throw new Error("internal server eror"+error)
  }
})


//method to get alloted leave of an employee or all employee
const employeeAllotedLeaves = asyncHandler(async(req, res)=>{
  const {employee,all} = req.body
  try {
    
  if (all == true) {
    console.log("true")
    var employeeLeave = await employeeLeaveAllotment.find({organisation:req.hr.organisation})
  }
  else if (all == false) {
    var employeeLeave = await employeeLeaveAllotment.findOne({employee:employee,organisation:req.hr.organisation})
  }
  if (employeeLeave){
res.status(200).json(employeeLeave)
  }else{
    res.status(404).json({success: false})
  }
  } catch (error) {
    res.status(500)
    throw new Error("internal server error: " + error)
  }
})

//allots holidays to an organisation
const holidayController = asyncHandler(async (req, res) => {
  const datas = req.body.datas

  try {
    const holidayData = await holiday.create({
      hr: req.hr._id,
      organisation: req.hr.organisation,
      datas: datas
    })
    if (holidayData) {
      res.status(201).json(holidayData)
    } else {
      res.status(404).json({
        success: false
      })
    }
  } catch (error) {
    res.status(500)
    throw new Error("internal server error" + error)
  }
})

//update holidays in an organisation
const updateHoliday = asyncHandler(async (req, res) => {
  const datas = req.body.datas 

  try {
    var holidayData = await holiday.findOne({organisation:req.hr.organisation})
    if(holidayData){
      holidayData.datas = datas
    }
    const success = holidayData.save()
    if (success){
      res.status(201).json({success: true})
    }else{
      res.status(404).status
    }
  } catch (error) {
    res.status(500)
    throw new Error("internal server error"+ error)
  }

})

//get all the holidays of an organisation
const getHolidays = asyncHandler(async (req, res) => {
  try {
    var holidayData = await holiday.findOne({organisation: req.hr.organisation})
    if(holidayData){
      res.status(200).json(holidayData)
    }else{
      res.status(404).json({success: false})
    }
  } catch (error) {
    res.status(500)
    throw new Error("internal server error"+error)
  }
})





//attendence summary according to the user request
const employeeAttendenceSummary = asyncHandler(async (req, res) => {
  const organisation = req.hr.organisation

  const startMonth = Number(req.query.startMonth)
  const endMonth = Number(req.query.endMonth)
  const startYear = Number(req.query.startYear)
  const endYear = Number(req.query.endYear)
  try {
    if (startYear !== endYear) {
      var summary = []

      for (var i = startYear; i <= endYear; i++) {
        for (var j = startMonth; j <= endMonth; i++) {
          const summaryAttendence = await employeeAttendence.find({
            organisation: organisation,
            year: i,
            month: j
          })
          summary.push(summaryAttendence);

          const csvString = parse(summary);
          res.setHeader('Content-disposition', 'attachment; filename=shifts-report.csv');
          res.set('Content-Type', 'text/csv');
          res.status(200).send(csvString);
        }
      }

    } else if (startYear === endYear) {
      if (startMonth !== endMonth) {
        var summary = []
        for (var i = startMonth; i <= endMonth; i++) {
          const summaryAttendence = await employeeAttendence.find({
            organisation: organisation,
            year: startYear,
            month: i
          })
          summary.push(summaryAttendence)

          const csvString = parse(summary);
          res.setHeader('Content-disposition', 'attachment; filename=shifts-report.csv');
          res.set('Content-Type', 'text/csv');
          res.status(200).send(csvString);
        }


      } else if (startMonth == endMonth) {
        const summary = await employeeAttendence.find({
          organisation: organisation,
          year: startYear,
          month: startMonth
        })
        const csvString = parse(summary);
        res.setHeader('Content-disposition', 'attachment; filename=shifts-report.csv');
        res.set('Content-Type', 'text/csv');
        res.status(200).send(csvString);

      }
    }
  } catch (error) {
    res.status(500)
    throw new Error("internal server error" + error);
  }

})

//logo upload of an organisation
const imageUpload = asyncHandler(async (req, res) => {
const file = req.file
const path = req.file.path
console.log(path)
try {
  const result = await uploadFile(file)
if(result){
  const organisation_id = req.hr.organisation
  const organisation = await organisationModel.findOne({_id:organisation_id})
  if(organisation){
    organisation.logo = result
   const saveDone =  organisation.save()
   if (saveDone) {
    fs.unlinkSync(req.file.path)
    res.status(201).json({success: true})
   }
   else{
    fs.unlinkSync(req.file.path)
     res.status(404).json({success: false})
   }
  }
}
} catch (error) {
  res.status(500)
  throw new Error("internal server error"+ error)
}



})
export {
  hrRegister,
  hrVerification,
  authHR,
  forgotPassword,
  newForgotPasswords,
  changePassword,
  checkForgetPasswordToken,
  allotedLeave,
  updateAllotedLeave,
  getAllotedLeaves,
  employeeAttendenceSummary,
  holidayController,
  imageUpload,
  allotEmployeeLeave,
  updateEmployeeLeave,
  employeeAllotedLeaves,
  updateHoliday,
  getHolidays
};