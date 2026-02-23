import { jest } from '@jest/globals';

// Set test timeout
jest.setTimeout(30000);

// Create mock instance with all methods used in src/index.ts
const mockInstance = {
  apiKey: 'test-api-key',
  apiUrl: 'test-api-url',
  scrape: jest.fn().mockImplementation(async () => ({
    success: true,
    markdown: '# Test Content',
    metadata: { title: 'Test Page' },
  })),
  map: jest.fn().mockImplementation(async () => ({
    success: true,
    links: ['https://example.com/page1'],
  })),
  search: jest.fn().mockImplementation(async () => ({
    success: true,
    data: [
      {
        url: 'https://example.com',
        title: 'Test Page',
        description: 'Test Description',
      },
    ],
  })),
  crawl: jest.fn().mockImplementation(async () => ({
    success: true,
    id: 'test-crawl-id',
  })),
  getCrawlStatus: jest.fn().mockImplementation(async () => ({
    status: 'completed',
    data: [{ url: 'https://example.com', markdown: '# Content' }],
  })),
  extract: jest.fn().mockImplementation(async () => ({
    success: true,
    data: { test: 'data' },
  })),
  startAgent: jest.fn().mockImplementation(async () => ({
    success: true,
    id: 'test-agent-id',
  })),
  getAgentStatus: jest.fn().mockImplementation(async () => ({
    status: 'completed',
    data: { result: 'success' },
  })),
  fetchBatchScrape: jest.fn().mockImplementation(async () => ({
    success: true,
    id: 'test-batch-id',
  })),
  getBatchScrapeStatus: jest.fn().mockImplementation(async () => ({
    status: 'completed',
    data: [{ url: 'https://example.com', markdown: '# Content' }],
  })),
  browser: jest.fn().mockImplementation(async () => ({
    success: true,
    id: 'test-session-id',
  })),
  browserExecute: jest.fn().mockImplementation(async () => ({
    success: true,
    output: 'test output',
  })),
  listBrowsers: jest.fn().mockImplementation(async () => ({
    success: true,
    sessions: [],
  })),
  v1: {
    getCreditUsage: jest.fn().mockImplementation(async () => ({
      success: true,
      data: {
        remaining_credits: 500,
        plan_credits: 1000,
        billing_period_start: null,
        billing_period_end: null,
      },
    })),
  },
};

// End of mock configuration
