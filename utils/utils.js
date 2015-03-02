var utils = {};

/*
  Send a 200 OK with success:true in the request body to the
  response argument provided.
  The caller of this function should return after calling
*/
utils.sendSuccessResponse = function(res, content) {
  res.status(200).json({
    success: true,
    content: content
  }).end();
};

/*
  Send an error code with success:false and error message
  as provided in the arguments to the response argument provided.
  The caller of this function should return after calling
*/
utils.sendErrResponse = function(res, errcode, err) {
  res.status(errcode).json({
    success: false,
    err: err
  }).end();
};

utils.getDisplayName = function(user) {
  var lastInitial = getLastInitial(user.name);
  if (user.PreferredName) {
    return concatName(capitalizeFirstLetter(user.PreferredName), lastInitial);
  } else {
    return concatName(capitalizeFirstLetter(getFirstName(user.name)), lastInitial);
  }
}

utils.insertSpaces = function(phrase) {
  return phrase.split('_').join(' ');
}

function getFirstName(name) {
  return name.split(' ')[0];
}

function getLastInitial(name) {
  var trimmedName = name.trim();
  var nameArray = trimmedName.split(' ');
  var lastName = nameArray[nameArray.length - 1];
  return lastName.substring(0,1).toUpperCase() + '.';
}

function concatName(first, last) {
  return first + ' ' + last;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = utils;
