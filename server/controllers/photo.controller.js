import {
  deletePhotoService,
  addPhotoService,
  uploadPhotoService,
  updatePhotoService,
} from "../services/photo.service.js";

const uploadPhotoController = async (req, res) => {
  try {
    const files = req.files;
    const { status, url, message } = await uploadPhotoService(files[0]);
    res.status(status).json({ status, url, message });
  } catch (error) {
    console.log(error);
  }
};
const addPhotoController = async (req, res) => {
  try {
    const _id = req.params._id;
    const files = req.files;
    const metadata = req.body.metadata;
    const metadatas = [];
    if (typeof metadata == "string") {
      metadatas.push(JSON.parse(metadata));
    } else {
      // convert to array object
      metadata.forEach((item) => {
        metadatas.push(JSON.parse(item));
      });
    }
    const { status, message, element } = await addPhotoService({
      _id,
      file: files[0],
      metadatas,
    });
    res.status(status).json({ message });
  } catch (error) {
    console.log(error);
  }
};
const updatePhotoController = async (req, res) => {
  try {
    const _id = req.params._id;
    const data = req.body;
    const { status, message, element } = await updatePhotoService({
      _id,
      data,
    });
    res.status(status).json({ message });
  } catch (error) {
    console.log(error);
  }
};
const deletePhotoController = async (req, res) => {
  try {
    const _id = req.params._id;
    const { status, message, element } = await deletePhotoService(_id);
    res.status(status).json({ message });
  } catch (error) {
    console.log(error);
  }
};
export {
  addPhotoController,
  deletePhotoController,
  updatePhotoController,
  uploadPhotoController,
};
