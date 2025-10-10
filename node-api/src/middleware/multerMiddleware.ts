import multer, { FileFilterCallback } from "multer";
import fs from "fs";
import path from "path";
import { Request } from "express";

/**
 * Creates a Multer middleware for handling image/audio uploads.
 * Automatically creates the folder if it doesn't exist.
 * @param folder - Destination folder path for uploaded files
 */
export const uploadImage = (folder: string) => {
  console.log(`[UPLOAD_IMAGE] Requested upload folder: ${folder}`);

  // Ensure folder exists (creates nested folders too)
  if (!fs.existsSync(folder)) {
    console.log(`[UPLOAD_IMAGE] Folder does not exist. Creating: ${folder}`);
    fs.mkdirSync(folder, { recursive: true });
  } else {
    console.log(`[UPLOAD_IMAGE] Folder already exists: ${folder}`);
  }

  return multer({
    storage: multer.diskStorage({
      destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        console.log(`[UPLOAD_IMAGE] Uploading file: ${file.originalname}`);
        cb(null, folder);
      },
      filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        const filename = `${Date.now()}-${file.originalname}`;
        console.log(`[UPLOAD_IMAGE] Saved as: ${filename}`);
        cb(null, filename);
      },
    }),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB
    },
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
      const allowedTypes = [
        'audio/mpeg',   // .mp3
        'audio/wav',    // .wav
        'image/jpeg',
        'image/png',
        'image/webp'
      ];

      if (!allowedTypes.includes(file.mimetype)) {
        console.log(`[UPLOAD_IMAGE] Rejected file type: ${file.mimetype}`);
        return cb(new Error('Only .jpeg, .png, .webp images and .mp3/.wav audio are allowed'));
      }

      cb(null, true);
    },
  });
};
