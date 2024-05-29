import { uploadService } from "../services/photo.service.js";

const uploadController = async (req, res) => {
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
    const { status, message, element } = await uploadService({
      _id,
      files,
      metadatas,
    });
    res.status(status).json({ message });
  } catch (error) {
    console.log(error);
  }
};
export { uploadController };
