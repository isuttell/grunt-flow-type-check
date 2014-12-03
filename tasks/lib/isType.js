/**
 * Checks to see if a var is a speficied type
 *
 * @param  {Mixed}  obj  var to check
 *
 * @return {Boolean}
 */
var isType = function(obj, type) {
  var result = {}.toString.call(obj).toLowerCase();
  return result === '[object ' +  type.toLowerCase() + ']';
};

module.exports.type = isType;

/**
 * Checks to see if a var is a boolean
 *
 * @param  {Mixed}  obj  var to check
 *
 * @return {Boolean}
 */
var isBoolean = function(obj) {
  return isType(obj, 'boolean');
};

module.exports.typeBoolean = isBoolean;

/**
 * Checks to see if a var is a array
 *
 * @param  {Mixed}  obj  var to check
 *
 * @return {Boolean}
 */
var isArray = function(obj) {
  return isType(obj, 'array');
};

module.exports.typeArray = isArray;

/**
 * Checks to see if a var is a function
 *
 * @param  {Mixed}  obj  var to check
 *
 * @return {Boolean}
 */
var isFunction = function(obj) {
  return isType(obj, 'function');
};

module.exports.typeFunction = isFunction;

/**
 * Checks to see if a var is a number
 *
 * @param  {Mixed}  obj  var to check
 *
 * @return {Boolean}
 */
var isNumber = function(obj) {
  return isType(obj, 'number');
};

module.exports.typeNumber = isNumber;

/**
 * Checks to see if a var is a boolean
 *
 * @param  {Mixed}  obj  var to check
 *
 * @return {Boolean}
 */
var isObject = function(obj) {
  return isType(obj, 'object');
};

module.exports.typeObject = isObject;

/**
 * Checks to see if a var is a string
 *
 * @param  {Mixed}  obj  var to check
 *
 * @return {Boolean}
 */
var isString = function(obj) {
  return isType(obj, 'string');
};

module.exports.typeString = isString;

/**
 * Checks to see if a var is a iterable
 *
 * @param  {Mixed}  obj  var to check
 *
 * @return {Boolean}
 */
var isIterable = function(obj) {
  return isType(obj, 'object') || isType(obj, 'function');
};

module.exports.typeIterable = isIterable;
