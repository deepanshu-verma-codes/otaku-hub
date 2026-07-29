import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
    },
    bio: {
      type: String,
      default: "",
    },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Anime" }],
    watchHistory: [{ type: Schema.Types.ObjectId, ref: "Video" }],
    favoriteImages: {
      type: Array,
      default: []
    },
    favoriteTrailers: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", UserSchema);
export default User;
