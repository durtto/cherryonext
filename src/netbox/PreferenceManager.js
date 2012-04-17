// $Id$

/** Creates a new PreferenceManager.
  * @constructor
  * @extends Ext.util.Observable
  * @param {Object} config An object which may contain the following properties:<ul>
  * <li><b>id</b> : String<p style="margin-left:1em">The id of preference manager. A preference is unambiguously identified by id, userName and the name of the preference</p></li>
  * <li><b>userName</b> : String<p style="margin-left:1em">The userName that owns the preferences. A preference is unambiguously identified by id, userName and the name of the preference</p></li>
  * <li><b>getFn</b> : Function<p style="margin-left:1em">The function used to extract from the application the preferences to save</p></li>
  * <li><b>setFn</b> : Function<p style="margin-left:1em">The function used to apply to the application the preferences as returned by getFn</p></li>
  * <li><b>fnScope</b> : Object<p style="margin-left:1em">The scope of the getFn and setFn functions. Optional. If not present window is used</p></li>
  * <li><b>getAllPrefURL</b> : String<p style="margin-left:1em">The URL used to get all the preferences by user. It loads a Store, using a JsonReader as reader.
  * This URL corresponds to a web page that loads a range of preferences for the given user and id. It must be called with the following parameters:
  * <ul>
  *   <li><b>id</b> : String<p style="margin-left:1em">The id of the preference manager</p></li>
  *   <li><b>userName</b> : String<p style="margin-left:1em">The name of the user using the application</p></li>
  *   <li><b>start</b> : Number<p style="margin-left:1em">The first preference in the range of preferences to return</p></li>
  *   <li><b>limit</b> : Number<p style="margin-left:1em">The The number of preferences to return</p></li>
  * </ul>
  * The page must return a json encoded object in the following format:
  * <PRE>
  * {totalCount: &lt;total number of the preferences&gt;, 
  *   preferences:[
  *     {prefId   : &lt;id of the preference&gt;,
  *      prefName : &lt;name of the preference&gt;,
  *      prefDesc : &lt;the description of the preference&gt;,
  *      isDefault: &lt;true if default, false otherwise&gt;},
  *     {.....}
  *    ]
  *  }
  * </PRE>
  * </p></li>
  * <li><b>applyDefaultPrefURL</b> : String<p style="margin-left:1em">The URL used to apply the default preference.
  * This URL corresponds to a web page that returns the default preference for the given user and id. It must be called with the following parameters:
  * <ul>
  *   <li><b>id</b> : String<p style="margin-left:1em">The id of the preference manager</p></li>
  *   <li><b>userName</b> : String<p style="margin-left:1em">The name of the user using the application</p></li>
  * </ul>
  * The page returns the preference in the same format saved by method savePreference and then it's applied. If there is no default preference the response text must be empty.
  * </p></li>
  * <li><b>loadPrefURL</b> : String<p style="margin-left:1em">The URL used to load a specified preference.
  * This URL corresponds to a web page that returns the selected preference for the given user and id. It must be called with the following parameters:
  * <ul>
  *   <li><b>id</b> : String<p style="margin-left:1em">The id of the preference manager</p></li>
  *   <li><b>userName</b> : String<p style="margin-left:1em">The name of the user using the application</p></li>
  *   <li><b>prefId</b> : String<p style="margin-left:1em">The id of the selected preference</p></li>
  * </ul>
  * The page returns the preference in the same format saved by method savePreference and then it's applied.
  * </p></li>
  * <li><b>savePrefURL</b> : String<p style="margin-left:1em">The URL used to save a preference with a given name.
  * This URL must be called with the following parameters:
  * <ul>
  *   <li><b>id</b> : String<p style="margin-left:1em">The id of the preference manager</p></li>
  *   <li><b>userName</b> : String<p style="margin-left:1em">The name of the user using the application</p></li>
  *   <li><b>prefId</b> : String<p style="margin-left:1em">The id of the selected preference.
  *   If the value exist means that there is an update, otherwise is an insertion </p></li>
  *   <li><b>prefName</b> : String<p style="margin-left:1em">Name of the preference to save</p></li>
  *   <li><b>prefDesc</b> : String<p style="margin-left:1em">Description of the preference to save</p></li>
  *   <li><b>prefValue</b> : String<p style="margin-left:1em">Value of the preference to save, encoded Json</p></li>
  *   <li><b>isDefault</b> : boolean<p style="margin-left:1em">True if it's default preference, false otherwise</p></li>
  * </ul>
  * </p></li>
  * <li><b>deletePrefURL</b> : String<p style="margin-left:1em">The URL used to delete one or more selected preferences.
  * This URL must be called with the following parameters:
  * <ul>
  *   <li><b>id</b> : String<p style="margin-left:1em">The id of the preference manager</p></li>
  *   <li><b>userName</b> : String<p style="margin-left:1em">The name of the user using the application</p></li>
  *   <li><b>prefIdArray</b> : [String]<p style="margin-left:1em">Array of preference's Id to delete</p></li>
  * </ul>
  * </p></li>
  * @class This class manages user preferences. A user preference is a "state" of some objects that the user wants to save with a name. For example, he has a grid,
  *  with the column in a predefined order, with some filters applied, sorted for a certain column. He can bookmark the given situation, and associate a name 
  *  to it. The he can easilly select from that prefeences, and the grid is back to the state he saved. Since only the developer knows what is usefull to bookmark,
  *  the preferenceManager has 2 functions, a getter and a setter. The getter acquires the state to save from the application, the setter reapplies the settings returned by the getter
  *  to come back to the saved state. The only restriction on the returned value of the getter is that it must be json encodable/decodable. 
  *  To load and manage the preferences this class defines 4 ajax interfaces that the application backend must implement (See the constructor for more details)
  *  To signal an error in the backend simply returns an error http status code (for example 500)
  * <h4>Example</h4>
  * This example suppoose that you have a grid with a filter. It saves and restores the filters and the status of the grid (size of the columns, position of the columns, sort state, hidden/visible columns)
  * <pre>
  * var getterFn=function(){
  *   return({grid: grid.getState(),filter: filterModel.getFilterObj()});
  * }
  * var setterFn=function(pref){
  *   //filter
  *   if(pref.filter){
  *     filterModel.setFilterObj(pref.filter);
  *   }
  *   //grid
  *   if(pref.grid){
  *     grid.getView().userResized=true;
  *     grid.applyState(pref.grid);
  *     grid.getColumnModel().setConfig(grid.getColumnModel().config);
  *   }
  * }
  * prefManager=new Ext.ux.netbox.PreferenceManager({
  *   id: 'prefManagerId',
  *   userName: 'user',
  *   getFn: getterFn,
  *   setFn: setterFn,
  *   getAllPrefURL:'http://getAllPrefURL',
  *   applyDefaultPrefURL:'http://applyDefaultPrefURL',
  *   loadPrefURL:'http://loadPrefURL',
  *   savePrefURL:'http://savePrefURL',
  *   deletePrefURL:'http://deletePrefURL'
  * });
  * </pre>
  */
