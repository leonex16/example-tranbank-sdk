import type { Page } from '@playwright/test';

export const getTokenAfterCardRegister = async ( page: Page, url:string ): Promise<string | null> => {
  const delay = Math.floor( Math.random() * ( 400 - 200 ) + 200 );

  await page.goto( url );

  // Fill transbank form
  await page.locator( 'button:has-text("Crédito")' ).click();

  await page.locator( '[placeholder="XXXX XXXX XXXX XXXX"]' ).click();
  await page.locator( '[placeholder="XXXX XXXX XXXX XXXX"]' ).type( '4051 8856 0044 6623', { delay } );

  await page.locator( '[placeholder="MM\\/AA"]' ).click();
  await page.locator( '[placeholder="MM\\/AA"]' ).type( '1212', { delay } );

  await page.locator( '[placeholder="・・・"]' ).click();
  await page.locator( '[placeholder="・・・"]' ).type( '123', { delay } );

  await page.locator( 'span:has-text("Es mi correo")' ).click();

  await page.locator( 'text=Inscribir mi tarjeta' ).click();

  // Confirm transaction
  await page.locator( 'input[name="rutClient"]' ).click();
  await page.locator( 'input[name="rutClient"]' ).fill( '111111111' );

  await page.locator( 'input[name="passwordClient"]' ).click();
  await page.locator( 'input[name="passwordClient"]' ).fill( '123' );

  await page.locator( 'text=Aceptar' ).click();

  await Promise.all( [
    page.waitForNavigation(),
    page.locator( 'text=Continuar' ).click()
  ] );

  // Extract token
  const pageUrl = new URL( page.url() );
  const tbkToken = pageUrl.searchParams.get( 'TBK_TOKEN' );

  await page.waitForTimeout( delay );
  await page.close();

  return tbkToken;
};
