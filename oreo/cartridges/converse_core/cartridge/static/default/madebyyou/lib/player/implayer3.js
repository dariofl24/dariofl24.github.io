//------------------------------------------------------------------------------------
// implayer3.js
// Author: Ben Siroshton
// Copyright © Immersive Media 2010-2013
//------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------
// imSceneType
//------------------------------------------------------------------------------------
/**
 * Scene specifiers for the available scenes.
 */

var imSceneType = {};
{
	/**
	 * This provides a basic scene for displaying videos and stills, all other scene types
	 * are derived from this one
	 */
	imSceneType.Basic		= "im.player.scenes::BasicScene";
	
	/**
	 * A GeoScene extend the BasiScene by providing augmentation capabilities using cartesian
	 * and or GPS positioning information.
	 */ 
	imSceneType.Geo 		= "im.player.scenes.geo::GeoScene";
	
	/**
	 * @deprecated
	 * The MediaStore scene provides access to our legacy MediaStore product, future efforts
	 * are focused on the im360 Server.
	 */
	imSceneType.MediaStore 	= "im.player.scenes.geo::MediaStoreScene";
}

//------------------------------------------------------------------------------------
//imMediaTransformType
//------------------------------------------------------------------------------------
var imMediaTransformType = {};
{
	imMediaTransformType.CopyTransform = "im.player.media.transforms::CopyTransform";
    imMediaTransformType.RestrictedTransform = "im.player.media.transforms::RestrictedTransform";
}

//------------------------------------------------------------------------------------
// imNodeProjectionType
//------------------------------------------------------------------------------------
var imNodeProjectionType = {};
{
	imNodeProjectionType._3D		= 0;
	imNodeProjectionType.ViewPlane	= 1;
}

//------------------------------------------------------------------------------------
// imImageProjectionType
//------------------------------------------------------------------------------------
var imImageProjectionType = {};
{
	imImageProjectionType.Planar 			= 0;
	imImageProjectionType.Equirectangular	= 1;
}


//------------------------------------------------------------------------------------
// imScreenPositionType
//------------------------------------------------------------------------------------
var imScreenPositionType = {};
{
	imScreenPositionType.AspectFit 		= 0;
	imScreenPositionType.AspectFill		= 1;
	imScreenPositionType.StretchFill	= 2;
	imScreenPositionType.Original		= 3;
}

//------------------------------------------------------------------------------------
// imNodeType
//------------------------------------------------------------------------------------
var imNodeType = {};
{
	// Geo Nodes
	imNodeType.GeoNode 			= "im.player.scenes.geo::GeoNode";
	imNodeType.GeoImage 		= "im.player.scenes.geo::GeoImage";
	imNodeType.GeoSphere 		= "im.player.scenes.geo::GeoSphere";
	imNodeType.GeoScreenText	= "im.player.scenes.geo::GeoScreenText";
	imNodeType.GeoPlug			= "im.player.scenes.geo::GeoPlug";
	imNodeType.GeoLine			= "im.player.scenes.geo::GeoLine";
	imNodeType.GeoSprite		= "im.player.scenes.geo::GeoSprite";

	// Screen Nodes
	imNodeType.ScreenNode		= "im.player.scenes.screen::ScreenNode";
	imNodeType.ScreenImage		= "im.player.scenes.screen::ScreenImage";
}

//------------------------------------------------------------------------------------
// imSequenceTargetType
//------------------------------------------------------------------------------------
var imSequenceTargetType = {};
{
	imSequenceTargetType.Scene		= "Scene";
	imSequenceTargetType.Camera		= "Camera";
	imSequenceTargetType.GeoNode	= "GeoNode";
	imSequenceTargetType.ScreenNode	= "ScreenNode";	
}

//------------------------------------------------------------------------------------
// imSequenceFrameType
//------------------------------------------------------------------------------------
var imSequenceFrameType = {};
{
	imSequenceFrameType.CameraFrame	= "im.player.sequence::CameraFrame";
	imSequenceFrameType.ObjectFrame	= "im.player.sequence::ObjectFrame";
	imSequenceFrameType.UVAreaFrame	= "im.player.sequence::UVAreaFrame";	
}


//------------------------------------------------------------------------------------
// imVideoEventType
//------------------------------------------------------------------------------------
var imVideoEventType = {};
{
	imVideoEventType.TimeChanged		= "time.change";
	imVideoEventType.DurationChanged	= "duration.change";
	imVideoEventType.Playing			= "stream.playing";
	imVideoEventType.Paused				= "stream.paused";
	imVideoEventType.Failed				= "stream.failed";	
	imVideoEventType.Finished			= "stream.finished";
	imVideoEventType.StreamPublished	= "stream.published";
	imVideoEventType.StreamUnpublished	= "stream.unpublished";
	imVideoEventType.StreamSwitching	= "stream.switching";
	imVideoEventType.StreamSwitched		= "stream.switched";
	imVideoEventType.FirstFrame			= "first.frame";
}

//------------------------------------------------------------------------------------
// imSceneEventType
//------------------------------------------------------------------------------------
var imSceneEventType = {};
{
	imSceneEventType.WorldViewEnabled			= "worldview.enabled";
	imSceneEventType.WorldViewDisabled			= "worldview.disabled";
	imSceneEventType.WorldViewProperty			= "worldview.property";
	imSceneEventType.WorldViewLayoutProperty	= "worldview.layout.property";
}

//------------------------------------------------------------------------------------
// imVideoMetaDataEventType
//------------------------------------------------------------------------------------
var imVideoMetaDataEventType = {};
{
	imVideoMetaDataEventType.DataArrived	= "meta.data.arrived";
}

//------------------------------------------------------------------------------------
// imMediaProviderType
//------------------------------------------------------------------------------------
var imMediaProviderType = {};
{
	imMediaProviderType.StillProvider		= "im.player.media::StillProvider";
	imMediaProviderType.VideoProvider		= "im.player.media::VideoProvider";
	imMediaProviderType.VideoStillProvider  = "im.player.media::VideoStillProvider";
}

//------------------------------------------------------------------------------------
// imVAlignmentType
//------------------------------------------------------------------------------------
var imVAlignmentType = {};
{
	imVAlignmentType.Top = 1;
	imVAlignmentType.Middle = 2;
	imVAlignmentType.Bottom = 3;
}

