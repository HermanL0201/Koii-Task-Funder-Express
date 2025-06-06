// Mock implementation of mongoose for testing
export const mongoose = {
  set: jest.fn(),
  connect: jest.fn().mockResolvedValue(true),
  connection: {
    dropDatabase: jest.fn().mockResolvedValue(true),
    db: {}
  },
  disconnect: jest.fn().mockResolvedValue(true),
  Model: class {
    static create = jest.fn();
    static findOne = jest.fn();
    static find = jest.fn();
    static findById = jest.fn();
    static updateOne = jest.fn();
    static deleteOne = jest.fn();
  }
};

export default mongoose;