import asyncHandler from "express-async-handler";
//hr models.
//hr employees.
import employeeAttendence from "../models/employee.attendence.js"
import employeeLeaveAllotment from "../models/employee.leaves.allotment.js"

const me = asyncHandler(async (req, res) => {
    const presentMonth = new Date().getMonth() + 1
    const presentYear = new Date().getFullYear()

    const hr = req.query.hr;
    const id = req.query.id;

    const lastUpdate = await employeeAttendence.findOne({
        employee: id,
        month: presentMonth,
        year: presentYear
    })
    const leaveAllotments = await employeeLeaveAllotment.findOne({
        employee: id
    })
    res.status(200).json({
        leaveAllotments,
        lastUpdate
    })

})
export {
    me
};