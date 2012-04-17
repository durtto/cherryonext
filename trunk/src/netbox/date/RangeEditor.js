Ext.define('Ext.ux.netbox.date.RangeMenu', {
	extend: 'Ext.menu.Menu',
	constructor: function(config) {
	
		Ext.ux.netbox.date.RangeMenu.superclass.constructor.call(this,config);
	},
	hide:function(deep) {
  	  if (!this.canHide) return;
  	  this.callParent(arguments);
	  if (this.completeHandler!=null) {
		  this.canClose=true;
		  this.completeHandler.call(this);
	  }

    }	

});

Ext.define('Ext.ux.netbox.date.RangeEditor', { 
	extend: 'Ext.form.field.Trigger',
	constructor: function(config) {
	  this.dateFormat=config.dateFormat;
	  this.timeFormat=config.timeFormat;
	  this.format=config.format;
	  this.completeHandler=config.completeHandler;
	  Ext.ux.netbox.core.RangeField.superclass.constructor.call(this,config);
  },
	
  fromText    : 'from',
  toText      : 'to',
    
  hide:function(deep) {
//    if (!this.canHide) return;
    this.callParent(arguments);
  },

  defaultAutoCreate : {tag: "input", type: "text", size: "20", autocomplete: "off"},
  editable: false,
  rangeValue: null,
   	  
  initComponent: function () {
	Ext.ux.netbox.core.RangeField.superclass.initComponent.call(this);
  },
  
  valueChange: function(value) {
	  this.value=[this.dateTimeFieldFrom.getValue(),this.dateTimeFieldTo.getValue()];
	  var strValue='';
	  if (this.value[0]!=undefined) {
		  strValue=Ext.Date.format(this.value[0],this.format);
	  }
	  strValue+=',';
	  if (this.value[1]!=undefined) {
		  strValue+=Ext.Date.format(this.value[1],this.format);
	  }
	  this.setRawValue(strValue);
  },
  
  beforeShowBy: function(){
	  this.menu.canHide=false;
  },
  
  afterShowBy: function(){
	  this.menu.canHide=true;
  },
  
  canClose: function(){
	  return this.menu.canClose;
  },
  
  onTriggerClick: function(){
    if(this.disabled){
      return;
    }
    if(this.menu == null){
	  this.dateTimeFieldFrom=Ext.create('Ext.ux.netbox.date.DateTimeEditor',{dateFormat:this.dateFormat,
																	         timeFormat:this.timeFormat,
																	         format:this.format,
																	         fieldLabel:this.fromText,
																	         valueChangeHandler:Ext.bind(this.valueChange,this),
																	         beforeShowByHandler:Ext.bind(this.beforeShowBy,this),
																	         afterShowByHandler:Ext.bind(this.afterShowBy,this)});
	  	  
	  this.dateTimeFieldTo=Ext.create('Ext.ux.netbox.date.DateTimeEditor',{dateFormat:this.dateFormat,
																           timeFormat:this.timeFormat,
																           format:this.format,
																           fieldLabel:this.toText,
																	       valueChangeHandler:Ext.bind(this.valueChange,this),
																	       beforeShowByHandler:Ext.bind(this.beforeShowBy,this),
																	       afterShowByHandler:Ext.bind(this.afterShowBy,this)});
	 
	  this.panel = Ext.create('Ext.panel.Panel',{ height:55,
										          width:this.getWidth()-6,
										          layout: {
													        type: 'vbox',
													        align: 'stretch'
												  },
			    	  							  toBack: function () {
  	  													var i=0;
     											  },
	                                              items:[this.dateTimeFieldFrom,this.dateTimeFieldTo] });
	  
	  this.dateTimeFieldFrom.on('change',Ext.bind(this.showNewValue,this));

	  this.dateTimeFieldTo.on('change',Ext.bind(this.showNewValue,this));
	  
      this.menu=Ext.create('Ext.ux.netbox.date.RangeMenu',{items:this.panel,height:255,width:this.getWidth()});
	  this.menu.completeHandler=this.completeHandler; 
    }
    if (this.menuListeners) {
	  this.menu.on(Ext.apply({}, this.menuListeners, {scope:this}));
    }
    this.menu.setWidth(this.getWidth());
    this.menu.showBy(this);
    this.menu.canClose=false;

  },
    
  showNewValue: function(trigger,newValue,oldValue,eOpts ){
	  var rowValue="";
	  if (this.dateTimeFieldFrom.getValue()!=null) {
		  rowValue=Ext.Date.format(this.dateTimeFieldFrom.getValue(),this.timeFormat);
	  }
	  if (this.dateTimeFieldTo.getValue()!=null) {
		  if (rowValue!="") rowValue+=' , ';
		  rowValue+=Ext.Date.format(this.dateTimeFieldTo.getValue(),this.timeFormat);
	  }
  },
  
  getValueStr: function(){
	  var rowValue="";
	  if (this.dateTimeFieldFrom.getValue()!=null) {
		  rowValue=Ext.Date.format(this.dateTimeFieldFrom.getValue(),this.format);
	  }
	  if (this.dateTimeFieldTo.getValue()!=null) {
		  if (rowValue!="") rowValue+=' , ';
		  rowValue+=Ext.Date.format(this.dateTimeFieldTo.getValue(),this.format);
	  }
	  return rowValue;
  },
   
  stopEdit: function(){
	this.dateTimeFieldFrom.stopEdit();
  	this.dateTimeFieldTo.stopEdit();
  },
  
  getValue: function(){
	this.rangeValue=[];
    if(this.menu !== undefined){
    	this.rangeValue.push(this.dateTimeFieldFrom.getValue());
    	this.rangeValue.push(this.dateTimeFieldTo.getValue());
    }
    return(this.rangeValue);
  },
   
  setValue: function(val){
	if (this.dateTimeFieldFrom===undefined) return;
	if (!Ext.isArray(val)) {
		val = [new Date(),new Date()];
	}
	
    var valueFrom = (val[0] === undefined || val[0]==null || !Ext.isDate(val[0]))? new Date() : val[0];
    var valueTo   = (val[1] === undefined || val[0]==null || !Ext.isDate(val[1]))? new Date() : val[1];

    this.dateTimeFieldFrom.setValue(val[0]);
    this.dateTimeFieldTo.setValue(val[1]);
    
    this.setRawValue(Ext.Date.format(this.dateTimeFieldFrom.getValue(),this.format)+' , '+
    		         Ext.Date.format(this.dateTimeFieldTo.getValue()  ,this.format));
    this.rangeValue=val;
  },
  
  
  
//  markInvalid: function(msg){
//    Ext.ux.netbox.core.RangeField.superclass.markInvalid.call(this,msg);
//    if(this.menu){
//      this.menu.markInvalid(msg);
//    }
//  },
    
//  clearInvalid: function(){
//    Ext.ux.netbox.core.RangeField.superclass.clearInvalid.call(this);
//    if(this.menu){
//      this.menu.clearInvalidFields();
//    }
//  },
  
  validateBlur: function(e){
    return(this.menu && this.menu.getEl() && !this.menu.getEl().contains(e.target));
  } 

});
