
/** Fetches article titles from Hacker News.*/
async function fetchArticles(page) {
    return await page.$$eval('span.titleline a', links => links.slice(0, 100).map(link => link.innerText));
}

/**
 Fetches article timestamps from Hacker News.*/
async function fetchTimestamps(page) {
    return await page.$$eval('span.age', timeLinks => timeLinks.map(link => link.innerText));
}

/** Parses time strings into minutes for comparison.*/
const parseTime = (time) => {
    if (!time) return 0; 
    const timeValue = parseInt(time);
    if (time.includes('minute')) {
        return timeValue; 
    } else if (time.includes('hour')) {
        return timeValue * 60; 
    } else if (time.includes('day')) {
        return timeValue * 1440; 
    }
    return 0; 
};

/** Retries a given function multiple times. */
async function retry(fn, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (err) {
            console.error(`Attempt ${i + 1} failed: ${err}`);
            if (i === retries - 1) throw err; 
        }
    }
}

// Export the functions to be used in index.js
module.exports = {
    fetchArticles,
    fetchTimestamps,
    parseTime,
    retry,
};
