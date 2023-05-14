import asyncHandler from "express-async-handler";
import HR from "../models/HR.model.js";
import verify from "../models/hr.verification.js";
import forgotPasswordToken from "../models/hr.forgotPasssword.verification.js";
import inviteEmployeeModel from "../models/invite.employee.js";
import employeeModel from "../models/employee.model.js";
import organisationModel from "../models/organisation.js";
import generateToken from "../utils/generate.token.js";
import mail from "../utils/verification.mail.js";
import randomStr from "../utils/random.str.js";
import employeeForgotPasswordToken from "../models/employee.forgetPassword.js";
import timeDiff from "../utils/timeDifference.js";
import fs from "fs"
// import fast from "fast-csv"
// import csv from "csvtojson"
import csv from "csv-parser"
import allotedLeaves from "../models/alloted.leaves.js"
import leaveApplication from "../models/leave.application.js";
import employeeAttendence from "../models/employee.attendence.js";
import employeeLeaveAllotment from "../models/employee.leaves.allotment.js";
import holiday from "../models/holidays.js";
// import auth from "../utils/google.auth.login.js";
import authGoogle from "../utils/google.auth.login.js";
import {website} from "../utils/enviroments.js"
import createAttendence from "../utils/createNewOutAttendence.js";


//  function createEmailInvition(data, hrId, organisationId){
const createEmailInvition = (data, hrId, organisationId) => {
  const firstName = data.first_name;
  const lastName = data.last_name;
  const email = data.email;
  let token = randomStr(32, "123456789abcdefghi");

  return new Promise(async (resolve, reject) => {
    try {
      const employeeData = await inviteEmployeeModel.create({
        hr: hrId,
        organisation: organisationId,
        firstName,
        lastName,
        email,
        token,
      })

      resolve(employeeData)

    } catch (error) {
      reject(error)
    }
  })


};
const sendEmailInvitation = async (id) => {
  const employeeInviteData = await inviteEmployeeModel.findById(id)
  if (employeeInviteData) {
    let email = employeeInviteData.email
    let content = {
      subject: `you are invited by ${employeeInviteData.organisation}`,
      message: `${website}/invite?token=${employeeInviteData.token}&email=${employeeInviteData.email}`
    }
    mail(employeeInviteData.email, content);
  }
};

//create invite employee from raw data
//POST /invite-employee
//acress protect and HR
const createInviteEmployee = asyncHandler(async (req, res) => {
  try {
    const hrId = req.hr._id;
    const organisation = req.hr.organisation;
    const datas = req.body.datas;

    datas.forEach((data) => {

      const employeeToken = createEmailInvition(data, hrId, organisation)
        .then((inviteData) => {
          sendEmailInvitation(inviteData._id)
        })
      res.status(200).json({
        mailsent: true
      })
    });
  } catch (error) {
    res.status(404);
    throw new Error(error.message);
  }
});

//create invite employee from cvs
//POST /invite-employee/bulk
//acress protect and HR
const createInviteEmployeeBulk = asyncHandler(async (req, res) => {
  const hrId = req.body.hr_id;
  const organisationId = req.body.organisation_id;

  const datas = [];
  try {
    if (req.files) {
      // console.log(req.files)
      var file = req.files.filename;
      const filename = req.hr._id + ".csv";
      file.mv("./upload/" + filename, function (err) {
        if (err) {
          res.send("error in file upload")
        } else {
          fs.createReadStream(`../upload/${req.hr._id}`)
            .pipe(csv({}))
            .on("data", () => datas.push(data))
            .on("end", () => {
              console.log(datas)
            });


          //  console.log(fs.createReadStream("./upload/"+filename))
          //  fs.createReadStream("./upload/"+filename)
          //   .pipe(csv({
          //     delimiter:','
          //   }))
          //   .on('data',()=>
          //   {
          //     console.log(data)
          //     datas.push(data)
          //   }
          //   )
          //   .end('end',()=>{
          //     console.log(datas)
          //   })
          //   datas.forEach((data) => {

          //     const employeeToken = createEmailInvition(data, hrId, organisationId)
          //       .then((inviteData) => {
          //         sendEmailInvitation(inviteData._id, reason)
          //       })
          //     })

        }
      })


    }
    // console.log(file)
    // fs.createReadStream(req.files.filename)
    // .pipe(csv())
    //   .on("data", () => result.push(data))
    //   .on("end", () => {
    //     console.log(data)
    //   });
    //       csv()
    // .fromString(req.files.filename.data.toString('utf8'))
    // .on('json', (user) => {
    //     console.log(user);
    // })
    // .on('done', () => {
    //     console.log('done parsing');
    // });

    // console.log(result)
    // inviteEmployeeFunction(employeeEmail, _id)
  } catch (error) {
    res.status(404);
    throw new Error(error.message);
  }
});