//------------------------------------------------------------------------------------
// imHAlignmentType
//------------------------------------------------------------------------------------
var imHAlignmentType = {};
{
	imHAlignmentType.Left = 1;
	imHAlignmentType.Center = 2;
	imHAlignmentType.Right = 3;
}

//------------------------------------------------------------------------------------
// imUtils
//------------------------------------------------------------------------------------
var imUtils = (imUtils==undefined) ? {} : imUtils; 
{
	if( imUtils.debugContainer==undefined ) imUtils.debugContainer = null;

	imUtils.e = function(id)
	{
		return document.getElementById(id);
	};
	
	imUtils.debug = function()
	{		
		if( imUtils.debugContainer )
			imUtils.debugOut(imUtils.debugContainer, arguments);
	};
	
	imUtils.debugOut = function()
	{
		if( arguments==null || arguments.length<2 )
		{
			return;
		}
		
		var out = arguments[0];
		var args = arguments[1];
		
		var str="";
		for(var i=0;i<args.length;i++)
		{
			str += args[i] + ( i<args.length-1 ? ", " : "");
		}
		
	    var d = document.createElement('div');
	    d.innerHTML = str;

	    out.appendChild(d);
	    out.scrollTop = out.scrollHeight;	
	}	
	
	imUtils.argsToArray = function(args,startIndex)
	{
		startIndex = (startIndex==undefined||startIndex==null) ? 0 : startIndex;
	 
		var a = new Array();
		var count=0;
		for(var i=startIndex;i<args.length;i++)
		{
			a[count] = args[i];
			count++;
		}		
		return a;
	};
}

//------------------------------------------------------------------------------------
// imPlayerInstances
//------------------------------------------------------------------------------------
/**
* @private
*/
var imPlayerInstances = {};
{
	imPlayerInstances.instances = new Array();
	imPlayerInstances.instanceCount = 0;
	
	imPlayerInstances.getPlayer = function(id){
		return this.instances[id];
	};

	imPlayerInstances.addPlayerInstance = function(player){	
		var id = '_plr_inst_' + imPlayerInstances.instanceCount; 
		imPlayerInstances.instances[id] = player;
		imPlayerInstances.instanceCount++;	
		return id;
	};
	
	imPlayerInstances.getFlashInstance = function(id){
		return document.getElementById(id);
	    //var isIE = navigator.appName.indexOf("Microsoft") != -1;
	    //return (isIE) ? window[id] : document.getElementById(id);	
	};
}


//------------------------------------------------------------------------------------
// imPlayer
//------------------------------------------------------------------------------------	
/**
* Construct a new player object.
*
* @class
* @constructor
* @param element	HTML Element to embed the player.
* @see init
*/

