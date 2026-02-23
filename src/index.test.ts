import { jest } from '@jest/globals';
import { extractApiKey, removeEmptyTopLevel, server } from './index.js';

describe('Firecrawl MCP Server Utilities', () => {
  describe('extractApiKey', () => {
    it('should extract API key from x-firecrawl-api-key header', () => {
      const headers = { 'x-firecrawl-api-key': 'test-key' };
      expect(extractApiKey(headers)).toBe('test-key');
    });

    it('should extract API key from x-api-key header', () => {
      const headers = { 'x-api-key': 'test-key' };
      expect(extractApiKey(headers)).toBe('test-key');
    });

    it('should extract API key from bearer token', () => {
      const headers = { authorization: 'Bearer test-key' };
      expect(extractApiKey(headers)).toBe('test-key');
    });

    it('should return undefined if no key is found', () => {
      const headers = {};
      expect(extractApiKey(headers)).toBeUndefined();
    });
  });

  describe('removeEmptyTopLevel', () => {
    it('should remove null and undefined values', () => {
      const obj = { a: 1, b: null, c: undefined };
      expect(removeEmptyTopLevel(obj)).toEqual({ a: 1 });
    });

    it('should remove empty strings', () => {
      const obj = { a: 'cont', b: '', c: ' ' };
      expect(removeEmptyTopLevel(obj)).toEqual({ a: 'cont' });
    });

    it('should remove empty arrays and objects', () => {
      const obj = { a: [1], b: [], c: { x: 1 }, d: {} };
      expect(removeEmptyTopLevel(obj)).toEqual({ a: [1], c: { x: 1 } });
    });
  });
});

import FirecrawlApp from '@mendable/firecrawl-js';
import {
  scrapeHandler,
  mapHandler,
  searchHandler,
  crawlHandler,
  crawlStatusHandler,
  extractHandler,
  agentHandler,
  agentStatusHandler,
  browserCreateHandler,
  browserExecuteHandler,
  browserDeleteHandler,
  browserListHandler,
} from './index.js';

// Setup prototype spies instead of module mocking
jest.spyOn(FirecrawlApp.prototype, 'scrape').mockImplementation(async () => ({
  success: true,
  markdown: '# Test Content',
  metadata: { title: 'Test Page' },
} as any));

jest.spyOn(FirecrawlApp.prototype, 'map').mockImplementation(async () => ({
  success: true,
  links: ['https://example.com/page1'],
} as any));

jest.spyOn(FirecrawlApp.prototype, 'search').mockImplementation(async () => ({
  success: true,
  data: [
    {
      url: 'https://example.com',
      title: 'Test Page',
      description: 'Test Description',
    },
  ],
} as any));

jest.spyOn(FirecrawlApp.prototype, 'crawl').mockImplementation(async () => ({
  success: true,
  id: 'test-crawl-id',
} as any));

jest.spyOn(FirecrawlApp.prototype, 'getCrawlStatus').mockImplementation(async () => ({
  success: true,
  status: 'completed',
  data: [{ markdown: 'content' }],
} as any));

jest.spyOn(FirecrawlApp.prototype, 'extract').mockImplementation(async () => ({
  success: true,
  data: { key: 'value' },
} as any));

// startAgent and getAgentStatus are not in the main types but used via (client as any)
jest.spyOn(FirecrawlApp.prototype as any, 'startAgent').mockImplementation(async () => ({
  success: true,
  id: 'test-agent-id',
} as any));

jest.spyOn(FirecrawlApp.prototype as any, 'getAgentStatus').mockImplementation(async () => ({
  success: true,
  status: 'completed',
  data: { result: 'done' },
} as any));

jest.spyOn(FirecrawlApp.prototype, 'browser').mockImplementation(async () => ({
  success: true,
  sessionId: 'test-session-id',
} as any));

jest.spyOn(FirecrawlApp.prototype, 'browserExecute').mockImplementation(async () => ({
  success: true,
  output: 'result',
} as any));

