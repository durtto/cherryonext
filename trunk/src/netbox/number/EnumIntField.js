Ext.define('Ext.ux.netbox.number.EnumIntField', {
	extend: 'Ext.ux.netbox.string.EnumField',
	constructor: function(id,label) {
	  Ext.ux.netbox.number.EnumIntField.superclass.superclass.constructor.call(this,id,label);
	  var equalOperator = Ext.create('Ext.ux.netbox.core.Operator',"INT_EQUAL",this.stringEqualsLabel);
	  this.addOperator(equalOperator);
	  this.setDefaultOperator(equalOperator);
	  this.addOperator(Ext.create('Ext.ux.netbox.core.Operator',"INT_DIFFERENT",this.stringDifferentLabel));
  },
	
  stringEqualsLabel: "=",
  stringDifferentLabel: "!=",
    
  stringListText: "in",
  
  stringNotListText: "not in",

  isMultipleSelection: function(operatorId) {
	  return (operatorId=="INT_LIST"  || operatorId=="INT_NOT_LIST");
  },
	  
});