//to validate invited employees by the employeer
// get /hr/invite-employee
//access public
const inviteEmployeeController = asyncHandler(async (req, res) => {
  const email = req.query.email;
  const token = req.query.token;
  const employee = await inviteEmployeeModel.findOne({
    token,
    email
  });
  const min = timeDiff(employee.createdAt);
  if (min < 43800) {
    try {
      if (employee && employee.status == false) {
        res.status(200).json({
          valid: true,
          _id: employee._id,
          email: employee._email,
        });
      }
    } catch (error) {
      res.status(404)
      throw new Error("not valid token or email");
    }
  } else {
    res.status(404)
    throw new Error("link expired")
  }
});

//register employee
//access public
//post /employee/register-employee
const registerEmployee = asyncHandler(async (req, res) => {
  // const token = req.body.token;
  const {
    email,
    address,
    country,
    gender,
    phone_number,
    password,
    token
  } = req.body;
// console.log(req.body)
  try {
    const tokenVerification = await inviteEmployeeModel.findOne({
      token: token,
      email: email,
    });
    if (tokenVerification) {
      // console.log(tokenVerification)
      const employee = await employeeModel.create({
        hr: tokenVerification.hr,
        organisation: tokenVerification.organisation,
        firstName: tokenVerification.firstName,
        lastName: tokenVerification.lastName,
        email: email,
        address: address,
        position:"employee",
        country: country,
        gender: gender,
        phoneNumber: phone_number,
        password: password,
      });
      if (employee) {
        // console.log(employee)
        tokenVerification.status = true;
        tokenVerification.save();
      res.status(201).json({
        created: true,
      });
      }else{
        res.status(404).json({success: false})
      }
      
    }
  } catch (error) {
    res.status(500);
    throw new Error("internal server error"+ error);
  }
});

//login employee
//access public
//post /employee/login
const loginEmployee = asyncHandler(async (req, res) => {
  const {
    email,
    password,
    method,
    token
  } = req.body;

  if (method == "google") {
    const checkAuth = authGoogle(token);
    const email = checkAuth.email;

    try {

      const employee = await employeeModel.findOne({
        email:email
      }).populate("hr").populate("organisation")
      if (employee) {
        res.status(200).json({
          _id: employee._id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          HR_name: employee.hr.name,
          organisationName: employee.organisation.name,
          token: generateToken(employee._id),
          hr: employee.HR
        });
      } else {
        res.status(404).send("user not found")
      }
    } catch (error) {
      res.status(500)
      throw new Error("invalid username or password")
    }


  } 
    try {
      const employee = await employeeModel.findOne({
        email: email
      }).populate("hr").populate("organisation")

      if (employee) {
        if (employee && (await employee.matchPassword(password))) {


          res.status(200).json({
            _id: employee._id,
            firstNAme: employee.firstName,
            lastName: employee.lastName,
            HR_name: employee.hr.name,
            organisationName: employee.organisation.name,
            token: generateToken(employee._id),
            hr: employee.HR
          });
        }
        else{
          res.status(404)
          throw new Error("invalid username or password")
        }
      }
      else{
        res.status(404)
        throw new Error("invalid username or password")
      }
    } catch (error) {
      res.status(500)
      throw new Error(error)
    }

  



});

//change password of employee
//access procteEmployee
//post /employee/change-password
const changeEmployeePassword = asyncHandler(async (req, res) => {
  const newPassword = req.body.new_password;
  try {
    const employee = await employeeModel.findById(req.employee._id);
    if (employee) {
      employee.password = newPassword;
    }
    const updatedEmployee = await employee.save();
    res.status(201).json(updatedEmployee._id);
  } catch (error) {
    res.status(400);
    throw new Error("password not changed" + error);
  }
});

const updateProfile = asyncHandler(async (req, res) => {
  const {
    first_name,
    last_name,
    address,
    country,
    gender,
    phone_number
  } =
  req.body;

  try {
    const employee = await employeeModel.findById(req.employee._id);
    if (employee) {
      employee.firstName = first_name;
      employee.lastName = last_name;
      employee.address = address;
      employee.country = country;
      employee.gender = gender;
      employee.phoneNumber = phone_number;
    }

    await employee.save();
    res.status(201).json({
      success: true,
    });
  } catch (error) {
    res.status(404).json({
      error: error,
    });
  }
});


