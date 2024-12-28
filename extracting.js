const { JSDOM } = require('jsdom');

function ExtractDataFromHTML(html) {

    console.log('Extracting trending topics from HTML...');
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const trendingElements = document.querySelectorAll('div[data-testid="trend"]');
    const trendingTopics = [];

    trendingElements.forEach((trend) => {
        const label = trend.querySelector('div[dir="ltr"]:nth-child(2) > span')?.textContent.trim();
        const count = trend.querySelector('div[dir="ltr"]:nth-child(3)')?.textContent.trim();
        if (label) {
            trendingTopics.push({ label, count });
        }
    });

    return trendingTopics;
}

module.exports = ExtractDataFromHTML;
