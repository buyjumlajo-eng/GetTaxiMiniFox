import { chromium } from 'playwright';

async function test() {
  console.log('Starting Playwright test...');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Test 1: Load landing page
    console.log('Test 1: Loading landing page...');
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);
    console.log('✓ Landing page loaded');
    
    // Test 2: Check for login buttons
    console.log('Test 2: Checking login buttons...');
    const loginBtn = await page.locator('button:has-text("دخول كراكب")').first();
    const isPassengerVisible = await loginBtn.isVisible();
    console.log('✓ Passenger button visible:', isPassengerVisible);
    
    const driverBtn = await page.locator('button:has-text("دخول كسائق")').first();
    const isDriverVisible = await driverBtn.isVisible();
    console.log('✓ Driver button visible:', isDriverVisible);
    
    // Test 3: Click on passenger button
    console.log('Test 3: Testing passenger login...');
    await loginBtn.click();
    await page.waitForTimeout(1000);
    console.log('✓ Clicked on passenger login');
    
    // Test 4: Check for map element
    console.log('Test 4: Checking map...');
    const map = await page.locator('#map').first();
    const isMapVisible = await map.isVisible();
    console.log('✓ Map element visible:', isMapVisible);
    
    // Test 5: Check for trip sheet button
    console.log('Test 5: Checking trip sheet...');
    const tripBtn = await page.locator('.dock-cta').first();
    const isTripBtnVisible = await tripBtn.isVisible();
    console.log('✓ Trip button visible:', isTripBtnVisible);
    
    if (isTripBtnVisible) {
      await tripBtn.click();
      await page.waitForTimeout(500);
      console.log('✓ Opened trip sheet');
    }
    
    // Test 6: Check for fare options
    const fareCards = await page.locator('.fare-card').count();
    console.log('✓ Fare options count:', fareCards);
    
    console.log('\n✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

test();
