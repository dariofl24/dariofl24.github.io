var testSuite = function (){
    var deps = [];
    var tests = [];

    var importScript = function (script){
        var tag = document.createElement("script");
        tag.type="text/javascript";
        tag.src = script;
        document.head.appendChild(tag);
    };

    var _addDeps = function(){
        for ( d in deps ) {
            console.log("adding dependency: \t"+deps[d]);
            try{
                importScript(deps[d]);
            }catch(e){
                console.log("error _addDeps:", e);
            }
        }
    };

    var _addTests = function(){
        for ( t in tests ) {
            console.log("adding test to suite: \t"+ tests[t]);
            try{
                importScript(tests[t]);
            }catch(e){
                console.log("error _addTest:", e);
            }
        }
    }
        
    return {
        addTests:function(t){
            tests = tests.concat(t)
        },
        addDeps:function(d){
            deps = deps.concat(d)
        },
        runTests:function(){
            _addDeps();
            _addTests();
        }
    }
}();

try{
    testSuite.addDeps(getDepList);
    testSuite.addTests(getTestList);
    testSuite.runTests();
}catch(e){
    console.log("error:",e);
}
