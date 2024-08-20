import brcypt from "bcrypt";
import _user from "../models/user.model.js";
import _refreshToken from "../models/refreshToken.model.js";
import _otp from "../models/otp.model.js";
import { validOtpService } from "./otp.service.js";
import jwt from "jsonwebtoken";
import { createCartService } from "./cart.service.js";
const generateAccessToken = (payload) => {
  return jwt.sign(
    {
      userId: payload._id || payload.userId,
      admin: payload.admin,
    },
    process.env.ACCESSTOKEN_KEY,
    {
      expiresIn: 60,
    }
  );
};
const generateRefreshToken = (payload) => {
  try {
    const refreshToken = jwt.sign(
      {
        userId: payload._id || payload.userId,
        admin: payload.admin,
      },
      process.env.REFRESHTOKEN_KEY,
      {
        expiresIn: "15d",
      }
    );
    return refreshToken;
  } catch (error) {
    console.log(error);
  }
};
const saveRefreshToken = async ({ refreshToken, payload }) => {
  try {
    const currentDate = new Date();
    const expiresIn =
      Math.floor(currentDate.getTime() / 1000) + 15 * 24 * 60 * 60;
    return await _refreshToken.findOneAndUpdate(
      {
        userId: payload._id || payload.userId,
      },
      {
        refreshToken,
        expiresAt: new Date(expiresIn * 1000), // Convert seconds to milliseconds
      },
      {
        upsert: true,
        new: true,
      }
    );
  } catch (error) {
    console.log(error);
  }
};
const loginService = async ({ email, password }) => {
  try {
    const isUser = await _user.findOne({ email });
    if (!isUser) {
      return {
        status: 401,
        message: "Email is invalid!",
      };
    }
    const { password: Password, ...other } = isUser._doc;
    const isPassword = await brcypt.compare(password, Password);
    if (!isPassword) {
      return {
        status: 401,
        message: "Password is invalid!",
      };
    }
    const accessToken = generateAccessToken(other);
    const refreshToken = generateRefreshToken(other);
    await saveRefreshToken({ refreshToken, payload: other });
    return {
      status: 200,
      message: "Login successfully",
      element: {
        user: other,
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
    console.log(error);
  }
};
const registerService = async ({
  firstName,
  lastName,
  email,
  phone,
  password,
  otp,
}) => {
  try {
    const otpHolder = await _otp.find({ email });
    if (!otpHolder.length) {
      return {
        status: 404,
        message: "Expired OTP!",
      };
    }
    const lastOtp = otpHolder[otpHolder.length - 1];
    const isValid = await validOtpService({ otp, hashOtp: lastOtp.otp });
    if (!isValid) {
      return {
        status: 401,
        message: "Invalid OTP!",
      };
    }
    if (isValid && email == lastOtp.email) {
      const salt = await brcypt.genSalt(10);
      const hashPassword = await brcypt.hash(password, salt);
      const user = await _user.create({
        firstName,
        lastName,
        email,
        phone,
        password: hashPassword,
      });
      await createCartService({ userId: user._doc._id });
      if (user) {
        await _otp.deleteMany({ email });
      }
      return {
        status: 200,
        message: "Register successfully!",
      };
    }
  } catch (error) {
    console.log(error);
  }
};
const logoutService = async ({ refreshToken }) => {
  try {
    const isLogout = await _refreshToken.findOneAndDelete({ refreshToken });
    if (!isLogout) {
      return {
        status: 404,
        message: "Refresh token not found!",
      };
    }
    return {
      status: 200,
      message: "Logout successfully!",
    };
  } catch (error) {
    console.log(error);
  }
};
const updateUserService = async ({ _id, data }) => {
  try {
    const user = await _user.findById(_id);
    const isUpdate = await user.updateOne({ $set: data });
    if (!isUpdate) {
      return {
        status: 404,
        message: "User not found!",
      };
    }
    return {
      status: 200,
      message: "Updated successfully!",
      element: data,
    };
  } catch (error) {
    console.log(error);
  }
};
const refreshTokenService = async ({ refreshToken, user }) => {
  try {
    const isRefreshToken = await _refreshToken.findOne({ refreshToken });
    if (!isRefreshToken) {
      return {
        status: 403,
        message: "Refresh token is'nt valid",
      };
    }
    // Create new refreshToken, accessToken
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    await saveRefreshToken({ refreshToken: newRefreshToken, payload: user });
    return {
      status: 200,
      message: "Refresh token successfully",
      element: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    };
  } catch (error) {
    console.log(error);
  }
};
const resetPasswordService = async ({ email, password, otp }) => {
  try {
    const otpHolder = await _otp.find({ email });
    console.log(otpHolder);
    if (!otpHolder.length) {
      return {
        status: 404,
        message: "Expired OTP!",
      };
    }
    const lastOtp = otpHolder[otpHolder.length - 1];
    const isValid = await validOtpService({ otp, hashOtp: lastOtp.otp });
    if (!isValid) {
      return {
        status: 401,
        message: "Invalid OTP!",
      };
    }
    if (isValid && email == lastOtp.email) {
      const salt = await brcypt.genSalt(10);
      const hashPassword = await brcypt.hash(password, salt);
      const isUser = await _user.findOneAndUpdate(
        { email },
        { password: hashPassword }
      );
      if (isUser) {
        await _otp.deleteMany({ email });
      }
      return {
        status: 200,
        message: "You have successfully changed your password",
      };
    }
  } catch (error) {
    console.log(error);
  }
};

export {
  loginService,
  registerService,
  logoutService,
  refreshTokenService,
  resetPasswordService,
  updateUserService,
};
