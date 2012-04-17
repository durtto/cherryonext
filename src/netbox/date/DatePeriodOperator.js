Ext.define('Ext.ux.netbox.date.DatePeriodOperator', {
	extend: 'Ext.ux.netbox.core.Operator',
	constructor: function(config) {
	  Ext.ux.netbox.date.DatePeriodOperator.superclass.constructor.call(this,"DATE_PERIOD",this.periodText);
	  
	  this.periodStore=new Ext.data.SimpleStore(
	     {fields: ['value', 'label'],
	      data: [
	        ["LAST_QUARTER",this.quarterText],
	        ["LAST_HOUR",this.hourText],
	        ["LAST_DAY",this.dayText],
	        ["LAST_WEEK",this.weekText],
	        ["LAST_MONTH",this.monthText],
	        ["LAST_YEAR",this.yearText]
	      ]});
	   var validateFn=function(value){
	     if(this.getField().emptyNotAllowedFn(value)!==true){
	       return(this.getField().emptyNotAllowedFn(value));
	     }
	     if(value[0]!=="LAST_QUARTER" && value[0]!=="LAST_HOUR"  && value[0]!=="LAST_DAY" &&
	        value[0]!=="LAST_WEEK"    && value[0]!=="LAST_MONTH" && value[0]!=="LAST_YEAR"){
	       return(this.valueNotExpected);
	     }
	     return(true);
	   }
	   this.setValidateFn(validateFn);
	},
	
	getValueLabel: function(value) {
		return this.periodStore.findRecord('value',value).get('label');
	},
	
  periodText  : "period",
  yearText    : "last year",
  monthText   : "last month",
  weekText    : "last week",
  dayText     : "last day",
  hourText    : "last hour",
  quarterText : "last quarter",
  valueNotExpected: "Value not expected",

  
  getDefaultValues : function(){
    return(["LAST_DAY"]);
  },

  
  setPeriods: function(store){
    this.periodStore=store;
    this.editor=null;
  },
  
  createEditor: function(operatorId){
    var editor=Ext.create('Ext.ux.netbox.core.AvailableValuesEditor',this.periodStore);
    return editor;
  },
  
  convertValue: function(value){
    if(value !==null && value !== undefined && Ext.type(value)=="array"){
      if(value.length>0 && value[0]!== undefined){
        if(this.getField().checkDatePeriod(value[0])){
          if(value.length==1){
            return(value);
          } else {
            return([value[0]]);
          }
        }
      }
    }
    return(this.getDefaultValues());
  }
});
