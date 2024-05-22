import _product from "../models/product.model.js";
const getAllProductService = async ({ page, pageSize }) => {
  try {
    const skip = (page - 1) * pageSize;
    const products = await _product
      .find({})
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });
    return {
      status: 200,
      message: "Geted list product",
      element: products,
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
    const product = await _product.findById(_id);
    const isUpdate = await product.updateOne({ $set: data });
    if (!isUpdate) {
      return {
        status: 404,
        message: "Product not found!",
      };
    }
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
    const isDelete = await _product.findByIdAndDelete(_id);
    if (!isDelete) {
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
  updateProductService,
  deleteProductService,
};
