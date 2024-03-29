// $Id$

/** Creates a new RangeMenu, a menu containing 2 input box that represents the range value between 2 values.
  * @class This is a private class used by RangeField (it's the popup)
  * @extends Ext.menu.Menu
  * @constructor
  * @ignore
  */
Ext.define('Ext.ux.netbox.core.RangeMenu', {
	extend: 'Ext.menu.Menu',
	constructor: function(config) {
	  var textCls=config.textCls;
	  if(textCls===undefined){
		    textCls = Ext.form.TextField;
		    textCls.anchor = "100%";
	  }
	  
	  config.fromCfg.width=config.width-6;
	  config.fromCfg.labelWidth=35;
//	  config.fromCfg.style='background-color:white';
//	  config.fromCfg.itemCls="x-menu-item x-menu-item-cstm";
	  config.toCfg.width=config.width-6;
	  config.toCfg.labelWidth=35;
//	  config.toCfg.style='background-color:white';
//	  config.toCfg.itemCls="x-menu-item x-menu-item-cstm";
	  
	  this.editorFrom=Ext.create(textCls,config.fromCfg);
	  this.editorTo=Ext.create(textCls,config.toCfg);
	  if (config.fieldValidateFunc!=undefined) {
		  this.editorFrom.validate=config.fieldValidateFunc;
		  this.editorTo.validate=config.fieldValidateFunc;
	  }

      this.editorFrom.fieldLabel=this.fromText;
	  this.editorTo.fieldLabel=this.toText;

//		  this.initComponent();

	  Ext.ux.netbox.core.RangeMenu.superclass.constructor.call(this,{width:config.width,
		  													   StyleSpec:'background-color:white; background-image: none;',
		                                                       style:'background-color:white; background-image: none;',
		                                                       bodyStyle : 'background-color:white; background-image: none;',
		                                                       styleHtmlCls: 'background-color:white; background-image: none;',
		                                                       styleHtmlContent :true,
		                                                       items:[this.editorFrom,this.editorTo]});
	},

	reset: function() {
		this.editorFrom.setValue("");
		this.editorTo.setValue("");
	},
	
	  setValue: function(val){
		if (!Ext.isArray(val)) {
			val = ["",""];
		}
		
	    var valueFrom = (val[0]===undefined || val[0]==null)?"":val[0];
	    var valueTo   = (val[1]===undefined || val[1]==null)?"":val[1];
	    formattedValue=this.fromText+": "+valueFrom+", "+this.toText+": "+valueTo;
//	    Ext.ux.netbox.core.RangeField.superclass.setValue.call(this, formattedValue);
//	    this.rangeValue=val;
//	    if(this.menu!=null){
//	      this.menu.setValue(this.rangeValue);
//	    }
	  },

  fromText : 'da',  
  toText   : 'a',

  hideOnClick: false,
  layout: "form",
  labelWidth: 38,
  style: {'background-image': 'none'},
  // Needed as it is defined into a MenuLayout but not into the FormLayout
  // that we use for this RangeMenu
  layoutConfig: {  
	doAutoSize : function () {
	}
  },
  
//  initComponent: function () {
//       Ext.apply(this, {items: [this.editorFrom, this.editorTo]});
//       Ext.ux.netbox.core.RangeMenu.superclass.initComponent.call(this);
//       this.addEvents({'update': true});
//       var items = this.items.items;
//       for (var i = 0; i < items.length; i++) {
//           items[i].on("keyup", this.onKeyUp, this);
//       }
//  },
//  
//  setValue: function(data){
//    var from="";
//    var to="";
//    if(data.length==2){
//      from=data[0].label;
//      to=data[1].label;
//    } else if (data.length==1) {
//      from=data[0].label;
//    }
//    if(to==="") {
//        this.editorTo.setRawValue("");
//    }else {
//	this.editorTo.setValue(to);
//    }
//    if (from==="") {
//        this.editorFrom.setRawValue("");
//    } else {
//        this.editorFrom.setValue(from);
//    }
//
//    this.fireEvent("update", this);
//  },
    
//  onKeyUp: function(event){
//    if(event.getKey() == event.ENTER && this.isValid()){
//      this.hide(true);
//      return;
//    }
//  },
    
  getValue: function(){
    var result = [this.editorFrom.getValue(),this.editorTo.getValue()];
    return result;
  },
   
  isValid: function(){
    return (this.editorFrom.isValid() && this.editorTo.isValid());
  },
   
  markInvalid: function(msg){
    this.editorFrom.markInvalid(msg);
    this.editorTo.markInvalid(msg);
  },
    
  clearInvalidFields: function(){
    this.editorFrom.clearInvalid();
    this.editorTo.clearInvalid();
  }

});
