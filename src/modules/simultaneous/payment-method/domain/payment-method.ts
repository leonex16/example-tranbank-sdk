export interface PaymentMethod {
  getUrlToAdd: ( username: string, email: string ) => Promise<{ url: string, token: string }>,
  confirm: ( token: string ) => Promise<any>,
  delete: () => Promise<void>,
}
