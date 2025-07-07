import {
  loginService,
  registerService,
  refreshTokenService,
  resetPasswordService,
  logoutService,
  updateUserService,
  isLoginService,
  loginGoogleService,
  getUserService,
  changePasswordService,
  forgotPasswordService,
} from "../services/user.service.js";
const isLoginController = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { rt } = req.cookies;
    const token = !!authorization ? authorization.split(" ")[1] : rt;
    const { status, element } = await isLoginService(token);
    if (!element) {
      res.clearCookie("rt");
    }
    res.status(status).json({
      isLogin: element,
    });
  } catch (error) {
    console.log(error);
  }
};
const getUserController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { status, element, message } = await getUserService(userId);
    res.status(status).json({
      message,
      user: element,
    });
  } catch (error) {
    console.log(error);
  }
};
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
        // domain: "",
        path: "/",
        sameSite: "None",
        secure: true,
        httpOnly: true,
        expires: new Date(
          Math.floor(currentDate.getTime()) + 15 * 24 * 60 * 60 * 1000
        ),
      });
    }
    res.status(status).json({
      message,
      accessToken: element?.accessToken,
    });
  } catch (error) {
    console.log(error);
  }
};
const loginGoogleController = async (req, res) => {
  try {
    const { name, email } = req.user;
    const [firstName, lastName] = name.split(" ");
    const { status, element, message } = await loginGoogleService({
      firstName,
      lastName,
      email,
    });
    const currentDate = new Date();
    if (status == 200) {
      //Save refreshtoken to cookie
      res.cookie("rt", element?.refreshToken, {
        // domain: "",
        path: "/",
        sameSite: "None",
        secure: true,
        httpOnly: true,
        expires: new Date(
          Math.floor(currentDate.getTime()) + 15 * 24 * 60 * 60 * 1000
        ),
      });
    }
    res.status(status).json({
      message,
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
    const { rt } = req.cookies;
    const refreshToken = !!authorization ? authorization.split(" ")[1] : rt;
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
    const { userId } = req.user;
    const { firstName, lastName, phone } = req.body;
    const { status, element, message } = await updateUserService({
      userId,
      firstName,
      lastName,
      phone,
    });
    res.status(status).json({
      message,
      user: element,
    });
  } catch (error) {
    console.log(error);
  }
};
const changePasswordController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { currentPassword, newPassword } = req.body;
    const { status, element, message } = await changePasswordService({
      userId,
      currentPassword,
      newPassword,
    });
    res.status(status).json({
      message,
    });
  } catch (error) {
    console.log(error);
  }
};
const refreshTokenController = async (req, res) => {
  try {
    const user = req.user;
    const { authorization } = req.headers;
    const { rt } = req.cookies;
    const refreshToken = !!authorization ? authorization.split(" ")[1] : rt;
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
const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    const { status, message } = await forgotPasswordService({
      email,
    });
    res.status(status).json({
      message,
    });
  } catch (error) {
    console.log(error);
  }
};
const resetPasswordController = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const { status, message } = await resetPasswordService({
      token,
      newPassword,
    });
    res.status(status).json({
      message,
    });
  } catch (error) {
    console.log(error);
  }
};
export {
  getUserController,
  isLoginController,
  loginController,
  loginGoogleController,
  registerController,
  logoutController,
  refreshTokenController,
  resetPasswordController,
  updateUserController,
  changePasswordController,
  forgotPasswordController,
};
