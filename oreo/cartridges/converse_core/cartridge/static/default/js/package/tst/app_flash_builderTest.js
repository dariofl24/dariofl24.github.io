module( "Module App FlashBuilder", {
    self : this,
    
    setup: function() {
    	$('#qunit-fixture').html("");
		$('*').unbind();
		
        // setup some fixture html
		this.htmlFixture = htmlUtil.writeAsString(function() {/*!
        <div id="flash-builder-container">
            EMPTY FIXTURE>>> NOTHING NEEDED HERE
        </div>
        */});
        
        $('#qunit-fixture').append(this.htmlFixture);
        
        app.customization = {
                nikeIdDomain : "nikeid.nike.com",
                addToMyDesigns : "MyDesigns-Add",
                sendDYOToFriend : "SendToFriend-DYOItem"
        };
        
        swfObjectMock = {
            parameters : {},
            variables : {},
            element : undefined,
            
            addParam : function(name, value)
            {
                this.parameters[name] = value;
            },
            
            addVariable : function(name, value)
            {
                this.variables[name] = value;
            },
            
            write : function(element)
            {
                this.element = element;
            }
        }
    },
    
    teardown: function() {
        $('#qunit-fixture').html("");
        $('*').unbind();
        swfObjectMock.parameters = {};
        swfObjectMock.variables = {};
        swfObjectMock.element = undefined;
        
    }
});

test("When App Flash Builder configures properties it is well configured", function() {

    var parameters = {
        allowFullscreen :  true,
        menu : false,
        scale : "noscale"
    };
    
    app.flashbuilder.configureParameters( self.swfObjectMock, parameters );
    
    ok( self.swfObjectMock.parameters['allowFullscreen'] === true, "True value is not properly passed as parameter");
    ok( self.swfObjectMock.parameters['menu'] === false, "False value is not properly passed as parameter");
    ok( self.swfObjectMock.parameters['scale'] == "noscale", "String values is not properly passed as parameter");
    ok( Object.keys(self.swfObjectMock.parameters).length === 3, "Not all parameters well passed to the swf object");
});

test("When App Flash Builder configures variables with values it is well configured", function() {

    var variables = {
        FQDN :  "www.converse.com/",
        lang_locale : "en_US",
        dynamicUrl : function(){ return this.FQDN + "somepage.html"; }
    };
    
    app.flashbuilder.configureVariables( self.swfObjectMock, variables );
    
    ok( self.swfObjectMock.variables['FQDN'] == "www.converse.com/", "Capitalized String key with value is not properly passed as variable");
    ok( self.swfObjectMock.variables['lang_locale'] == "en_US", "String value is not properly passed as variable");
    ok( self.swfObjectMock.variables['dynamicUrl'] == "www.converse.com/somepage.html", "Dynamic value is not properly passed as variable" + self.swfObjectMock.variables['dynamicUrl']);
    ok( Object.keys(self.swfObjectMock.variables).length === 3, "Not all variables well passed to the swf object");
});

test("When App Flash Builder passes some variables and this override default ones", function() {

    var variables = {
        domain :  "www.converse.com",
        lang_locale : "en_GB"
    };
    
    var allVariables = app.flashbuilder.obtainVariables( variables );
    
    ok( allVariables['domain'] == "www.converse.com", "domain has not the new value");
    ok( allVariables['lang_locale'] == "en_GB", "lang_locale has not the new value");
    ok( allVariables['id'] == "builderID", "id has not the default value");
    ok( typeof(allVariables['flashSource']) == "function", "flashSource should remind as a function");
    ok( allVariables['flashSource'].call(allVariables) == "www.converse.com/builder/standaloneIDBuilder.swf", "flashSource should return a url based on the new domain value.");
});

