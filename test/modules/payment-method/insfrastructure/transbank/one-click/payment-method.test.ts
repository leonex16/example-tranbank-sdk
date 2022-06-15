import { test, expect } from '@playwright/test';

import { PaymentMethod } from '../../../../../../src/modules/payment-method/domain/payment-method';
import { PaymentMethodConfirmator } from '../../../../../../dist/src/modules/payment-method/application/payment-method-confirmator';
import { PaymentMethodCreator } from '../../../../../../dist/src/modules/payment-method/application/payment-method-creator';
import { PaymentMethodDeleter } from '../../../../../../dist/src/modules/payment-method/application/payment-method-deleter';
import { TransbankOneClickPaymentMethod } from '../../../../../../dist/src/modules/payment-method/insfrastructure/transbank/one-click/payment-method';

let paymentMethodImplementation: PaymentMethod;

test.beforeEach(() => {
  paymentMethodImplementation = new TransbankOneClickPaymentMethod();
})

test.describe('Infrastructure Transbank One Click', () => {
  test.describe('PaymentMethod', () => {
    test.describe('PaymentMethodCreator', () => {
      test('should returns url and token', async () => {
        const TBK_URL = 'https://webpay3gint.transbank.cl/webpayserver/bp_multicode_inscription.cgi';
        const paymentMethodCreator = new PaymentMethodCreator(paymentMethodImplementation);
        const dataToCreatePaymentMethod = await paymentMethodCreator.invoke('jane', 'janedoe@gmail.com');

        expect(dataToCreatePaymentMethod.url).toBe(TBK_URL);
        expect(dataToCreatePaymentMethod.token).toBeDefined();
      })
    })

    test.describe('PaymentMethodConfirmator', () => {
      test('should allow get keys to transaction. TODO: Return -96 code...', async ({page, context}) => {
        const paymentMethodCreator = new PaymentMethodCreator(paymentMethodImplementation);
        const dataToCreatePaymentMethod = await paymentMethodCreator.invoke('jane', 'janedoe@gmail.com');

        await page.goto(`${dataToCreatePaymentMethod.url}?TBK_TOKEN=${dataToCreatePaymentMethod.token}`);

        // Fill transbank form
        await page.locator('button:has-text("Crédito")').click();

        await page.locator('[placeholder="XXXX XXXX XXXX XXXX"]').click();
        await page.locator('[placeholder="XXXX XXXX XXXX XXXX"]').type('4051 8856 0044 6623', { delay: 50 });

        await page.locator('[placeholder="MM\\/AA"]').click();
        await page.locator('[placeholder="MM\\/AA"]').type('1212', { delay: 50 });

        await page.locator('[placeholder="・・・"]').click();
        await page.locator('[placeholder="・・・"]').type('123', { delay: 50 });

        await page.locator('span:has-text("Es mi correo")').click();

        await page.locator('text=Inscribir mi tarjeta').click();

        // Confirm transaction
        await page.locator('input[name="rutClient"]').click();
        await page.locator('input[name="rutClient"]').fill('111111111');

        await page.locator('input[name="passwordClient"]').click();
        await page.locator('input[name="passwordClient"]').fill('123');

        await page.locator('text=Aceptar').click();

        await Promise.all([
          page.waitForNavigation(),
          page.locator('text=Continuar').click(),
        ]);

        // Extract token
        const url = new URL(page.url());
        const token = url.searchParams.get('TBK_TOKEN');

        await page.close();

        const paymentMethodConfirmator = new PaymentMethodConfirmator(paymentMethodImplementation);

        await expect(paymentMethodConfirmator.invoke(token)).resolves.toBeUndefined();
      })
    })

    test.describe('PaymentMethodDeleter', () => {
      // test('should delete payment method', async () => {})
    })
  })
})