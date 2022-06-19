export interface PaymentMethod {
  getUrlToAdd: ( username: string, email: string, urlToRedirect: string ) => Promise<{ url: string, token: string }>,
  confirm: ( token: string ) => Promise<any>,
  delete: ( token: string, username: string ) => Promise<void>,
}
