import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

// Providers
export const ProviderEnum = {
  GOOGLE: "google",
  SYSTEM: "system",
};

// Roles
export const RoleEnum = {
  USER: "user",
  ADMIN: "admin",
  HR: "hr",
  OWNER: "owner",
};
const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50,
    },

    lastName: {
      type: String,
      minlength: 1,
      maxlength: 50,
      default: "User"
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: function () {
        return this.provider === ProviderEnum.SYSTEM;
      },
    },

    provider: {
      type: String,
      enum: Object.values(ProviderEnum),
      default: ProviderEnum.SYSTEM,
    },

    role: {
      type: String,
      enum: Object.values(RoleEnum),
      default: RoleEnum.USER,
    },

    confirmEmailOtp: String,

    confirmedAt: {
      type: Date,
      default: null,
    },

    phone: String,
    skills: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual username
UserSchema.virtual("username")
  .set(function (value) {
    const [firstName, lastName] = value.split(" ");
    this.firstName = firstName || value;
    this.lastName = lastName || "User";
    this.slug = (value.toLowerCase().replace(/\s+/g, "-") + "-" + Math.floor(Math.random() * 10000));

  })
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });

export const UserModel = models.User || model("User", UserSchema);
