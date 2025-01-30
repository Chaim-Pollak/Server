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
                message: true,
                data: professions,
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
    addProfession: async (req, res) => {
        try {
            const { profession_name } = req.body;

            if (!profession_name) {
                throw new Error("the field is required!");
            }

            const profession = await professionsModal.create(req.body);

            res.status(200).json({
                success: true,
                message: "new profession is added successfuly",
                profession,
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: "new profession is not added successfuly",
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
                message: true,
                data: professionDeleted
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: false,
                error: error || error.message,
            });
        }
    },
};
