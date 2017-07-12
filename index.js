const request = require('request-promise');
const USER_ID = 'j6wOOLnSnU';
const BASE_URL = 'http://10.134.22.19:3000/'

var requestGenerator = function(method, uri, body) {
    return {
        method: method,
        url: BASE_URL + uri,
        headers: {
            "userID": USER_ID,
            "user-agent": "something"
        },
        body: body,
        json: true
    };
};

var requester = function(method, uri, requestBody) {
    var options = requestGenerator(method, uri, requestBody);
    return request(options)
};

var register = function() {
    var name = 'BS'
    var uri = 'user/register'
    var data = {
        name
    };
    requester('POST', uri, data).then((res) => console.log(res))
};

var getChallange = function() {
    var uri = 'challenge'
    var method = 'GET'
    return requester(method, uri);
};
// register();

getChallange().then((res) => console.log(res));

var getInput = function() {
    var uri = 'challenge/input';
    var method = 'GET';
    return requester(method, uri);
};

var postOutput = function(output) {
    var uri = 'challenge/output';
    var method = 'POST';
    var data = {
        output
    };
    return requester(method, uri, data);
};

var solveChallenge = function(method) {
    return getInput().then((input) => {
        console.log('input: ', input);
        var output = method(input);
        console.log('output: ', output);
        return postOutput(output);
    });
};

var challengeone = function(input) {
    return {
        count: input.length
    };
};

solveChallenge(challengeone).then((res) => console.log(res));
