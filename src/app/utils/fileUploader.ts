import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import multer from 'multer';
import config from '../config';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: config.cloudinary.name,
  api_key: config.cloudinary.key,
  api_secret: config.cloudinary.secret,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const sendImageToCloudinary = async (filePath: string, imageName: string) => {
  return new Promise((resolve, rejects) => {
    cloudinary.uploader.upload(
      filePath,
      {
        public_id: imageName,
      },
      function (error, result) {
        if (error) {
          rejects(error);
        }
        resolve(result as UploadApiResponse);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log('file is deleted');
          }
        });
      },
    );
  });
  // const result = Promise.resolve(cloudinary.uploader.upload(file));
};

const upload = multer({ storage: storage });

export const fileUploader = {
  upload,
  sendImageToCloudinary,
};
