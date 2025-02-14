import jwt from "jsonwebtoken";
import employeeModel from "../models/employee.model.js";
import { compare } from "bcrypt";
import transporter from "../service/nodemailer.service.js";

export default {
  employeeSignUp: async (req, res) => {
    try {
      const { employeeName, employeeEmail, employeePassword } = req.body;
      if (!employeeName || !employeeEmail || !employeePassword) {
        throw new Error("all field required");
      }
      const employee = await employeeModel.create(req.body);
      await transporter.sendMail({
        from: process.env.AUTH_USER,
        to: `${employeeEmail}`,
        subject: "Email verification",
        html: `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="https://res.cloudinary.com/dp08vd3cy/image/upload/v1733785970/logo_lhjqzl.jpg" alt="Company Logo" style="max-width: 350px; display: block; margin: 0 auto;"">
                </div>
      
                <!-- Welcome Message -->
                <div style="background-color: #FEF3C7; border-radius: 10px; padding: 30px; margin-bottom: 30px;">
                    <h1 style="color: #92400E; text-align: center; margin: 0 0 20px 0; font-size: 24px;">
                        Welcome to Our Team!
                    </h1>
                    <p style="color: #92400E; text-align: center; margin: 0 0 20px 0; font-size: 16px;">
                        We're excited to have you on board. To get started, please verify your email address.
                    </p>
                </div>
      
                <!-- Verification Button -->
                <div style="text-align: center; margin-bottom: 30px;">
                    <a href="http://localhost:3000/users/validationEmail/${employee._id}" style="background-color: #D97706; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: bold; font-size: 16px;">
                        Verify Your Email
                    </a>
                </div>
      
                <!-- Footer Message -->
                <div style="text-align: center; color: #92400E; font-size: 14px;">
                    <p style="margin: 0;">
                        Thank you for joining us! If you didn't create this account, please ignore this email.
                    </p>
                </div>
            </div>
              `,
      });

      res.status(200).json({
        success: true,
        message: "Employee added successfully",
        employee,
      });
    } catch (error) {
      if (error.code === 11000) {
        error.message = "Email already exists!";
      }
      res.status(401).json({
        success: false,
        message: "Failed to add employee",
        error: error.message || error,
      });
    }
  },

  validateEmail: async (req, res) => {
    try {
      const { id } = req.params;
      await employeeModel.findByIdAndUpdate(id, { verify: true });

      const clientOrigin = req.headers.origin || "http://localhost:5173";

      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Email Verification Success</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
          <div class="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
            <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
              <!-- Success Icon Circle -->
              <div class="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg 
                  class="w-10 h-10 text-green-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <!-- Main Content -->
              <h1 class="text-2xl font-bold text-amber-900 mb-4">
                Email Verified Successfully!
              </h1>
              
              <p class="text-amber-700 mb-6">
                Thank you for verifying your email address. Your account is now fully activated.
              </p>

              <!-- Celebration Icons -->
              <div class="flex justify-center space-x-4 mb-8">
                <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <svg 
                    class="w-6 h-6 text-amber-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <svg 
                    class="w-6 h-6 text-amber-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <svg 
                    class="w-6 h-6 text-amber-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="space-y-4">
                <a 
                  href="${clientOrigin}/login"
                  class="block w-full bg-amber-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-amber-700 transition-colors duration-200"
                >
                  Continue to Login
                </a>
              </div>

              <!-- Footer Text -->
              <p class="mt-6 text-sm text-amber-600">
                Welcome aboard! We're excited to have you as part of our community.
              </p>
            </div>
          </div>
        </body>
        </html>
      `);
    } catch (error) {
      // Error Page
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Verification Error</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
          <div class="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
            <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
              <!-- Error Icon Circle -->
              <div class="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <svg 
                  class="w-10 h-10 text-red-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>

              <!-- Main Content -->
              <h1 class="text-2xl font-bold text-amber-900 mb-4">
                Verification Failed
              </h1>
              
              <p class="text-amber-700 mb-6">
                We encountered an error while verifying your email address. Please try again or contact support if the issue persists.
              </p>

              <!-- Action Buttons -->
              <div class="space-y-4">
                <a 
                  href="/support" 
                  class="block w-full bg-amber-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-amber-700 transition-colors duration-200"
                >
                  Contact Support
                </a>
                <a 
                  href="/" 
                  class="block w-full bg-amber-100 text-amber-900 py-3 px-4 rounded-xl font-medium hover:bg-amber-200 transition-colors duration-200"
                >
                  Back to Homepage
                </a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `);
    }
  },

  getEmployeeById: async (req, res) => {
    try {
      const { id } = req.params;
      const employee = await employeeModel
        .findById(id)
        .populate(["issues", "employeeId"]);

      res.json({
        success: true,
        message: true,
        data: employee.issues,
      });
    } catch (error) {
      res.json({
        success: false,
        message: false,
        error: error.message || error,
      });
    }
  },

  employeeSignIn: async (req, res) => {
    try {
      const { employeeEmail, employeePassword } = req.body;
      const employee = await employeeModel
        .findOne({ employeeEmail })
        .select("+employeePassword");
      if (!employee) {
        throw new Error("Email not exist");
      }

      const isPasswordValid = await compare(
        employeePassword,
        employee.employeePassword
      );

      if (!isPasswordValid) {
        throw new Error("the password not match");
      }

      const token = jwt.sign({ ...employee }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 60 * 1,
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 1,
      });

      res.status(200).json({
        success: true,
        message: true,
        data: employee,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: false,
        error: error.message || error,
      });
    }
  },

  updateEmployee: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const employee = await employeeModel.findById(id);
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      Object.assign(employee, updates);

      const employeeUpdated = await employee.save();

      res.status(200).json({
        success: true,
        message: "Updated successfully",
        employeeUpdated,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Not updated successfully",
        error: error || error.message,
      });
    }
  },

  deleteEmployee: async (req, res) => {
    try {
      const { id } = req.params;
      const employeeDeleted = await employeeModel.findByIdAndDelete(id);
      res.status(200).json({
        success: true,
        message: "Employee deleted successfully",
        employeeDeleted,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Failed to delete employee",
        error: error || error.message,
      });
    }
  },

  getAllEmployees: async (req, res) => {
    try {
      const { page = 1, limit = 4 } = req.query;

      const count = await employeeModel.countDocuments();

      const skip = (page - 1) * limit;

      const allEmployees = await employeeModel
        .find()
        .populate("employeeId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      res.status(200).json({
        success: true,
        message: true,
        data: allEmployees,
        count: count,
      });
    } catch (error) {
      res.status(200).json({
        success: false,
        message: false,
        error: error || error.message,
      });
    }
  },
};
