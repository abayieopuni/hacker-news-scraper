const { chromium } = require("playwright");
const {
    fetchArticles,
    fetchTimestamps,
    parseTime,
} = require('./utils'); 

describe('Hacker News Scraping Tests', () => {
    let browser, context, page;

    beforeAll(async () => {
        browser = await chromium.launch({ headless: true });
        context = await browser.newContext();
        page = await context.newPage();
        await page.goto("https://news.ycombinator.com/newest", { waitUntil: 'networkidle' });
    });

    afterAll(async () => {
        await browser.close();
    });

    test('Fetch articles', async () => {
        const articles = await fetchArticles(page);
        expect(articles.length).toBeGreaterThan(0);
        console.log('Fetched Articles:', articles);
    });

    test('Fetch timestamps', async () => {
        const timestamps = await fetchTimestamps(page);
        expect(timestamps.length).toBeGreaterThan(0); 
        console.log('Fetched Timestamps:', timestamps);
    });

    test('Parse timestamps correctly', () => {
        const time = parseTime('5 minutes ago');
        expect(time).toBe(5);
    });

    test('Ensure articles and timestamps match', async () => {
        const articles = await fetchArticles(page);
        const timestamps = await fetchTimestamps(page);
        const count = Math.min(articles.length, timestamps.length);
        expect(count).toBe(timestamps.length); 
    });
});
