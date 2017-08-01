const request = require('request-promise');
const USER_ID = 'fobwtNSuWT';
const _ = require('lodash');
const BASE_URL = 'http://10.134.20.141:3000/'

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
  console.log('output data: ', data)
  return requester(method, uri, data);
};

var solveChallenge = function(method) {
  return getInput().then((input) => {
    // console.log('input: ', input);
    var output = method(input);
    // console.log('output: ', output);
    return postOutput(output);
  });
};

var challengeone = function(input) {
  return {
    count: input.length
  };
};

var isActive = function(product) {
  var now = new Date();
  var startDate = new Date(product.startDate);
  var endDate = new Date(product.endDate);
  return startDate <= now && (!product.endDate || endDate >= now);
};

var filterActiveProducts = function(input) {
  return input.filter(isActive);
};

var challengetwo = function(input) {
  return {
    count: filterActiveProducts(input).length
  };
};

var challengethree = function(input) {
  var activeProducts = filterActiveProducts(input);
  console.log(activeProducts)
  var result = activeProducts.reduce((categorised, product) => {
    categorised[product.category] = categorised[product.category] ? categorised[product.category] + 1 : 1
    return categorised;
  }, {});
  console.log('result', result);
  return result
};

var challengefour = function(input) {
  var activeProducts = filterActiveProducts(input);
  var totalValue = activeProducts.reduce((sum, product) => {
    return product.price + sum
  }, 0);
  console.log(totalValue);
  return {
    totalValue
  };
};

var challenge5 = function(input) {
  var sumAge = input.reduce(function(sum, person) {
    return sum += person.age
  }, 0);

  var avg = sumAge / input.length;

  return {
    averageAge: Math.floor(avg)
  };
};

var challengeSix = function({
  people,
  connection,
  requiredSuggestion
}) {
  var connectonsAlready = _.find(connection, requiredSuggestion)[requiredSuggestion];
  console.log(people);
  console.log(requiredSuggestion);
  console.log(connectonsAlready)
  friendsOfFriends = connectonsAlready.reduce(function(sum, person) {
    return sum.concat(_.find(connection, person)[person])
  }, []);
  var notFiends = _.reject(friendsOfFriends, function(person) {
    return _.includes(connectonsAlready, person) || person == requiredSuggestion
  });
  console.log(notFiends)
  // // _.filter(notFiends, function(person){
  //
  // // });
  return {
    suggestedFriends: notFiends.map(function(person) {
      return _.find(people, {
        name: person
      });
    })
  }
};

var challengeSeven = function({
  people,
  connection,
  requiredSuggestion
}) {
  var output = challengeSix({
    people,
    connection,
    requiredSuggestion
  });
  return {
    suggestedFriends: output.suggestedFriends.filter(function(person) {
      return _.find(people, {
        name: requiredSuggestion
      }).age == person.age;
    })
  }
};

var challengeEight = function({
  people,
  connection,
  averageFriendsAge
}) {
  var connectonsAlready = _.find(connection, averageFriendsAge)[averageFriendsAge];
  // console.log(requiredSuggestion);
  var sum = challenge5(connectonsAlready.map(function(person) {
    return _.find(people, {
      name: person
    })
  }))
  return {
    averageAge: sum.averageAge / connectonsAlready.length
  }
}
// register();
// getChallange().then((res) => console.log(res, res.sampleOutput.output));
// solveChallenge(challengeEight).then((res) => console.log(res));
