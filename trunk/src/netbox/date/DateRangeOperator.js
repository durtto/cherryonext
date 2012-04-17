Ext.define('Ext.ux.netbox.date.DateRangeOperator', {
	extend: 'Ext.ux.netbox.date.DateOperator',
	constructor: function(format) {
	  Ext.ux.netbox.date.DateRangeOperator.superclass.constructor.call(this,"DATE_RANGE",this.includeText,format);
	  this.mapping={
	    d: '99',
	    m: '99',
	    Y: '9999',
	    y: '99',
	    H: '99',
	    i: '99',
	    s: '99'
	  }
	  var validateFn=function(value){
	    var isOk=this.getField().emptyNotAllowedFn(value);
	    if(isOk!==true){
	      return(isOk);
	    }
	    if(value.length!=2){
	      return(this.bothFromAndToNotEmpty);
	    }
	    if(!Ext.isDate(value[0]) && !Ext.isDate(value[1])){
	      return(this.toAndFromNotADate);
	    }

	    if(!Ext.isDate(value[0])){
	      return(this.fromNotADate);
	    }

	    if(!Ext.isDate(value[1])){
	      return(this.toNotADate);
	    }

	    return(true);
	  }
	  this.setValidateFn(validateFn);
	},
	
  fromText    : 'from',
  
  toText      : 'to',
  
  includeText : 'between',
  
  bothFromAndToNotEmpty: "Both 'from' and 'to' must have a value",
  
  fromBiggerThanTo: "From is bigger than to",
  
  fromNotADate: "From is not a valid date",
  
  toNotADate: "To is not a valid date",
  
  toAndFromNotADate: "From and to are not valid dates",

  
  createEditor: function(operatorId){
    var field=Ext.create('Ext.ux.netbox.core.RangeField',{
      textCls: Ext.form.TextField,
      fromConfig: this.getTextFieldConfig(),
      toConfig: this.getTextFieldConfig(),
      minListWidth: 300,
      fieldSize: 36
    });

    var editor=Ext.create('Ext.ux.netbox.date.DateRangeEditor',field,{format: this.format});
    field.on("editingcompleted",editor.completeEdit,editor);
    return editor;
  },
  
  render: function(value){
    var valueFrom=value[0] == undefined ? '' : value[0].label;
    var valueTo=value[1] == undefined ? '' : value[1].label;
    return(this.fromText+": "+valueFrom+", "+this.toText+": "+valueTo);
  },

  
  getTextFieldConfig: function(){
    return({plugins: [Ext.create('Ext.ux.netbox.InputTextMask',this.calculateMask(), true)]});
  },
  
  calculateMask: function(){
	  var maskTmp='';
    for(var i=0; i<this.format.length;i++){
      if(this.mapping[this.format.charAt(i)]){
        maskTmp+=this.mapping[this.format.charAt(i)];
      }else{
        maskTmp+=this.format.charAt(i);
      }
    }
    return(maskTmp);
  }
});
