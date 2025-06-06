# Project Setup and Troubleshooting

## Prerequisites

### MongoDB Memory Server Dependencies
If you encounter an error related to `libcrypto.so.1.1`, you may need to install the OpenSSL library:

#### For Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install libssl1.1
```

#### For CentOS/RHEL:
```bash
sudo yum install openssl-libs
```

## Running Tests
Use the following command to run tests:
```bash
npm test
```

## Common Issues
- Ensure all dependencies are installed: `npm install`
- Check that environment variables are correctly set up
- Verify Node.js and npm versions are compatible with project dependencies