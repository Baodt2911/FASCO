import _address from "../models/address.model.js";
import _user from "../models/user.model.js";
import { checkId } from "../utils/check_id.js";
const addAddressService = async ({
  userId,
  firstName,
  lastName,
  postcode,
  country,
  addressLine1,
  addressLine2,
  city,
  isDefault,
}) => {
  try {
    const user = await _user.findById(userId);
    if (!user) {
      return {
        status: 404,
        message: "User not found",
      };
    }
    if (isDefault) {
      await _address.updateOne(
        { userId },
        { $set: { "list.$[].isDefault": false } } // Đặt tất cả các địa chỉ trong list là không phải mặc định
      );
    }
    const addressDocument = await _address.findOneAndUpdate(
      { userId },
      {
        $push: {
          list: {
            firstName,
            lastName,
            postcode,
            country,
            addressLine1,
            addressLine2,
            city,
            isDefault,
          },
        },
      },
      { upsert: true, new: true }
    );
    if (!user.address) {
      await _user.findByIdAndUpdate(userId, { address: addressDocument._id });
    }
    return {
      status: 200,
      message: "Created address successfully!",
    };
  } catch (error) {
    console.log(error);
  }
};
const getAddressService = async ({ userId, default_address }) => {
  try {
    let address;
    if (default_address === "true") {
      address = await _address.findOne(
        {
          userId,
          "list.isDefault": true,
        },
        {
          list: { $elemMatch: { isDefault: true } },
        }
      );
    } else {
      address = await _address.findOne({ userId });
    }

    if (!address) {
      return {
        status: 400,
        message: "Address not found!",
      };
    }
    return {
      status: 200,
      element: address.list,
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
  isDefault,
  id_list_address,
}) => {
  try {
    const address = await _address.findOne({ userId });
    if (!address) {
      return {
        status: 400,
        message: "Address not found!",
      };
    }
    if (checkId(id_list_address)) {
      return {
        status: 500,
        message: "_id address invalid",
      };
    }
    if (isDefault) {
      await _address.updateOne(
        { userId },
        { $set: { "list.$[].isDefault": false } } // Đặt tất cả các địa chỉ trong list là không phải mặc định
      );
    }
    await _address.findOneAndUpdate(
      {
        userId,
        "list._id": id_list_address, // Tìm kiếm phần tử cụ thể trong mảng list theo _id
      },
      {
        $set: {
          "list.$.firstName": firstName,
          "list.$.lastName": lastName,
          "list.$.postcode": postcode,
          "list.$.country": country,
          "list.$.addressLine1": addressLine1,
          "list.$.addressLine2": addressLine2,
          "list.$.city": city,
          "list.$.isDefault": isDefault,
        },
      }
    );
    return {
      status: 200,
      message: "Updated successfully!",
    };
  } catch (error) {
    console.log(error);
  }
};
const removeAddressService = async ({ userId, id_list_address }) => {
  try {
    const updatedAddress = await _address.findOneAndUpdate(
      {
        userId,
        "list._id": id_list_address,
      },
      {
        $pull: {
          list: {
            _id: id_list_address,
          },
        },
      },
      { new: true }
    );
    if (!updatedAddress) {
      return {
        status: 404,
        message: "Address not found or couldn't be deleted.",
      };
    }
    return {
      status: 200,
      message: "Address deleted successfully!",
    };
  } catch (error) {
    console.error(error);
  }
};

export {
  addAddressService,
  getAddressService,
  editAddressService,
  removeAddressService,
};
