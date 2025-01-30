import mongoose, { model, Schema } from "mongoose";

const issueSchema = new Schema(
    {
        issue_building: {
            type: String,
            default: "",
        },
        issue_floor: {
            type: Number,
            default: "",
        },
        issue_apartment: {
            type: Number,
            default: "",
        },
        issue_description: {
            type: String,
            default: "",
        },
        issue_images: [
            {
                type: String,
                default: "",
            },
        ],
        issue_urgency: {
            type: String,
            enum: ["high", "medium", "low"],
            default: "Low",
        },

        issue_status: {
            type: String,
            enum: ["New", "In process", "Done"],
            default: "New",
        },
        issue_profession: {
            ref: "professions",
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        employees: {
            ref: "employees",
            type: mongoose.Schema.Types.ObjectId,
        },
    },

    { timestamps: true }
);

export default model("issues", issueSchema);
