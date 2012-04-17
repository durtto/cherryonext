// $Id$

/** It instantiates a new DateOperator.
  * @class This is the general class for all DateOperators (with the exception of DatePeriodOperator)<BR>
  * <B>NB:</B> The value of a date operator (ie: value[0].value) will be always in the following format: Y-m-d H:i:s
  * @constructor
  * @extends Ext.ux.netbox.core.Operator
  * @param {String} id The id of the operator
  * @param {String} label The label of the operator
  * @param {String} format The format of the date. The date format should be divided from time format by a space.
  * If you provided only the date format, the time field will not appear.<br>
  * Supported formats:
  * <PRE>
  * Format  Description                                                               Example returned values
  * ------  -----------------------------------------------------------------------   -----------------------
  * d       Day of the month, 2 digits with leading zeros                             01 to 31
  * m       Numeric representation of a month, with leading zeros                     01 to 12
  * Y       A full numeric representation of a year, 4 digits                         Examples: 1999 or 2003
  * y       A two digit representation of a year                                      Examples: 99 or 03
  * H       24-hour format of an hour with leading zeros                              00 to 23
  * i       Minutes, with leading zeros                                               00 to 59
  * s       Seconds, with leading zeros                                               00 to 59
  *</PRE>
  */
Ext.ux.netbox.date.DateOperator = function(id,label,format) {
  Ext.ux.netbox.date.DateOperator.superclass.constructor.call(this,id,label,format);

  /** With this operator I want always a TextField with the right mask
    * This is the variable that contains the editor
    * @property {Ext.Editor} editor
    */
  this.editor=null;
  /** The format of the dates
    * @property {String} format
    */
  this.format=format;
};

Ext.extend(Ext.ux.netbox.date.DateOperator,Ext.ux.netbox.core.Operator,/** @scope Ext.ux.netbox.date.DateOperator.prototype */{
  /** This method creates an Ext.ux.netbox.date.DateTextEditor.
    * @param {String} operatorId The operatorId actually used in the filter
    * @return {Ext.Editor} The field used to edit the values of this filter
    */
  createEditor: function(operatorId){
    var editor;
    var splittedFormat=this.format.split(" ");
    if(splittedFormat.length > 1){
      var dateTimeField=new Ext.ux.form.DateTime({
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
      editor=new Ext.ux.netbox.date.DateTextEditor(dateTimeField,{format: this.format});
    }else{
      editor=new Ext.ux.netbox.date.DateTextEditor(new Ext.form.DateField({
                format: splittedFormat[0],
                allowBlank: false
              }),
              {format: this.format}
            );
    }
    return editor;
  },

  /** This function controls if the given value is an array with at least an element. If the given element is an object
    * with the format {label: , value: } and the value is a valid date in the format Y-m-d H:i:s, it returns an array containing the first element
    * otherwise it returns an empty array
    * @param {Object} value The value to convert
    * @return {Array} The converted object
    */
  convertValue: function(value){
    if(value !==null && value !== undefined && Ext.type(value)=="array"){
      if(value.length>0 && value[0].value!== undefined && value[0].label!== undefined){
        if(this.getField().checkDate(value[0].label) && this.getField().checkDate(value[0].value,'Y-m-d H:i:s')){
          if(value.length==1){
            return(value);
          } else {
            return([value[0]]);
          }
        }
      }
    }
    return([]);
  },

  /** Returns the format of the dates
    * @return {String} The format of the dates
    */
  getFormat : function(){
    return this.format;
  }
});

/** It instantiates a new DateRangeEditor
  * @class Editor used to edit date ranges. The DATE_RANGE operator returns this editor.
  * @constructor
  * @extends Ext.ux.netbox.FilterEditor
  */
Ext.ux.netbox.date.DateRangeEditor=function(field,config){
  Ext.ux.netbox.date.DateRangeEditor.superclass.constructor.call(this,field,config);
  this.format=config.format;
}

Ext.extend(Ext.ux.netbox.date.DateRangeEditor,Ext.ux.netbox.FilterEditor,/** @scope Ext.ux.netbox.date.DateRangeEditor.prototype */{
  /** This method parses the values returned by the RangeField, and casts the values to follow the Y-m-d H:i:s format
    * @return {Array} Array of object {label: value: } where value is always in the format Y-m-d H:i:s or it is an empty string if the value entered by the user is not a valid date
    */
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

/** It instantiates a new DateRangeOperator
  * @class This is the class that implements the range operator between 2 dates. The id of the operator is DATE_RANGE
  * @constructor
  * @extends Ext.ux.netbox.date.DateOperator
  * @param {String} format See format parameter of DateField
  */
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
      if(value.length>0 && value[0].value!== undefined && value[0].label!== undefined){
        if(this.getField().checkDate(value[0].label) && this.getField().checkDate(value[0].value,'Y-m-d H:i:s')){
          if(value.length==1){
            return(value);
          } else {
            return([value[0]]);
          }
        }
      }
    }
    return([]);
  },

  
  getFormat : function(){
    return this.format;
  }
});

/** It creates a new DatePeriodOperator
  * @class This is the class that implements the period operator. The id of the operator is DATE_PERIOD
  * The available periods are the following:
  * <PRE>
  *   LAST_YEAR: between now and now -1 year
  *   LAST_MONTH: between now and now -1 month
  *   LAST_WEEK: between now and now -1 week
  *   LAST_DAY: between now and now -1 day
  *   LAST_HOUR: between now and now -1 hour
  *   LAST_QUARTER: between now and now -15 minutes
  * </PRE>
  * @constructor
  * @extends Ext.ux.netbox.core.Operator
  * @param {String} format See format parameter of DateField
  */
Ext.define('Ext.ux.netbox.date.DatePeriodOperator', {
	extend: 'Ext.ux.netbox.core.Operator',
	constructor: function(config) {
	  Ext.ux.netbox.date.DatePeriodOperator.superclass.constructor.call(this,"DATE_PERIOD",this.periodText);
	  
	  this.periodStore=Ext.create('Ext.data.SimpleStore',{fields: ['value', 'label'],
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
	     if(value[0].value!=="LAST_QUARTER" && value[0].value!=="LAST_HOUR" && value[0].value!=="LAST_DAY"
	       && value[0].value!=="LAST_WEEK" && value[0].value!=="LAST_MONTH" && value[0].value!=="LAST_YEAR"){
	       return(this.valueNotExpected);
	     }
	     return(true);
	   }
	   this.setValidateFn(validateFn);
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
    return([{value: "LAST_DAY", label: this.dayText}]);
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
      if(value.length>0 && value[0].value!== undefined && value[0].label!== undefined){
        if(this.periodStore.find('value',value[0].value)!='-1'){
          if(value.length==1){
            return(value);
          } else {
            return([value[0]]);
          }
        }
      }
    }
    return([]);
  }
});
