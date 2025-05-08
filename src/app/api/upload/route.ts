import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

//Setting up the S3 client for digital Ocen Spaces
const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: process.env.DO_SPACES_ENDPOINT || "N/A",
  credentials: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY || "N/A",
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY || "N/A",
  },
});

const BUCKET_NAME = process.env.DO_SPACES_BUCKET_NAME || "N/A";

export async function POST(req: NextRequest) {
  try {
    //Check if request is multipart form-data
    if (!req.headers.get("content-type")?.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Expected multipart form-data" },
        { status: 400 }
      );
    }
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    //Generate a unique filename to prevent overwriting
    const fileExtension = file.name.split(".").pop() || "";
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;

    //Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    //Upload to digtal ocean
    const params = {
      Bucket: BUCKET_NAME,
      Key: `uploads/${uniqueFileName}`,
      Body: buffer,
      ContentType: file.type,
      ACL: "public-read" as ObjectCannedACL, //Make the file publicly accesible
    };

    await s3Client.send(new PutObjectCommand(params));

    //Constructing the public URL for the uploaded file
    const fileUrl = `https://${BUCKET_NAME}.${
      process.env.DO_SPACES_ENDPOINT?.replace("https://", "") ||
      "nyc3.digitaloceanspaces.com"
    }/uploads/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
    });
  } catch (error) {
    console.log("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
