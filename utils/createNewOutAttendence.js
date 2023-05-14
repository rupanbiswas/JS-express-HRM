import employeeAttendence from "../models/employee.attendence.js"

const presentMonth = new Date().getMonth() + 1
const presentYear = new Date().getFullYear()
const presentDate = new Date().getDate()
const presentTime = new Date().getTime()
const createAttendence =async (employee_id,organisation_id,created_by,position) => {
    console.log("entered")
    await employeeAttendence.create({
        employee: employee_id,
        organisation: organisation_id,
        created_by: {
          _id: created_by,
          position: position
        },
        month: presentMonth,
        year: presentYear,
        checkout_attendence: {
          date: presentDate,
          time: presentTime
        }
      },(err,result)=>{
          if(err) {
            res.status(201).json({
                success: true
              })          }else{
                res.status(404).json({
                    success: false
                  })          }
      })
}

export default createAttendence