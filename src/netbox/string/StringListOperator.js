// $Id$

/** It instantiates a new StringListOperator
  * @class This is the class that implements an operator that allows the choice of more than one value (from a list)
  * @constructor
  * @extends Ext.ux.netbox.core.Operator
  * @param {String} id The id of the operator.
  * @param {String} label The label of the operator.
  */
Ext.define('Ext.ux.netbox.string.StringListOperator', {
	extend: 'Ext.ux.netbox.core.Operator',
	constructor: function(id,label) {
	  Ext.ux.netbox.string.StringListOperator.superclass.constructor.call(this,id,label);
	  
	  this.editor=null;
	  valFn=function(values){
	    return(this.getField().emptyNotAllowedFn(values));
	  }
	  this.addValidateFn(valFn);
   },
	
  createEditor: function(operatorId){
    var editor=Ext.create('Ext.ux.netbox.core.AvailableValuesEditor',this.getField().getAvailableValues(),{remote: this.isStoreRemote(),forceReload: this.isForceReload(),multiSelect: true,caseSensitive: this.isCaseSensitive()});
    return editor;
  }
  
});
