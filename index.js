const fs = require('fs');
const { chromium } = require("playwright");
const {
    fetchArticles,
    fetchTimestamps,
    parseTime,
    retry,
} = require('./src/utils');

/**  Main function to scrape Hacker News articles.  */
async function sortHackerNewsArticles() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
    
    const page = await context.newPage();
    
    try {
        await retry(() => page.goto("https://news.ycombinator.com/newest", { waitUntil: 'networkidle' }));

        const articles = await fetchArticles(page);
        const timestamps = await fetchTimestamps(page);

        console.log('Number of articles:', articles.length);
        console.log('Number of timestamps:', timestamps.length);

        const articlesWithTimestamps = articles.slice(0, timestamps.length).map((article, index) => ({
            title: article,
            timestamp: parseTime(timestamps[index]),
        }));

        console.log(`Total articles fetched: ${articlesWithTimestamps.length}`);
        console.log(`First article timestamp: ${new Date(articlesWithTimestamps[0].timestamp * 60000)}`);
        console.log(`Last article timestamp: ${new Date(articlesWithTimestamps[articlesWithTimestamps.length - 1].timestamp * 60000)}`);

        // Save articles to a JSON file
        const jsonContent = JSON.stringify(articlesWithTimestamps, null, 2);
        fs.writeFileSync('articles.json', jsonContent);
        console.log('Articles saved to articles.json');

    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        // Wait for user input before closing
        await new Promise(resolve => {
            console.log("Press Enter to close the browser...");
            process.stdin.once('data', () => {
                resolve();
            });
        });
        await browser.close();
    }
}

(async () => {
    await sortHackerNewsArticles();
})();
