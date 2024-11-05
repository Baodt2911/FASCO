import {
  addProductService,
  deleteProductService,
  getAllProductService,
  getDetailProductService,
  searchProductService,
  updateProductService,
} from "../services/product.service.js";
const getAllProductController = async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      type,
      sex,
      brand,
      min_price,
      max_price,
    } = req.query;
    const { status, message, element } = await getAllProductService({
      page: +page,
      pageSize: +pageSize,
      type,
      sex,
      brand,
      min_price,
      max_price,
    });
    res.status(status).json({
      datas: element,
      message,
    });
  } catch (error) {
    console.log(error);
  }
};
const getDetailProductController = async (req, res) => {
  try {
    const { id } = req.query;
    const { status, message, element } = await getDetailProductService({ id });
    res.status(status).json({
      product: element,
      message,
    });
  } catch (error) {
    console.log(error);
  }
};
const searchProductController = async (req, res) => {
  try {
    const { q: querySearch, order } = req.query;
    const { message, status, element } = await searchProductService({
      querySearch,
      order,
    });
    res.status(status).json({
      products: element,
      message,
    });
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
    const _id = req.params._id;
    const data = req.body;
    const { is_delete_photo = false } = req.query;
    const { status, element, message } = await updateProductService({
      _id,
      data,
      is_delete_photo,
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
    const _id = req.params._id;
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
  searchProductController,
};
