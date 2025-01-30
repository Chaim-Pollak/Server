import issuesHistoryModel from "../models/issuesHistory.model.js";

export default {
    getAllHistories: async (req, res) => {
        try {
            const allhistories = await issuesHistoryModel
                .find()
                .populate("issue_profession")
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                message: true,
                data: allhistories,
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
    getHistoryById: async (req, res) => {
        try {
            const { id } = req.params;
            const myIssues = await issuesHistoryModel
                .find({
                    employees: id,
                })
                .populate(["employees", "issue_profession"]);
            res.json({
                success: true,
                message: true,
                data: myIssues,
            });
        } catch (error) {
            console.log(error);
            res.json({
                success: false,
                message: false,
                error: error || error.message,
            });
        }
    },
};
