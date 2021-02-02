const RSA_PRIVATE_KEY = "sdfgsudfsgautwevrgwefuiytwefgcdsuifvysduv";

const crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'N7bz2FTM$UHc#rPmveVEQ-ZnXSYqaD6uWgAxsLjdCwJ_Bfyt54';
    // const key = Buffer.concat([Buffer.from(password)], Buffer.alloc(32).length);
function encrypt(text){
  //const iv = Buffer.from(Array.prototype.map.call(Buffer.alloc(16), () => {return Math.floor(Math.random() * 256)}));
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(""+text+RSA_PRIVATE_KEY,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

module.exports = {encrypt,decrypt};
