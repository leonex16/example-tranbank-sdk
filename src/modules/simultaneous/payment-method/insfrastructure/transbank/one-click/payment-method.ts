import { IntegrationApiKeys, IntegrationCommerceCodes, Oneclick, Options } from 'transbank-sdk';

import type MallInscription from 'transbank-sdk/dist/es5/transbank/webpay/oneclick/mall_inscription';

import { PaymentMethod } from '#src/modules/simultaneous/payment-method/domain/payment-method';

import type { InscriptionFinish, InscriptionStart } from './types';

export enum TranskbankUrlEnvironment {
  PROD = 'https://webpay3g.transbank.cl',
  DEV = 'https://webpay3gint.transbank.cl',
}

export class TransbankOneClickPaymentMethod implements PaymentMethod {
  private URL_ENVIRONMENT = TranskbankUrlEnvironment.DEV; // MOVE TO ENV

  private inscription: MallInscription;

  constructor () {
    const opts = new Options( IntegrationCommerceCodes.ONECLICK_MALL, IntegrationApiKeys.WEBPAY, this.URL_ENVIRONMENT );
    this.inscription = new Oneclick.MallInscription( opts );
  }

  async getUrlToAdd ( username: string, email: string, urlToRedirect: string ) {
    const resp: InscriptionStart = await this.inscription.start( username, email, urlToRedirect );

    return {
      url: resp.url_webpay,
      token: resp.token
    };
  }

  async confirm ( token: string ): Promise<any> {
    const resp: InscriptionFinish = await this.inscription.finish( token );

    return {
      card: {
        type: resp.card_type,
        number: resp.card_number
      },
      tbkUser: resp.tbk_user
    };
  }

  async delete ( token: string, username: string ) {
    await this.inscription.delete( token, username );
  }
}