function imPlayer(element){

    //--------------------------------------------------------------------------------
    // Main Support
    //--------------------------------------------------------------------------------
    /**
     * Initialize the player.  This function embeds the player into the constructor
     * element.  Any events you want to handle should be set before calling this
     * function (specifically the onLoad event, otherwise the event might be missed).
     *
     * @param playerPath	Path to the player (path only, do not include a file).
     * @param configPath	(optional) Path to a player configuration file.
     * @see onLoad
     */
	this.init = function(playerPath, configPath)
	{
	    // window modes: normal, transparent, direct, gpu
	    this.parent.innerHTML = InsertPlayerString(this.playerId, '100%', '100%', 'normal', configPath, playerPath);	
	}
	
	/**
	 * Checks for a policy file at the given url.
	 *
	 * @param url	Url to check.
	 */
	this.checkPolicy = function(url)
	{
		imPlayerInstances.getFlashInstance(this.playerId).checkPolicy(url);
	}

	/**
	 * Returns the value for any named property.  See the AS3 docs to view available
	 * properties.
	 *
	 * @param name	The name of the property to retrieve.
	 * @return		Returns the value of the property.
	 * @see setProperty
	 */  
	this.getProperty = function(name){
		return imPlayerInstances.getFlashInstance(this.playerId).getProperty(name); 
	}
	
	/**
	 * Sets the value for any named property.  See the AS3 docs to view available
	 * properties.
	 *
	 * @param name	The name of the property to set.
	 * @param value	Value to to set the property to.
	 * @see getProperty
	 */  
	this.setProperty = function(name,value){
		return imPlayerInstances.getFlashInstance(this.playerId).setProperty(name,value); 
	}
	
	/**
	 * Loads a plugin at the player level.  This plugin will sit on top of any loaded scene.
	 *
	 * @param name		The name of the plugin to load.
	 * @param swfUrl	Url to the swf that hosts the plugin.
	 * @return			Id of the plugin.
	 */  
	this.loadPlugin = function(name,swfUrl){
		return imPlayerInstances.getFlashInstance(this.playerId).loadPlugin(name,swfUrl);
	};

	/**
	 * Sets the value for any named property.
	 *
	 * @param id	Id of the plugin.
	 * @param name	The name of the property to set.
	 * @param value	Value to set the property to.
	 * @see getPluginProperty
	 */  
	this.setPluginProperty = function(id,name,value){
		imPlayerInstances.getFlashInstance(this.playerId).setPluginProperty(id,name,value);
	}

	/**
	 * Retrieves the value for any named property.
	 *
	 * @param id	Id of the plugin.
	 * @param name	The name of the property to set.
	 * @return		Value of the property.
	 * @see setPluginProperty
	 */  
	this.getPluginProperty = function(id,name){
		return imPlayerInstances.getFlashInstance(this.playerId).getPluginProperty(id,name);
	}

	/**
	 * Executes a method on the given property.
	 *
	 * @param id	Id of the plugin.
	 * @param name	Name of the function to execute.
	 * @param ...	Variable argument list containing all the arguments for the function. 
	 * @return		Method results.
	 */  
	this.pluginCall = function(){ 
		return imPlayerInstances.getFlashInstance(this.playerId).pluginCall(arguments[0],imUtils.argsToArray(arguments,1));
	};
	
	/**
	 * (Event) Override this method to receive notification when the player has 
	 * loaded and is ready for use.
	 *
	 * @param event	Event structure.
	 * {
	 *	.version : String version number of the player
	 * }
	 * @see init
	 */  
	this.onLoad = function(event){};
	this.onConfigLoaded = function(event){};
	this.onPluginLoaded = function(event){};
	this.onSizeChanged = function(event){};
	
    //--------------------------------------------------------------------------------
    // Scene Support
    //--------------------------------------------------------------------------------
    /**
     * Loads a new scene and adds it to the scene manager, optionally with a transition.
     *
     * @param className The scene specifier @see imSceneType
     * @param configUrl Path to a configuration file that holds properties for the scene to use
     * upon loading.
     * @param replaceTop when true the top most scene in the players scene manager will be 
     * replaced with the new scene otherwise it will be pushed up on the scene stack.
     * @param transitionFrom An object that includes property values to transition from.
     * @param transitionTo An accompanying object to transitionFrom that provides property values
     * to transition to.
     * @param waitForMedia when true the scene will not be added to the scene manager until
     * its media loaded event has successfully fired.
     */
	this.loadScene = function(className,configUrl,replaceTop,transitionFrom,transitionTo,transitionDuration,waitForMedia)
	{ 
		return imPlayerInstances.getFlashInstance(this.playerId).loadScene(
			className,
			configUrl,
			replaceTop==null?true:replaceTop,
			transitionFrom,
			transitionTo,
			transitionDuration==null?1.0:transitionDuration,
			waitForMedia==null?false:waitForMedia
			); 
	};

	this.popScene = function()
	{ 
		return imPlayerInstances.getFlashInstance(this.playerId).popScene(); 
	};

	this.getEventInterval = function(name){
		return imPlayerInstances.getFlashInstance(this.playerId).getEventInterval(name);
	}
	
	this.setEventInterval = function(name,interval){
		return imPlayerInstances.getFlashInstance(this.playerId).setEventInterval(name,interval);
	}

	this.onLoadingNewScene = function(e){ return true; };
	this.onScenePushed = function(e){};
	this.onScenePopped = function(e){};
	this.onSceneActivated = function(e){};
	this.onSceneDeactivated = function(e){};	
	this.onSceneTransitionCompleted = function(e){};
	this.onSceneConfigLoaded = function(e){};
	this.onSceneEvent = function(e){};
	
    //--------------------------------------------------------------------------------
    // Scene Support - BASIC
    //--------------------------------------------------------------------------------
	this.loadStill = function(url,projection){
		imPlayerInstances.getFlashInstance(this.playerId).loadStill(
			url,
			projection==null?imImageProjectionType.Equirectangular:projection);
	};

	this.loadVideo = function(url,startTime,startPaused,projection){
		imPlayerInstances.getFlashInstance(this.playerId).loadVideo(
			url,
			startTime==null?0:startTime,
			startPaused==null?false:startPaused,
			projection==null?imImageProjectionType.Equirectangular:projection);
	};
	
	this.switchStream = function(streamName){
		return imPlayerInstances.getFlashInstance(this.playerId).switchStream(streamName);
	};

	this.unloadMedia = function(){
		imPlayerInstances.getFlashInstance(this.playerId).unloadMedia();
	};

	this.setScreen = function(projection,properties){
		imPlayerInstances.getFlashInstance(this.playerId).setScreen(projection,properties);
	};

	this.setScreenRotation = function(yaw,pitch,roll){
		imPlayerInstances.getFlashInstance(this.playerId).setScreenRotation(yaw,pitch,roll);
	};

	this.getScreenRotation = function(){
		return imPlayerInstances.getFlashInstance(this.playerId).getScreenRotation();
	};

	this.setScreenProperty = function(property,value){
		imPlayerInstances.getFlashInstance(this.playerId).setScreenProperty(property,value);
	};
	
	this.getScreenProperty = function(property){
		return imPlayerInstances.getFlashInstance(this.playerId).getScreenProperty(property);
	};

	this.buildScreenFromMeta = function(json){
		return imPlayerInstances.getFlashInstance(this.playerId).buildScreenFromMeta(json);
	};

	this.setSceneProperty = function(property,value){
		imPlayerInstances.getFlashInstance(this.playerId).setSceneProperty(property,value);
	};
	
	this.getSceneProperty = function(property){
		return imPlayerInstances.getFlashInstance(this.playerId).getSceneProperty(property);
	};
	
	this.setSceneLayoutProperty = function(property,value){
		imPlayerInstances.getFlashInstance(this.playerId).setSceneLayoutProperty(property,value);
	}; 
	
	this.getSceneLayoutProperty = function(property){
		return imPlayerInstances.getFlashInstance(this.playerId).getSceneLayoutProperty(property);
	}; 

	this.setLayoutItemProperty = function(id,property,value){
		imPlayerInstances.getFlashInstance(this.playerId).setLayoutItemProperty(id,property,value);
	}; 
	
	this.getLayoutItemProperty = function(id,property){
		return imPlayerInstances.getFlashInstance(this.playerId).getLayoutItemProperty(id,property);
	}; 

	this.isSceneType = function(type){
		return imPlayerInstances.getFlashInstance(this.playerId).isSceneType(type);
	}

	this.setCameraProperty = function(property,value){
		imPlayerInstances.getFlashInstance(this.playerId).setCameraProperty(property,value);
	};
	
	this.getCameraProperty = function(property){
		return imPlayerInstances.getFlashInstance(this.playerId).getCameraProperty(property);
	};

	this.setWorldViewProperty = function(property,value){
		imPlayerInstances.getFlashInstance(this.playerId).setWorldViewProperty(property,value);
	};
	
	this.getWorldViewProperty = function(property){
		return imPlayerInstances.getFlashInstance(this.playerId).getWorldViewProperty(property);
	};

	this.playVideo = function(){
		imPlayerInstances.getFlashInstance(this.playerId).playVideo();
	};

	this.pauseVideo = function(){
		imPlayerInstances.getFlashInstance(this.playerId).pauseVideo();
	};

	this.seekVideo = function(time){
		return imPlayerInstances.getFlashInstance(this.playerId).seekVideo(time);
	};

	this.getMediaProperty = function(name){
		return imPlayerInstances.getFlashInstance(this.playerId).getMediaProperty(name);
	};

	this.setMediaProperty = function(name,value){
		imPlayerInstances.getFlashInstance(this.playerId).setMediaProperty(name,value);
	};
	
	this.setMediaTransform = function(name) {
        imPlayerInstances.getFlashInstance(this.playerId).setMediaTransform(name);
    };

    this.setMediaTransformProperty = function(name, value) {
        imPlayerInstances.getFlashInstance(this.playerId).setMediaTransformProperty(name, value);
    };
    
	this.isMediaType = function(type){
		return imPlayerInstances.getFlashInstance(this.playerId).isMediaType(type);
	};

	this.transitionCamera = function(toValues,time){
		imPlayerInstances.getFlashInstance(this.playerId).transitionCamera(toValues,time);
	};

	this.cameraLookAtXyz = function(x,y,z,fov,time){
		imPlayerInstances.getFlashInstance(this.playerId).cameraLookAtXyz(x,y,z,fov>0?fov:NaN,time>0?time:0);
	};

	this.loadScenePlugin = function(name,swfUrl){
		return imPlayerInstances.getFlashInstance(this.playerId).loadScenePlugin(name,swfUrl);
	};

	this.removeScenePlugin = function(id){
		return imPlayerInstances.getFlashInstance(this.playerId).removeScenePlugin(id);
	};

	this.setScenePluginProperty = function(id,prop,value){
		imPlayerInstances.getFlashInstance(this.playerId).setScenePluginProperty(id,prop,value);
	};

	this.getScenePluginProperty = function(id,prop){
		return imPlayerInstances.getFlashInstance(this.playerId).getScenePluginProperty(id,prop);
	};
	
	this.setScenePluginLayoutIndex = function(id,index,asInsert,props){
		return imPlayerInstances.getFlashInstance(this.playerId).setScenePluginLayoutIndex(id,index==null?-1:index,asInsert==null?true:asInsert,props);
	};

	this.getScenePluginLayoutId = function(id){
		return imPlayerInstances.getFlashInstance(this.playerId).getScenePluginLayoutId(id);
	};

	this.scenePluginCall = function(){ 
		return imPlayerInstances.getFlashInstance(this.playerId).scenePluginCall(arguments[0],imUtils.argsToArray(arguments,1));
	};

    this.addScreenNode = function(type,parentId){
    	return imPlayerInstances.getFlashInstance(this.playerId).addScreenNode(type,parentId);
    };
    
    this.removeScreenNode = function(nodeId){
    	return imPlayerInstances.getFlashInstance(this.playerId).removeScreenNode(nodeId);
    };

	this.getScreenNodeProperty = function(id,property){ 
		return imPlayerInstances.getFlashInstance(this.playerId).getScreenNodeProperty(id,property);
	};

	this.setScreenNodeProperty = function(id,property,value){ 
		imPlayerInstances.getFlashInstance(this.playerId).setScreenNodeProperty(id,property,value);
	};

	this.setScreenNodeOrder = function(id,order){
		imPlayerInstances.getFlashInstance(this.playerId).setScreenNodeOrder(id,order);
	};
		
	this.addSequence = function(frameClassName){
		return imPlayerInstances.getFlashInstance(this.playerId).addSequence(frameClassName);
	};
	
	this.createSequencesFromXml = function(xml){
		return imPlayerInstances.getFlashInstance(this.playerId).createSequencesFromXml(xml);
	};
	
	this.createSequencesFromJson = function(json){
		return imPlayerInstances.getFlashInstance(this.playerId).createSequencesFromJson(json);
	};

	this.getSequenceManagerProperty = function(property){
		return imPlayerInstances.getFlashInstance(this.playerId).getSequenceManagerProperty(property);
	};

	this.removeSequence = function(seqId){
		imPlayerInstances.getFlashInstance(this.playerId).removeSequence(seqId);
	};
	
	this.clearSequences = function(seqId){
		imPlayerInstances.getFlashInstance(this.playerId).clearSequences();
	};

	this.attachSequenceTarget = function(seqId,targetType,targetId){
		return imPlayerInstances.getFlashInstance(this.playerId).attachSequenceTarget(seqId,targetType,targetId);
	};
	
	this.getSequenceProperty = function(seqId,name){
		return imPlayerInstances.getFlashInstance(this.playerId).getSequenceProperty(seqId,name);
	};
	
	this.setSequenceProperty = function(seqId,name,value){
		imPlayerInstances.getFlashInstance(this.playerId).setSequenceProperty(seqId,name,value);
	};
	
	this.addSequenceFrame = function(seqId,time){
		return imPlayerInstances.getFlashInstance(this.playerId).addSequenceFrame(seqId,time);
	};
	
	this.removeSequenceFrame = function(seqId,frameId){
		imPlayerInstances.getFlashInstance(this.playerId).removeSequenceFrame(seqId,frameId);
	};
	
	this.getSequenceFrameProperty = function(seqId,frameId,name){
		return imPlayerInstances.getFlashInstance(this.playerId).getSequenceFrameProperty(seqId,frameId,name);
	};
	
	this.setSequenceFrameProperty = function(seqId,frameId,name,value){
		imPlayerInstances.getFlashInstance(this.playerId).setSequenceFrameProperty(seqId,frameId,name,value);
	};

	
	this.onCameraChange = function(e){};
	this.onCameraMotionStarted = function(e){};
	this.onCameraMotionEnded = function(e){};
	this.onScreenRotationChange = function(e){};
	this.onMediaLoaded = function(e){};
	this.onMediaLoadFailed = function(e){};
	this.onVideoEvent = function(e){};
	this.onVideoMetaDataEvent = function(e){};
	this.onScenePluginLoaded = function(e){};
	this.onScreenNodeMouseOver = function(e){};
	this.onScreenNodeMouseOut = function(e){};
	this.onScreenNodeMouseClick = function(e){};
	this.onMediaClick = function(e){};
	this.onTimeSequenceAdded = function(e){};
	this.onTimeSequenceRemoved = function(e){};
	this.onTimeSequenceLoaded = function(e){};
	this.onTimeSequenceFrameAdded = function(e){};
	this.onTimeSequenceFrameRemoved = function(e){};
	
    //--------------------------------------------------------------------------------
    // Scene Support - GEO:BASIC
    //--------------------------------------------------------------------------------
    this.setLocation = function(longitude,latitude,altitude){
    	imPlayerInstances.getFlashInstance(this.playerId).setLocation(longitude,latitude,altitude);
    };

    this.getLocation = function(){
    	return imPlayerInstances.getFlashInstance(this.playerId).getLocation();
    };
    
    this.addGeoNode = function(type,parentId){
    	return imPlayerInstances.getFlashInstance(this.playerId).addGeoNode(type,parentId);
    };
    
    this.removeGeoNode = function(nodeId){
    	return imPlayerInstances.getFlashInstance(this.playerId).removeGeoNode(nodeId);
    };
    
    this.clearGeoNodes = function(nodeId){
    	return imPlayerInstances.getFlashInstance(this.playerId).clearGeoNodes();
    };

	this.getGeoNodeProperty = function(id,property){ 
		return imPlayerInstances.getFlashInstance(this.playerId).getGeoNodeProperty(id,property);
	};

	this.setGeoNodeProperty = function(id,property,value){ 
		return imPlayerInstances.getFlashInstance(this.playerId).setGeoNodeProperty(id,property,value);
	};

	this.getGeoNodeUserProperty = function(id,property){ 
		return imPlayerInstances.getFlashInstance(this.playerId).getGeoNodeUserProperty(id,property);
	};

	this.setGeoNodeUserProperty = function(id,property,value){ 
		return imPlayerInstances.getFlashInstance(this.playerId).setGeoNodeUserProperty(id,property,value);
	};

	this.geoPlugLoadPlugin = function(id,name,swfUrl){
		imPlayerInstances.getFlashInstance(this.playerId).geoPlugLoadPlugin(id,name,swfUrl);
	};
	
	this.geoPlugCall = function(){ 
		return imPlayerInstances.getFlashInstance(this.playerId).geoPlugCall(arguments[0],imUtils.argsToArray(arguments,1));
	};

	this.geoPlugGetProperty = function(id,property){ 
		return imPlayerInstances.getFlashInstance(this.playerId).geoPlugGetProperty(id,property);
	};

	this.geoPlugSetProperty = function(id,property,value){ 
		imPlayerInstances.getFlashInstance(this.playerId).geoPlugSetProperty(id,property,value);
	};

	this.geoLineAddPointXyz = function(id,x,y,z){
		imPlayerInstances.getFlashInstance(this.playerId).geoLineAddPointXyz(id,x,y,z);
	};
	
	this.geoLineAddPointGeo = function(id,longitude,latitude,altitude){
		imPlayerInstances.getFlashInstance(this.playerId).geoLineAddPointGeo(id,longitude,latitude,altitude);
	};

	this.cameraLookAtGeo = function(longitude,latitude,altitude,fov,time){
		imPlayerInstances.getFlashInstance(this.playerId).cameraLookAtGeo(longitude,latitude,altitude,fov>0?fov:NaN,time>0?time:0);
	};

	this.addGeoTrackSequenceFrame = function(time, lat, lng, alt, heading, pitch, roll){
		imPlayerInstances.getFlashInstance(this.playerId).addGeoTrackSequenceFrame(time, lat, lng, alt, heading, pitch, roll);
	};

	this.clearGeoTrackSequence = function(){
		imPlayerInstances.getFlashInstance(this.playerId).clearGeoTrackSequence();
	};

	this.onLocationChange = function(e){};
	this.onGeoNodeBeingAdded = function(e){ return true; };
	this.onGeoNodeRemoved = function(e){};
	this.onGeoNodeMouseOver = function(e){};
	this.onGeoNodeMouseOut = function(e){};
	this.onGeoNodeMouseClick = function(e){};
	this.onGeoPlugPluginLoaded = function(e){};
	this.onGeoPlugSwfLoaded = function(e){};
	this.onGeoPlugPluginLoadFailed = function(e){};

    //--------------------------------------------------------------------------------
    // Scene Support -  MEDIASTORE:GEO
    //--------------------------------------------------------------------------------
	this.queryMsScene = function(){ 
		imPlayerInstances.getFlashInstance(this.playerId).queryMsScene(imUtils.argsToArray(arguments)); 
	};

	this.loadMsScene = function(url){ 
		imPlayerInstances.getFlashInstance(this.playerId).loadMsScene(url); 
	};

	this.loadVideoBySourceId = function(sourceId){ 
		imPlayerInstances.getFlashInstance(this.playerId).loadVideoBySourceId(sourceId); 
	};

	this.setRequestParam = function(requestName, name, value){ 
		imPlayerInstances.getFlashInstance(this.playerId).setRequestParam(requestName, name, value);
	};

	this.getRequestParam = function(requestName, name, value){ 
		return imPlayerInstances.getFlashInstance(this.playerId).getRequestParam(requestName, name);
	};

	this.setCustomerKey = function(key){ 
		imPlayerInstances.getFlashInstance(this.playerId).setCustomerKey(key);
	};

	this.getCustomerKey = function(){ 
		return imPlayerInstances.getFlashInstance(this.playerId).getCustomerKey();
	};

	this.setMediaStoreUrl = function(url){ 
		imPlayerInstances.getFlashInstance(this.playerId).setMediaStoreUrl(url);
	};

	this.getMediaStoreUrl = function(){ 
		return imPlayerInstances.getFlashInstance(this.playerId).getMediaStoreUrl();
	};
	
	this.setNavigationMarker = function(type,normal,hover,scale,projection){
		imPlayerInstances.getFlashInstance(this.playerId).setNavigationMarker(type,normal,hover,scale,projection);
	};
	
	this.setSceneLoadAttribute = function(name,value){ 
		imPlayerInstances.getFlashInstance(this.playerId).setSceneLoadAttribute(name,value);
	};

	this.getSceneLoadAttribute = function(name){ 
		return imPlayerInstances.getFlashInstance(this.playerId).getSceneLoadAttribute(name);
	};
		
	this.getNearestStillGroupCount = function(){
		return imPlayerInstances.getFlashInstance(this.playerId).getNearestStillGroupCount();
	};
	
	this.getNearestStillGroup = function(groupIndex){
		return imPlayerInstances.getFlashInstance(this.playerId).getNearestStillGroup(groupIndex);
	};

	this.getNearestStill = function(groupIndex,stillIndex){
		return imPlayerInstances.getFlashInstance(this.playerId).getNearestStill(groupIndex,stillIndex);
	};

	this.getAddress = function(){
		return imPlayerInstances.getFlashInstance(this.playerId).getAddress();
	};

	this.setAddress = function(number,street,city,state,zip){
		imPlayerInstances.getFlashInstance(this.playerId).setAddress(number,street,city,state,zip);
	};

	this.onSceneLoaded = function(e){};
	this.onSourceRouteLoaded = function(e){};
	
    //--------------------------------------------------------------------------------
    // Constructor
    //--------------------------------------------------------------------------------
    this.playerId = imPlayerInstances.addPlayerInstance(this);
	this.parent = element;
    this.isLoaded = false;
    this.sceneType = null;

}


