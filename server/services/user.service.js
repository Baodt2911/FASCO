import bcrypt from "bcrypt";
import _user from "../models/user.model.js";
import _refreshToken from "../models/refreshToken.model.js";
import _otp from "../models/otp.model.js";
import { validOtpService } from "./otp.service.js";
import jwt from "jsonwebtoken";
import otpGenerate from "otp-generator";
import nodemailer from "nodemailer";

const generateAccessToken = (payload) => {
  return jwt.sign(
    {
      userId: payload._id || payload.userId,
      admin: payload.admin,
    },
    process.env.ACCESSTOKEN_KEY,
    {
      expiresIn: 60 * 5,
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
const getUserService = async (userId) => {
  try {
    const user = await _user.findById(userId);
    if (!user) {
      return {
        status: 404,
        message: "User not found!",
      };
    }
    const { firstName, lastName, email, phone } = user._doc;
    return {
      status: 200,
      element: {
        firstName,
        lastName,
        email,
        phone,
      },
    };
  } catch (error) {
    console.log(error);
  }
};
const isLoginService = async (refreshToken) => {
  try {
    const isLogin = await _refreshToken.findOne({ refreshToken });
    if (!isLogin) {
      return {
        status: 404,
        element: false,
      };
    }
    return {
      status: 200,
      element: true,
    };
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
    if (!Password) {
      return {
        status: 404,
        message: "User is not found!",
      };
    }
    const isPassword = await bcrypt.compare(password, Password);
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
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
    console.log(error);
  }
};
const loginGoogleService = async ({ firstName, lastName, email }) => {
  try {
    let user = await _user.findOneAndUpdate(
      { email },
      { $setOnInsert: { firstName, lastName, email } },
      { upsert: true, new: true }
    );
    const { password, ...other } = user._doc;
    const accessToken = generateAccessToken(other);
    const refreshToken = generateRefreshToken(other);
    await saveRefreshToken({ refreshToken, payload: other });
    return {
      status: 200,
      message: "Login successfully!",
      element: { accessToken, refreshToken },
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
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const user = await _user.create({
        firstName,
        lastName,
        email,
        phone,
        password: hashPassword,
      });
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
const updateUserService = async ({ userId, firstName, lastName, phone }) => {
  try {
    if (!firstName && !lastName && !phone) {
      return {
        status: 400,
        message: "No fields are provided for updating.",
      };
    }
    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (phone) updates.phone = phone;
    const updatedUser = await _user.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return {
        status: 404,
        message: "User not found!",
      };
    }
    return {
      status: 200,
      message: "Updated successfully!",
      element: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone,
      },
    };
  } catch (error) {
    console.log(error);
  }
};
const changePasswordService = async ({
  userId,
  newPassword,
  currentPassword,
}) => {
  try {
    const user = await _user.findById(userId);
    if (!user) {
      return {
        status: 404,
        message: "User not found!",
      };
    }
    const { password } = user._doc;
    if (!password) {
      return {
        status: 401,
        message: "Password is invalid!",
      };
    }
    const isPassword = await bcrypt.compare(currentPassword, password);
    if (!isPassword) {
      return {
        status: 401,
        message: "Your current password was not entered correctly",
      };
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashPassword;
    await user.save();
    return {
      status: 200,
      message: "Password changed successfully!",
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
const forgotPasswordService = async ({ email }) => {
  try {
    const user = await _user.findOne({ email });
    if (!user) {
      return {
        status: 404,
        message: "User not found!",
      };
    }
    const otp = otpGenerate.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const token = jwt.sign(
      {
        userId: user._id,
        otp: otp,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: 5 * 60,
      }
    );
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });
    const resetURL = `http://localhost:3000/dashboard/resetPassword.html?token=${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "FASCO - Reset password",
      html: `<p>Click the link to reset your password: ${resetURL}</p>`,
    });
    return {
      status: 200,
      message: "Please check your email",
    };
  } catch (error) {
    console.log(error);
  }
};
const resetPasswordService = async ({ token, newPassword }) => {
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
      if (err) {
        return {
          message: "Token is'nt valid",
        };
      }
      return decoded;
    });
    if (decoded.message) {
      return {
        status: 403,
        message: "Token is'nt valid",
      };
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    await _user.findByIdAndUpdate(decoded.userId, {
      password: hashPassword,
    });
    return {
      status: 200,
      message: "You have successfully changed your password",
    };
  } catch (error) {
    console.log(error);
  }
};

export {
  getUserService,
  isLoginService,
  loginService,
  loginGoogleService,
  registerService,
  logoutService,
  refreshTokenService,
  resetPasswordService,
  updateUserService,
  changePasswordService,
  forgotPasswordService,
};
