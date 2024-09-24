import _product from "../models/product.model.js";
import { checkId } from "../utils/check_id.js";
import { deletePhotoService } from "./photo.service.js";
import {
  addSoldService,
  getSoldRateService,
  deleteSoldRateService,
} from "./sold_rate.service.js";
const getAllProductService = async ({
  page,
  pageSize,
  type,
  sex,
  min_price,
  max_price,
}) => {
  try {
    const skip = (page - 1) * pageSize;
    let query = {};
    if (type) {
      query.type = type;
    }
    if (sex) {
      query.sex = sex;
    }
    if (min_price && max_price) {
      query.$and = [
        { price: { $gte: min_price } },
        { price: { $lte: max_price } },
      ];
    }
    const products = await _product
      .find(query)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .populate("photos");
    return {
      status: 200,
      message: "Geted list product",
      element: products,
    };
  } catch (error) {
    console.log(error);
  }
};
const getDetailProductService = async ({ id }) => {
  try {
    // Check id invalid
    if (checkId(id)) {
      return {
        status: 500,
        message: "_id product invalid",
      };
    }
    const product = await _product.findById(id).populate("photos");
    if (!product) {
      return {
        status: 404,
        message: "No result is found",
      };
    }
    return {
      status: 200,
      message: "Geted detail product",
      element: product,
    };
  } catch (error) {
    console.log(error);
  }
};
const searchProductService = async ({ querySearch, order }) => {
  try {
    if (!querySearch) {
      return {
        message: "No result is found",
        status: 404,
      };
    }
    let resultsProducts = await _product
      .find({
        name: { $regex: querySearch, $options: "i" },
      })
      .populate("photos");
    if (order === "suggest") {
      const firstWord = querySearch.split(" ")[0];
      resultsProducts = await _product.find(
        {
          name: {
            $regex: new RegExp(`^${firstWord}`), //query firstWord
            $options: "i",
          },
        },
        "name"
      ); //Get fieldName
    }
    return {
      status: 200,
      element: resultsProducts,
    };
  } catch (error) {
    console.log(error);
  }
};
const addProductService = async ({
  name,
  brand,
  price,
  type,
  sex,
  description,
}) => {
  try {
    const isProduct = await _product.create({
      name,
      brand,
      price,
      type,
      sex,
      description,
    });
    if (isProduct) {
      const { _id: idProduct } = isProduct._doc;
      await addSoldService({ idProduct });
      return {
        status: 200,
        message: "Added successfully!",
        element: isProduct,
      };
    }
    return {
      status: 500,
      message: "Internal server error",
    };
  } catch (error) {
    console.log(error);
  }
};
const updateProductService = async ({ _id, data, is_delete_photo }) => {
  try {
    const { photo, ...other } = data;
    // Check id invalid
    if (checkId(_id)) {
      return {
        status: 500,
        message: "_id product invalid",
      };
    }
    const product = await _product.findById(_id);
    if (!product) {
      return {
        status: 404,
        message: "Product not found!",
      };
    }
    if (!!photo) {
      if (is_delete_photo) {
        await product.updateOne({
          $pull: { photos: Array.isArray(photo) ? { $in: photo } : photo },
        });
        if (Array.isArray(photo)) {
          const listPhoto = photo.map((id) => deletePhotoService(id));
          await Promise.all(listPhoto);
        } else {
          await deletePhotoService(photo);
        }
      } else {
        await product.updateOne({ $push: { photos: photo } });
      }
    }
    await product.updateOne({ $set: other });
    return {
      status: 200,
      message: "Updated successfully!",
      element: data,
    };
  } catch (error) {
    console.log(error);
  }
};
const deleteProductService = async ({ _id }) => {
  try {
    // Check id invalid
    if (checkId(_id)) {
      return {
        status: 500,
        message: "_id product invalid",
      };
    }
    const isProduct = await _product.findById(_id);
    if (!isProduct) {
      return {
        status: 404,
        message: "Product not found!",
      };
    }
    const { photos, _id: idProduct } = isProduct?._doc;
    const isSoldRate = await getSoldRateService({ idProduct });
    if (!isSoldRate) {
      const { status, message } = isSoldRate;
      return {
        status,
        message,
      };
    }
    const isDeletePhotos = photos.map((item) => deletePhotoService(item));
    const deleteAllPhotos = await Promise.all(isDeletePhotos);
    const isDeleteAllPhoto = deleteAllPhotos.every(
      (item) => item.status === 200
    );
    if (!isDeleteAllPhoto) {
      return {
        status: 500,
        message: "Internal Server Error",
      };
    }
    await isProduct.deleteOne();
    await deleteSoldRateService(isSoldRate?.element?._id);
    return {
      status: 200,
      message: "Deleted successfully!",
    };
  } catch (error) {
    console.log(error);
  }
};
export {
  addProductService,
  getAllProductService,
  getDetailProductService,
  updateProductService,
  deleteProductService,
  searchProductService,
};
