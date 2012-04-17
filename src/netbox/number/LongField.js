Ext.define('Ext.ux.netbox.number.LongField', {
	extend: 'Ext.ux.netbox.number.NumberField',
	  constructor:function(id,label) {
		  Ext.ux.netbox.number.LongField.superclass.superclass.constructor.call(this,id,label);
		  var equalOperator = Ext.create('Ext.ux.netbox.core.Operator',"LONG_EQUAL","=");
		  this.addOperator(equalOperator);
		  this.setDefaultOperator(equalOperator);
		  this.addOperator(Ext.create('Ext.ux.netbox.core.Operator',"LONG_NOT_EQUAL","!="));
		  noEmptyAllowed=Ext.bind(this.emptyNotAllowedFn,this);
		  var op=Ext.create('Ext.ux.netbox.core.Operator',"LONG_GREATER",">");
		  op.addValidateFn(noEmptyAllowed);
		  this.addOperator(op);
		  op=Ext.create('Ext.ux.netbox.core.Operator',"LONG_GREATER_OR_EQUAL",">=");
		  op.addValidateFn(noEmptyAllowed);
		  this.addOperator(op);
		  op=Ext.create('Ext.ux.netbox.core.Operator',"LONG_LESS","<");
		  op.addValidateFn(noEmptyAllowed);
		  this.addOperator(op);
		  op=Ext.create('Ext.ux.netbox.core.Operator',"LONG_LESS_OR_EQUAL","<=");
		  op.addValidateFn(noEmptyAllowed);
		  this.addOperator(op);
		  this.addOperator(Ext.create('Ext.ux.netbox.number.NumberRangeOperator',"LONG_RANGE"));
		  this.rangeOperator="LONG_RANGE";
		  this.decimalPrecision=0;
	},
	  	  
});
