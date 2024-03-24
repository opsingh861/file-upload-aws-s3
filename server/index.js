import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import AWS from 'aws-sdk';
import connectDB from './db/index.js';
import File from './models/file.js';

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World');
});

const bucketName = process.env.BUCKET_NAME;

const s3 = new AWS.S3({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    signatureVersion: 'v4'
});


const generateUploadURL = async (key) => {
    const params = ({
        Bucket: bucketName,
        Key: key,
        Expires: 300
    })

    const url = await s3.getSignedUrlPromise('putObject', params);
    return url;

};

app.post('/upload', async (req, res) => {
    let { key } = req.body;
    const extension = key.split('.')[1];
    const randomKey = `${Date.now()}.${extension}`;
    console.log(randomKey);

    const file = new File({
        filename: key,
        uploadedFileName: randomKey
    });
    await file.save();
    const uploadURL = await generateUploadURL(randomKey);
    res.send({ uploadURL });
});

app.get('/download', async (req, res) => {
    const { key } = req.query;
    const file = await File.findOne({ filename: key });
    const randomKey = file.uploadedFileName;
    const params = ({
        Bucket: bucketName,
        Key: randomKey
    });

    const downloadURL = await s3.getSignedUrlPromise('getObject', params);
    res.send({ downloadURL });
});

const bucket = process.env.BUCKET_NAME;



console.log(bucket);
app.listen(3000, () => {
    connectDB();
    console.log('Server is running on 3000');
});