//--------------------------------------------------------------------------------
// Events from the Flash Player
//--------------------------------------------------------------------------------
/**
* @private
*/
function player_onLoad(playerId, e) {
	var player = imPlayerInstances.getPlayer(playerId);
	player.isLoaded = true;
	player.onLoad(e[0]);
}

/**
* @private
*/
function player_onSizeChanged(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onSizeChanged(e[0]);
}

/**
* @private
*/
function player_onSceneLoaded(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onSceneLoaded(e[0]);
}

/**
* @private
*/
function player_onScenePushed(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onScenePushed(e[0]);
}

/**
* @private
*/
function player_onScenePopped(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onScenePopped(e[0]);
}

/**
* @private
*/
function player_onSceneActivated(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	e = e[0];	
	player.sceneType = e.type;
	player.onSceneActivated(e);
}

/**
* @private
*/
function player_onSceneDeactivated(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	e = e[0];	
	player.sceneType = e.type;
	player.onSceneDeactivated(e);
}

/**
* @private
*/
function player_sceneTransitionComplete(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	e = e[0];	
	player.sceneType = e.type;
	player.onSceneTransitionCompleted(e);
}

/**
* @private
*/
function player_onCameraChange(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onCameraChange(e[0]);
}

/**
* @private
*/
function player_onScreenRotationChange(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onScreenRotationChange(e[0]);
}

