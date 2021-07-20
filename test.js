let crypto = require('crypto');
const { generateKeyPair } = require('crypto');
generateKeyPair('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    }
  }, (err, publicKey, privateKey) => {
});
//console.log(crypto.createPublicKey("-----BEGIN PRIVATE KEY-----\n 123455\n -----END PRIVATE KEY----- "))
