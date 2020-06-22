const express = require('express');
const crypto = require('crypto');
var jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios').default;

const router = express.Router();

const HOST = 'sdk.pingid.com';
const ACCOUNT_ID = '[[ACCOUNT_ID]]';
const APPLICATION_ID = '[[APPLICATION_ID]]';
const API_KEY = '[[API_KEY]]';
const TOKEN = '[[TOKEN]]';
const TOKEN_PREFIX = 'PINGID-HMAC=';

axios.defaults.baseURL = `https://${HOST}`;
axios.interceptors.request.use(cfg => {
    const method = cfg.method.toUpperCase();
    const uri = cfg.url;
    
    cfg.headers['Authorization'] = TOKEN_PREFIX + generateToken(method, uri, null, cfg.data);

    return cfg;
});

router.get('/users/:username', async (req, res, next) => {
    const { username } = req.params;
    const uri = `/pingid/v1/accounts/${ACCOUNT_ID}/applications/${APPLICATION_ID}/users/${username}`;

    try {
        const result = await axios.get(uri);
    
        res.send(result.data);
    }
    catch (e) {
        res.send(errorResp(e));
    }
});

router.post('/users/:username/auth', async (req, res, next) => {
    const { username } = req.params;
    const payload = {
        payload: '',
        ...req.body
    };
    const uri = `/pingid/v1/accounts/${ACCOUNT_ID}/applications/${APPLICATION_ID}/users/${username}/authentications`;``

    try {
        const result = await axios.post(uri, payload);
    
        res.send(result.data);
    }
    catch (e) {
        res.send(errorResp(e));
    }
});

router.post('/users/:username/auth/email', async (req, res, next) => {
    const { username } = req.params;
    const payload = {
        ...req.body,
        locale: 'pt-BR',
        emailConfigurationType: 'auth'
    };
    const uri = `/pingid/v1/accounts/${ACCOUNT_ID}/applications/${APPLICATION_ID}/users/${username}/authentications`;

    try {
        const result = await axios.post(uri, payload);
    
        res.send(result.data);
    }
    catch (e) {
        res.send(errorResp(e));
    }
});

router.get('/users/:username/auth/:authId', async (req, res, next) => {
    const { username, authId } = req.params;
    const uri = `/pingid/v1/accounts/${ACCOUNT_ID}/applications/${APPLICATION_ID}/users/${username}/authentications/${authId}`;

    try {
        const result = await axios.get(uri);
    
        res.send(result.data);
    }
    catch (e) {
        res.send(errorResp(e));
    }
});

router.put('/users/:username/auth/:authId/otp', async (req, res, next) => {
    const { username, authId } = req.params;
    const payload = {
        otp: '',
        ...req.body
    };
    const uri = `/pingid/v1/accounts/${ACCOUNT_ID}/applications/${APPLICATION_ID}/users/${username}/authentications/${authId}/otp`;

    try {
        const result = await axios.put(uri, payload);
    
        res.send(result.data);
    }
    catch (e) {
        res.send(errorResp(e));
    }
});

router.post('/users/:username/email/pair', async (req, res, next) => {
    const { username } = req.params;
    const payload = {
        deviceNickname: 'primary-email',
        recipient: '',
        ...req.body,
        automaticPairing: false,
        locale: 'pt-BR',
        type: 'register'
    };
    const uri = `/pingid/v1/accounts/${ACCOUNT_ID}/applications/${APPLICATION_ID}/users/${username}/emailpairings`;

    try {
        const result = await axios.post(uri, payload);
    
        res.send(result.data);
    }
    catch (e) {
        res.send(errorResp(e));
    }
});

router.get('/users/:username/email/pair/:pairId', async (req, res, next) => {
    const { username, pairId } = req.params;

    const uri = `/pingid/v1/accounts/${ACCOUNT_ID}/applications/${APPLICATION_ID}/users/${username}/emailpairings/${pairId}`;

    try {
        const result = await axios.get(uri);
    
        res.send(result.data);
    }
    catch (e) {
        res.send(errorResp(e));
    }
});

router.put('/users/:username/email/pair/:pairId/otp', async (req, res, next) => {
    const { username, pairId } = req.params;
    const payload = {
        deviceNickname: 'primary-email',
        otp: '',
        ...req.body
    };
    const uri = `/pingid/v1/accounts/${ACCOUNT_ID}/applications/${APPLICATION_ID}/users/${username}/emailpairings/${pairId}/otp`;

    try {
        const result = await axios.put(uri, payload);
    
        res.send(result.data);
    }
    catch (e) {
        res.send(errorResp(e));
    }
});

router.post('/users/:username/sms/pair', async (req, res, next) => {
    const { username } = req.params;
    const payload = {
        deviceNickname: null,
        phoneNumber: '',
        ...req.body,
        automaticPairing: false,
        message: 'Your pairing code is: ${otp}',
        sender: null
    };
    const uri = `/pingid/v1/accounts/${ACCOUNT_ID}/applications/${APPLICATION_ID}/users/${username}/smspairings`;
    try {
        const result = await axios.post(uri, payload);
    
        res.send(result.data);
    }
    catch (e) {
        res.send(errorResp(e));
    }
});

router.get('/users/:username/devices', async (req, res, next) => {
    const { username } = req.params;
    const uri = `/pingid/v1/accounts/${ACCOUNT_ID}/applications/${APPLICATION_ID}/users/${username}/devices`;

    try {
        const result = await axios.get(uri);
    
        res.send(result.data);
    }
    catch (e) {
        res.send(errorResp(e));
    }
});