/**
* @private
*/
function player_cameraMotionStarted(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onCameraMotionStarted(e[0]);
}

/**
* @private
*/
function player_cameraMotionEnded(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onCameraMotionEnded(e[0]);
}

/**
* @private
*/
function player_onLocationChange(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onLocationChange(e[0]);
}

/**
* @private
*/
function player_loadingNewScene(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	return player.onLoadingNewScene(e[0]);
}

/**
* @private
*/
function player_mediaLoaded(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	return player.onMediaLoaded(e[0]);
}

/**
* @private
*/
function player_videoEvent(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	return player.onVideoEvent(e[0]);
}

/**
* @private
*/
function player_sceneEvent(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	return player.onSceneEvent(e[0]);
}

/**
* @private
*/
function player_videoMetaDataEvent(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	return player.onVideoMetaDataEvent(e[0]);
}

/**
* @private
*/
function player_mediaLoadFailed(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	return player.onMediaLoadFailed(e[0]);
}

/**
* @private
*/
function player_geoNodeBeingAdded(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	return player.onGeoNodeBeingAdded(e[0]);
}

/**
* @private
*/
function player_geoNodeRemoved(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onGeoNodeRemoved(e[0]);
}

/**
* @private
*/
function player_executeScript(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	eval(e[0]);
}

