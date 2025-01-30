import { hash } from "bcrypt";
import { model, Schema } from "mongoose";

const managerSchema = new Schema(
    {
        manager_name: {
            type: String,
            required: true,
            unique: true,
        },
        manager_email: {
            type: String,
            required: true,
            unique: true,
        },
        manager_password: {
            type: String,
            required: true,
            select: false,
        },
        permission: {
            type: String,
            default: "Manager",
            enum: ["Admin", "Manager"],
        },
    },
    { timestamps: true }
);
managerSchema.pre("save", async function (next) {
    if (this.isModified("manager_password") && this.manager_password) {
        this.manager_password = await hash(this.manager_password, 10);
    }
    next();
});

export default model("managers", managerSchema);
