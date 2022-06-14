# Developer Docs

## Cards to Testing

 **Card type**      | **Detail**                                               | **Outcome**
--------------------|----------------------------------------------------------|--------------------------------
 VISA               | `4051 8856 0044 6623` CVV `123`  any expiration date     | ✅ Approved transactions.
 AMEX               | `3700 0000 0002 032`  CVV `1234` any expiration date     | ✅ Approved transactions.
 MASTERCARD         | `5186 0595 5959 0568` CVV `123`  any expiration date     | ❌ Declined transactions.
 Redcompra          | `4051 8842 3993 7763`                                    | ✅ Approved transactions.
 Redcompra          | `4511 3466 6003 7060`                                    | ✅ Approved transactions.
 Redcompra          | `5186 0085 4123 3829`                                    | ❌ Declined transactions.
 Prepago VISA       | `4051 8860 0005 6590` CVV `123` any expiration date      | ✅ Approved transactions.
 Prepago MASTERCARD | `5186 1741 1062 9480` CVV `123` any expiration date      | ❌ Declined transactions.

*When an authentication form with RUT and password appears, RUT **11.111.111-1** and password **123** must be used .*
