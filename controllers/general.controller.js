import issueModel from "../models/issues.model.js";
import managerModel from "../models/manager.model.js";
import employeeModel from "../models/employee.model.js";
import transporter from "../service/nodemailer.service.js";
export default {
  getDocumentCounts: async (req, res) => {
    try {
      const count = [
        await issueModel.countDocuments(),
        await managerModel.countDocuments(),
        await employeeModel.countDocuments(),
      ];
      const results = await Promise.all(count);

      res.status(200).json({
        success: true,
        message: true,
        countIssue: results[0],
        countUsers: results[1] + results[2],
      });
    } catch (error) {
      console.log(error);
      res.status(401).json({
        success: false,
        message: false,
        error: error || error.message,
      });
    }
  },

  contactSendEmail: async (req, res) => {
    try {
      const { firstName, lastName, email, phone, description } = req.body;

      if (!firstName || !lastName || !email || !phone || !description) {
        throw new Error("all field required");
      }

      transporter.sendMail({
        from: email,
        to: process.env.AUTH_USER,
        subject: `Contact from ${firstName} ${lastName} ${phone}`,
        text: description,
      });

      res.status(200).json({
        success: true,
        message: "Message sent successfully",
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Failed to sent message",
        error: error.message || error,
      });
    }
  },
};
