const request = require('sync-request');

function httpRequest(method, url, body) {
    return JSON.parse(request(
        method,
        url,
        {
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        }   
    ).getBody('utf8'));
}

module.exports = {      
    httpRequest: httpRequest
}
  