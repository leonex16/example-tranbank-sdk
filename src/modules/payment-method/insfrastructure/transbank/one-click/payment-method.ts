import { IntegrationApiKeys, IntegrationCommerceCodes, Oneclick, Options } from 'transbank-sdk';

import type MallInscription from 'transbank-sdk/dist/es5/transbank/webpay/oneclick/mall_inscription';

import { PaymentMethod } from '#src/modules/payment-method/domain/payment-method';

import type { InscriptionFinish, InscriptionStart } from './types';

export enum TranskbankUrlEnvironment {
  PROD = 'https://webpay3g.transbank.cl',
  DEV = 'https://webpay3gint.transbank.cl',
}

export class TransbankOneClickPaymentMethod implements PaymentMethod {
  private URL_TO_REDIRECT = 'https://www.google.cl'; // MOVE TO ENV
  private URL_ENVIRONMENT = TranskbankUrlEnvironment.DEV; // MOVE TO ENV

  private username: string | null = null;
  private inscription: MallInscription;
  private tbkUser: string | null = null;

  constructor () {
    const opts = new Options( IntegrationCommerceCodes.ONECLICK_MALL, IntegrationApiKeys.WEBPAY, this.URL_ENVIRONMENT );
    this.inscription = new Oneclick.MallInscription( opts );
  }

  async getUrlToAdd ( username: string, email: string ) {
    const resp: InscriptionStart = await this.inscription.start( username, email, this.URL_TO_REDIRECT );
    this.username = username;

    return {
      url: resp.url_webpay,
      token: resp.token
    };
  }

  async confirm ( token: string ): Promise<any> {
    const resp: InscriptionFinish = await this.inscription.finish( token );

    this.tbkUser = resp.tbk_user;

    return {
      card: {
        type: resp.card_type,
        number: resp.card_number
      },
      tbkUser: resp.tbk_user
    };
  }

  async delete () {
    if ( !this.username ) throw new Error( 'No username provided' );
    if ( !this.tbkUser ) throw new Error( 'No tbkUser setting' );

    await this.inscription.delete( this.tbkUser, this.username );
  }
}
