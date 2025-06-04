import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  execSync(`npx jest --config ${path.join(__dirname, 'package.json')} tests/mock-crypto-prices.test.js src/routes/coinDetails.test.js`, { stdio: 'inherit' });
  console.log('Tests completed successfully');
  process.exit(0);
} catch (error) {
  console.error('Tests failed');
  process.exit(1);
}