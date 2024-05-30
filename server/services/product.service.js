import _product from "../models/product.model.js";
import _photo from "../models/photo.model.js";
import _soldRate from "../models/sold_rate.model.js";
import { checkId } from "../utils/check_id.js";
import { createSoldRate } from "./sold_rate.service.js";
const getAllProductService = async ({ page, pageSize, sold_rate }) => {
  try {
    const skip = (page - 1) * pageSize;
    let products = await _product
      .find({})
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .populate("photos");
    if (sold_rate) {
      products = await _product
        .find({})
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .populate("photos")
        .populate("sold_rate");
    }
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
    const product = await _product
      .findById(id)
      .populate("photos")
      .populate("sold_rate");
    if (!product) {
      return {
        message: "No result is found",
        status: 404,
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
    const sold_rate = await createSoldRate();
    const isProduct = await _product.create({
      name,
      brand,
      price,
      type,
      sex,
      description,
      sold_rate,
    });
    if (isProduct) {
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
const updateProductService = async ({ _id, data }) => {
  try {
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
    if (!!data.photos) {
      // Check id invalid
      if (checkId(data.photos[0])) {
        return {
          status: 500,
          message: "_id photo invalid",
        };
      }
      await product.updateOne({ $addToSet: { photos: data.photos } });
      return {
        status: 200,
        message: "Updated successfully!",
        element: data,
      };
    }
    await product.updateOne({ $set: data });
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
    const isDtProduct = await _product.findByIdAndDelete(_id);
    const { photos, sold_rate } = isDtProduct._doc;
    const dlPhoto = photos.map(
      async (item) => await _photo.deleteMany({ _id: item })
    );
    const isDtPhoto = await Promise.all(dlPhoto);
    const isDtSoldRate = await _soldRate.findByIdAndDelete(sold_rate);
    if (!(isDtProduct && isDtPhoto && isDtSoldRate)) {
      return {
        status: 404,
        message: "Product not found!",
      };
    }
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
