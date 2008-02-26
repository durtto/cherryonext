// $Id$

Ext.namespace('Ext.ux.netbox.string');

/** Create a new TextFieldOperator
  * @constructor
  * @extends Ext.ux.netbox.core.Operator
  * @class This is the class that implements an operator that wants always a TextField
  * even if availableValues are available.
  */
Ext.ux.netbox.string.TextFieldOperator = function(id,label) {

  Ext.ux.netbox.string.TextFieldOperator.superclass.constructor.call(this,id,label);

  /** With this operator I want always a TextField, even if there are available values
    * This is the variable that contains the editor
    * @property {Ext.Editor} editor
    */
  this.editor=null;
};

Ext.extend(Ext.ux.netbox.string.TextFieldOperator,Ext.ux.netbox.core.Operator,/** @scope Ext.ux.netbox.string.TextFieldOperator.prototype */
{
  /** This method always returns a Ext.ux.netbox.core.TextValuesEditor as editor.
    * @param {boolean} cache true to use a cached editor if available, and to put the newly created editor in the cache if not available, false otherwise. The default is true
    * @return {Ext.ux.netbox.core.TextValuesEditor} The editor used to edit the values associated to this operator
    */
  getEditor: function(cache){
    if(cache===undefined){
      cache=true;
    }
    var editor;
    if(this.editor===undefined || this.editor===null || !cache){
      editor=new Ext.ux.netbox.core.TextValuesEditor();
      if(cache){
        this.editor=editor;
      }
    } else {
      editor=this.editor;
    }
    return(editor);
  }
});