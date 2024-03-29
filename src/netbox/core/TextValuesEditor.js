// $Id$

/** It creates a new TextValuesEditor. For an error the order of the parameter is reversed because we want the second field to be optional (the default value is a new Ext.form.TextField)
  * @class This class extends Editor to manage an array of {label: originalValue, value: originalValue} as value.
  * It should be used to manage all the form field that doesn't have a value different from the label (for example a TextField or a checkbox,
  * but not a ComboBox where label and value are different)
  * @constructor
  * @param {Object} config The config object. For more info look at the config options of Ext.Editor
  * @param {Ext.form.Field} The field inside the editor. Optional. The default value is a new Ext.form.TextField
  * @extends Ext.ux.netbox.FilterEditor
  */
Ext.define('Ext.ux.netbox.core.TextValuesEditor', {
	extend: 'Ext.ux.netbox.FilterEditor',
	constructor: function(field,config) {
	  if(field==undefined){
		    field=Ext.create('Ext.form.field.Text');
		  }
		  Ext.ux.netbox.core.TextValuesEditor.superclass.constructor.call(this,field,config);
	},
	  /** This method sets the value
	    * @param (Array) value
	    */
  setValue: function(value){
    var val;
    if(value!==undefined && value!==null && Ext.type(value)==="array"){ 
      if(value.length==0){
        val="";
      } else if (value[0].value!==undefined){
        val=value[0].value;
      } else {
        val=value[0];
      }
    } else {
      val="";
    }
    Ext.ux.netbox.FilterEditor.superclass.setValue.call(this,val);
  },

  
  getValue: function() {
    var val=Ext.ux.netbox.FilterEditor.superclass.getValue.call(this);
    if(val===""){
      return([]);
    } else {
      val=[{label: val, value:val}];
    }
    return(val);
  }

});
