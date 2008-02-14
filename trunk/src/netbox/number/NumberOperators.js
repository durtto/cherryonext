// $Id: NumberOperators.js 300311 2008-02-11 13:09:39Z SO000377 $

Ext.namespace('Ext.ux.netbox.number');

/** It instantiates a new NumberOperator
  * @class This is the general class for all NumberOperators. It extends Operators to alway use a Ext.form.NumberField as editor
  * @constructor
  * @extends Ext.ux.netbox.core.Operator
  */
Ext.ux.netbox.number.NumberOperator = function(id,label) {
  Ext.ux.netbox.number.NumberOperator.superclass.constructor.call(this,id,label);

  /** With this operator I want always a NumberField.
    * This is the variable that contains the editor
    * @property {Ext.Editor} editor
    */
  this.editor=null;
}

Ext.extend(Ext.ux.netbox.number.NumberOperator,Ext.ux.netbox.core.Operator,/** @scope Ext.ux.netbox.number.NumberOperator.prototype */{
  /** It returns a Ext.ux.netbox.core.TextValuesEditor with a Ext.form.NumberField as field
    * @param {boolean} cache true to use a cached editor if available, and to put the newly created editor in the cache if not available, false otherwise. The default is true
    * @return {Ext.ux.netbox.core.TextValuesEditor}
    */
  getEditor: function(cache){
    if(cache===undefined){
      cache=true;
    }
    var editor;
    if(this.editor===undefined || this.editor===null || !cache){
      editor=new Ext.ux.netbox.core.TextValuesEditor({},new Ext.form.NumberField({decimalPrecision: 10}));
      if(cache){
        this.editor=editor;
      }
    } else {
      editor=this.editor;
    }
    return(editor);
  }
});


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

  /** This method returns the Ext.ux.netbox.core.RangeField used to edit the range of numbers
    * @param {boolean} cache true to use a cached editor if available, and to put the newly created editor in the cache if not available, false otherwise. The default is true
    * @return {Ext.ux.netbox.core.RangeField} The Ext.Editor used to edit the number range value
    * @private
    */
  getEditor: function(cache){
    if(cache===undefined){
      cache=true;
    }
    var editor;
    if(this.editor===undefined || this.editor===null|| !cache){
      var field=new Ext.ux.netbox.core.RangeField({
        textCls: Ext.form.NumberField,
        fromConfig: {allowBlank: false},
        toConfig: {allowBlank: false}
      });
      editor=new Ext.ux.netbox.FilterEditor(field);
      field.on("editingcompleted",editor.completeEdit,editor);
      if(cache){
        this.editor=editor;
      }
    } else {
      editor=this.editor;
    }
    return(editor);
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