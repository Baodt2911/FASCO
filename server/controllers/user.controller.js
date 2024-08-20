import {
  loginService,
  registerService,
  refreshTokenService,
  resetPasswordService,
  logoutService,
  updateUserService,
} from "../services/user.service.js";

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { status, element, message } = await loginService({
      email,
      password,
    });
    const currentDate = new Date();
    if (status == 200) {
      //Save refreshtoken to cookie
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
    });
  } catch (error) {
    console.log(error);
  }
};
const registerController = async (req, res) => {
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
    });
  } catch (error) {
    console.log(error);
  }
};
const logoutController = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const refreshToken = authorization.split(" ")[1];
    const { status, message } = await logoutService({
      refreshToken,
    });
    if (status == 200) {
      res.clearCookie("rt");
    }
    res.status(status).json({
      message,
    });
  } catch (error) {
    console.log(error);
  }
};
const updateUserController = async (req, res) => {
  try {
    const { _id, ...data } = req.body;
    const { status, element, message } = await updateUserService({
      _id,
      data,
    });
    res.status(status).json({
      message,
      element,
    });
  } catch (error) {
    console.log(error);
  }
};
const refreshTokenController = async (req, res) => {
  try {
    const user = req.user;
    const refreshToken = req.headers.authorization.split(" ")[1];
    const { status, element, message } = await refreshTokenService({
      refreshToken,
      user,
    });
    const currentDate = new Date();
    //Save refreshtoken to cookie
    res.cookie("rt", element?.refreshToken, {
      HttpOny: true,
      Secure: false,
      SameSite: "strict",
      expires: new Date(
        Math.floor(currentDate.getTime()) + 15 * 24 * 60 * 60 * 1000
      ),
    });
    res.status(status).json({
      message,
      accessToken: element?.accessToken,
    });
  } catch (error) {
    console.log(error);
  }
};
const resetPasswordController = async (req, res) => {
  try {
    const { email, password, otp } = req.body;
    const { status, message } = await resetPasswordService({
      email,
      password,
      otp,
    });
    console.log(email, password, otp);
    res.status(status).json({
      message,
    });
  } catch (error) {
    console.log(error);
  }
};

export {
  loginController,
  registerController,
  logoutController,
  refreshTokenController,
  resetPasswordController,
  updateUserController,
};
