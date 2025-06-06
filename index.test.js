const { FundTask, KPLEstablishConnection } = require('@_koii/create-task-cli');

describe('Index Module', () => {
  it('should have task funding and connection establishment methods', () => {
    expect(FundTask).toBeDefined();
    expect(KPLEstablishConnection).toBeDefined();
  });
});