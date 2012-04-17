// $Id$

/** Create a new TextFieldOperator
  * @constructor
  * @extends Ext.ux.netbox.core.Operator
  * @class This is the class that implements an operator that wants always a TextField
  * even if availableValues are available.
  */
Ext.define('Ext.ux.netbox.string.TextFieldOperator', {
	extend: 'Ext.ux.netbox.core.Operator',
	constructor: function(id,label) {
	  Ext.ux.netbox.string.TextFieldOperator.superclass.constructor.call(this,id,label);

	  this.editor=null;
  },

  createEditor: function(operatorId){
    var editor=Ext.create('Ext.ux.netbox.core.TextValuesEditor');
    return editor;
  }

});
