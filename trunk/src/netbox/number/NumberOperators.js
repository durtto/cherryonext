// $Id$

Ext.namespace('Ext.ux.netbox.number');

/** It instantiates a new NumberRangeOperator
  * @class This is the class that implements the range operator between 2 numbers. The id of the operator is NUMBER_RANGE
  * @constructor
  * @extends Ext.ux.netbox.core.Operator
  */
Ext.ux.netbox.number.NumberRangeOperator = function() {
  Ext.ux.netbox.number.NumberRangeOperator.superclass.constructor.call(this,"NUMBER_RANGE",this.includeText);
}

Ext.extend(Ext.ux.netbox.number.NumberRangeOperator,Ext.ux.netbox.core.Operator,/** @scope Ext.ux.netbox.number.NumberRangeOperator.prototype */{

  fromText    : 'from: ',
  toText      : ', to: ',
  includeText : 'between',

  /** This method creates an aditor used to edit the range of numbers
    * @param {String} operatorId The operatorId actually used in the filter
    * @return {Ext.Editor} The field used to edit the values of this filter
    */
  createEditor: function(operatorId){
    var field=new Ext.ux.netbox.core.RangeField({
      textCls: Ext.form.NumberField,
      fromConfig: {allowBlank: false},
      toConfig: {allowBlank: false}
    });
    var editor=new Ext.ux.netbox.FilterEditor(field);
    field.on("editingcompleted",editor.completeEdit,editor);
    return editor;
  },
/** This function returns a string rendering the values. The format is da: (value[0].label), a: (value[1].label).
    * If the value doesn't have any of the elements, "" is used.
    * @param {Array} The value to render
    * @return {String} The rendered value
    * @private
    */
  render: function(value){
    var valueFrom=value[0] == undefined ? '' : value[0].label;
    var valueTo=value[1] == undefined ? '' : value[1].label;
      return(this.fromText+valueFrom+this.toText+valueTo);
  }
});