import _size from "../models/size.model.js";
const addSizeProductService = async ({ idPhoto, size, quantity }) => {
  try {
    const isSize = await _size.create({
      idPhoto,
      size,
      quantity,
    });
    return !!isSize;
  } catch (error) {
    console.log(error);
  }
};
export { addSizeProductService };
