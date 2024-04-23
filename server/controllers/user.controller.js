import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import {
  loginService,
  registerService,
  refreshTokenService,
  resetPasswordService,
  logoutService,
  updateUserService,
} from "../services/user.service.js";

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { status, element, message } = await loginService({
      email,
      password,
    });
    const currentDate = new Date();
    if (status == 200) {
      res.cookie("at", element?.accessToken, {
        HttpOny: true,
        Secure: false,
        SameSite: "strict",
        maxAge: 120000,
      });
      res.cookie("rt", element?.refreshToken, {
        HttpOny: true,
        Secure: false,
        SameSite: "strict",
        expires: new Date(
          Math.floor(currentDate.getTime()) + 15 * 24 * 60 * 60 * 1000
        ),
      });
    }
    res.status(status).json({
      message,
      user: element?.user,
      accessToken: element?.accessToken,
      refreshToken: element?.refreshToken,
    });
  } catch (error) {
    console.log(error);
  }
};
const registerController = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, otp } = req.body;
    const { status, element, message } = await registerService({
      firstName,
      lastName,
      email,
      phone,
      password,
      otp,
    });
    res.status(status).json({
      message,
      element,
    });
  } catch (error) {
    console.log(error);
  }
};
const logoutController = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const refreshToken = authorization.split(" ")[1];
    const { status, message } = await logoutService({
      refreshToken,
    });
    res.clearCookie("at");
    res.clearCookie("rt");
    res.status(status).json({
      message,
    });
  } catch (error) {
    console.log(error);
  }
};
const updateUserController = async (req, res, next) => {
  try {
    const { _id, ...data } = req.body;
    const { status, element, message } = await updateUserService({
      _id,
      data,
    });
    console.log(data);
    res.status(status).json({
      message,
      element,
    });
  } catch (error) {
    console.log(error);
  }
};
const refreshTokenController = async (req, res, next) => {
  try {
  } catch (error) {}
};
const resetPasswordController = async (req, res, next) => {
  try {
  } catch (error) {}
};

export {
  loginController,
  registerController,
  logoutController,
  refreshTokenController,
  resetPasswordController,
  updateUserController,
};
