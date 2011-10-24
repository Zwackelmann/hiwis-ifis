/**
 * CallbackAfterN can be used in cases when you want do ensure that a function is
 * called after n asynchronous functions callbacks where called.<br>
 * <br>
 * <b>Usage:</b>
 * <pre>
 * var foo = function(bar, baz) {...}
 * 
 * // I want to call foo("test1", "test2") after 3 callbacks: 
 * var callFooAfter3 = new CallbackAfterN({
 *   n: 3,
 *   callback: foo,
 *   args: ["test1", "test2"]
 * });
 * 
 * // now just pass the result of callFooAfter3.countdown() as a callback
 * someMethodWithCallback(callFooAfter3.countdown());
 * 
 * // or if you want to specify an individual callback after "someMethodWithCallback" 
 * // is finished, you can also assign it to countdown:
 * someMethodWithCallback(callFooAfter3.countdown(function(res){console.log(res);})); 
 * 
 * // and a third time:
 * someMethodWithCallback(callFooAfter3.countdown()); // after callback, foo("test1", "test2") will be called
 * </pre>
 * @param map.n Number of asynchronous callbacks to be called
 * @param map.callback Callback after n asynchronous callbacks where called
 * @param map.args List of arguments for the callback function
 * 
 * @returns CallbackAfterN object
 */
var CallbackAfterN = function(map) {
  var n = map.n || 1;
  var afterAllCallback = map.callback || function() {};
  var args = map.args || [];
  
  var countdown = function(callback) {
    return function innerCountdown() {
      n = n - 1;
      if(typeof callback === 'function') {
        callback.apply(callback, innerCountdown.arguments);
      }
      
      if(n == 0) {
        afterAllCallback.apply(afterAllCallback, args);
      }
    };
  };
  
  return {
    countdown: countdown
  };
};

module.exports = CallbackAfterN;