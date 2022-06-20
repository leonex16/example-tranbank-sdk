export class PaymentMethod {

  static async getDataToInscription(username, email) {
    const qs = `?username=${username}&email=${email}&urlToRedirect=http://localhost:3002/`;
    const resp = await fetch(
      `http://localhost:3001/simultaneous/payment-method/inscription${qs}`
    );

    return resp.json();
  }

  static async confirm(token) {
    const fetchOpts = {
      method: 'post',
      headers: { 'tbk-token': token },
    };
    const resp = await fetch(
      'http://localhost:3001/simultaneous/payment-method/confirm',
      fetchOpts
    );

    return resp.json();
  }

  static async remove(tbkUser, username) {
    const fetchOpts = {
      method: 'delete',
      body: JSON.stringify({tbkUser, username}),
    }

    await fetch('http://localhost:3001/simultaneous/payment-method/delete', fetchOpts);
  }
}
