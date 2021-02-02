const uuid = require('uuid');
const nJwt = require('njwt');
const secret = "sdfgsudfsgautwevrgwefuiytwefgcdsuifvysduv";
// var secureRandom = require('secure-random');
// var signingKey = secureRandom(256, {type: 'Buffer'});

const claims = {
 "jti": "7bf24a92-6867-44db-8851-c3d4d53c66f1",
 "iat": 1562723845,
 "exp": 1562727445
}



function encodeJWT(data){
    var jwt = nJwt.create(claims,secret,"HS256");
    jwt.setNotBefore(new Date().getTime() + (24*60*60*1000));
    return jwt.compact();
}

function decodeJWT(token){
    return nJwt.verify(token,secret,"HS256");
}

token = encodeJWT("helllo");
console.log(decodeJWT(token))