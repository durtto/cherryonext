// $Id: DateOperators.js 297787 2008-02-07 14:12:18Z UE014015 $

Ext.namespace('Ext.ux.netbox.date');

/** It istantiate a new DateOperator
  * @class This is the general class for all DateOperators (with the exception of DatePeriodOperator)<BR>
  * <B>NB:</B> The value of a date operator (ie: value[0].value) will be always in the following format: Y-m-d H:i:s
  * @constructor
  * @extends Ext.ux.netbox.core.Operator
  * @param {String} id The id of the operator
  * @param {String} label The label of the operator
  * @param {String} format The format of the date. Supported formats:
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

  this.mapping={
    d: '99',
    m: '99',
    Y: '9999',
    y: '99',
    H: '99',
    i: '99',
    s: '99'
  }
};

Ext.extend(Ext.ux.netbox.date.DateOperator,Ext.ux.netbox.core.Operator,/** @scope Ext.ux.netbox.date.DateOperator.prototype */{
  /** getEditor. This function returns the Ext.Editor to use to edit the values for this operator.
    * It returns a TextValuesEditor whose field has the right input mask, and the right function to validate the given date
    * @param {boolean} cache true to use a cached editor if available, and to put the newly created editor in the cache if not available, false otherwise. The default is true
    * @return {Ext.ux.netbox.core.TextValuesEditor}
    */
  getEditor: function(cache){
    if(cache===undefined){
      cache=true;
    }
    var editor;
    if(this.editor===undefined || this.editor===null || !cache){
      editor=new Ext.ux.netbox.date.DateTextEditor({format: this.format},new Ext.form.TextField(this.getTextFieldConfig()));
      if(cache){
        this.editor=editor;
      }
    } else {
      editor=this.editor;
    }
    return(editor);
  },

  /** It returns the config to use to create the Ext.form.TextField
    * It's composed by a plugin that register a quickTip and by a InputTextMask with the right mask as plugin,
    * and by a function that check if the date is valid
    * @private
    * @return {Object} An object with 2 elements, a plugin field with an array as value, containing an inputMask and a plugin that create a quickTip, and a function that validates the dates
    */
  getTextFieldConfig: function(){
    Ext.QuickTips.init();
    var registerTip=function(field){
      Ext.QuickTips.register({target: field.getEl(),text: this.format});
    }
    registerTip=registerTip.createDelegate(this);
    var x={init:
      function(field){
        if(field.rendered){
          registerTip(field);
        } else {
          field.on('render',registerTip);
        }
      }
    }
    return({plugins: [new Ext.ux.netbox.InputTextMask(this.calculateMask(), true),x],
      validator: this.checkDate.createDelegate(this) });
  },

  /** This method, given the format, returns a mask to use
    * in the InputTextMask for the given format
    * @return {String} The format to use
    */
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
  },

  /** Check if a date is valid.
    * @return {boolean} true if the date is valid, false otherwise
    */
  checkDate: function(value,format){
    if(format==undefined){
      format=this.format;
    }
    var date=Date.parseDate(value,format);
    if(!date){
      return(false);
    }
    var valueTmp=date.format(format);
    if(value!=valueTmp){
      return(false);
    }
    return(true);
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
        if(this.checkDate(value[0].label) && this.checkDate(value[0].value,'Y-m-d H:i:s')){
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
    for(var i=0; i < val.length; i++){
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
Ext.ux.netbox.date.DateRangeOperator = function(format) {
  Ext.ux.netbox.date.DateRangeOperator.superclass.constructor.call(this,"DATE_RANGE",this.includeText,format);
}

Ext.extend(Ext.ux.netbox.date.DateRangeOperator,Ext.ux.netbox.date.DateOperator,/** @scope Ext.ux.netbox.date.DateRangeOperator.prototype */{

  fromText    : 'from: ',
  toText      : ', to: ',
  includeText : 'between',

  /** This method returns the Ext.ux.netbox.core.RangeField used to edit the range of dates
    * @param {boolean} cache true to use a cached editor if available, and to put the newly created editor in the cache if not available, false otherwise. The default is true
    * @return {Ext.ux.netbox.core.RangeField} The Ext.Editor used to edit the date range value
    * @private
    */
  getEditor: function(cache){
    if(cache===undefined){
      cache=true;
    }
    var editor;
    if(this.editor===undefined || this.editor===null || !cache){
      var field=new Ext.ux.netbox.core.RangeField({
        textCls: Ext.form.TextField,
        fromConfig: this.getTextFieldConfig(),
        toConfig: this.getTextFieldConfig(),
        minListWidth: 260,
        fieldSize: 36
      });

      editor=new Ext.ux.netbox.date.DateRangeEditor(field,{format: this.format});
      field.on("editingcompleted",editor.completeEdit,editor);
      if(cache){
        this.editor=editor;
      }
    } else {
      editor=this.editor;
    }
    return(editor);
  },
  /** This function returns a string rendering the values. The format is da: (value[0].label), a: (value[1].label).
    * If the value doesn't have any of the elements, "" is used.
    * @param {Array} value The value to render
    * @return {String} The rendered value
    * @private
    */
  render: function(value){
    var valueFrom=value[0] == undefined ? '' : value[0].label;
    var valueTo=value[1] == undefined ? '' : value[1].label;
      return(this.fromText+valueFrom+this.toText+valueTo);
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
Ext.ux.netbox.date.DatePeriodOperator = function() {
  Ext.ux.netbox.date.DatePeriodOperator.superclass.constructor.call(this,"DATE_PERIOD",this.periodText);
  /** Store used to show the available values
    * @property {Ext.data.Store} periodStore
    * @private
    */
  this.periodStore=new Ext.data.SimpleStore({fields: ['value', 'label'],
      data: [
        ["LAST_YEAR",this.yearText],
        ["LAST_MONTH",this.monthText],
        ["LAST_WEEK",this.weekText],
        ["LAST_DAY",this.dayText],
        ["LAST_HOUR",this.hourText],
        ["LAST_QUARTER",this.quarterText]
      ]});
}

Ext.extend(Ext.ux.netbox.date.DatePeriodOperator,Ext.ux.netbox.core.Operator,/** @scope Ext.ux.netbox.date.DatePeriodOperator.prototype */{

  periodText  : "period",
  yearText    : "last year",
  monthText   : "last month",
  weekText    : "last week",
  dayText     : "last day",
  hourText    : "last hour",
  quarterText : "last quarter",

  /** This function sets the store of the periods.
    * The store must be local, and must have the label and value column
    * The default store is the following:
    * <PRE>
    * new Ext.data.SimpleStore({fields: ['value', 'label'],
    *  data: [
    *    ["LAST_YEAR","last year"],
    *    ["LAST_MONTH","last month"],
    *    ["LAST_WEEK","last week"],
    *    ["LAST_DAY","last day"],
    *    ["LAST_HOUR","last hour"],
    *    ["LAST_QUARTER","last quarter"]
    *  ]});
    * </PRE>
    *@param {Ext.data.Store} store The store that contains the available periods
    */
  setPeriods: function(store){
    this.periodStore=store;
    this.editor=null;
  },
  /** This method retruns an Ext.ux.netbox.core.AvailableValuesEditor used to edit the periods
    * The editor is created using the periodStore as local store
    * @param {boolean} cache true to use a cached editor if available, and to put the newly created editor in the cache if not available, false otherwise. The default is true
    * @return {Ext.ux.netbox.core.AvailableValuesEditor} The editor used to choose the periods
    */
  getEditor: function(cache){
    if(cache===undefined){
      cache=true;
    }
    var editor;
    if(this.editor===undefined || this.editor===null || !cache){
      editor=new Ext.ux.netbox.core.AvailableValuesEditor(this.periodStore,false);
      if(cache){
        this.editor=editor;
      }
    } else {
      editor=this.editor;
    }
    return(editor);
  },

  /**This method convert an old value in a filter to a new value,
    * suitable for this operator. If the given value is an array, with at least one element,
    * this element is an object with {label:...,value:...} and the value is in the period store,
    * an array with the first element is returned, an empty array otherwise.
    * @param {Object} value The value to convert
    * @return {Array} The converted value
    */
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