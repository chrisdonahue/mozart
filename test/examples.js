var test = require('tape');
var ctor = require('../');

var Citizen = ctor(function(prototype, _, _protected) {
  // Public methods.
  prototype.init = function(name, age) {
    _(this).name = name;
    _(this).age = age;
  };
  prototype.vote = function(politician) {
    if (_(this).allowedToVote()) {
      console.log(_(this).name + ' voted for ' + politician);
    } else {
      throw new Error(_(this).name + ' is not allowed to vote.');
    }
  };
  // Protected methods.
  _protected.allowedToVote = function() {
    return this.age > 18;
  };
});

var Criminal = Citizen.subclass(function(prototype, _, _protected) {
  // the `vote` method is not defined here because it's
  // inherited from the Citizen class.
  prototype.init = function(name, age, crime) {
    _(this).crime = crime;
    prototype.super.init.call(this, name, age);
  };
  _protected.allowedToVote = function() {
    return _(this).crime != 'felony'
      && _protected.super.allowedToVote.call(this);
  };
});

test('README examples.', function(t) {

  t.plan(1);

  var joe = new Criminal('Joe', 21, 'felony');

  t.throws(function() {
    joe.vote('Obama');
  }, /Joe is not allowed to vote\./);

});
