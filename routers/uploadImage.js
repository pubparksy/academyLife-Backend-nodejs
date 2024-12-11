const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");
const { MulterAzureStorage } = require("multer-azure-blob-storage");
require("dotenv").config();

/** Blob 이름 생성 */
const resolveBlobName = (req, file, directory) => {
  return new Promise((resolve, reject) => {
    const ext = path.extname(file.originalname);
    // console.log(ext);
    if (![".jpg", ".jpeg", ".png", ".bmp", ".gif", ".xlsx", ".csv"].includes(ext)) {
      reject(new Error("fileExtensionDenied")); // 허용되지 않은 확장자
    } else {
      // directory 이름이 주어질 경우 이름에 포함시키기
      // const blobName = path.basename(file.originalname, ext) + Date.now() + ext;
      const blobName = path.join(directory + path.basename(file.originalname, ext) + Date.now() + ext);
      req.filename = blobName;
      resolve(blobName);
    }
  });
};

/** Multer Azure Storage 설정 */
const azureStoreage = new MulterAzureStorage({
  connectionString: process.env.SA_CONNECTION_STRING,
  accessKey: process.env.SA_KEY,
  // containerName: 'academylife',  // 나중에 이거로 바꿔야함
  containerName: "academylife",

  // profile 단어가 들어가는 라우터에서 호출 시 디렉토리 이름 추가하도록 수정
  // blobName: resolveBlobName,
  blobName: (req, file) => {
    if (req.route.path.includes("profile")) {
      directory = ":profileImages:";
    } else {
      directory = "";
    }
    return resolveBlobName(req, file, directory);
  },
  containerAccessLevel: "blob",
});

const upload = multer({
  storage: azureStoreage,
  limits: { fileSize: 1024 * 1024 * 100 },
});

module.exports = upload;
