import { IntegrationApiKeys, IntegrationCommerceCodes, Oneclick, Options } from 'transbank-sdk';

import type MallInscription from 'transbank-sdk/dist/es5/transbank/webpay/oneclick/mall_inscription';

import { PaymentMethod } from '#src/modules/payment-method/domain/payment-method';

import type { CardType, InscriptionFinish, InscriptionStart } from './types';

export enum TranskbankUrlEnvironment {
  PROD = 'https://webpay3g.transbank.cl',
  DEV = 'https://webpay3gint.transbank.cl',
}

export class TransbankOneClickPaymentMethod implements PaymentMethod {
  private URL_TO_REDIRECT = 'https://www.google.cl'; // MOVE TO ENV
  private URL_ENVIRONMENT = TranskbankUrlEnvironment.DEV; // MOVE TO ENV

  private username: string | null = null;
  private inscription: MallInscription;
  private autorizationCode: string | null = null;
  private tbkUser: string | null = null;
  private card: { type: CardType, number: string } | null = null;

  constructor () {
    const opts = new Options( IntegrationCommerceCodes.ONECLICK_MALL, IntegrationApiKeys.WEBPAY, this.URL_ENVIRONMENT );
    this.inscription = new Oneclick.MallInscription( opts );
  }

  get cardInfo () {
    if ( !this.card ) throw new Error( 'Not set card yet. Maybe you missing to use confirm method' );

    return this.card;
  }

  get keysToTransaction () {
    if ( !this.autorizationCode || !this.tbkUser ) throw new Error( 'Not set card yet. Maybe you missing to use confirm method' );

    return {
      autorizationCode: this.autorizationCode,
      tbkUser: this.tbkUser
    };
  }

  async getUrlToAdd ( username: string, email: string ) {
    const resp: InscriptionStart = await this.inscription.start( username, email, this.URL_TO_REDIRECT );
    this.username = username;

    return {
      url: resp.url_webpay,
      token: resp.token
    };
  }

  async confirm ( token: string ) {
    if ( !token ) throw new Error( 'No token provided' );

    const resp: InscriptionFinish = await this.inscription.finish( token );

    this.autorizationCode = resp.authorization_code;
    this.tbkUser = resp.tbk_user;
    this.card = {
      type: resp.card_type,
      number: resp.card_number
    };
  }

  async delete () {
    if ( !this.username ) throw new Error( 'No username provided' );
    if ( !this.card || !this.tbkUser ) throw new Error( 'Not set card yet' );

    await this.inscription.delete( this.tbkUser, this.username );
  }
}
