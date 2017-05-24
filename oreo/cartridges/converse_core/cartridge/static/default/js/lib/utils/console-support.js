// http://stackoverflow.com/a/7585409
// from twitter source
// ... and improved by Tacit Knowledge.

(function() {
  var names = ['log', 'debug', 'info', 'warn', 'error',
      'assert', 'dir', 'dirxml', 'group', 'groupEnd', 'time',
      'timeEnd', 'count', 'trace', 'profile', 'profileEnd'],
      i, l = names.length;

  window.console = window.console || {};

  for ( i = 0; i < l; i++ ) {
   if( typeof window.console[ names[i] ] === 'undefined' )
   {
       window.console[ names[i] ] = function() {};
   }
  }
}());
