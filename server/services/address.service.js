import _address from "../models/address.model.js";
const createAddressService = async ({ userId }) => {
  try {
    await _address.create({ userId });
    return {
      status: 200,
      message: "Created address successfully!",
    };
  } catch (error) {
    console.log(error);
  }
};
const getAddressService = async ({ userId }) => {
  try {
    const address = await _address.findOne({ userId });
    if (!address) {
      return {
        status: 400,
        message: "Address not found!",
      };
    }
    return {
      status: 200,
      element: address,
    };
  } catch (error) {
    console.log(error);
  }
};
const editAddressService = async ({
  userId,
  firstName,
  lastName,
  postcode,
  country,
  addressLine1,
  addressLine2,
  city,
}) => {
  try {
    const address = await _address.findOne({ userId });
    if (!address) {
      return {
        status: 400,
        message: "Address not found!",
      };
    }
    await address.updateOne({
      $set: {
        firstName,
        lastName,
        postcode,
        country,
        addressLine1,
        addressLine2,
        city,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
export { createAddressService, getAddressService, editAddressService };
