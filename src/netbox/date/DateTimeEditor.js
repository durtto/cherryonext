Ext.define('Ext.ux.netbox.date.DateTimeEditor', {
	extend: 'Ext.form.field.Trigger',
	alias: 'widget.dateTimeEditor',
	constructor: function(config) {
		this.setFormat(config.dateFormat,config.timeFormat,config.format);
		this.valueChangeHandler=config.valueChangeHandler;
		this.beforeShowByHandler=config.beforeShowByHandler;
		this.afterShowByHandler=config.afterShowByHandler;
		Ext.ux.netbox.date.DateTimeEditor.superclass.constructor.call(this,config);
	},
    initComponent: function () {
		Ext.ux.netbox.date.DateTimeEditor.superclass.initComponent.call(this);
	},
  
    initComponent: function () {
		Ext.ux.netbox.date.DateTimeEditor.superclass.initComponent.call(this);
    },
  
    selectText: "Close",
    
    setValue: function(date) {
    	if (this.panel=== undefined) return;
    	if (Ext.isArray(date)) {
    		date=date[0];
    	}
    	if (Ext.isString(date)) {
    		if (date="") {
    			date=new Date();
    		} else {
    			date=Ext.Date.parse(this.format,date);
    		}
    	} 
    	if (!Ext.isDate(date) ) date=new Date();
    	this.value=date;
    	this.panel.items.items[0].setValue(date);
    	this.setRawValue(Ext.Date.format(date,this.format));
    },
    
    stopEdit: function() {
    	this.setValue(this.getDateRawValue());
    },
    
    getDateRawValue: function() {
    	return Ext.Date.parse(this.getRawValue(),this.format);
    },
    
    getValueStr: function() {
    	return this.getRawValue();
    },
    
    
    dataSelection: function() {
    	var timeDateStr="";
    	if (this.panel.items.items[1].isVisible()) {
	    	var valueStr=this.getRawValue();
	    	var timeDate=Ext.Date.parse(valueStr,this.format);
	    	if (timeDate===undefined) {
	    		timeDate=Ext.Date.parse("00","H");
	    	}
	    	timeDateStr=" "+Ext.Date.format(timeDate,this.timeFormat);
    	}
    	
    	this.value=this.panel.items.items[0].getValue();
    	var dateStr=Ext.Date.format(this.value,this.dateFormat)+timeDateStr;
		this.setRawValue(dateStr);
     	this.value=Ext.Date.parse(dateStr,this.format);   	
	    this.valueChange(this.value);
    },
    
    timeSelection: function() {
    	var valueStr=this.getRawValue();
    	var dateDate=Ext.Date.parse(valueStr,this.format);
    	if (dateDate===undefined) dateDate= new Date();
    	var dateStr=Ext.Date.format(dateDate,this.dateFormat);
    	
    	var timeDate=this.panel.items.items[1].getSelectionModel().getSelection()[0].data.date;
	    dateStr+=" "+Ext.Date.format(timeDate,this.timeFormat);
    	
	    this.setRawValue(dateStr);
	    this.value=Ext.Date.parse(dateStr,this.format);
	    this.valueChange(this.value);
    },
    
    valueChange: function(value) {
    	if (this.valueChangeHandler!=undefined) {
    		this.valueChangeHandler(this,value);
    	}
    },
    
    beforeShowBy: function(){
    	if (this.beforeShowByHandler!=undefined) {
    		this.beforeShowByHandler(this);
    	}
    },
    
    afterShowBy: function(){
    	if (this.afterShowByHandler!=undefined) {
    		this.afterShowByHandler(this);
    	}
    },

    stopEditing: function() {
		if (this.isVisible()) {
			this.panel.hide();
			this.hide();
		}
	},
	
	select: function() {
		this.panel.hide();
	},
	
	setFormat: function(dateFormat,timeFormat,format) {
		this.dateFormat=dateFormat;
		this.timeFormat=timeFormat;
		this.format=format;
	},
	
    onTriggerClick: function(){
	    if(this.disabled){
	      return;
	    } 
	    if(this.panel === undefined){ 
	      this.panel = Ext.create('Ext.panel.Panel',{   height:198,
	    	  											width:this.getWidth()-6,
	    	  											layout : 'border',
	    	  											items : [{
			    	  										        xtype: 'datepicker',
			    	  										        region: 'center',
		    	  										        	height:200,
		    	  										        	minWidth : 150,
			    	  										        handler: Ext.bind(this.dataSelection,this)
			    	  										     },{
		    	  										        	xtype: 'timepicker',
			    	  										        width: 100,
			    	  										        format: (this.timeFormat===undefined) ? "H:i" : this.timeFormat,
			    	  										        listeners: {
	    	  															selectionchange: Ext.bind(this.timeSelection,this)
	    	  														},
		    	  										        	region: 'east'
			    	  										     }],
			    	  								toBack: function () {
	    	  												var i=0;
	       													},
	    	  											buttonAlign : 'center',
			    	  									buttons : [{text   : this.selectText,
			    	  										        handler: Ext.bind(this.select,this)}]
	                              }); 
	      
	      this.menu=Ext.create('Ext.menu.Menu',{items:this.panel,height:230,width:this.getWidth()});
	    } 
	    if (this.menuListeners) {
		  this.menu.on(Ext.apply({}, this.menuListeners, {scope:this}));
	    }
	    
	    if (this.dateFormat===undefined) {
	    	this.dateFormat='Y-m-d|Y-n-d';
	    }
	    
	    this.panel.items.items[1].setVisible(this.timeFormat!=undefined);
	    if (this.timeFormat!=undefined) this.panel.items.items[1].format=this.timeFormat;
	    
//	    this.panel.setWidth(this.getWidth());
//	    this.panel.setHeight(230);
//	    this.panel.showBy(this);
	    this.menu.setWidth(this.getWidth());
	    this.menu.setHeight(230);
	    this.beforeShowBy();
	    this.menu.showBy(this);
	    this.afterShowBy();
	    this.panel.setVisible(true);
    },

    getValue: function(){
//        if(this.panel !== undefined)
//          this.value=this.panel.getValue();
        return(this.value);
    },
        
     markInvalid: function(msg){
    	Ext.ux.netbox.date.DateTimeEditor.superclass.markInvalid.call(this,msg);
        if(this.panel){
          this.panel.markInvalid(msg);
        }
     },
        
     clearInvalid: function(){
        Ext.ux.netbox.core.RangeField.superclass.clearInvalid.call(this);
     },
      
     validateBlur: function(e){
        return(this.menu && this.menu.getEl() && !this.menu.getEl().contains(e.target));
     }

});
