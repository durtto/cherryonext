// $Id: StringListOperator.js 301942 2008-02-12 13:24:41Z SO000377 $

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
    * If available values are not available ( isAvailableValuesAvailable  returns false) an exception is thrown
    * @property {Ext.Editor} editor
    */
  this.editor=null;
}

Ext.extend(Ext.ux.netbox.string.StringListOperator,Ext.ux.netbox.core.Operator,/** @scope Ext.ux.netbox.string.StringListOperator.prototype */{

  /** It returns an Ext.ux.netbox.core.AvailableValuesField, with more than one choice
    * If available values are not available ( isAvailableValuesAvailable  returns false) an exception is thrown
    * @param {boolean} cache true to use a cached editor if available, and to put the newly created editor in the cache if not available, false otherwise. The default is true
    * @return {Ext.ux.netbox.core.AvailableValuesEditor} The editor to use
    * @throws {String} When no availableValues are available
    */
  getEditor:function(cache){
    if(cache===undefined){
      cache=true;
    }
    var editor;
    if(this.editor===undefined || this.editor===null || !cache){
      if(!this.isAvailableValuesAvailable()){
        throw("This operator is availble only if there are available values");
      }
      editor=new Ext.ux.netbox.core.AvailableValuesEditor(this.getField().getAvailableValues(),this.isStoreRemote(),{multiSelect: true});
      if(cache){
        this.editor=editor;
      }
    } else {
      editor=this.editor;
    }
    return(editor);
  }
});