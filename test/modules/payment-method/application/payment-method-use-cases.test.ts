import { test, expect } from '@playwright/test';

import { PaymentMethodSpy } from './__mocks__/payment-method-spy';
import { registerDependencies } from '../../../../dist/src/config/inyection-container';
import { PaymentMethodConfirmator } from '../../../../dist/src/modules/payment-method/application/payment-method-confirmator';
import { PaymentMethodCreator } from '../../../../dist/src/modules/payment-method/application/payment-method-creator';
import { PaymentMethodDeleter } from '../../../../dist/src/modules/payment-method/application/payment-method-deleter';

test.describe('Application Payment Method', () => {
  test.describe('PaymentMethodCreator', () => {
    test('should called invoke method', async () => {
      const paymentMethodSpy = new PaymentMethodSpy();
      const paymentMethodCreator = new PaymentMethodCreator(paymentMethodSpy);
      await paymentMethodCreator.invoke('USER', 'EMAIL');

      expect(paymentMethodSpy.methodCalledCounter).toBe(1);
    })

    test('should inyject automatically its dependecy', async () => {
      registerDependencies();
      const paymentMethodCreator = new PaymentMethodCreator();
      const data = await paymentMethodCreator.invoke('janedoe', 'janedoe@gmail.com');

      expect(data).toBeDefined();
    })
  })

  test.describe('PaymentMethodConfirmator', () => {
    test('should called invoke method', async () => {
      const paymentMethodSpy = new PaymentMethodSpy();
      const paymentMethodConfirmator = new PaymentMethodConfirmator(paymentMethodSpy);
      await paymentMethodConfirmator.invoke('TOKEN');

      expect(paymentMethodSpy.methodCalledCounter).toBe(1);
    })

    test('should inyject automatically its dependecy', async () => {
      registerDependencies();
      const paymentMethodCreator = new PaymentMethodConfirmator();

      expect(() => paymentMethodCreator.invoke()).toThrowError('Token is required');
    })
  })

  test.describe('PaymentMethodDeleter', () => {
    test('should called invoke method', async () => {
      const paymentMethodSpy = new PaymentMethodSpy();
      const paymentMethodDeleter = new PaymentMethodDeleter(paymentMethodSpy);
      await paymentMethodDeleter.invoke();

      expect(paymentMethodSpy.methodCalledCounter).toBe(1);
    })

    test('should inyject automatically its dependecy', async () => {
      registerDependencies();
      const paymentMethodDeleter = new PaymentMethodDeleter();

      await expect(paymentMethodDeleter.invoke()).rejects.toThrowError();
    })
  })
})