router.delete('/users/:username/devices/:deviceId', async (req, res, next) => {
    const { username, deviceId } = req.params;
    const uri = `/pingid/v1/accounts/${ACCOUNT_ID}/users/${username}/devices/${deviceId}`;

    try {
        const result = await axios.delete(uri);
    
        res.send(result.data);
    }
    catch (e) {
        res.send(errorResp(e));
    }
});

router.get('/users/:username/seendevices', async (req, res, next) => {
    const { username } = req.params;
    const uri = `/pingid/v1/accounts/${ACCOUNT_ID}/applications/${APPLICATION_ID}/users/${username}/seendevices`;

    try {
        const result = await axios.get(uri);
    
        res.send(result.data);
    }
    catch (e) {
        res.send(errorResp(e));
    }
});

router.put('/users/:username/seendevices/:deviceFingerPrint', async (req, res, next) => {
    const { username, deviceFingerPrint } = req.params;
    const payload = {
        ...req.body,
        applicationId: APPLICATION_ID,
        deviceFingerprint: deviceFingerPrint
    };
    const uri = `/pingid/v1/accounts/${ACCOUNT_ID}/applications/${APPLICATION_ID}/users/${username}/seendevices/${deviceFingerPrint}`;

    try {
        const result = await axios.put(uri, payload);
    
        res.send(result.data);
    }
    catch (e) {
        res.send(errorResp(e));
    }
});

router.post('/users/:username/registration', async (req, res, next) => {
    const { username } = req.params;
    const payload = {
        payload: '',
        ...req.body
    };
    const uri = `/pingid/v1/accounts/${ACCOUNT_ID}/applications/${APPLICATION_ID}/users/${username}/registrationtokens`;

    try {
        const result = await axios.post(uri, payload);
    
        res.send(result.data);
    }
    catch (e) {
        res.send(errorResp(e));
    }
});

router.get('/users/:username/registration/:registrationId', async (req, res, next) => {
    const { username, registrationId } = req.params;
    const uri = `/pingid/v1/accounts/${ACCOUNT_ID}/applications/${APPLICATION_ID}/users/${username}/registrationtokens/${registrationId}`;

    try {
        const result = await axios.get(uri);
    
        res.send(result.data);
    }
    catch (e) {
        res.send(errorResp(e));
    }
});

router.post('/users', async (req, res, next) => {
    const payload = {
        username: '',
        firstName: '',
        lastName: '',
        status: null,
        lastLogin: null,
        bypassExpiration: null,
        userInBypass: false,
        ...req.body
    };
    const uri = `/pingid/v1/accounts/${ACCOUNT_ID}/users`;

    try {
        const result = await axios.post(uri, payload);
    
        res.send(result.data);
    }
    catch (e) {
        res.send(errorResp(e));
    }
});

router.delete('/users/:username', async (req, res, next) => {
    const { username } = req.params;
    const uri = `/pingid/v1/accounts/${ACCOUNT_ID}/users/${username}`;

    try {
        const result = await axios.delete(uri);
    
        res.send(result.data);
    }
    catch (e) {
        res.send(errorResp(e));
    }
});

router.post('/email/config', async (req, res, next) => {
    const payload = {
        fromAddress: 'noreply@pingidentity.com',
        emailSubject: 'Confirme seu e-mail',
        emailBody: 'Codigo de segurança: ${otp}',
        replyToAddress: 'noreply@pingidentity.com',
        contentType:'text/html',
        characterSet: 'UTF-8',
        locale: 'pt-BR',
        type: 'register',
        emailBodyEncoding: 'raw',
        ...req.body
      };
    const uri = `/pingid/v1/accounts/${ACCOUNT_ID}/applications/${APPLICATION_ID}/emailconfigurations`;

    try {
        const result = await axios.post(uri, payload);
    
        res.send(result.data);
    }
    catch (e) {
        res.send(errorResp(e));
    }
});

router.delete('/email/config/:id', async (req, res, next) => {
    const { id } = req.params;
    const uri = `/pingid/v1/accounts/${ACCOUNT_ID}/applications/${APPLICATION_ID}/emailconfigurations/${id}`;

    try {
        const result = await axios.delete(uri);
    
        res.send(result.data);
    }
    catch (e) {
        res.send(errorResp(e));
    }
});

module.exports = router;

function generateToken(method, uri, qs, payload) {
    const sp = jsonString(payload);
    const hsp = hash(sp);
    
    let cs = null;
    if (qs == null || qs == "")
        cs = `${method}:${HOST}:${uri}:${hsp}:`;
    else
        cs = `${method}:${HOST}:${uri}:${qs}:${hsp}:`;
    
    const hcs = hash(cs);
    console.log(`cs: ${cs}`);
    console.log(`hcs: ${hcs}`);

    console.log('');

    return generateJwt(hcs);
}

function jsonString(payload) {
    if (payload == null || payload == "")
        return "";

    return JSON.stringify(payload);
}

function hash(data) {
    return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
}

function generateJwt(data) {
    var secret = new Buffer(API_KEY, "base64");
    return jwt.sign({ data }, secret, {
        algorithm: 'HS256',
        header: {
            typ: 'JWT',
            account_id: ACCOUNT_ID,
            token: TOKEN,
            expires: '2020-06-29T23:09:46Z',
            'X-Request-ID': uuidv4(),
            'jwt_version': 'v4'
        }
    });
}

errorResp = (e) => ({
    config: e.config,
    response: e.response.data
});