import { bucket } from "../config/firebase.js";
import _product from "../models/product.model.js";
import _photo from "../models/photo.model.js";
import { updateProductService } from "./product.service.js";
import { checkId } from "../utils/check_id.js";
const addPhotoService = async ({ url, color, sizes }) => {
  try {
    const isPhoto = await _photo.create({
      url,
      color,
      sizes,
    });
    return {
      idPhoto: isPhoto._doc._id,
    };
  } catch (error) {
    console.log(error);
  }
};
const uploadService = async ({ _id, files, metadatas }) => {
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
      const isUpload = blob.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });
      if (isUpload) {
        const { color, sizes } = metadatas[index];
        const { idPhoto } = await addPhotoService({
          color,
          url: `https://firebasestorage.googleapis.com/v0/b/fasco-a5db7.appspot.com/o/photos%2F${file.originalname}?alt=media`,
          sizes,
        });
        if (idPhoto) {
          await updateProductService({
            _id,
            data: {
              photos: [idPhoto],
            },
          });
        }
      }
    };
    const uploadPromises = files.map(
      async (file, index) => await upload(file, index)
    );
    await Promise.all(uploadPromises);
    return {
      status: 200,
      message: "Upload photo successfully",
    };
  } catch (error) {
    console.log(error);
  }
};
const deletePhotoService = async (_id) => {
  try {
    // Check id invalid
    if (checkId(_id)) {
      return {
        status: 500,
        message: "_id photo invalid",
      };
    }
    const isDelete = await _photo.findById(_id);
    if (!isDelete) {
      return {
        status: 404,
        message: "Photo not found",
      };
    }
    const { url } = isDelete;
    const firstIndex = url.indexOf("%2F") + 3;
    const lastIndex = url.lastIndexOf("?alt=media");
    const path = url.substring(firstIndex, lastIndex);
    await bucket.file("photos/" + path).delete();
    await isDelete.deleteOne();
    return {
      status: 200,
      message: "Delete photo successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error: " + error?.errors[0]?.message,
    };
  }
};
export { uploadService, deletePhotoService };
