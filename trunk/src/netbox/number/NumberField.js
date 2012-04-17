// $Id$

Ext.namespace('Ext.ux.netbox.number');

/** It instantiates a new NumberField
  * @class This is the class that implements the field to use if the data to filter is a number.
  * It contains as default the following operation:
  * <ul>
  *   <li> NUMBER_EQUAL </li>
  *   <li> NUMBER_NOT_EQUAL </li>
  *   <li> NUMBER_GREATER </li>
  *   <li> NUMBER_GREATER_OR_EQUAL </li>
  *   <li> NUMBER_LESS </li>
  *   <li> NUMBER_LESS_OR_EQUAL </li>
  *   <li> NUMBER_RANGE </li>
  * </ul>
  * The default operation is NUMBER_EQUAL
  * @param {String} id The Field id.
  * @param {String} label Optional. The label of the filter. If not supplied the id is used.
  * @constructor
  * @extends Ext.ux.netbox.core.Field
  */
Ext.define('Ext.ux.netbox.number.NumberField', {
	extend: 'Ext.ux.netbox.core.Field',
	  constructor:function(id,label) {

		  Ext.ux.netbox.number.NumberField.superclass.constructor.call(this,id,label);
		  var equalOperator = Ext.create('Ext.ux.netbox.core.Operator',"NUMBER_EQUAL","=");
		  this.addOperator(equalOperator);
		  this.setDefaultOperator(equalOperator);
		  this.addOperator(Ext.create('Ext.ux.netbox.core.Operator',"NUMBER_NOT_EQUAL","!="));
		  noEmptyAllowed=Ext.bind(this.emptyNotAllowedFn,this);
		  var op=Ext.create('Ext.ux.netbox.core.Operator',"NUMBER_GREATER",">");
		  op.addValidateFn(noEmptyAllowed);
		  this.addOperator(op);
		  op=Ext.create('Ext.ux.netbox.core.Operator',"NUMBER_GREATER_OR_EQUAL",">=");
		  op.addValidateFn(noEmptyAllowed);
		  this.addOperator(op);
		  op=Ext.create('Ext.ux.netbox.core.Operator',"NUMBER_LESS","<");
		  op.addValidateFn(noEmptyAllowed);
		  this.addOperator(op);
		  op=Ext.create('Ext.ux.netbox.core.Operator',"NUMBER_LESS_OR_EQUAL","<=");
		  op.addValidateFn(noEmptyAllowed);
		  this.addOperator(op);
		  this.addOperator(Ext.create('Ext.ux.netbox.number.NumberRangeOperator',"NUMBER_RANGE"));
		  this.rangeOperator="NUMBER_RANGE";
		  this.decimalPrecision=10;
	},
	
  completeEdit: function(cellEditor) {
	  if (cellEditor!=null) cellEditor.completeEdit();
  },
  
  completeEditors: function() {
	  this.completeEdit(this.numberCellFieldEditor);
	  this.completeEdit(this.rangeFieldCellEditor);
  },
	    
  getEditor: function(operatorId,filter,editorId) {
	  if (operatorId!=this.rangeOperator) {
		  if (this.numberCellFieldEditor===undefined) {
			  var numberFieldEditor=Ext.create('Ext.form.NumberField',{decimalPrecision: this.decimalPrecision,
				                                                       setValue: function (value) {
				  															if (Ext.isArray(value)) {
				  																value=value[0];
				  															}
				  															Ext.form.NumberField.superclass.setValue.call(this,value);
			                                                           } 
			                                                          });
			  
			  this.numberFieldCellEditor=Ext.create('Ext.grid.CellEditor', {
                	                                                         editorId: editorId,
                                                                             field: numberFieldEditor
                                                                            }); 
		  }
		  return this.numberFieldCellEditor;
	  } else {
		  if (this.rangeFieldCellEditor===undefined) {
			  var rangeFieldEditor=Ext.create('Ext.ux.netbox.core.RangeEditor',{
			      textCls: "Ext.form.NumberField",
			      fromConfig: {decimalPrecision: this.decimalPrecision},
			      toConfig: {decimalPrecision: this.decimalPrecision}
			    });
			  this.rangeFieldCellEditor=Ext.create('Ext.grid.CellEditor', {
                                                                           editorId: editorId,
                                                                           field: rangeFieldEditor
                                                                          }); 
		  }
		  return this.rangeFieldCellEditor;
	  }
  },

});