jest.spyOn(FirecrawlApp.prototype, 'deleteBrowser').mockImplementation(async () => ({
  success: true,
} as any));

jest.spyOn(FirecrawlApp.prototype, 'listBrowsers').mockImplementation(async () => ({
  success: true,
  sessions: [],
} as any));

const mockSession = { firecrawlApiKey: 'test-key' };

describe('Tool Handlers', () => {
  const mockLog = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  } as any;

  describe('scrapeHandler', () => {
    it('should call client.scrape correctly', async () => {
      const args = { url: 'https://example.com', formats: ['markdown'] };
      const result = await scrapeHandler(args, { session: mockSession, log: mockLog });
      expect(result).toContain('# Test Content');
      expect(mockLog.info).toHaveBeenCalled();
    });
  });

  describe('mapHandler', () => {
    it('should call client.map correctly', async () => {
      const args = { url: 'https://example.com' };
      const result = await mapHandler(args, { session: mockSession, log: mockLog });
      expect(JSON.parse(result).links).toBeDefined();
    });
  });

  describe('searchHandler', () => {
    it('should call client.search correctly', async () => {
      const args = { query: 'test query' };
      const result = await searchHandler(args, { session: mockSession, log: mockLog });
      expect(JSON.parse(result).data).toBeDefined();
    });
  });

  describe('crawlHandler', () => {
    it('should call client.crawl correctly', async () => {
      const args = { url: 'https://example.com' };
      const result = await crawlHandler(args, { session: mockSession, log: mockLog });
      expect(JSON.parse(result).id).toBe('test-crawl-id');
    });
  });

  describe('crawlStatusHandler', () => {
    it('should call client.getCrawlStatus correctly', async () => {
      const args = { id: 'test-crawl-id' };
      const result = await crawlStatusHandler(args, { session: mockSession });
      expect(JSON.parse(result).status).toBe('completed');
    });
  });

  describe('extractHandler', () => {
    it('should call client.extract correctly', async () => {
      const args = { urls: ['https://example.com'], prompt: 'test' };
      const result = await extractHandler(args, { session: mockSession, log: mockLog });
      expect(JSON.parse(result).data).toBeDefined();
    });
  });

  describe('agentHandler', () => {
    it('should call client.startAgent correctly', async () => {
      const args = { prompt: 'test' };
      const result = await agentHandler(args, { session: mockSession, log: mockLog });
      expect(JSON.parse(result).id).toBe('test-agent-id');
    });
  });

  describe('agentStatusHandler', () => {
    it('should call client.getAgentStatus correctly', async () => {
      const args = { id: 'test-agent-id' };
      const result = await agentStatusHandler(args, { session: mockSession, log: mockLog });
      expect(JSON.parse(result).status).toBe('completed');
    });
  });

  describe('browserCreateHandler', () => {
    it('should call client.browser correctly', async () => {
      const args = {};
      const result = await browserCreateHandler(args, { session: mockSession, log: mockLog });
      expect(JSON.parse(result).sessionId).toBe('test-session-id');
    });
  });

  describe('browserExecuteHandler', () => {
    it('should call client.browserExecute correctly', async () => {
      const args = { sessionId: 'test', code: 'test' };
      const result = await browserExecuteHandler(args, { session: mockSession, log: mockLog });
      expect(JSON.parse(result).output).toBe('result');
    });
  });

  describe('browserDeleteHandler', () => {
    it('should call client.deleteBrowser correctly', async () => {
      const args = { sessionId: 'test' };
      const result = await browserDeleteHandler(args, { session: mockSession, log: mockLog });
      expect(JSON.parse(result).success).toBe(true);
    });
  });

  describe('browserListHandler', () => {
    it('should call client.listBrowsers correctly', async () => {
      const args = { status: 'active' };
      const result = await browserListHandler(args, { session: mockSession, log: mockLog });
      expect(JSON.parse(result).sessions).toBeDefined();
    });
  });
});

// Note: FastMCP doesn't expose listTools() publically. 
// Tool registration is verified by the fact that the server starts and the code executes without errors.
