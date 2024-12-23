import _otp from "../models/otp.model.js";
import _user from "../models/user.model.js";
import bcrpyt from "bcrypt";
import otpGenerate from "otp-generator";
const validOtpService = async ({ otp, hashOtp }) => {
  try {
    const isValid = await bcrpyt.compare(otp, hashOtp);
    return isValid;
  } catch (error) {
    console.log(error);
  }
};
const insertOtpService = async ({ email, otp }) => {
  try {
    const salt = await bcrpyt.genSalt(10);
    const hashOtp = await bcrpyt.hash(otp, salt);
    const OTP = await _otp.create({
      email,
      otp: hashOtp,
    });
    return OTP ? 1 : 0;
  } catch (error) {
    console.log(error);
  }
};
const sendToMail = async ({ email, otp }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "FASCO - OTP",
      html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>FASCO - OTP for Account Verification</title>
</head>
<body style="font-family: Arial, sans-serif;">
    <h2>FASCO - OTP for Account Verification</h2>
    <p>You are receiving an OTP to verify your email address and complete the account registration process on FASCO.</p>

    <p>Your OTP is: <strong style="font-size: 18px; background-color: #f0f0f0; padding: 5px;">${otp}</strong></p>

    <p>This OTP is valid for 1 minute from the time this email is sent. Please do not share this OTP with anyone.</p>

    <p>If you did not request this account registration or you're not performing this action, please disregard this email.</p>

    <p>If you encounter any issues or need assistance, please contact us via email at <a href="mailto:fasco-support@example.com">fasco-support@example.com</a>.</p>

    <p>Thank you.</p>

    <p>Best regards,</p>
    <p><strong>Our Support Team at FASCO</strong></p>

</body>
</html>
`,
    });
  } catch (error) {
    console.log(error);
  }
};
const sendOtpService = async ({ email, isForgotPassword }) => {
  try {
    const isEmail = await _user.findOne({ email });
    if (!(!isEmail || isForgotPassword)) {
      return {
        status: 401,
        message: "Email already exists!",
      };
    }
    const otp = otpGenerate.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    await sendToMail({ email, otp });
    return {
      status: 200,
      element: await insertOtpService({ email, otp }),
    };
  } catch (error) {
    console.log(error);
  }
};
export { insertOtpService, validOtpService, sendOtpService };
