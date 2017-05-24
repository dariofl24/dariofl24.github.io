/*exported MakeSingleton*/

function MakeSingleton( obj ) {
    var r;
    if ( obj.constructor.prototype._singletonInstance ) {
        r = obj.constructor.prototype._singletonInstance;
    } else {
        obj.constructor.prototype._singletonInstance = obj;
        r = obj.constructor.prototype._singletonInstance;
    }
    return r;
}
