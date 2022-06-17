export type CardType =
  'Visa' |
  'AmericanExpress' |
  'MasterCard' |
  'Diners' |
  'Magna' |
  'Redcompra' |
  'Prepago';

export type AutorizationStatus =
  'AUTHORIZED' |
  'POSSIBLE_INPUT_ERROR' |
  'PROCESSING_TRANSACTION_ERROR' |
  'TRANSACTION_ERROR' |
  'REJECTED_BY_ISSUER' |
  'RISK_OR_FRAUD_TRANSACTION';

export interface InscriptionStart {
  token: string,
  url_webpay: string,
}

export interface InscriptionFinish {
  response_code: AutorizationStatus,
  tbk_user: string,
  authorization_code: string,
  card_type: CardType,
  card_number: string
}
