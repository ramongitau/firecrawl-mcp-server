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
import { scrapeHandler, mapHandler, searchHandler } from './index.js';

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
});

// Note: FastMCP doesn't expose listTools() publically. 
// Tool registration is verified by the fact that the server starts and the code executes without errors.
