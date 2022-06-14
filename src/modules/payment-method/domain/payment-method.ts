export interface PaymentMethod {
  getUrlToAdd: ( username: string, email: string ) => Promise<{ url: string, token: string }>,
  confirm: ( token: string ) => Promise<void>,
  delete: () => Promise<void>,

  get cardInfo(): { type: string, number: string }
  get keysToTransaction(): any
}
