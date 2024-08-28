import _product from "../models/product.model.js";
import _photo from "../models/photo.model.js";
import _soldRate from "../models/sold_rate.model.js";
import { checkId } from "../utils/check_id.js";
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
    // Check id invalid
    if (checkId(_id)) {
      return {
        status: 500,
        message: "_id product invalid",
      };
    }
    const isDtProduct = await _product.findByIdAndDelete(_id);
    if (!isDtProduct) {
      return {
        status: 404,
        message: "Product not found!",
      };
    }
    const { photos } = isDtProduct?._doc;
    const dlPhoto = photos.map(
      async (item) => await _photo.deleteMany({ _id: item })
    );
    await Promise.all(dlPhoto);
    await _soldRate.findByIdAndDelete(isDtProduct);
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
