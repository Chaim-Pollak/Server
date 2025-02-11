import { model, Schema } from "mongoose";

const professionsSchema = new Schema(
  {
    profession_name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default model("professions", professionsSchema);