/**
* @private
*/
function player_geoNodeMouseOver(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onGeoNodeMouseOver(e[0]);
}

/**
* @private
*/
function player_geoNodeMouseOut(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onGeoNodeMouseOut(e[0]);
}

/**
* @private
*/
function player_geoNodeMouseClick(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onGeoNodeMouseClick(e[0]);
}

/**
* @private
*/
function player_geoPlugPluginLoaded(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onGeoPlugPluginLoaded(e[0]);
}

/**
* @private
*/
function player_geoPlugSwfLoaded(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onGeoPlugSwfLoaded(e[0]);
}

/**
* @private
*/
function player_geoPlugPluginLoadFailed(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onGeoPlugPluginLoadFailed(e[0]);
}

/**
* @private
*/
function player_pluginLoaded(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onPluginLoaded(e[0]);
}

/**
* @private
*/
function player_scenePluginLoaded(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onScenePluginLoaded(e[0]);
}

/**
* @private
*/
function player_screenNodeMouseOver(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onScreenNodeMouseOver(e[0]);
}

/**
* @private
*/
function player_screenNodeMouseOut(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onScreenNodeMouseOut(e[0]);
}

/**
* @private
*/
function player_screenNodeMouseClick(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onScreenNodeMouseClick(e[0]);
}

/**
* @private
*/
function player_mediaClicked(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onMediaClick(e[0]);
}

/**
* @private
*/
function player_configLoaded(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onConfigLoaded(e[0]);
}

/**
* @private
*/
function player_sceneConfigLoaded(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onSceneConfigLoaded(e[0]);
}

/**
* @private
*/
function player_timeSequenceAdded(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onTimeSequenceAdded(e[0]);
}

/**
* @private
*/
function player_timeSequenceRemoved(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onTimeSequenceRemoved(e[0]);
}

/**
* @private
*/
function player_timeSequenceLoaded(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onTimeSequenceLoaded(e[0]);
}

/**
* @private
*/
function player_timeSequenceFrameAdded(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onTimeSequenceFrameAdded(e[0]);
}

/**
* @private
*/
function player_timeSequenceFrameRemoved(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onTimeSequenceFrameRemoved(e[0]);
}

/**
* @private
*/
function player_sourceRouteLoaded(playerId, e){
	var player = imPlayerInstances.getPlayer(playerId);
	player.onSourceRouteLoaded(e[0]);
}


//------------------------------------------------------------------------------------
// Flash Embed Support
//------------------------------------------------------------------------------------
// Version of Flash required
var requiredMajorVersion = 11;
var requiredMinorVersion = 1;
var requiredRevision = 0;

