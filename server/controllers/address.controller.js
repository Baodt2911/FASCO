import {
  editAddressService,
  getAddressService,
} from "../services/address.service.js";

const getAddressController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { status, message, element } = await getAddressService({ userId });
    res.status(status).json({ message, element });
  } catch (error) {
    console.log(error);
  }
};
const editAddressController = async (req, res) => {
  try {
    const { userId } = req.user;
    const {
      firstName,
      lastName,
      postcode,
      country,
      addressLine1,
      addressLine2,
      city,
    } = req.body;
    const { status, message, element } = await editAddressService({
      userId,
      firstName,
      lastName,
      postcode,
      country,
      addressLine1,
      addressLine2,
      city,
    });
    res.status(status).json({ message, element });
  } catch (error) {
    console.log(error);
  }
};
export { getAddressController, editAddressController };
