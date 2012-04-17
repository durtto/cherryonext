// $Id$

/** It creates a new number field
 * @class This is the class that implements the field to use if the type is date.
 * It contains as default the following operator:
 * <ul>
 *   <li> DATE_EQUAL </li>
 *   <li> DATE_GREATER </li>
 *   <li> DATE_GREATER_OR_EQUAL </li>
 *   <li> DATE_LESS </li>
 *   <li> DATE_LESS_OR_EQUAL </li>
 *   <li> DATE_RANGE </li>
 *   <li> DATE_PERIOD </li>
 * </ul>
 * The default operator is DATE_PERIOD
 * @param {String} id The Field id.
 * @param {String} label Optional. The label of the filter. If not supplied the id is used.
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
 * @constructor
 * @extends Ext.ux.netbox.core.Field
 */
Ext.define('Ext.ux.netbox.date.DateField', {
	extend: 'Ext.ux.netbox.core.Field',
	constructor: function(id,label,format) {
	
	  this.periodStore=Ext.create('Ext.data.SimpleStore',{fields: ['value', 'label'],
	      data: [
	        ["LAST_QUARTER",this.quarterText],
	        ["LAST_HOUR",this.hourText],
	        ["LAST_DAY",this.dayText],
	        ["LAST_WEEK",this.weekText],
	        ["LAST_MONTH",this.monthText],
	        ["LAST_YEAR",this.yearText]
          ]});

	  Ext.ux.netbox.date.DateField.superclass.constructor.call(this,id,label);
	  this.setValidateFn(this.validateDate);
	  var periodOperator = Ext.create('Ext.ux.netbox.date.DatePeriodOperator');
	  this.addOperator(periodOperator);
	  this.setDefaultOperator(periodOperator);
	  this.addOperator(Ext.create('Ext.ux.netbox.date.DateOperator',"DATE_EQUAL","=",format));
	  noEmptyAllowed=Ext.bind(this.emptyNotAllowedFn,this);
	  var op=Ext.create('Ext.ux.netbox.date.DateOperator',"DATE_GREATER",">",format);
	  op.addValidateFn(noEmptyAllowed);
	  this.addOperator(op);
	  op=Ext.create('Ext.ux.netbox.date.DateOperator',"DATE_GREATER_OR_EQUAL",">=",format);
	  op.addValidateFn(noEmptyAllowed);
	  this.addOperator(op);
	  op=Ext.create('Ext.ux.netbox.date.DateOperator',"DATE_LESS","<",format);
	  op.addValidateFn(noEmptyAllowed);
	  this.addOperator(op);
	  op=Ext.create('Ext.ux.netbox.date.DateOperator',"DATE_LESS_OR_EQUAL","<=",format);
	  op.addValidateFn(noEmptyAllowed);
	  this.addOperator(op);	
	  this.addOperator(Ext.create('Ext.ux.netbox.date.DateRangeOperator',format));
	  if (format==null) format='Y-m-d|Y-n-d';
	  var splittedFormat=format.split(" ");
	  this.format=this.dateFormat=splittedFormat[0];
	  if (splittedFormat.length>1) {
		  this.timeFormat=splittedFormat[1];
		  this.format=this.dateFormat+" "+this.timeFormat;
	  }
  },
  
  setValue: function(combo, newValue, oldValue, eOpts) {
  	combo.select(newValue);
  },

  periodText  : "period",
  yearText    : "last year",
  monthText   : "last month",
  weekText    : "last week",
  dayText     : "last day",
  hourText    : "last hour",
  quarterText : "last quarter",
  valueNotExpected: "Value not expected",
  
  setDateTimeValue: function(value) {
	  if (value===undefined || value==null || !Ext.isArray(value)) {
		  value = [""];
	  }
	  
	  this.dateTimeField.setValue(value[0]);

  },
  
  getDateTimeRangeValue: function() {
	  if (this.rangeCellEditor===undefined) return "";
	  var val=this.rangeEditor.getValueStr();
	  return val;
  },
  
  getDateTimeValue: function() {
	  if (this.dateTimeField===undefined) return "";
	  var val=this.dateTimeField.getValueStr();

	  return val;
  },
  
  autoSizeDateTime: function() {
	  this.dateField.autoSize();
	  this.dateField.autoSize();
  },
  
  resetDateTime: function() {
	  this.dateField.reset();
	  if (this.timefield!==undefined) {
		  this.timeField.reset();
	  }
  }, 
  
  getDateTimeErrors: function(value) {
	  return this.dateField.getErrors();
  },
  
  completeEdit: function(cellEditor) {
	  if (cellEditor!=undefined && cellEditor!=null) cellEditor.completeEdit();
  },
  
  completeEditors: function() {
//	  this.completeEdit(this.comboEditor);
//	  this.completeEdit(this.dateTimeField);
	  if (this.dateTimeField!=undefined) this.dateTimeField.stopEditing();
  },
  
  onBeforecomplete: function(celEditor,value,startValue,eOpts ) {
	
	if (!this.rangeEditor.canClose()) return false;
	this.rangeEditor.stopEdit();
	return true;
  },
  
  onCompleteEdit: function() {
	  this.rangeCellEditor.completeEdit();
  },
    
  stopDateTimeEditor: function() {
	  this.dateTimeField.stopEdit();
  },
  
  getEditor: function(operatorId,filter,editorId) {
	  if (operatorId=="DATE_PERIOD") {
		  if (this.comboEditor===undefined) {			  
			  var comboEditor=Ext.create('Ext.form.field.ComboBox',{ 
				                                               store:this.periodStore,
				                                               queryMode     : 'local',
				                                               valueField    : 'value',
				                                               displayField  : 'label',
				                                               editable      : false,
				                                               triggerAction : 'all',
				                                               lazyRender    : true
				                                             });
			  comboEditor.on('change',this.setValue,this);
			  this.comboEditor=Ext.create('Ext.grid.CellEditor', {
	              editorId: editorId,
	              field: comboEditor
	             });
		  }
		  return this.comboEditor;
	  } else if (operatorId=="DATE_RANGE") {
		  if (this.rangeCellEditor===undefined) {			  
			  this.rangeEditor=Ext.create('Ext.ux.netbox.date.RangeEditor',{dateFormat:this.dateFormat,
																			timeFormat:this.timeFormat,
																			format:this.format,
																			completeHandler:Ext.bind(this.onCompleteEdit,this)});
			  this.rangeCellEditor=Ext.create('Ext.grid.CellEditor', {editorId: editorId,
														              field: this.rangeEditor});
			  this.rangeCellEditor.on('beforecomplete',this.onBeforecomplete,this);
		  }
		  return this.rangeCellEditor;
	  } else {
		  if (this.dateTimeFieldCellEditor===undefined) {
			  this.dateTimeField=dateTimeField=Ext.create('Ext.ux.netbox.date.DateTimeEditor',{dateFormat:this.dateFormat,
																				               timeFormat:this.timeFormat,
																				               format:this.format});
			  this.dateTimeFieldCellEditor=Ext.create('Ext.grid.CellEditor', {
																              editorId: editorId,
																              field: dateTimeField});
			  this.dateTimeFieldCellEditor.on('beforecomplete',this.stopDateTimeEditor,this);
		  } else {
			  try {
				  this.dateTimeFieldCellEditor.setVisible(true);
				  this.dateTimeField.setVisible(true);
			  } catch(e) {}
		  }
		  
		  return this.dateTimeFieldCellEditor;
	  }
	  
  },
  
  getPeriodStore: function() {	  
	  return this.periodStore;
  },
	
  getValueLabel: function(value,operator) {
	if (operator.getId()=="DATE_PERIOD") {
		if (value===undefined || value==null || !Ext.isArray(value)) {
          return this.getPeriodStore().findRecord('value',operator.getDefaultValues[0]).get('label');
		}
		return this.getPeriodStore().findRecord('value',value).get('label');
	}
	if (operator.getId()=="DATE_RANGE") {
		return this.getDateTimeRangeValue();
	}
	return this.getDateTimeValue();
  },

	validateDate: function(values){
//    for(var i=0;values && i<values.length;i++){
//      if(values[i].value!=="" && !this.checkDate(values[i].value,'Y-m-d H:i:s')){
//        return(this.checkDate(values[i].value,'Y-m-d H:i:s'));
//      }
//    }
    return(true);
  },
  
  checkDate: function(value,format){
    if(format==undefined){
      format=this.dateFormat;
    }
	 if (value===undefined || format===undefined) return false;
    
    var date=Ext.Date.parse(value,format);
    if(!date){
      return(false);
    }
    var valueTmp=Ext.Date.parse(date,format);
    if(value!=valueTmp){
      return(false);
    }
    return(true);
  },
  
  checkDatePeriod: function(value) {
	  if (this.getPeriodStore()===undefined) return false;
	  return (this.getPeriodStore().find("value",value[0])!=-1);
  }
  
});
