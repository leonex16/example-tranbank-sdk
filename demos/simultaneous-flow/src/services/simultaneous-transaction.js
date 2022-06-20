export class SimultaneousTransaction {

  static async authorize( username, tbkUser, items ) {
    const purchaseOrder = 'PO-DEMO-';
    const detail = items;
    const body = { username, tbkUser, purchaseOrder, detail };
    const fetchOpts = {
      method: 'post',
      body: JSON.stringify(body),
    };

    const resp = await fetch('http://localhost:3001/simultaneous/transaction/authorizate', fetchOpts);
    
    return resp.json();
  }
}