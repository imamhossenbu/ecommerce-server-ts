export declare const UploadService: {
    processSingleFile: (file: Express.Multer.File | undefined) => string | null;
    processMultipleFiles: (files: Express.Multer.File[] | {
        [fieldname: string]: Express.Multer.File[];
    } | undefined) => string[];
};
