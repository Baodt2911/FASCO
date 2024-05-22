import { bucket } from "../config/firebase.js";
import _product from "../models/product.model.js";
import _photo from "../models/photo.model.js";
import { addSizeProductService } from "./size.service.js";
const addPhotoService = async ({ idProduct, url, color }) => {
  try {
    const isPhoto = await _photo.create({
      idProduct,
      url,
      color,
    });
    return !!isPhoto;
  } catch (error) {
    console.log(error);
  }
};
const uploadService = async ({ _id, files, metadata }) => {
  try {
    const isProduct = await _product.findById(_id);
    if (!isProduct) {
      return {
        status: 404,
        message: "Product not found!",
      };
    }
    const upload = async (file, index) => {
      const blob = bucket.file("photos/" + file.originalname);
      const isUpload = await blob.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });
      console.log("index:", index, file, file.originalname);
      if (isUpload) {
        const { color, quantity, size } = metadata[index];
        const isAddPhoto = await addPhotoService({
          idProduct: _id,
          color,
          url: `https://firebasestorage.googleapis.com/v0/b/fasco-a5db7.appspot.com/o/photos%2F${file.originalname}?alt=media`,
        });
        if (isAddPhoto) {
          const isAddSize = await addSizeProductService({
            idProduct: _id,
            size,
            quantity,
          });
          if (isAddSize) {
            console.log("Đã up");
          }
        }
      }
    };
    const uploadPromises = files.map(
      async (file, index) => await upload(file, index)
    );
    console.log(uploadPromises);
    await Promise.all(uploadPromises);
    return {
      status: 200,
      message: "Uploaded successfully!",
      element: [],
    };
  } catch (error) {
    console.log(error);
  }
};

export { uploadService };