/**
* @private
*/
function AC_GenerateobjString(objAttrs, params, embedAttrs) {
    var str = '';
    if (isIE && isWin && !isOpera) {
        var i;

        str += '<object ';
        for (i in objAttrs)
            str += i + '="' + objAttrs[i] + '" ';
        str += '>';
        for (i in params)
            str += '<param name="' + i + '" value="' + params[i] + '" /> ';
        str += '</object>';
    } else {
        str += '<embed ';
        for (i in embedAttrs)
            str += i + '="' + embedAttrs[i] + '" ';
        str += '> </embed>';
    }

    return str;
}

/**
* @private
*/
function AC_FL_RunContentString() {
    var ret =
    AC_GetArgs
    (arguments, ".swf", "movie", "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
     , "application/x-shockwave-flash"
    );
    return AC_GenerateobjString(ret.objAttrs, ret.params, ret.embedAttrs);
}

/**
* @private
*/
function InsertPlayerString(id, width, height, windowMode, configPath, playerPath) {

	playerPath = playerPath==null ? '' : playerPath;
	
    var Id = id;

    var hasProductInstall = DetectFlashVer(6, 0, 65);
    var hasRequestedVersion = DetectFlashVer(requiredMajorVersion, requiredMinorVersion, requiredRevision);
    var Result = "";
    //var Result = "<script language='javascript'>";

    // Check to see if a player with Flash Product Install is available and the version does not meet the requirements for playback
    if (hasProductInstall && !hasRequestedVersion) {
        // MMdoctitle is the stored document.title value used by the installation process to close the window that started the process
        // This is necessary in order to close browser windows that are still utilizing the older version of the player after installation has completed
        // DO NOT MODIFY THE FOLLOWING FOUR LINES
        // Location visited after installation is complete if installation is required
        var MMPlayerType = (isIE == true) ? "ActiveX" : "PlugIn";
        var MMredirectURL = window.location;
        document.title = document.title.slice(0, 47) + " - Flash Player Installation";
        var MMdoctitle = document.title;

        Result += AC_FL_RunContentString(
					"src", playerPath + "playerProductInstall",
					"base", playerPath,
					"FlashVars", "MMredirectURL=" + MMredirectURL + '&MMplayerType=' + MMPlayerType + '&MMdoctitle=' + MMdoctitle + "",
					"width", width,
					"height", height,
					"align", "middle",
					"id", Id,
					"name", Id,
					"quality", "high",
					"allowFullScreen", "true",
					"menu", "false",
					"bgcolor", "#000000",
					"allowScriptAccess", "always",
					"type", "application/x-shockwave-flash",
					"pluginspage", "http://www.adobe.com/go/getflashplayer"
					);

    } else if (hasRequestedVersion) {
        // if we've detected an acceptable version
        // embed the Flash Content SWF when all tests are passed
        Result += AC_FL_RunContentString(
						"src", playerPath + "IMPlayer3",
						"base", playerPath,
						"width", width,
						"height", height,
						"align", "middle",
						"id", Id,
						"name", Id,
						"quality", "high",
						"allowFullScreen", "true",
						"menu", "false",
						"bgcolor", "#000000",
						"flashvars", "playerid=" + Id + ((configPath==null)?"":"&config=" + configPath),
						"allowScriptAccess", "always",
						"type", "application/x-shockwave-flash",
						"pluginspage", "http://www.adobe.com/go/getflashplayer",
						"wmode", windowMode					
						);

    } else {  // flash is too old or we can't detect the plugin
        Result = 'Alternate HTML content should be placed here. ' +
					'This content requires the Adobe Flash Player. ' +
					'<a href=http://www.adobe.com/go/getflash/>Get Flash</a>';
    }

    //Result += "</script>";

    Result += "<noscript>" +
				"<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' " +
				"id='" + Id + "' width='" + width + "' height='" + height + "' align='center' " +
				"codebase='http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab'>" +
				"<param name='movie' value='" + playerPath + "IMPlayer3.swf'/>" +
				"<param name='quality' value='high'/>" +
				"<param name='bgcolor' value='#000000'/>" +
				"<param name='wmode' value='" + windowMode + "'/>" +
				"<param name='allowScriptAccess' value='always'/>" +
				"<embed src='" + playerPath + "IMPlayer3.swf' quality='high' bgcolor='#000000' " +
				"width='" + width + "' height='" + height + "' name='" + Id + "' align='middle' " +
				((configPath==null)?"":"config='" + configPath + "'") +
				"play='true' " +
				"loop='false' " +
				"quality='high'	 " +
				"allowScriptAccess='always' " +
				"allowFullScreen='true' " +
				"menu='false' " +
				"type='application/x-shockwave-flash' " +
				"pluginspage='http://www.adobe.com/go/getflashplayer'>" +
				"base='" + playerPath + "' " +
				"</embed>" +
				"</object>" +
				"</noscript>";

    return Result;
}



//-------------------------------------------------------------------------------------
//Adobe AC_OETags.js included for simplicity
//-------------------------------------------------------------------------------------
//Flash Player Version Detection - Rev 1.6
//Detect Client Browser type
//Copyright(c) 2005-2006 Adobe Macromedia Software, LLC. All rights reserved.
var isIE = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
var isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
var isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;

/**
* @private
*/
function ControlVersion() {
    var version;
    var axo;
    var e;

    // NOTE : new ActiveXObject(strFoo) throws an exception if strFoo isn't in the registry

    try {
        // version will be set for 7.X or greater players
        axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
        version = axo.GetVariable("$version");
    } catch (e) {
    }

    if (!version) {
        try {
            // version will be set for 6.X players only
            axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");

            // installed player is some revision of 6.0
            // GetVariable("$version") crashes for versions 6.0.22 through 6.0.29,
            // so we have to be careful. 

            // default to the first public version
            version = "WIN 6,0,21,0";

            // throws if AllowScripAccess does not exist (introduced in 6.0r47)		
            axo.AllowScriptAccess = "always";

            // safe to call for 6.0r47 or greater
            version = axo.GetVariable("$version");

        } catch (e) {
        }
    }

    if (!version) {
        try {
            // version will be set for 4.X or 5.X player
            axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
            version = axo.GetVariable("$version");
        } catch (e) {
        }
    }

    if (!version) {
        try {
            // version will be set for 3.X player
            axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
            version = "WIN 3,0,18,0";
        } catch (e) {
        }
    }

    if (!version) {
        try {
            // version will be set for 2.X player
            axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
            version = "WIN 2,0,0,11";
        } catch (e) {
            version = -1;
        }
    }

    return version;
}

