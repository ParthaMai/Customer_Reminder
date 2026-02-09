
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const audioStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "emi_audio",
    resource_type: "video", // IMPORTANT for audio
    allowed_formats: ["mp3", "wav", "webm", "m4a"],
  },
});

const uploadAudio = multer({ storage: audioStorage });

export default uploadAudio;
