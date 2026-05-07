import { test, expect } from '@playwright/test';

test.describe('End-to-End Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to shop and add an item to the cart
    await page.goto('/shop');
    
    // Assuming product card has a specific data-testid or text
    const firstProduct = page.locator('text=City Leather Boots').first();
    await firstProduct.click();
    
    // We are on the product page, add to cart
    await page.click('button:has-text("Add to Cart")');
    
    // Close the cart drawer to proceed to checkout manually or click checkout
    await page.click('button:has-text("Checkout")');
  });

  test('should successfully complete a Cash on Delivery order', async ({ page }) => {
    // 1. Delivery Details Step
    await expect(page.locator('h2:has-text("Delivery Details")').or(page.locator('h2:has-text("የአቅርቦት መረጃ")'))).toBeVisible();
    
    // Fill Customer Details
    await page.fill('input[placeholder="e.g. Abebe Kebede"], input[placeholder="ምሳሌ፦ አበበ ከበደ"]', 'Abebe Test');
    await page.fill('input[type="tel"]', '911223344');
    await page.fill('input[type="email"]', 'test@example.com');
    
    // Select Delivery Zone
    await page.click('button:has-text("Addis Ababa")');
    
    // Assuming there is a "Next to Payment" button or we just scroll to payment
    // 2. Payment Section
    await page.click('button:has-text("Cash on Delivery")');

    // 3. Submit Order
    await page.click('button:has-text("Place Order")');

    // 4. Assert Success
    await expect(page.locator('text=Order confirmed')).toBeVisible({ timeout: 10000 });
  });

  test('should validate empty cart submission prevention', async ({ page }) => {
    // Clear cart via localStorage for testing
    await page.evaluate(() => localStorage.removeItem('cart-storage'));
    await page.reload();

    // Fill details
    await page.fill('input[placeholder="e.g. Abebe Kebede"], input[placeholder="ምሳሌ፦ አበበ ከበደ"]', 'Abebe Test');
    await page.fill('input[type="tel"]', '911223344');
    
    await page.click('button:has-text("Place Order")');
    
    // Should show error toast
    await expect(page.locator('text=Cart items are required').or(page.locator('text=Please fill in your name'))).toBeVisible();
  });
});
