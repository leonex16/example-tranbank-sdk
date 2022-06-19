import http from 'node:http';

import { PaymentMethodConfirmator } from '#src/modules/simultaneous/payment-method/application/payment-method-confirmator';
import { PaymentMethodCreator } from '#src/modules/simultaneous/payment-method/application/payment-method-creator';
import { PaymentMethodDeleter } from '#src/modules/simultaneous/payment-method/application/payment-method-deleter';
import { TransactionAuthorizator } from '#src/modules/simultaneous/transaction/application/transaction-authorizator';
import { TransactionReversor } from '#src/modules/simultaneous/transaction/application/transaction-reversor';
import { TransactionStatus } from '#src/modules/simultaneous/transaction/application/transaction-status';

import { Server } from '#src/modules/server/domain/server';
import { version } from '../../../../../package.json';

const parseToUrl = ( path = '/' ) => new URL( path, 'http://localhost' );

export class NodeServer implements Server {
  private readonly _server: http.Server;
  private readonly headers: http.OutgoingHttpHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000 // 30 days
  };

  constructor () {
    this._server = http.createServer( this.router );
  }

  async listen ( port = 3000 ): Promise<void> {
    this._server.listen( port, () => this.serverUp( port ) );
  }

  private serverUp ( port: number ): void {
    console.info( `server started on port: ${ port }` );
  }

  private async router ( req: http.IncomingMessage, res: http.ServerResponse ): Promise<void> {
    const { method, url: rawUrl } = req;
    const { pathname, searchParams } = parseToUrl( rawUrl );

    res.setHeader( 'Access-Control-Allow-Origin', '*' );
    res.setHeader( 'Access-Control-Allow-Headers', '*' );
    res.setHeader( 'Access-Control-Allow-Methods', '*' );

    if ( method === 'OPTIONS' ) {
      const allowedEndpoints = [
        '/',
        '/simultaneous/payment-method/inscription',
        '/simultaneous/payment-method/confirm',
        '/simultaneous/payment-method/delete',
        '/simultaneous/transaction/authorizate',
        '/simultaneous/transaction/status',
        '/simultaneous/transaction/reverse'
      ];

      if ( allowedEndpoints.includes( pathname ) ) {
        res.writeHead( 204 );
        res.end();
        return;
      }
    }

    if ( method === 'GET' && pathname === '/' ) {
      res.writeHead( 200, { 'Content-Type': 'application/json' } );
      res.end( JSON.stringify( { version } ) );
      return;
    }

    if ( method === 'GET' && pathname === '/simultaneous/payment-method/inscription' ) {
      const username = searchParams.get( 'username' );
      const email = searchParams.get( 'email' );
      const urlToRedirect = searchParams.get( 'urlToRedirect' );

      if ( username === null ) throw new Error( 'Username is required' );
      if ( email === null ) throw new Error( 'Email is required' );
      if ( urlToRedirect === null ) throw new Error( 'UrlToRedirect is required' );

      const paymentMethodCreator = new PaymentMethodCreator();

      res.writeHead( 200, { 'Content-Type': 'application/json' } );
      res.end( JSON.stringify( await paymentMethodCreator.invoke( username, email, urlToRedirect ) ) );
      return;
    }

    if ( method === 'POST' && pathname === '/simultaneous/payment-method/confirm' ) {
      const tbkTkn = req.headers[ 'tbk-token' ];

      if ( tbkTkn === undefined ) throw new Error( 'tbk-token is required' );
      if ( Array.isArray( tbkTkn ) ) throw new Error( 'tbk-token is not string' );

      const paymentMethodConfirmator = new PaymentMethodConfirmator();

      res.writeHead( 200, { 'Content-Type': 'application/json' } );
      res.end( JSON.stringify( await paymentMethodConfirmator.invoke( tbkTkn ) ) );

      return;
    }

    if ( method === 'DELETE' && pathname === '/simultaneous/payment-method/delete' ) {
      const body = await getBody( req );

      if ( body === null ) throw new Error( 'Body is required' );
      if ( body[ 'username' ] === null ) throw new Error( 'Username is required' );
      if ( body[ 'tbkUser' ] === null ) throw new Error( 'TbkUser is required' );

      const { username, tbkUser } = body;
      const paymentMethodDeleter = new PaymentMethodDeleter();
      await paymentMethodDeleter.invoke( tbkUser, username );

      res.writeHead( 204 );
      res.end();
      return;
    }

    if ( method === 'POST' && pathname === '/simultaneous/transaction/authorizate' ) {
      const body = await getBody( req );

      if ( body === null ) throw new Error( 'Body is required' );
      if ( body[ 'username' ] === null ) throw new Error( 'Username is required' );
      if ( body[ 'tbkUser' ] === null ) throw new Error( 'TbkUser is required' );
      if ( body[ 'purchaseOrder' ] === null ) throw new Error( 'PurchaseOrder is required' );
      if ( body[ 'detail' ] === null ) throw new Error( 'Detail is required' );

      const { username, tbkUser, purchaseOrder, detail } = body;
      const simultaneousTransactionAuthorizator = new TransactionAuthorizator();

      res.writeHead( 200, { 'Content-Type': 'application/json' } );
      res.end( JSON.stringify( await simultaneousTransactionAuthorizator.invoke( username, tbkUser, purchaseOrder, detail ) ) );
      return;
    }

    if ( method === 'GET' && pathname === '/simultaneous/transaction/status' ) {
      const purchaseOrder = searchParams.get( 'purchaseOrder' );

      if ( purchaseOrder === null ) throw new Error( 'PurchaseOrder is required' );

      const simultaneousTransactionAuthorizator = new TransactionStatus();

      res.writeHead( 200, { 'Content-Type': 'application/json' } );
      res.end( JSON.stringify( await simultaneousTransactionAuthorizator.invoke( purchaseOrder ) ) );
      return;
    }

    if ( method === 'POST' && pathname === '/simultaneous/transaction/reverse' ) {
      const body = await getBody( req );

      if ( body === null ) throw new Error( 'Body is required' );
      if ( body[ 'mainPurchaseOrder' ] === null ) throw new Error( 'MainPurchaseOrder is required' );
      if ( body[ 'childPurchaseOrder' ] === null ) throw new Error( 'ChildPurchaseOrder is required' );
      if ( body[ 'amount' ] === null ) throw new Error( 'Amount is required' );

      const { mainPurchaseOrder, childPurchaseOrder, amount } = body;
      const simultaneousTransactionAuthorizator = new TransactionReversor();

      res.writeHead( 200, { 'Content-Type': 'application/json' } );
      res.end( JSON.stringify( await simultaneousTransactionAuthorizator.invoke( mainPurchaseOrder, childPurchaseOrder, amount ) ) );
      return;
    }

    res.writeHead( 404 );
    res.end();
  }
}

async function getBody ( req: http.IncomingMessage ) {
  return new Promise<Record<string, any> | null>( resolve => {
    let body = '';

    req.on( 'data', ( chunk: Buffer ) => {
      body += chunk.toString();
    } );

    req.on( 'end', () => {
      resolve( JSON.parse( body ) );
    } );
  } );
}
