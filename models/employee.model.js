import mongoose, { model, Schema } from "mongoose";
import { hash } from "bcrypt";

const employeeSchema = new Schema(
    {
        employeeName: {
            type: String,
            required: true,
            unique: true,
        },
        employeeEmail: {
            type: String,
            required: true,
        },
        employeePassword: {
            type: String,
            required: true,
            select: false, //TODO understand this
        },
        employeeId: {
            ref: "professions",
            type: mongoose.Schema.Types.ObjectId,
        },
        verify: {
            type: Boolean,
            default: false,
        },
        issues: [
            {
                ref: "issues",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
    },
    { timestamps: true }
);

employeeSchema.pre("save", async function (next) {
    this.employeePassword = await hash(this.employeePassword, 10);
    next();
});

export default model("employees", employeeSchema);
