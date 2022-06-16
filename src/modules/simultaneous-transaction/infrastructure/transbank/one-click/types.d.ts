export interface TranbankTransaction {
  details:          Detail[];
  buy_order:        string;
  card_detail:      CardDetail;
  accounting_date:  string;
  transaction_date: Date;
}

export interface CardDetail {
  card_number: string;
}

export interface Detail {
  amount:              number;
  status:              string;
  authorization_code:  string;
  payment_type_code:   string;
  response_code:       number;
  installments_number: number;
  commerce_code:       string;
  buy_order:           string;
}

export interface TransbankRefound {
  type: 'REVERSED'
}

export interface TransactionItem {
  amount: number,
  installments?: number
}
