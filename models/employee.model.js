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
      select: false,
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
  if (this.isModified("employeePassword") && this.employeePassword) {
    this.employeePassword = await hash(this.employeePassword, 10);
  }
  next();
});

export default model("employees", employeeSchema);
