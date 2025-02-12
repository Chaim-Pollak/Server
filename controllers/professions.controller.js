import professionsModal from "../models/professions.modal.js";

export default {
  getAllProfessions: async (req, res) => {
    try {
      const { page, limit } = req.query;

      const count = await professionsModal.countDocuments();

      const skip = (page - 1) * limit;

      const professions = await professionsModal
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      res.status(200).json({
        success: true,
        message: "Counting was successful",
        data: professions,
        count: count,
      });
    } catch (error) {
      res.status(200).json({
        success: false,
        message: "Failed to get all professions",
        error: error.message || error,
      });
    }
  },

  addProfession: async (req, res) => {
    try {
      const { profession_name } = req.body;

      if (!profession_name) {
        throw new Error("the field is required!");
      }

      const profession = await professionsModal.create(req.body);

      res.status(200).json({
        success: true,
        message: "Profession added successfully",
        data: profession,
      });
    } catch (error) {
      if (error.code === 11000) {
        error.message = "Profession already exists!";
      }

      res.status(401).json({
        success: false,
        message: "Failed adding profession",
        error: error.message || error,
      });
    }
  },

  deleteProfession: async (req, res) => {
    try {
      const { id } = req.params;
      const professionDeleted = await professionsModal.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Profession deleted successfully",
        data: professionDeleted,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Profession isn't deleted successfully",
        error: error || error.message,
      });
    }
  },
};
