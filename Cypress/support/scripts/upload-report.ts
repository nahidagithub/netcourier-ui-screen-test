import * as AWS from "aws-sdk";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

function getTenantNameFromUrl(url: string): string {
  const hostname = new URL(url).hostname; // e.g., arena-hub.netcourier.net
  const firstPart = hostname.split(".")[0]; // arena-hub
  return firstPart.split("-")[0]; // take only 'arena'
}

export async function uploadReports(nodeSiteVersion: string) {
  const reportDir = path.join(__dirname, "../../reports");

  console.log(reportDir);

  const {
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_REGION,
    AWS_S3_BUCKET,
    BASE_URL,
  } = process.env;
  if (
    !AWS_ACCESS_KEY_ID ||
    !AWS_SECRET_ACCESS_KEY ||
    !AWS_REGION ||
    !AWS_S3_BUCKET ||
    !BASE_URL
  ) {
    console.warn("⚠️ Missing AWS credentials or BASE_URL, skipping S3 upload.");
    return;
  }

  if (!fs.existsSync(reportDir)) {
    console.warn("⚠️ Reports directory not found, skipping S3 upload.");
    return;
  }

  const tenantName = getTenantNameFromUrl(BASE_URL);

  const timestamp = new Date();
  const datePart = timestamp.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const timePart = timestamp.toTimeString().slice(0, 8).replace(/:/g, ""); // HHMMSS

  const s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION,
  });

  const files = fs
    .readdirSync(reportDir)
    .filter((f) => f.endsWith(".html") || f.endsWith(".json"));

  if (files.length === 0) {
    console.warn("⚠️ No report files found to upload.");
    return;
  }

  for (const fileName of files) {
    const filePath = path.join(reportDir, fileName);
    const fileContent = fs.readFileSync(filePath);

    const s3Key = `${tenantName}/${nodeSiteVersion}/ui-tests/${datePart}/${timePart}/${fileName}`;
    console.log(s3Key);

    const contentType = fileName.endsWith(".html")
      ? "text/html"
      : fileName.endsWith(".json")
        ? "application/json"
        : "application/octet-stream";

    try {
      await s3
        .upload({
          Bucket: AWS_S3_BUCKET,
          Key: s3Key,
          Body: fileContent,
          ContentType: contentType,
        })
        .promise();

      console.log(`✅ Uploaded ${fileName} to S3 at ${s3Key}`);
    } catch (err) {
      console.error(`❌ Failed to upload ${fileName}:`, err);
    }
  }
}