Ext.define('Ext.ux.netbox.PreferenceManager', {
	extend: 'Ext.util.Observable',
	constructor: function(config) {
	  Ext.ux.netbox.PreferenceManager.superclass.constructor.call(this,config);

	  this.addEvents({
	    
	    preferenceSaved: true,
	    
	    preferenceDeleteFailed: true,
	    
	    applyDefaultPreferenceFailed: true,
	    
	    applyPreferenceFailed: true,
	    
	    
	    preferenceSaveFailed: true,
	    
	    
	    preferenceDeleted : true,
	    
	    loadPreferencesFailed: true
	  });
	  
	  this.id=config.id;
	  
	  this.userName=config.userName;
	  
	  this.setFn=config.setFn;
	  
	  this.getFn=config.getFn;
	  
	  this.fnScope=config.fnScope;
	  
	  this.getAllPrefURL=config.getAllPrefURL;
	  
	  this.applyDefaultPrefURL=config.applyDefaultPrefURL;
	  
	  this.loadPrefURL=config.loadPrefURL;
	  
	  this.savePrefURL=config.savePrefURL;
	  
	  this.deletePrefURL=config.deletePrefURL;
  },
	
  getAllPreferences : function(){
    if(this.store === undefined){
      this.store = Ext.create('Ext.data.Store',{
        proxy: Ext.create('Ext.data.HttpProxy',{
          url: this.getAllPrefURL
        }),
        baseParams: {id: this.id, userName: this.userName},
        reader: Ext.create('Ext.data.JsonReader',{
          root: 'preferences',
          totalProperty: 'totalCount',
          fields: [
            'prefId',
            'prefName',
            'prefDesc',
            {name: 'isDefault', type: 'boolean'}
          ]
        })
      });
      this.store.on("exception",this._loadExceptionCbk,this);
      this.store.setDefaultSort('prefName');
    }
    return this.store;
  },
  
  
  _loadExceptionCbk: function(proxy, request, response){
    this.fireEvent("loadPreferencesFailed",response);
  },

  
  applyDefaultPreference : function(){
    Ext.Ajax.request({
       url: this.applyDefaultPrefURL,
       success: Ext.bind(this.applyDefaultPreferenceCbk,this),
       failure: Ext.bind(this.errorFunction,this),
       params: {
         id: this.id,
         userName: this.userName}
    });
  },

  
  applyPreference : function(prefId,prefValue){
    if(prefValue===undefined){
      Ext.Ajax.request({
         url: this.loadPrefURL,
         success: Ext.bind(this.applyPreferenceCbk,this),
         failure: Ext.bind(this.errorFunction,this),
         params: {
           id: this.id,
           userName: this.userName,
           prefId: prefId}
      });
    } else {
      this.setFn.call(this.fnScope,prefValue);
    }
  },
  
  
  applyDefaultPreferenceCbk : function(response,options){
    if(response.responseText!=""){
      this.applyPreferenceCbk(response,options);
    }
  },

  
  applyPreferenceCbk : function(response,options){
    var pref=Ext.JSON.decode(response.responseText);
    this.setFn.call(this.fnScope,pref);
  },

  
  savePreference : function(prefId,prefName,prefDesc,isDefault){
    var values=this.getFn.call(this.fnScope);
    var valueEnc=Ext.JSON.encode(values);
    var cfg={
       url: this.savePrefURL,
       params: {
         id: this.id,
         userName: this.userName,
         prefId: prefId,
         prefName: prefName,
         prefDesc: prefDesc,
         prefValue: valueEnc,
         isDefault: isDefault
       },
       success: Ext.bind(this._onSaveSuccessCbk,this),
       failure: Ext.bind(this._onSaveFailureCbk,this)
    };
    Ext.Ajax.request(cfg);
  },

  
  _onSaveSuccessCbk : function(response,options){
    this.fireEvent('preferenceSaved',options.params.prefId,options.params.prefName);
  },

  
  _onSaveFailureCbk : function(response,options){
    this.fireEvent('preferenceSaveFailed',options.params.prefId, options.params.prefName,response);
  },

  
  deletePreferences : function(prefIdArray){
    var cfg={
       url: this.deletePrefURL,
       params: {
         id: this.id,
         userName: this.userName,
         prefIdArray: prefIdArray
       },
       success: Ext.bind(this._onDeleteSuccessCbk,this),
       failure: Ext.bind(this._onDeleteFailureCbk,this)
    };
    Ext.Ajax.request(cfg);
  },

  
  _onDeleteSuccessCbk : function(response,options){
    this.fireEvent('preferenceDeleted',options.params.prefIdArray);
  },

  
  _onDeleteFailureCbk : function(response,options){
    this.fireEvent('preferenceDeleteFailed',options.params.prefIdArray,response);
  },
  
  
  errorFunction : function(response,options){
    if(options.params.prefId===undefined){
      this.fireEvent('applyDefaultPreferenceFailed',response);
    } else {
      this.fireEvent('applyPreferenceFailed',options.params.prefId,response);
    }
  }

});
