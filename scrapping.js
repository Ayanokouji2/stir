const { By, Builder, until, Key } = require('selenium-webdriver');
const ExtractDataFromHTML = require('./extracting');
const chrome = require('selenium-webdriver/chrome');
const TrendingModel = require('./model');

const proxies = process.env.PROXIES.split(',');

function generateRandomProxy() {
	console.log('Generating a random proxy...');
	return proxies[Math.floor(Math.random() * proxies.length)];
}

async function scrapping() {
	let driver;
	let elem;
	let html;

	console.log('Starting to scrape the trending topics from X homepage...');
	const start_time = Date.now();
	while (true) {
		try {
			const chromeOptions = new chrome.Options();
			const proxy = generateRandomProxy();

			chromeOptions.addArguments('--no-sandbox', '--disable-dev-shm-usage');
			chromeOptions.addArguments('--disable-gpu'); 
			chromeOptions.addArguments('--headless'); 
			chromeOptions.addArguments(`--proxy-server=${proxy}`)

			console.log(`Using proxy: ${proxy}`);

			driver = await new Builder()
				.forBrowser('chrome')
				.setChromeOptions(chromeOptions)
				.build();

			console.log('Driver created successfully.');

			await driver.get('https://www.x.com/login/');
			console.log('Navigated to login page.');

			// Login process
			const username = await driver.wait(
				until.elementLocated(
					By.xpath("//input[@autocomplete='username']")
				),
				10000
			);
			await username.sendKeys(process.env.USERNAME, Key.ENTER); 
			console.log('Username entered and submitted.');

			try {
				const verifyingEmail = await driver.wait(
					until.elementLocated(By.xpath('//input[@name="text"]')),
					10000
				);
				await verifyingEmail.sendKeys(
					process.env.EMAIL
				);
				await verifyingEmail.sendKeys(Key.ENTER);
				console.log('Email verification step completed.');
			} catch (e) {
				console.log('Email verification step skipped.');
			}

			const password = await driver.wait(
				until.elementLocated(By.xpath("//input[@name='password']")),
				20000
			);
			await password.sendKeys(process.env.PASS, Key.ENTER);
			console.log('Password entered and submitted.');

			try {
				const reEmail = await driver.wait(
					until.elementLocated(
						By.xpath("//input[@autocomplete='email']")
					),
					10000
				);
				await reEmail.sendKeys(
					process.env.EMAIL,
					Key.ENTER
				);
				console.log('Re-entering email step completed.');
			} catch (e) {
				console.log('Re-entering email step skipped.');
			}

			elem = await driver.wait(
				until.elementLocated(
					By.xpath("//div[@aria-label='Timeline: Trending now']")
				),
				20000
			);
			console.log('Trending topics element located.');

			html = await elem.getAttribute('outerHTML');
			console.log('HTML extracted successfully.');

			if (!html) {
				throw new Error(
					'Failed to extract HTML. Retrying with a different proxy...'
				);
			}

			console.log('Scraping successful. Script ended.');
			const data = ExtractDataFromHTML(html);

			const post = await TrendingModel.create({
				ipAddress: proxy,
				nameoftrend1: data[0].label,
				nameoftrend2: data[1].label,
				nameoftrend3: data[2].label,
				nameoftrend4: data[3].label,
				script_end: Date.now(),
				script_start: start_time
			})

			if(!post){
				throw new Error("Error While Saving Post in Database")
			}

			return [...data, { ipAddress: proxy }];
		} catch (error) {
			console.error('Error during scraping:', error.message);
			console.log('Retrying with a new proxy...');
		} finally {
			console.log('Something Happened');
			if (driver) {
				await driver.quit();
				console.log('Driver quit successfully.');
			}
		}
	}
}


module.exports = scrapping

