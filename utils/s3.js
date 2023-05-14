import AWS from "aws-sdk";
import fs from "fs";
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const securityAccessKey = process.env.AWS_SECURITY_KEY;

// console.log(region, accessKeyId, securityAccessKey)

AWS.config.update({
  accessKeyId: "AKIA2OHW2XM75D64YCRP02000",
  secretAccessKey: "N3bLD3ACJq8Iw3x7wf2mp1bi00gG2yPDrjdyYFqxE0000",
});

var s3 = new AWS.S3();

// const s3 = new AWS.S3({
// region : "us-east-2",
// accessKeyId : "AKIA2OHW2XM75D64YCRP",
// securityAccessKey: "N3bLD3ACJq8Iw3x7wfmp1bi00gG2yPDrjdyYFqxE"
// })
// console.log(s3.region, s3.accessKeyId, s3.securityAccessKey)
function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);
  console.log(file.filename);
  const uploadParams = {
    Bucket: "hr-app-appycodes",
    Body: fileStream,
    Key: file.filename,
  };
  return s3.upload(uploadParams).promise();
}

export { uploadFile };
