import issueModel from "../models/issues.model.js";
import managerModel from "../models/manager.model.js";
import employeeModel from "../models/employee.model.js";



export default {
    getAlllength: async (req, res) => {
        try {

            const count = [await issueModel.countDocuments(), await managerModel.countDocuments(), await employeeModel.countDocuments()];
            const results = await Promise.all(count)

            res.status(200).json({
                success: true,
                message: true,
                countIssue: results[0],
                countUsers: (results[1] + results[2])
            });

        } catch (error) {
            console.log(error);
            res.status(401).json({
                success: false,
                message: false,
                error: error || error.message,
            });
        }
    }
}