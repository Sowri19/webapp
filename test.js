describe("Sample Test Case 1 ", () => {
  it("This test should check that true === true", () => {
    expect(true).toBe(true);
  });
});
aws.config.update({
  secretAccessKey: process.env.ACCESS_SECRET,
  accessKeyId: process.env.ACCESS_KEY,
  region: process.env.REGION,
});

const BUCKET = process.env.BUCKET
const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
      s3: s3,
      acl: "public-read",
      bucket: BUCKET,
      key: function (req, file, cb) {
          console.log(file);
          cb(null, file.originalname)
      }
  })
})