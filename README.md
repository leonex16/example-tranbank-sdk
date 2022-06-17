# Example TS One Click

API building with Typescript that exposes the transbank SDK methods to integrate one click on your application.

| **ENDPOINT**                               | **METHOD** | **STATUS** | **DESCRIPTION**                                                  |
|--------------------------------------------|:----------:|:----------:|------------------------------------------------------------------|
| `/`                                        | GET        | OK         | Get API version, also works as health check                      |
| `/simultaneous/payment-method/inscription` | GET        | OK         | Get data to begin the inscription of simultaneous payment method |
| `/simultaneous/payment-method/confirm`     | POST       | OK         | Get token to later be able to make simultaneous transactions     |
| `/simultaneous/payment-method/delete`      | DELETE     | OK         | Remove simultaneous payment method that was enrolled             |
| `/simultaneous/transaction/authorizate`    | POST       | OK         | Authorize a simultaneous transaction                             |
| `/simultaneous/transaction/status`         | GET        | OK         | Get the status of a simultaneous transaction                     |
| `/simultaneous/transaction/reverse`        | POST       | OK         | Cancel an authorized simultaneous transaction                    |
| `/deferred/payment-method/inscription`     | GET        | TO DO      | Get data to begin the inscription of deferred payment method     |
| `/deferred/payment-method/confirm`         | POST       | TO DO      | Get token to later be able to make deferred transactions         |
| `/deferred/payment-method/delete`          | DELETE     | TO DO      | Remove deferred payment method that was enrolled                 |
| `/deferred/transaction/authorizate`        | POST       | BUILDING   | Authorize a deferred transaction                                 |
| `/deferred/transaction/status`             | GET        | BUILDING   | Get the status of a deferred transaction                         |
| `/deferred/transaction/reverse`            | POST       | BUILDING   | Cancel an authorized deferred transaction                        |

## Run Enviroments

This project has three enviroments:

- Development ➡️ `npm run dev`
- Testing ➡️ `npm run test`
- Production ➡️ `npm run start`

> :warning: **Warning:**
If you want to run the development environment, you nedd to change the extensions from `.js` to `.ts` inside the `imports` property of the package.json file.
