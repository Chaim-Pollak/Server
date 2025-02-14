import employeeModel from "../models/employee.model.js";
import issueModel from "../models/issues.model.js";
import issuesHistoryModel from "../models/issuesHistory.model.js";
import cloudinary from "../service/cloudinary.service.js";
import pLimit from "p-limit";
import transporter from "../service/nodemailer.service.js";

export default {
  addIssues: async (req, res) => {
    try {
      const {
        issue_building,
        issue_floor,
        issue_apartment,
        issue_description,
        issue_urgency,
        issue_profession,
      } = req.body;

      if (
        !issue_building ||
        !issue_floor ||
        !issue_apartment ||
        !issue_description ||
        !issue_urgency ||
        !issue_profession ||
        !req.files ||
        req.files.length === 0
      )
        throw new Error("all fields required!");

      const limit = pLimit(5);

      const images = req.files.map((file) =>
        limit(async () => await cloudinary.uploader.upload(file.path))
      );

      const results = await Promise.all(images);

      req.body.issue_images = results.map((result) => result.secure_url);

      const issue = await issueModel.create(req.body);

      res.status(200).json({
        success: true,
        message: "Issue added successfully",
        issue,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  getAllIssues: async (req, res) => {
    try {
      const {
        page,
        limit,
        status = "all",
        urgency = "all",
        profession = "all",
      } = req.query;

      const filterObject = {
        ...(status !== "all" && { issue_status: status }),
        ...(urgency !== "all" && { issue_urgency: urgency }),
        ...(profession !== "all" && { issue_profession: profession }),
      };
      const count = await issueModel.countDocuments(filterObject);

      const skip = (page - 1) * limit;

      const allIssues = await issueModel
        .find(filterObject)
        .populate(["issue_profession", "employees"])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      res.status(200).json({
        success: true,
        message: true,
        data: allIssues,
        count: count,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: false,
        error: error || error.message,
      });
    }
  },

  autocompleteIssue: async (req, res) => {
    const INDEX_NAME = "autocompleteIssues";
    try {
      const SearchQuery = req.query.query;

      const pipeline = [];
      pipeline.push({
        $search: {
          index: INDEX_NAME,
          autocomplete: {
            query: SearchQuery,
            path: "issue_building",
            tokenOrder: "sequential",
          },
        },
      });

      pipeline.push({ $limit: 7 });
      pipeline.push({
        $project: {
          _id: 1,
          score: { $meta: "searchScore" },
          issue_building: 1,
          issue_floor: 1,
          issue_apartment: 1,
          issue_description: 1,
          issue_images: 1,
        },
      });

      const result = await issueModel.aggregate(pipeline).sort({ score: -1 });

      res.json({
        success: true,
        message: "the issue is found successfully",
        data: result,
      });
    } catch (error) {
      res.json({
        success: false,
        message: "the issue is not found successfully",
      });
    }
  },

  updateIssue: async (req, res) => {
    try {
      const { id } = req.params;
      const issue = req.body;
      const issueUpdated = await issueModel.findByIdAndUpdate(id, issue, {
        new: true,
      });

      res.status(200).json({
        success: true,
        message: "Issue updated successfully",
        issueUpdated,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Failed to update issue",
        error: error || error.message,
      });
    }
  },

  deleteAndArchiveIssue: async (req, res) => {
    try {
      const { id } = req.params;

      const previous = await issueModel.findById(id).populate("employees");

      const previousIssue = await issueModel.findByIdAndDelete(id);
      const issueForHistory = {
        issue_building: previousIssue.issue_building,
        issue_floor: previousIssue.issue_floor,
        issue_apartment: previousIssue.issue_apartment,
        issue_description: previousIssue.issue_description,
        issue_images: previousIssue.issue_images,
        issue_urgency: previousIssue.issue_urgency,
        issue_status: previousIssue.issue_status,
        issue_profession: previousIssue.issue_profession,
        employees: previousIssue.employees,
      };

      const issueCreated = await issuesHistoryModel.create(issueForHistory);

      await transporter.sendMail({
        from: process.env.AUTH_USER,
        to: previous.employees.employeeEmail,
        subject: "Issue handling successfully completed",
        html: `
            <div style="background: linear-gradient(to bottom right, #fff8e5, #ffedd5); padding: 20px; border-radius: 15px; max-width: 600px; margin: auto; font-family: Arial, sans-serif">
                <div style="text-align: center; margin-bottom: 20px">
                    <div style="position: relative; display: inline-block">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" style="color: #d97706; display: block;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
                        </svg>
                        <div style="position: absolute; top: -8px; right: -8px">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="color: #fbbf24; display: block;" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <div style="text-align: center; margin-bottom: 20px">
                    <h1 style="font-size: 24px; color: #92400e;">Issue successfully resolved!</h1>
                    <div style="width: 100px; height: 5px; background: #fbbf24; margin: 0 auto; border-radius: 2px;"></div>
                </div>

                <div style="background: rgba(255, 255, 255, 0.8); padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center">
                    <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px">
                        <span style="font-size: 16px; font-weight: bold; color: #92400e;">Issue number #${previousIssue._id} has been resolved</span>
                    </div>
                    <p style="color: #92400e;">Hello ${previous.employees.employeeName},</p>
                    <p style="color: #d97706; line-height: 1.6;">We would like to thank you for your professional work in resolving the fault.</p>
                    <div style="color: #92400e; font-weight: 500;">
                        <p>Best regards,</p>
                        <p>Keep up the great work,</p>
                        <p>Management Division</p>
                        <p style="color: #b45309; font-size: 14px;">Service Department Manager</p>
                    </div>
                </div>

                <div style="text-align: center; color: #d97706; font-size: 12px;">
                    <p>This message was sent from the fault management system.</p>
                </div>
            </div>`,
      }),
        res.status(200).json({
          success: true,
          message: true,
          data: previousIssue,
          data2: issueCreated,
        });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: false,
        error: error || error.message,
      });
    }
  },

  associateEmployeeWithIssue: async (req, res) => {
    try {
      const { employees, issues } = req.body;

      const employeeUpdated = await issueModel.findByIdAndUpdate(
        issues,
        { employees },
        {
          new: true,
        }
      );

      const issueUpdated = await employeeModel.updateOne(
        { _id: employees },
        { $addToSet: { issues } }
      );

      res.status(200).json({
        success: true,
        message: true,
        data: issueUpdated,
        data2: employeeUpdated,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: false,
        error: error || error.message,
      });
    }
  },

  allIssuesByProfession: async (req, res) => {
    try {
      const { id } = req.params;

      const allIssues = await issueModel
        .find({ issue_profession: id })
        .populate(["employees", "issue_profession"]);

      res.json({
        success: true,
        message: true,
        data: allIssues,
      });
    } catch (error) {
      res.json({
        success: false,
        message: false,
        error: error || error.message,
      });
    }
  },
};
