import {
  addAddressService,
  editAddressService,
  getAddressService,
  removeAddressService,
} from "../services/address.service.js";
const addAddressController = async (req, res) => {
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
      isDefault,
    } = req.body;
    const { status, message, element } = await addAddressService({
      userId,
      firstName,
      lastName,
      postcode,
      country,
      addressLine1,
      addressLine2,
      city,
      isDefault,
    });
    res.status(status).json({ message });
  } catch (error) {
    console.log(error);
  }
};
const getAddressController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { default_address } = req.query;
    const { status, message, element } = await getAddressService({
      userId,
      default_address,
    });
    res.status(status).json({ message, address: element });
  } catch (error) {
    console.log(error);
  }
};
const editAddressController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id_list_address } = req.params;
    const {
      firstName,
      lastName,
      postcode,
      country,
      addressLine1,
      addressLine2,
      city,
      isDefault,
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
      isDefault,
      id_list_address,
    });
    res.status(status).json({ message, element });
  } catch (error) {
    console.log(error);
  }
};
const removeAddressController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id_list_address } = req.params;
    const { status, message, element } = await removeAddressService({
      userId,
      id_list_address,
    });
    res.status(status).json({ message, element });
  } catch (error) {
    console.log(error);
  }
};
export {
  addAddressController,
  getAddressController,
  editAddressController,
  removeAddressController,
};
