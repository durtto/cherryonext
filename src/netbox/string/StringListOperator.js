// $Id$

Ext.namespace('Ext.ux.netbox.string');

/** It instantiates a new StringListOperator
  * @class This is the class that implements an operator that allows the choice of more than one value (from a list)
  * @constructor
  * @extends Ext.ux.netbox.core.Operator
  * @param {String} id The id of the operator.
  * @param {String} label The label of the operator.
  */
Ext.ux.netbox.string.StringListOperator = function(id,label) {
  Ext.ux.netbox.string.StringListOperator.superclass.constructor.call(this,id,label);
  /** With this operator I want always a combo with multiple choice. The editor that implements the behaviour is Ext.ux.netbox.core.AvailableValuesEditor
    * If available values are not available (isAvailableValuesAvailable  returns false) an exception is thrown
    * @property {Ext.Editor} editor
    */
  this.editor=null;
}

Ext.extend(Ext.ux.netbox.string.StringListOperator,Ext.ux.netbox.core.Operator,/** @scope Ext.ux.netbox.string.StringListOperator.prototype */{
  /** This method creates an Ext.ux.netbox.core.AvailableValuesEditor as editor.
    * @param {String} operatorId The operatorId actually used in the filter
    * @return {Ext.Editor} The field used to edit the values of this filter
    */
  createEditor: function(operatorId){
    var editor=new Ext.ux.netbox.core.AvailableValuesEditor(this.getField().getAvailableValues(),this.isStoreRemote(),this.isForceReload(),{multiSelect: true});
    return editor;
  }
});