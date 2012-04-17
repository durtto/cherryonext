// $Id$

Ext.define('Ext.ux.netbox.string.TextField', {
	extend: 'Ext.form.TextField',
	setValue: function (value) {
	    if (Ext.isArray(value)) {
	       value=value[0];
	    }
	    Ext.ux.netbox.string.TextField.superclass.setValue.call(this,value);
	}
});

/** It creates a new string field
  * @param {String} id The id of the field
  * @param {String} label Optional. The label of the field. If not supplied the id is used.
  * @constructor
  * @extends Ext.ux.netbox.core.Field
  * @class This is the class that implements the field to use if the type is string.
  * It contains as default the following operators:
  * <ul>
  *   <li> STRING_EQUAL </li>
  *   <li> STRING_DIFFERENT </li>
  *   <li> STRING_CONTAINS </li>
  *   <li> STRING_DOESNT_CONTAIN </li>
  *   <li> STRING_STARTS_WITH </li>
  *   <li> STRING_ENDS_WITH </li>
  * </ul>
  * The default operator is STRING_EQUAL.
  * The STRING_LIST and STRING_NOT_LIST operations should be manually added if needed.
  */
Ext.define('Ext.ux.netbox.string.StringField', {
	extend: 'Ext.ux.netbox.core.Field',
	constructor: function(id,label) {
	  Ext.ux.netbox.string.StringField.superclass.constructor.call(this,id,label);
	  var equalOperator = Ext.create('Ext.ux.netbox.core.Operator',"STRING_EQUAL",this.stringEqualsLabel);
	  this.addOperator(equalOperator);
	  this.setDefaultOperator(equalOperator);
	  this.addOperator(Ext.create('Ext.ux.netbox.core.Operator',"STRING_DIFFERENT",this.stringDifferentLabel));
	  noEmptyAllowed=Ext.bind(this.emptyNotAllowedFn,this);
	  var op=Ext.create('Ext.ux.netbox.string.TextFieldOperator',"STRING_CONTAINS",this.containsText);
	  op.addValidateFn(noEmptyAllowed);
	  this.addOperator(op);
	  op=Ext.create('Ext.ux.netbox.string.TextFieldOperator',"STRING_DOESNT_CONTAIN",this.doesntContainsText);
	  op.addValidateFn(noEmptyAllowed);
	  this.addOperator(op);
	  op=Ext.create('Ext.ux.netbox.string.TextFieldOperator',"STRING_STARTS_WITH",this.startsWithText);
	  op.addValidateFn(noEmptyAllowed);
	  this.addOperator(op);
	  op=Ext.create('Ext.ux.netbox.string.TextFieldOperator',"STRING_ENDS_WITH",this.endsWithText);
	  op.addValidateFn(noEmptyAllowed);
	  this.addOperator(op);
  },
	
  stringEqualsLabel: "=",
  stringDifferentLabel: "!=",
  containsText: "contains",
  doesntContainsText: "doesn't contain",
  startsWithText: "starts with",
  endsWithText: "ends with",
    
  stringListText: "in",
  
  stringNotListText: "not in",

  completeEdit: function(cellEditor) {
	  if (cellEditor!=null) cellEditor.completeEdit();
  },
  
  completeEditors: function() {
	  this.completeEdit(this.textFieldEditor);
  },

  getEditor: function(operatorId,filter,editorId) {
	  if (this.textFieldEditor===undefined) {
		  var textFieldEditor=Ext.create('Ext.ux.netbox.string.TextField');
		  this.textFieldEditor=Ext.create('Ext.grid.CellEditor', {
              editorId: editorId,
              field: textFieldEditor
             }); 
	  }
	  return this.textFieldEditor;
  }
  
});
