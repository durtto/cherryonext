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
	  config.toCfg.width=config.width-6;
	  config.toCfg.labelWidth=35;
	  
	  this.editorFrom=Ext.create(textCls,config.fromCfg);
	  this.editorTo=Ext.create(textCls,config.toCfg);
	  if (config.fieldValidateFunc!=undefined) {
		  this.editorFrom.validate=config.fieldValidateFunc;
		  this.editorTo.validate=config.fieldValidateFunc;
	  }

      this.editorFrom.fieldLabel=this.fromText;
	  this.editorTo.fieldLabel=this.toText;

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
	    this.editorFrom.setValue(valueFrom);
	    this.editorTo.setValue(valueTo);
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
