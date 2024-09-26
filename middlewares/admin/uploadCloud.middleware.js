const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configuration kết nối tới tài khoản cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_KEY, 
  api_secret: process.env.CLOUD_SECRET
});

module.exports.uploadSingleToCloud = (req, res, next) => {
  if(req.file){
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream(
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      req.body.thumbnail = result.url //gán thêm trường thumbnail trong DB là link ảnh trên cloud luôn
      next();
    }

    upload(req);
  }
  else{
    next();
  }
}