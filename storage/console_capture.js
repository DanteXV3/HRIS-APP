const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

    // We need to login first if it redirects, but let's try getting index first
    var res = await page.goto('http://localhost/cost-control/summary-budgeting/1', { waitUntil: 'networkidle0' });
    
    if (res.status() === 302 || res.url().includes('login')) {
        console.log("Redirected to login. Logging in...");
        await page.type('#email', 'dante.exreaper@gmail.com');
        await page.type('#password', 'password'); // use appropriate password or just auth bypass
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        await page.goto('http://localhost/cost-control/summary-budgeting/1', { waitUntil: 'networkidle0' });
    }
    
    console.log("Final URL:", page.url());
    const content = await page.content();
    console.log("Body length:", content.length);
    
    await browser.close();
})();
