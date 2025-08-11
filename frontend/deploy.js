const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configure AWS SDK
AWS.config.region = 'us-east-1'; // Change to your region

const s3 = new AWS.S3();

// Get bucket name from Terraform output
const getBucketName = () => {
  try {
    const output = execSync('cd ../terraform && terraform output -raw s3_bucket_name', { encoding: 'utf8' });
    return output.trim();
  } catch (error) {
    console.error('Error getting bucket name:', error.message);
    process.exit(1);
  }
};

const uploadFile = async (bucketName, filePath, key) => {
  const fileContent = fs.readFileSync(filePath);
  
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fileContent,
    ContentType: getContentType(filePath)
  };

  try {
    await s3.upload(params).promise();
    console.log(`Uploaded: ${key}`);
  } catch (error) {
    console.error(`Error uploading ${key}:`, error.message);
  }
};

const getContentType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };
  return types[ext] || 'application/octet-stream';
};

const uploadDirectory = async (bucketName, dirPath) => {
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file.name);
    
    if (file.isDirectory()) {
      await uploadDirectory(bucketName, fullPath);
    } else {
      const key = path.relative('build', fullPath).replace(/\\/g, '/');
      await uploadFile(bucketName, fullPath, key);
    }
  }
};

const main = async () => {
  console.log('Building React app...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('Getting S3 bucket name...');
  const bucketName = getBucketName();
  console.log(`Deploying to bucket: ${bucketName}`);
  
  console.log('Uploading files to S3...');
  await uploadDirectory(bucketName, 'build');
  
  console.log('Deployment complete!');
  console.log('Getting CloudFront URL...');
  
  try {
    const cfUrl = execSync('cd ../terraform && terraform output -raw cloudfront_url', { encoding: 'utf8' });
    console.log(`Your app is available at: ${cfUrl.trim()}`);
  } catch (error) {
    console.log('Check terraform outputs for CloudFront URL');
  }
};

main().catch(console.error);
