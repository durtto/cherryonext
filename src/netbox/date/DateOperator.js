Ext.define('Ext.ux.netbox.date.DateOperator', {
	extend: 'Ext.ux.netbox.core.Operator',
	constructor: function(id,label,format) {
	  Ext.ux.netbox.date.DateOperator.superclass.constructor.call(this,id,label,format);
	  
	  this.editor=null;
	  
	  this.format=format;
  },
	
  createEditor: function(operatorId){
    var editor;
    var splittedFormat=this.format.split(" ");
    if(splittedFormat.length > 1){
      var dateTimeField=Ext.create('Ext.ux.form.DateTime',{
                dateFormat: splittedFormat[0],
                dateConfig: {
                  altFormats: 'Y-m-d|Y-n-d'
                },
                otherToNow: false,
                timeFormat: splittedFormat[1],
                timeConfig: {
                  altFormats: 'H:i:s'
                }
              });
      editor=Ext.create('Ext.ux.netbox.date.DateTextEditor',dateTimeField,{format: this.format});
    }else{
      editor=Ext.create('Ext.ux.netbox.date.DateTextEditor',Ext.create('Ext.form.DateField',{
                format: splittedFormat[0],
                allowBlank: false
              }),
              {format: this.format}
            );
    }
    return editor;
  },

  
  convertValue: function(value){
    if(value !==null && value !== undefined && Ext.type(value)=="array"){
      if(value.length>0 && value[0]!== undefined){
        if(this.getField().checkDate(value[0])){
          if(value.length==1){
            return(value);
          } else {
            return([value[0]]);
          }
        }
      }
    }
    return([""]);
  },

  
  getFormat : function(){
    return this.format;
  }
});