//JavaScript helper required to detect Flash Player PlugIn version information
/**
* @private
*/
function GetSwfVer() {
    // NS/Opera version >= 3 check for Flash plugin in plugin array
    var flashVer = -1;

    if (navigator.plugins != null && navigator.plugins.length > 0) {

        if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) {

            var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
            var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;
            var descArray = flashDescription.split(" ");
            var tempArrayMajor = descArray[2].split(".");
            var versionMajor = tempArrayMajor[0];
            var versionMinor = tempArrayMajor[1];
            var versionRevision = descArray[3];

            if (versionRevision == "") {
                versionRevision = descArray[4];
            }

            if (versionRevision[0] == "d") {
                versionRevision = versionRevision.substring(1);
            } else if (versionRevision[0] == "r") {
                versionRevision = versionRevision.substring(1);

                if (versionRevision.indexOf("d") > 0) {
                    versionRevision = versionRevision.substring(0, versionRevision.indexOf("d"));
                }
            }

            flashVer = versionMajor + "." + versionMinor + "." + versionRevision;
        }
    }
    // MSN/WebTV 2.6 supports Flash 4
    else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.6") != -1) flashVer = 4;
    // WebTV 2.5 supports Flash 3
    else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.5") != -1) flashVer = 3;
    // older WebTV supports Flash 2
    else if (navigator.userAgent.toLowerCase().indexOf("webtv") != -1) flashVer = 2;
    else if (isIE && isWin && !isOpera) {
        flashVer = ControlVersion();
    }

    return flashVer;
}

//When called with reqMajorVer, reqMinorVer, reqRevision returns true if that version or greater is available
/**
* @private
*/
function DetectFlashVer(reqMajorVer, reqMinorVer, reqRevision) {
    versionStr = GetSwfVer();
    if (versionStr == -1) {
        return false;
    } else if (versionStr != 0) {
        if (isIE && isWin && !isOpera) {
            // Given "WIN 2,0,0,11"
            tempArray = versionStr.split(" "); 	// ["WIN", "2,0,0,11"]
            tempString = tempArray[1]; 		// "2,0,0,11"
            versionArray = tempString.split(","); // ['2', '0', '0', '11']
        } else {
            versionArray = versionStr.split(".");
        }
        var versionMajor = versionArray[0];
        var versionMinor = versionArray[1];
        var versionRevision = versionArray[2];

        // is the major.revision >= requested major.revision AND the minor version >= requested minor
        if (versionMajor > parseFloat(reqMajorVer)) {
            return true;
        } else if (versionMajor == parseFloat(reqMajorVer)) {
            if (versionMinor > parseFloat(reqMinorVer))
                return true;
            else if (versionMinor == parseFloat(reqMinorVer)) {
                if (versionRevision >= parseFloat(reqRevision))
                    return true;
            }
        }
        return false;
    }
}

/**
* @private
*/
function AC_AddExtension(src, ext) {
    if (src.indexOf('?') != -1)
        return src.replace(/\?/, ext + '?');
    else
        return src + ext;
}

/**
* @private
*/
function AC_Generateobj(objAttrs, params, embedAttrs) {
    
    var str = '';
    var i;
    
    if (isIE && isWin && !isOpera) {
        str += '<object ';

        for (i in objAttrs)
            str += i + '="' + objAttrs[i] + '" ';

        str += '>';

        for (i in params)
            str += '<param name="' + i + '" value="' + params[i] + '" /> ';

        str += '</object>';
    } else {

        str += '<embed ';

        for (i in embedAttrs)
            str += i + '="' + embedAttrs[i] + '" ';

        str += '> </embed>';
    }

    document.write(str);
}

/**
* @private
*/
function AC_FL_RunContent() {

    var ret =
    AC_GetArgs
    (arguments, ".swf", "movie", "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
      , "application/x-shockwave-flash"
    );

    AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}

/**
* @private
*/
function AC_GetArgs(args, ext, srcParamName, classid, mimeType) {

    var ret = new Object();
    ret.embedAttrs = new Object();
    ret.params = new Object();
    ret.objAttrs = new Object();

    for (var i = 0; i < args.length; i = i + 2) {

        var currArg = args[i].toLowerCase();

        switch (currArg) {
            case "classid":
                break;
            case "pluginspage":
                ret.embedAttrs[args[i]] = args[i + 1];
                break;
            case "src":
            case "movie":
                args[i + 1] = AC_AddExtension(args[i + 1], ext);
                ret.embedAttrs["src"] = args[i + 1];
                ret.params[srcParamName] = args[i + 1];
                break;
            case "onafterupdate":
            case "onbeforeupdate":
            case "onblur":
            case "oncellchange":
            case "onclick":
            case "ondblClick":
            case "ondrag":
            case "ondragend":
            case "ondragenter":
            case "ondragleave":
            case "ondragover":
            case "ondrop":
            case "onfinish":
            case "onfocus":
            case "onhelp":
            case "onmousedown":
            case "onmouseup":
            case "onmouseover":
            case "onmousemove":
            case "onmouseout":
            case "onkeypress":
            case "onkeydown":
            case "onkeyup":
            case "onload":
            case "onlosecapture":
            case "onpropertychange":
            case "onreadystatechange":
            case "onrowsdelete":
            case "onrowenter":
            case "onrowexit":
            case "onrowsinserted":
            case "onstart":
            case "onscroll":
            case "onbeforeeditfocus":
            case "onactivate":
            case "onbeforedeactivate":
            case "ondeactivate":
            case "type":
            case "codebase":
                ret.objAttrs[args[i]] = args[i + 1];
                break;
            case "id":
            case "width":
            case "height":
            case "align":
            case "vspace":
            case "hspace":
            case "class":
            case "title":
            case "accesskey":
            case "name":
            case "tabindex":
                ret.embedAttrs[args[i]] = ret.objAttrs[args[i]] = args[i + 1];
                break;
            default:
                ret.embedAttrs[args[i]] = ret.params[args[i]] = args[i + 1];
        }
    }

    ret.objAttrs["classid"] = classid;

    if (mimeType)
        ret.embedAttrs["type"] = mimeType;

    return ret;
}


