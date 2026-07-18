import { test, expect } from '@playwright/test';

const bunKrator_name = 'Краторная булка N-200i';
const bunKrator_testid = 'test-id-ingr-643d69a5c3f7b9001cfa093c';
const bunFly_name = 'Флюоресцентная булка R2-D3';
const mainMag_name = 'Биокотлета из марсианской Магнолии';
const mainMag_testid = 'test-id-ingr-643d69a5c3f7b9001cfa0941';
const mainCheese_name = 'Сыр с астероидной плесенью';
const sauseSpicy_name = 'Соус Spicy-X';
const sauseSpicy_testid = 'test-id-ingr-643d69a5c3f7b9001cfa0942';
const sauseShip_name = 'Соус с шипами Антарианского плоскоходца';

test.describe('интеграционное тестирование конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });
    await page.routeFromHAR('./tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false
    });
    await page.goto('/');
  });

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => {
      localStorage.removeItem('refreshToken');
    });
    await page.context().clearCookies();
  });

  test('все данные отображаются успешно', async ({ page }) => {
    const bunKrator = page.getByText(bunKrator_name);
    await expect(bunKrator).toBeVisible();
    const bunFly = page.getByText(bunFly_name);
    await expect(bunFly).toBeVisible();

    const mainMag = page.getByText(mainMag_name);
    await expect(mainMag).toBeVisible();
    const mainCheese = page.getByText(mainCheese_name);
    await expect(mainCheese).toBeVisible();

    const sauseSpicy = page.getByText(sauseSpicy_name);
    await expect(sauseSpicy).toBeVisible();
    const sauseShip = page.getByText(sauseShip_name);
    await expect(sauseShip).toBeVisible();
  });

  test('добавление булки и начинки в конструктор', async ({ page }) => {
    const constructor = await page.getByTestId('test-id-constructor');
    await page.getByTestId(bunKrator_testid).getByText('Добавить').click();
    await page.getByTestId(mainMag_testid).getByText('Добавить').click();

    await expect(
      constructor
        .locator('.constructor-element__text')
        .filter({ hasText: bunKrator_name })
    ).toHaveCount(2);

    await expect(
      constructor
        .locator('.constructor-element__text')
        .filter({ hasText: mainMag_name })
    ).toHaveCount(1);

    await expect(page.getByText('Выберите начинку')).not.toBeVisible();
  });

  test('открытие модального окна ингредиента', async ({ page }) => {
    await page.getByText(bunKrator_name).first().click();
    await expect(page.getByText('Информация об ингридиенте')).toBeVisible();
    await expect(
      page.locator('#modals').getByText(bunKrator_name)
    ).toBeVisible();

    await expect(page.getByText('Калории, ккал')).toBeVisible();
    await expect(page.getByText('Белки, г')).toBeVisible();
    await expect(page.getByText('Жиры, г')).toBeVisible();
    await expect(page.getByText('Углеводы, г')).toBeVisible();
  });

  test('закрытие модалки по крестику', async ({ page }) => {
    await page.getByTestId(bunKrator_testid).click();
    await expect(page.getByText('Информация об ингридиенте')).toBeVisible();

    await page.getByTestId('test-id-modal-close').click();

    await expect(page.getByText('Информация об ингридиенте')).not.toBeVisible();
  });

  test('закрытие модалки по оверлею', async ({ page }) => {
    await page.getByTestId(bunKrator_testid).click();
    await expect(page.getByText('Информация об ингридиенте')).toBeVisible();

    await page.mouse.click(10, 10);

    await expect(page.getByText('Информация об ингридиенте')).not.toBeVisible();
  });

  test('создание заказа и очищение конструктора', async ({ page, context }) => {

    await page.routeFromHAR('./tests/hars/order.har', { url: '**/api/orders' });

    await page.getByTestId(bunKrator_testid).getByText('Добавить').click();
    await page.getByTestId(mainMag_testid).getByText('Добавить').click();
    await page.getByTestId(sauseSpicy_testid).getByText('Добавить').click();
    await page.getByText('Оформить заказ').click();

    const modal = await page.getByTestId('test-id-modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByText('108216')).toBeVisible();

    await page.getByTestId('test-id-modal-close').click();
    await expect(modal).not.toBeVisible();

    await expect(page.getByText('Выберите начинку')).toBeVisible();
    await expect(page.getByText('Выберите булки')).toHaveCount(2);
  });
});

