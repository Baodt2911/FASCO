import {
  addProductService,
  deleteProductService,
  getAllProductService,
  updateProductService,
} from "../services/product.service.js";
import { uploadService } from "../services/photo.service.js";
const getAllProductController = async (req, res) => {
  try {
    const { page = 1, pageSize = 50 } = req.query;
    const { status, message, element } = await getAllProductService({
      page: +page,
      pageSize: +pageSize,
    });
    res.status(status).json({
      products: element,
      message,
    });
  } catch (error) {
    console.log(error);
  }
};
const getDetailProductController = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};
const uploadController = async (req, res) => {
  try {
    const _id = req.params._id;
    const files = req.files;
    const metadata = req.body.metadata;
    console.log(files);
    const { status, message, element } = await uploadService({
      _id,
      files,
      metadata,
    });
    res.status(status).json({ message });
  } catch (error) {
    console.log(error);
  }
};
const addProductController = async (req, res) => {
  try {
    const { name, brand, price, type, sex, description } = req.body;
    const { status, message, element } = await addProductService({
      name,
      brand,
      price,
      type,
      sex,
      description,
    });
    res.status(status).json({
      message,
      element: { _id: element._id },
    });
  } catch (error) {
    console.log(error);
  }
};
const updateProductController = async (req, res) => {
  try {
    const { _id, ...data } = req.body;
    const { status, element, message } = await updateProductService({
      _id,
      data,
    });
    res.status(status).json({
      message,
      element,
    });
  } catch (error) {
    console.log(error);
  }
};
const deleteProductController = async (req, res) => {
  try {
    const { _id } = req.body;
    const { status, element, message } = await deleteProductService({
      _id,
    });
    res.status(status).json({
      message,
      element,
    });
  } catch (error) {
    console.log(error);
  }
};
export {
  addProductController,
  getAllProductController,
  getDetailProductController,
  updateProductController,
  deleteProductController,
  uploadController,
};
