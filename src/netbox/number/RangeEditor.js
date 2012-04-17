Ext.define('Ext.ux.netbox.core.RangeEditor', {
	extend: 'Ext.form.field.Trigger',
	constructor: function(config) {
	  this.textCls=config.textCls;
	  this.fromConfig=config.fromConfig;
	  this.toConfig=config.toConfig;
	  if(config.minListWidth){
	    this.minListWidth=config.minListWidth;
	  } else {
	    this.minListWidth=100;
	  }
	  if(config.fieldSize){
	    this.defaultAutoCreate.size=config.fieldSize;
	  }
	  Ext.ux.netbox.core.RangeField.superclass.constructor.call(this,config);
  },
	
  fromText    : 'da',
  toText      : 'a',
    
  defaultAutoCreate : {tag: "input", type: "text", size: "20", autocomplete: "off"},
  editable: false,
  rangeValue: null,
   
  initComponent: function () {
	Ext.ux.netbox.core.RangeField.superclass.initComponent.call(this);
  },
  
  onTriggerClick: function(){
    if(this.disabled){
      return;
    }
    if(this.menu == null){
      this.menu = Ext.create('Ext.ux.netbox.core.RangeMenu',{textCls:this.textCls,
    	                                                     fromCfg:this.fromConfig,
    	                                                     toCfg:this.toConfig,
    	                                                     fieldValidateFunc:Ext.bind(this.validate,this),
    	                                                     width: this.getWidth()});
    }
    if (this.menuListeners) {
	  this.menu.on(Ext.apply({}, this.menuListeners, {scope:this}));
    }
    this.menu.setWidth(this.getWidth());
    this.menu.showBy(this);
    this.menu.setValue(this.rangeValue);
  },
    
  getValue: function(){
    if(this.menu !== undefined)
      this.rangeValue=this.menu.getValue();
    return(this.rangeValue);
  },
    
  setValue: function(val){
	if (!Ext.isArray(val)) {
		val = ["",""];
	}
	
    var valueFrom = (val[0] === undefined || val[0]==null)? "" : val[0];
    var valueTo   = (val[1] === undefined || val[0]==null)? "" : val[1];
    formattedValue=this.fromText+": "+valueFrom+", "+this.toText+": "+valueTo;
    Ext.ux.netbox.core.RangeField.superclass.setValue.call(this, formattedValue);
    this.rangeValue=val;
    if(this.menu!=null){
      this.menu.setValue(this.rangeValue);
    }
  },
  
  markInvalid: function(msg){
    Ext.ux.netbox.core.RangeField.superclass.markInvalid.call(this,msg);
    if(this.menu){
      this.menu.markInvalid(msg);
    }
  },
    
  clearInvalid: function(){
    Ext.ux.netbox.core.RangeField.superclass.clearInvalid.call(this);
    if(this.menu){
      this.menu.clearInvalidFields();
    }
  },
  
  validateBlur: function(e){
    return(this.menu && this.menu.getEl() && !this.menu.getEl().contains(e.target));
  }

});
