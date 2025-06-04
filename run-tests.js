import { execSync } from 'child_process';

try {
  execSync('npx jest tests/mock-crypto-prices.test.js src/routes/coinDetails.test.js', { stdio: 'inherit' });
  console.log('Tests completed successfully');
  process.exit(0);
} catch (error) {
  console.error('Tests failed');
  process.exit(1);
}