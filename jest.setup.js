// Global test setup
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn()
};

// Mock external dependencies
jest.mock('@_koii/create-task-cli', () => ({
  FundTask: jest.fn().mockResolvedValue(true),
  KPLEstablishConnection: jest.fn().mockResolvedValue(true)
}));