const employeeVerificationForgetPassword = async (hrEmail, id, reason) => {
  let email = hrEmail;
  let token = randomStr(32, "123456789abcdefghi");
  const hrToken = await employeeForgotPasswordToken.create({
    employee: id,
    email,
    token,
  });
  if (hrToken) {
    let content = {
      subject: `password reset`,
      message: `${website}/invite?token=${token}&email=${email}`
    }
    mail(email, content);
  }
};
//method POST to
// employee/employee-forget-password
//access public
const employeeForgetPassword = asyncHandler(async (req, res) => {
  const email = req.body.email;
  try {
    const employee = await employeeModel.findOne({
      email
    });
    if (employee) {
      employeeVerificationForgetPassword(
        email,
        employee._id,
      );
      res.status(200).json({
        mailsent: true
      })
    }

  } catch (error) {
    res.status(400)
    throw new Error("employee not found" + error)
  }

});



// tocheck the token of forget password
// method GET
const checkEmployeeForgetPasswordToken = asyncHandler(async (req, res) => {

  const email = req.query.email;
  const token = req.query.token;

  try {
    const check = await employeeForgotPasswordToken
      .findOne({
        token
      })
      .populate("employee", "_id");

    if (check && check.status == false) {
      if (check.email == email) {
        res.status(200).json({
          success: "ture",
          id: check.employee._id,
        });
      }
    }
  } catch (error) {
    res.status(400);
    throw new Error("authentication failed");
  }
});

//to reset the password
//access after frontend gets token verified
const employeeResetPassword = asyncHandler(async (req, res) => {
  const _id = req.body._id;
  const token = req.body.token;
  const newPassword = req.body.new_password;

  try {
    const employee = await employeeModel.findById(_id);
    const verify = await employeeForgotPasswordToken.findOne({
      token,
    });
    const min = timeDiff(verify.createdAt);
    if (min < 30) {
      if (employee && verify && verify.status == false) {
        if (verify.email == employee.email) {
          employee.password = newPassword;
          verify.status = true;
        }
      }
      const updatedPassword = await employee.save();
      await verify.save();
      res.status(201).json(updatedPassword._id);
    }
  } catch (error) {
    res.status(400);
    throw new Error("can not reset password" + error);
  }
})


//to apply leave by the employee
//method POST 
//access employee
const employeeLeaveApplication = asyncHandler(async (req, res) => {
 const employee = req.employee._id
 const organisation = req.employee.organisation
  const {
    startDate,
    endDate,
    reason,
    count
  } = req.body
  const allotedLeavesOfEmployee = await employeeLeaveAllotment.findOne({
    employee: employee
  })
  if (allotedLeavesOfEmployee.allotedLeaves.length !== 0) {
    allotedLeavesOfEmployee.allotedLeaves.map((alloted) => {
      if (alloted.reason == reason) {
        allotedLeavesOfEmployee.leavesTaken.map(async (taken) => {
          if (taken.reason == reason && count >= (alloted.number - taken.number)) {

            try {
              const application = await leaveApplication.create({
                employee,
                organisation,
                startDate,
                endDate,
                reason,
                count
              })
              if (application) {
                res.status(201).json({
                  success: true
                })
              } else {
                res.status(404).json({
                  success: false
                })
              }
            } catch (error) {
              res.status(500)
              throw new Error("internal server error: " + error)
            }
          } else if (taken.reason !== reason) {
            try {
              const application = await leaveApplication.create({
                employee,
                organisation,
                startDate,
                endDate,
                reason,
                count
              })
              if (application) {
                res.status(201).json({
                  success: true
                })
              } else {
                res.status(404).json({
                  success: false
                })
              }
            } catch (error) {
              res.status(500)
              throw new Error("internal server error: " + error)
            }
          } else {
            res.status(404).send("no leaves left for the particular reason")
          }
        })
      }
    })
  } else {
    res.status(200).send("no leave left")
  }



})



//to aprove leave application
//access hrcheck
//method put
const employeeLeavestatus = asyncHandler(async (req, res) => {
  const {
    application_id
  } = req.body
  let present
  try {
    const application = await leaveApplication.findById(application_id)
    if (application) {
      application.approved = true;
      const employeeLeaves = await employeeLeaveAllotment.fineOne({
        employee: application.employee
      })
      for (i = 0; i < employeeLeaves.leavesTaken.length; i++) {
        if (employeeLeaves.leavesTaken[i] == application.reason) {
          present = true;
        } else {
          present = false;
        }
      }
      if (present == false) {
        toInsertLeave = employeeLeaves.leavesTaken.push({
          reason: application.reason,
          number: application.count
        })
        employeeLeaves.leavesTaken = toInsertLeave
      } else {
        const newEmployeeLeaveAllotment = employeeLeaves.leavesTaken.map((leave) => {
          if (leave.reason == application.reason) {
            leave.number = leave.number + application.count
          }
          return (leave)
        })
        employeeLeaves.leavesTaken = newEmployeeLeaveAllotment
      }
      employeeLeaves.save()
      const approvedApplication = await application.save();
      if (approvedApplication) {
        res.status(201).json({
          success: true
        })
      }
    }

  } catch (error) {
    res.status(500)
    throw new Error("internal server error: " + error)
  }
})


