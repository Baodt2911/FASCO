import { sendOtpService } from "../services/otp.service.js";

const sendOtpController = async (req, res, next) => {
  try {
    const { element, message, status } = await sendOtpService({
      email: req.body.email,
      isForgotPassword: req.body?.isForgotPassword,
    });
    res.status(status).json({ message, element });
  } catch (error) {
    console.log(error);
  }
};

export { sendOtpController };
