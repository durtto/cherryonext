// $Id$

Ext.namespace('Ext.ux.netbox.core');

/** This constructor instantiates an editor with an Ext.ux.Andrie.Select to use as editor widget
  * @class This class is used to edit a value of a elementary filter when a set of available values must be shown.
  * The values MUST be in the format [{label:..., value:...}]
  * @constructor
  * @param {Ext.data.Store} store The store used to retrieve the data.
  * It must have 2 columns, label (which will be used as displayField) and value (which will be used as labelField).
  * @config {Object} config See the parameter with the same name of Ext.ux.FilterEditor.
  * Also were added in the config 4 boolean parameters: remote, forceReload,  multiSelect and caseSensitive.
  * config.remote: true if the store is remote, false if the data is local (ie, if store is a Ext.data.SimpleStore). Dafault is false.
  * config.forceReload: true if the store is to be reloaded everytime the combo expands. Dafault is false.
  * config.multiSelect: true if more than one selection is allowed, false for 1. Dafault is false.
  * config.caseSensitive: true if the value should be compared with the store's one with case sensitive. Default is true.
  * @extends Ext.ux.netbox.FilterEditor
  */

Ext.define('Ext.ux.netbox.core.AvailableValuesEditor', {
	extend: 'Ext.ux.netbox.FilterEditor',
	constructor: function(store,config) {
	  if(config==undefined){
		    config={};
		  }
		  var mode='local';
		  if(config.remote==true)
		    mode='remote';
		  if(config.multiSelect==undefined){
		    config.multiSelect=false;
		  }
		  this.fieldCombo=Ext.create('Ext.ux.Andrie.Select',{
		    store         : store,
		    displayField  : 'label',
		    valueField    : 'value',
		    selectOnFocus : true,
		    mode          : mode,
		    triggerAction : 'all',
		    selectOnFocus : true,
		    typeAhead     : true,
		    multiSelect   : config.multiSelect,
		    minChars      : 0
		  });
		  if(!config.multiSelect){
		    this.fieldCombo.on('select',this.completeEditLater,this);
		  }
		  if(config.forceReload){
		    this.fieldCombo.on("beforequery",function(qe){ qe.combo.lastQuery = null; });
		  }
		  if(config.caseSensitive)
		    this.caseSensitive=true;
		  else
		    this.caseSensitive=false;
		  Ext.ux.netbox.core.AvailableValuesEditor.superclass.constructor.call(this,this.fieldCombo,config);
		  this.store=store;
   },

  
  setValue: function(value){
    var val=[];
    var rawVal=[];
    var label='';
    if(value!=undefined && value!=null && Ext.type(value)=="array"){
      if(value.length>0){
        for(var i=0; i< value.length && ((this.fieldCombo.multiSelect) || i<1); i++){
          val.push(value[i].value);
          if(value[i].label!=undefined){
            rawVal.push(value[i].label);
          } else {
            rawVal.push(value[i].value);
          }
        }
      }
    }
    this.originalValue=value;

    Ext.ux.netbox.core.AvailableValuesEditor.superclass.setValue.call(this,val);
    
    Ext.form.ComboBox.superclass.setValue.call(this.fieldCombo,rawVal.join(","));
    this.fieldCombo.value=val;
    this.fieldCombo.rawValueArray=rawVal;
  },
  
  
  completeEditLater: function(){
    var task=Ext.create('Ext.util.DelayedTask',this.completeEdit,this);
    task.delay(0);
  },
  
  
  getValue: function() {
    var val=Ext.ux.netbox.core.AvailableValuesEditor.superclass.getValue.call(this);
    if(Ext.type(val)=='string'){
      val=val.split(',');
    }
    var toReturn=[];
    for(var i=0; i<val.length;i++){
      var j=this.store.find('value',val[i],0,false,this.caseSensitive);
      if(j<0)
        continue;
      var record=this.store.getAt(j);
      toReturn.push({label: record.get('label'), value: val[i]});
    }
    //if the user clicks on the field and then it presses Enter, the store is not loaded...
    if((val.length>0 && val[0]!=="") && toReturn.length==0)
      return(this.originalValue);
    else
      return toReturn;
  }
});
