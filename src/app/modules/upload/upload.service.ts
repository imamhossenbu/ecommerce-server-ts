const processSingleFile = (file: Express.Multer.File | undefined) => {
  if (!file) return null;
  return file.path;
};

const processMultipleFiles = (files: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] } | undefined) => {
  if (!files || !Array.isArray(files)) return [];
  return files.map((file) => file.path);
};

export const UploadService = {
  processSingleFile,
  processMultipleFiles
};