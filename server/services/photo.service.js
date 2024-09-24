import { bucket } from "../config/firebase.js";
import _product from "../models/product.model.js";
import _photo from "../models/photo.model.js";
import { updateProductService } from "./product.service.js";
import { checkId } from "../utils/check_id.js";
const uploadPhotoService = async (file) => {
  try {
    const blob = bucket.file("photos/" + file.originalname);
    await blob.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });
    return {
      status: 200,
      url: `https://firebasestorage.googleapis.com/v0/b/fasco-a5db7.appspot.com/o/photos%2F${file.originalname}?alt=media`,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: error.message,
    };
  }
};
const addPhotoService = async ({ _id, file, metadatas }) => {
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
    const { status, url, message } = await uploadPhotoService(file);
    if (!url) {
      return {
        status,
        message,
      };
    }
    const createListPhoto = async (color, sizes) => {
      const isPhoto = await _photo.create({
        color,
        url,
        sizes,
      });
      if (isPhoto) {
        await updateProductService({
          _id,
          data: {
            photo: isPhoto._id,
          },
        });
      }
    };
    const listPhoto = metadatas.map(({ color, sizes }) =>
      createListPhoto(color, sizes)
    );
    await Promise.all(listPhoto);
    return {
      status: 200,
      message: "Upload photo successfully",
    };
  } catch (error) {
    console.log(error);
  }
};
const updatePhotoService = async ({ _id, data }) => {
  try {
    // Check id invalid
    if (checkId(_id)) {
      return {
        status: 500,
        message: "_id photo invalid",
      };
    }
    const photo = await _photo.findById(_id);
    if (!photo) {
      return {
        status: 404,
        message: "Photo not found!",
      };
    }
    await photo.updateOne({ $set: data });
    return {
      status: 200,
      message: "Updated successfully!",
      element: data,
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
export {
  addPhotoService,
  uploadPhotoService,
  updatePhotoService,
  deletePhotoService,
};
