Ext.define('Ext.ux.netbox.number.EnumLongField', {
	extend: 'Ext.ux.netbox.string.EnumField',
	constructor: function(id,label) {
	  Ext.ux.netbox.number.EnumLongField.superclass.constructor.call(this,id,label);
	  var equalOperator = Ext.create('Ext.ux.netbox.core.Operator',"LONG_EQUAL",this.stringEqualsLabel);
	  this.addOperator(equalOperator);
	  this.setDefaultOperator(equalOperator);
	  this.addOperator(Ext.create('Ext.ux.netbox.core.Operator',"LONG_DIFFERENT",this.stringDifferentLabel));
  },
	
  stringEqualsLabel: "=",
  stringDifferentLabel: "!=",

    
  stringListText: "in",
  
  stringNotListText: "not in",

  isMultipleSelection: function(operatorId) {
	  return (operatorId=="LONG_LIST"  || operatorId=="LONG_NOT_LIST");
  },

});
