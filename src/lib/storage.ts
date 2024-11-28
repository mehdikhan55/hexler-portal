
import { NextRequest } from "next/server";
import { cloudinary } from "./cloudinaryConfig";


export const uploadToCloudinary = (fileUri: string, fileName: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .unsigned_upload(fileUri, "hexler_projects")
      .then((result) => {
        resolve({ success: true, result });
      })
      .catch((error) => {
        reject({ success: false, error });
      });
  });
};

