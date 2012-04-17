Ext.define('Ext.ux.netbox.number.IntField', {
	extend: 'Ext.ux.netbox.number.NumberField',
	  constructor:function(id,label) {
	  Ext.ux.netbox.number.IntField.superclass.superclass.constructor.call(this,id,label);
	  var equalOperator = Ext.create('Ext.ux.netbox.core.Operator',"INT_EQUAL","=");
	  this.addOperator(equalOperator);
	  this.setDefaultOperator(equalOperator);
	  this.addOperator(Ext.create('Ext.ux.netbox.core.Operator',"INT_NOT_EQUAL","!="));
	  noEmptyAllowed=Ext.bind(this.emptyNotAllowedFn,this);
	  var op=Ext.create('Ext.ux.netbox.core.Operator',"INT_GREATER",">");
	  op.addValidateFn(noEmptyAllowed);
	  this.addOperator(op);
	  op=Ext.create('Ext.ux.netbox.core.Operator',"INT_GREATER_OR_EQUAL",">=");
	  op.addValidateFn(noEmptyAllowed);
	  this.addOperator(op);
	  op=Ext.create('Ext.ux.netbox.core.Operator',"INT_LESS","<");
	  op.addValidateFn(noEmptyAllowed);
	  this.addOperator(op);
	  op=Ext.create('Ext.ux.netbox.core.Operator',"INT_LESS_OR_EQUAL","<=");
	  op.addValidateFn(noEmptyAllowed);
	  this.addOperator(op);
	  this.addOperator(Ext.create('Ext.ux.netbox.number.NumberRangeOperator',"INT_RANGE"));
	  this.rangeOperator="INT_RANGE";
	  this.decimalPrecision=0;
	},

});
