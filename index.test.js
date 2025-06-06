import { describe, it, expect, vi } from 'vitest';
import { FundTask } from '@_koii/create-task-cli';

// Mock the external dependencies
vi.mock('@_koii/create-task-cli', () => {
  return {
    FundTask: vi.fn().mockResolvedValue(true),
    KPLEstablishConnection: vi.fn(),
    KPLFundTask: vi.fn(),
    getTaskStateInfo: vi.fn(),
    KPLCheckProgram: vi.fn(),
  };
});

describe('Cryptocurrency Task Funding', () => {
  it('should call FundTask with correct parameters', async () => {
    const mockPayerKeypair = {
      publicKey: 'mock-public-key',
      secretKey: new Uint8Array([1, 2, 3])
    };
    const mockTaskStateInfoAddress = 'mock-task-address';
    const mockStakePotAccount = 'mock-stake-pot';
    const amount = 100;

    await FundTask(mockPayerKeypair, mockTaskStateInfoAddress, mockStakePotAccount, amount);

    expect(FundTask).toHaveBeenCalledWith(
      mockPayerKeypair, 
      mockTaskStateInfoAddress, 
      mockStakePotAccount, 
      amount
    );
  });
});