test("When App Flash Builder prepares a SWFObject. It passes the variables, parameters and assign the SWFObject to the proper HTML element", function() {
    
    var configureParametersSpy = sinon.spy(app.flashbuilder, "configureParameters");
    var configureVariablesSpy = sinon.spy(app.flashbuilder, "configureVariables");
    var writeSpy = sinon.spy(self.swfObjectMock, "write");
    
    var variables = {id : "buildId"};
    var parameters = {width : "90" };
    app.flashbuilder.prepareSWFObject(self.swfObjectMock, variables, parameters );
    
    ok(configureParametersSpy.calledWith(self.swfObjectMock, parameters) === true , "Configure Parameters should be called." );
    ok(configureVariablesSpy.calledWith(self.swfObjectMock, variables) === true , "Configure Variables should be called." );
    ok(writeSpy.calledWith("flash-builder-container") === true , "Write to Element should be called." );
    
    configureParametersSpy.restore();
    configureVariablesSpy.restore();
    writeSpy.restore();
});

test("When App Flash Builder instantiates a SWFObject it is done with the proper configuration", function() {
    
    var SWFObjectOriginal = SWFObject;
    var swfObjectArgs = new Array();
    
    SWFObject =  function(flashSource,id,width,height,version,backgroundColor,quaity) {
        swfObjectArgs = [flashSource,id,width,height,version,backgroundColor,quaity];
        
    };
	
    var variables = {
        flashSource : "flashSource",
        id : "id",
        width : "width",
        height : "height",
        version : "version",
        backgroundColor : "backgroundColor",
        quality : "quality"
    };
    
    var swfObject = app.flashbuilder.obtainSWFObject( variables);
    
    
    ok(swfObjectArgs[0] == "flashSource" , "flash source was not correctly assigned");
    ok(swfObjectArgs[1] == "id" , "id was not correctly assigned");
    ok(swfObjectArgs[2] == "width" , "width was not correctly assigned");
    ok(swfObjectArgs[3] == "height" , "height was not correctly assigned");
    ok(swfObjectArgs[4] == "version" , "version was not correctly assigned");
    ok(swfObjectArgs[5] == "backgroundColor" , "backgroundColor was not correctly assigned");
    ok(swfObjectArgs[6] == "quality" , "quality was not correctly assigned");
    
    SWFObject = SWFObjectOriginal;
});

test("When App Flash Builder is initialized all steps are correctly called", function() {
    
	var obtainVariablesSpy = sinon.spy(app.flashbuilder, "obtainVariables");
    var obtainParametersSpy = sinon.spy(app.flashbuilder, "obtainParameters");
    var obtainSWFObjectStub = sinon.stub(app.flashbuilder, "obtainSWFObject", function(){ return self.swfObjectMock; });
    var prepareSWFObjectSpy = sinon.spy(app.flashbuilder, "prepareSWFObject");
    
    var variables = {id : "buildId", nikeProductID : "121212"};
    var parameters = {width : "90" };
    
    app.flashbuilder.init( variables, parameters );
    
    ok(obtainVariablesSpy.calledWith(variables) === true , "ObtainVariables should be called." );
    ok(obtainParametersSpy.calledWith(parameters) === true , "ObtainParameters should be called." );
    ok(prepareSWFObjectSpy.calledWithMatch(self.swfObjectMock, variables, parameters) === true, "prepareSWFObjectSpy should be called." );
    
    obtainVariablesSpy.restore();
    obtainParametersSpy.restore();
    obtainSWFObjectStub.restore();
    prepareSWFObjectSpy.restore();
});

test("When App Flash Builder is initializing it stops if not nikeProducID", function() {
    
	var obtainVariablesSpy = sinon.spy(app.flashbuilder, "obtainVariables");
    var obtainParametersSpy = sinon.spy(app.flashbuilder, "obtainParameters");
    
    var variables = {id : "buildId"};
    var parameters = {width : "90" };
    
    app.flashbuilder.init( variables, parameters );
    
    ok(obtainVariablesSpy.calledWith(variables) === true , "ObtainVariables should be called." );
    ok(obtainParametersSpy.calledWith(parameters) === false , "ObtainParameters should not be called." );
    
    obtainVariablesSpy.restore();
    obtainParametersSpy.restore();
    
});





