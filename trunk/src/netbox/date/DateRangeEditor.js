Ext.define('Ext.ux.netbox.date.DateRangeEditor', {
	extend: 'Ext.ux.netbox.FilterEditor',
	constructor: function(config) {
	  Ext.ux.netbox.date.DateRangeEditor.superclass.constructor.call(this,field,config);
	  this.format=config.format;
  },
	
  getValue: function(){
    var val=Ext.ux.netbox.date.DateRangeEditor.superclass.getValue.call(this);
    var toReturn=[];
    for(var i=0; val && i < val.length; i++){
      var date=Date.parseDate(val[i].value,this.format);
      if(!date){
        toReturn.push({label:"",value:""});
        continue;
      }
      val[i].value=date.format('Y-m-d H:i:s');
      toReturn.push(val[i]);
    }
    return(toReturn);
  }
});
