# pingidsdk-node-facade

A NodeJS API acting as a facade, to help build [PingID SDK HMAC tokens](https://apidocs.pingidentity.com/pingid-sdk/guide/getting-started/pid_t_SDKimplementServer/#Signatures-in-PingID-SDK) and call their [Server API's](https://apidocs.pingidentity.com/pingid-sdk/guide/server-api/).

## Usage

### You will need [NodeJS]( https://nodejs.org/en/) and NPM installed to use this project.

In your PingOne account, access *SETUP -> PINGID -> CLIENT INTEGRATION* and download your PINGID SDK Settings file.

Open the file `node/src/controllers/test-controller.js` and change the values of the variables with the values found in your settings file 
```js
//...
const ACCOUNT_ID = '[[ACCOUNT_ID]]';
const APPLICATION_ID = '[[APPLICATION_ID]]';
const API_KEY = '[[API_KEY]]';
const TOKEN = '[[TOKEN]]';
//...
```

After that, open a terminal window in project's `node` folder and run:
```sh
npm i
npm run start-dev
```

*The project runs on PORT **4400** as default*

## Examples

Inside `/postman` folder, you will find a postman collection with some example calls to this project.