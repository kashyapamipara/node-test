import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Document, Model, model, Schema } from "mongoose";
import Config from "../../config";
import { getLogger } from "../../services/logger";
import { pullAuthTokenFromUser } from "./user.DAL";

const { jwtAuthentication } = Config;

const MODULE_NAME_FOR_LOG = "user.model";
const log = getLogger(MODULE_NAME_FOR_LOG);

/**
 * -----------------------------
 * Interface for user Model
 * -----------------------------
 */

export interface IUserDocument extends Document {
  name: string;
  contactNumber: string;
  email: string;
  password: string;
  tokens: { token: string }[];
  role: string;
}

export interface IUser extends IUserDocument {
  removeToken(token: string): Promise<IUser>;

  getAuthToken(): Promise<IUser>;
}

/**
 * user's statics methods
 */
export interface IUserModel extends Model<IUser> {
  findByToken(token: string): Promise<void | IUser>;

  findByCredentials(email: string, password: string): Promise<void | IUser>;

  findByEmail(email: string): Promise<void | IUser>;
}

/**
 * --------------------------------
 * user Schema for store in DB
 * --------------------------------
 */

export const userSchema: Schema<IUserDocument> = new Schema(
  {
    name: Schema.Types.String,
    contactNumber: Schema.Types.String,
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: Schema.Types.String,
    tokens: [{ token: Schema.Types.String }],
    role: Schema.Types.String,
  },
  {
    timestamps: true,
  }
);

/**
 * statics method to find user with token
 * @param token
 * @returns
 */
userSchema.statics.findByToken = async function (token) {
  let decoded;
  try {
    decoded = jwt.verify(token, jwtAuthentication.publicKeyToVerifyJWT);
  } catch (err) {
    decoded = jwt.decode(token);
    let hasSessionExpired = false;
    if (err && err.message && err.message.includes("jwt expired")) {
      hasSessionExpired = true;
      log.debug(`findByToken : session expired for user ${decoded}`);
    } else {
      log.error(`findByToken : jwt error`);
    }
    if (decoded && decoded._id) {
      await pullAuthTokenFromUser(decoded._id, token);
    }
    if (hasSessionExpired) {
      throw new Error("Session Expired");
    } else {
      throw new Error("Authentication Failed");
    }
  }
  return this.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": "auth",
  });
};

/**
 * statics method to find user with credentials
 * @param email
 * @param password
 * @returns
 */
userSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }
  const res = await bcrypt.compare(password, user.password);

  if (res === true) {
    return user;
  }
  throw new Error("WRONG_PASSWORD");
};

userSchema.statics.findByEmail = async function (email) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }
  return user;
};

userSchema.methods.getAuthToken = function () {

  const token = jwt
    .sign(
      { _id: this._id.toHexString() },
      jwtAuthentication.privateKeyToSignJWT,
      jwtAuthentication.signOptions as jwt.SignOptions
    )
    .toString();
  this.tokens = this.tokens.concat([{ token }]);

  return this.save().then(() => {
    return token;
  });
};

userSchema.methods.removeToken = function (token) {
  /**
   * "this" here refers to user Doc
   */
  return this.update({
    $pull: {
      tokens: {
        token,
      },
    },
  });
};

userSchema.pre("save", function (next) {
  const user = this as IUserDocument;
  if (user.isModified("password")) {
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.index({ email: 1 });
export const User: IUserModel = model<IUser, IUserModel>("user", userSchema);

export default User;
