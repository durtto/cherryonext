// $Id$

/** It creates a new enumerator field
  * @param {String} id The id of the field
  * @param {String} label Optional. The label of the field. If not supplied the id is used.
  * @constructor
  * @extends Ext.ux.netbox.core.Field
  * @class This is the class that implements the field to use if the type is enumerator.
  * It contains as default the following operators:
  * <ul>
  *   <li> STRING_EQUAL </li>
  *   <li> STRING_DIFFERENT </li>
  * </ul>
  * The default operator is STRING_EQUAL.
  * The STRING_LIST and STRING_NOT_LIST operations should be manually added if needed.
  */
Ext.define('Ext.ux.netbox.string.EnumField', {
	extend: 'Ext.ux.netbox.core.Field',
	constructor: function(id,label) {
	  Ext.ux.netbox.string.EnumField.superclass.constructor.call(this,id,label);
	  var equalOperator = Ext.create('Ext.ux.netbox.core.Operator',"STRING_EQUAL",this.stringEqualsLabel);
	  this.addOperator(equalOperator);
	  this.setDefaultOperator(equalOperator);
	  this.addOperator(Ext.create('Ext.ux.netbox.core.Operator',"STRING_DIFFERENT",this.stringDifferentLabel));
    },
	
  stringEqualsLabel: "=",
  stringDifferentLabel: "!=",

    
  /** Label of the STRING_LIST operation
   * @property
   */
  stringListText: "in",
  
  /** Label of the STRING_NOT_IN_LIST operation
   * @property
   */
  stringNotListText: "not in", 
  
  setValue: function(combo, newValue, oldValue, eOpts) {
    	combo.select(newValue);
  },

  isMultipleSelection: function(operatorId) {
	  return (operatorId=="STRING_LIST"  || operatorId=="STRING_NOT_LIST");
  },
  
  completeEdit: function(cellEditor) {
	  if (cellEditor!=null) cellEditor.completeEdit();
  },
  
  completeEditors: function() {
	  this.completeEdit(this.comboMultiSelectionEditor);
	  this.completeEdit(this.comboEditor);
  },
	    
  getEditor: function(operatorId,filter,editorId) {
	  if (this.isMultipleSelection(operatorId)) {
		  if (this.comboMultiSelectionEditor===undefined) {
			  var comboMultiSelectionEditor=Ext.create('Ext.form.field.ComboBox',{ store:this.getAvailableValues() , 
				                                               queryMode     : 'local',
				                                               valueField    : 'value',
				                                               displayField  : 'label',
				                                               editable      : false,
				                                               triggerAction : 'all',
				                                               lazyRender    : true,
				                                               multiSelect   : true
				                                             });
			  this.comboMultiSelectionEditor=Ext.create('Ext.grid.CellEditor', {
	              editorId: editorId,
	              field: comboMultiSelectionEditor
	             });
		  }
		  return this.comboMultiSelectionEditor;
	  } else {
		  if (this.comboEditor===undefined) {			  
			  var comboEditor=Ext.create('Ext.form.field.ComboBox',{ 
				                                               store:this.getAvailableValues() ,
				                                               queryMode     : 'local',
				                                               valueField    : 'value',
				                                               displayField  : 'label',
				                                               editable      : false,
				                                               triggerAction : 'all',
				                                               lazyRender    : true
				                                             });
			  comboEditor.on('change',this.setValue,this);
			  this.comboEditor=Ext.create('Ext.grid.CellEditor', {
	              editorId: editorId,
	              field: comboEditor
	             });
		  }
		  return this.comboEditor;
	  }
    }  
});
