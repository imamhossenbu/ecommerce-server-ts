"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const processSingleFile = (file) => {
    if (!file)
        return null;
    return file.path;
};
const processMultipleFiles = (files) => {
    if (!files || !Array.isArray(files))
        return [];
    return files.map((file) => file.path);
};
exports.UploadService = {
    processSingleFile,
    processMultipleFiles
};
//# sourceMappingURL=upload.service.js.map