//to view all the leave application
//method GET
//access hrcheck
const viewLeaveApplicattion = asyncHandler(async (req, res) => {
  const organisation = req.hr.organisation
  console.log(organisation)
  try {
    const applications = await leaveApplication.find()
    applications.forEach((application) => {
      console.log(application)
      if (application.organisaiton == organisation) {
        res.status(200).json(application)
      } else {
        res.status(404).json({
          error: true
        })
      }
    })


  } catch (error) {
    res.status(500)
    throw new Error("internal server error:" + error)
  }

})

//to delete leave-application
//method DELETE
//access hrcheck
const deleteApplication = asyncHandler(async (req, res) => {
  const application_id = req.body.application_id
  try {
    const application = await leaveApplication.findById(application_id).remove()
    console.log(application)
    if (application) {
      res.status(200).json({
        success: true
      })
    } else {
      res.status(404).json({
        success: false
      })
    }
  } catch (error) {
    res.status(500)
    throw new Error('internal server error: ' + error)
  }

})




//attendence of an employee
//method POST
const employeeAttendenceController = asyncHandler(async (req, res) => {
  const employee_id= req.employee._id
  const organisation_id = req.employee.organisation
  const {
    created_by,
    position,
    check_in,
    check_out
  } = req.body
  const presentMonth = new Date().getMonth() + 1
  const presentYear = new Date().getFullYear()
  const presentDate = new Date().getDate()
  const presentTime = new Date().getTime()


  try {

    const employeeMatch = await employeeAttendence.find({
      employee: employee_id
    })
    if (employeeMatch.length !== 0) {
      const yearMatch = await employeeAttendence.find({
        employee: employee_id,
        year: presentYear
      })
      if (yearMatch.length !== 0) {
        const monthMatch = await employeeAttendence.findOne({
          employee: employee_id,
          month: presentMonth
        })
        if (monthMatch) {
          if (check_in == true) {
            const checkinAttendence = monthMatch.checkin_attendence
            const newcheckinAttendence = checkinAttendence.push({
              date: presentDate,
              time: presentTime
            })
            monthMatch.checkinAttendence = newcheckinAttendence
            const done = monthMatch.save()
            if (done) {
              res.status(201).json({
                success: true
              })
            } else {
              res.status(404).json({
                success: false
              })
            }
          } else if (check_out == true) {
            const checkinAttendence = monthMatch.checkin_attendence
            const newcheckinAttendence = checkinAttendence.push({
              date: presentDate,
              time: presentTime
            })
            monthMatch.checkinAttendence = newcheckinAttendence
            const done = monthMatch.save()
            if (done) {
              res.status(201).json({
                success: true
              })
            } else {
              res.status(404).json({
                success: false
              })
            }
          }
        } else {
          if (check_in == true) {       
             createInAttendence(employee_id,organisation_id,created_by,position)
          } else if (check_out == true) {       
             createAttendence(employee_id,organisation_id,created_by,position)
          }
        }

      } else {
        if (check_in == true) {      
            createInAttendence(employee_id,organisation_id,created_by,position)
        } else if (check_out == true) {    
              createAttendence(employee_id,organisation_id,created_by,position)
        }
      }
    } else {
      if (check_in == true) {
        createInAttendence(employee_id,organisation_id,created_by,position)
      } else if (check_out == true) {
        createAttendence(employee_id,organisation_id,created_by,position)
      }}} catch (error) {
    res.status(500)
    throw new Error("internal server error: " + error)
  }})


  //get employee Attendence

const getAttendence = asyncHandler(async (req, res)=>{
  try {
    const attendence = await employeeAttendence.find({ employee:req.employee._id})
    if(attendence){
      res.status(200).json(attendence)
    }else{
      res.status(404).send("no data found")
    }
  } catch (error) {
    res.status(500)
    throw new Error("internal server error: " + error)
  }
})


export {
  createInviteEmployee,
  createInviteEmployeeBulk,
  inviteEmployeeController,
  registerEmployee,
  loginEmployee,
  changeEmployeePassword,
  updateProfile,
  employeeForgetPassword,
  employeeResetPassword,
  checkEmployeeForgetPasswordToken,
  getAttendence,
  employeeLeaveApplication,
  employeeLeavestatus,
  viewLeaveApplicattion,
  deleteApplication,
  employeeAttendenceController,

};