import { compare } from "bcrypt";
import managerModel from "../models/manager.model.js";
import jwt from "jsonwebtoken";

export default {
  signUp: async (req, res) => {
    try {
      const { manager_name, manager_email, manager_password } = req.body;

      if (!manager_name || !manager_email || !manager_password) {
        throw new Error("All fields are required!");
      }

      const manager = await managerModel.create(req.body);

      res.status(200).json({
        success: true,
        message: "Manager added successfully",
        manager,
      });
    } catch (error) {
      if (error.code === 11000) {
        error.message = "Email already exists!";
      }

      res.status(401).json({
        success: false,
        message: "Sign up manager failed",
        error: error.message || error,
      });
    }
  },

  signIn: async (req, res) => {
    try {
      const { manager_email, manager_password } = req.body;
      const manager = await managerModel
        .findOne({
          manager_email: manager_email,
        })
        .select("+manager_password");
      if (!manager) throw new Error("Manager isn't exist");

      const isPasswordValid = await compare(
        manager_password,
        manager.manager_password
      );
      if (!isPasswordValid) throw new Error("Password isn't valid");

      const token = jwt.sign({ ...manager }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 60,
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 1,
      });
      const { manager_password: _, ...managerWithoutPassword } =
        manager.toObject();
      res.status(200).json({
        success: true,
        message: "Success Login manager",
        data: managerWithoutPassword,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        massage: "Not success login manager",
        error: error.message || error,
      });
    }
  },

  Auth: async (req, res) => {
    try {
      res.status(200).json({
        success: true,
        message: "Success Auth User",
        user: req.user._doc,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "not Success Auth User",
        error: error.message || error,
      });
    }
  },

  logOut: async function (req, res) {
    try {
      res.clearCookie("token", {
        secure: true,
        httpOnly: true,
      });

      return res.json({ success: true, message: "success to signout" });
    } catch (error) {
      return res.json({ success: false, message: "not success to signout" });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const manager = await managerModel.findById(id);
      if (!manager) {
        return res.status(401).json({
          success: false,
          message: "Manager not found",
          error: error.message || error,
        });
      }

      Object.assign(manager, updates);

      const managerUpdated = await manager.save();

      res.status(200).json({
        success: true,
        message: "Manager updated successfully",
        data: managerUpdated,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to updated manager",
        error: error || error.message,
      });
    }
  },

  deleteManager: async (req, res) => {
    try {
      const { id } = req.params;
      const managerDeleted = await managerModel.findByIdAndDelete(id);
      res.status(200).json({
        success: true,
        message: "Manager deleted successfully",
        data: managerDeleted,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "failed deleting manager",
        error: error || error.message,
      });
    }
  },

  getAllManagers: async (req, res) => {
    try {
      const { page = 1, limit = 4 } = req.query;

      const count = await managerModel.countDocuments();

      const skip = (page - 1) * limit;

      const allManagers = await managerModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      res.status(200).json({
        success: true,
        message: "Counting was successful",
        data: allManagers,
        count: count,
      });
    } catch (error) {
      res.status(200).json({
        success: false,
        message: "Counting was not successful",
        error: error || error.message,
      });
    }
  },

  autocompleteManager: async (req, res) => {
    console.log("autocompleteManager");
    const INDEX_NAME = "autocompleteManager";
    try {
      const SearchQuery = req.query.query;

      const pipeline = [];
      pipeline.push({
        $search: {
          index: INDEX_NAME,
          autocomplete: {
            query: SearchQuery,
            path: "manager_email",
            tokenOrder: "sequential",
          },
        },
      });
      pipeline.push({ $limit: 7 });
      pipeline.push({
        $project: {
          _id: 1,
          score: { $meta: "searchScore" },
          manager_email: 1,
          manager_name: 1,
          manager_password: 1,
        },
      });
      const result = await managerModel.aggregate(pipeline).sort({ score: -1 });
      console.log("result", result);
      res.json({
        success: true,
        message: "the manager is found successfully",
        data: result,
      });
    } catch (error) {
      console.log("not work");
      res.json({
        success: false,
        message: "the manager is not found successfully",
        error: error.message || error,
      });
    }
  },
};
