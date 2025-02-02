const mockPrisma = {
  $connect: jest.fn().mockResolvedValue(undefined),
  $disconnect: jest.fn().mockResolvedValue(undefined),
  $queryRaw: jest.fn().mockResolvedValue([{ result: 2 }]),
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
    deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
  },
  messageLog: {
    create: jest.fn(),
  },
};

export default mockPrisma;
