// $Id$

/** Build a new LocalStoreFilterResolver.
  * @param {Ext.ux.netbox.core.FilterModel} filterModel The filterModel whose filter must be applied to the store
  * @param {Object} mapping A mapping to use instead of the default one.
  * @class This is the class that does the actual filtering with a DataStore that has local data. For each available operator (identified by id) it defines
  * a function that returns if a record matches an elementary filter or not. These functions have as input parameters:
  * <ol>
  *   <li> <b>record</b>: Ext.data.Record <em> The record of the store that the function should check</em></li>
  *   <li> <b>value</b>: Mixed <em> The value of the elementary filter that the function should evaluate</em></li>
  *   <li> <b>column</b>: String <em> The field id of the elementary filter that the function should evaluate</em></li>
  * </ol>
  * For example if I have a filter <PRE>{id:"Ciccio", operator: "STRING_EQUAL", values:[{label: "bombo",value:"bombo"}]},</PRE> the function corresponding with
  * STRING_EQUAL in the mapping will be called for each record in the store, with [{label: "bombo",value:"bombo"}] as value and "Ciccio" as column.<br>
  * This is, for example, the default mapping:
  * <PRE>
  * this.mapping={NUMBER_EQUAL: {fn: this.filterNumberEqual, scope: this},
  *   NUMBER_NOT_EQUAL: {fn: this.filterNumberDifferent, scope: this},
  *   NUMBER_GREATER: {fn: this.filterNumberGreater, scope: this},
  *   NUMBER_GREATER_OR_EQUAL: {fn: this.filterNumberGreaterOrEqual, scope: this},
  *   NUMBER_LESS: {fn: this.filterNumberLess, scope: this},
  *   NUMBER_LESS_OR_EQUAL: {fn: this.filterNumberLessOrEqual, scope: this},
  *   NUMBER_RANGE: {fn: this.filterNumberRange, scope: this},
  *   STRING_EQUAL: {fn: this.filterStringEquals, scope: this},
  *   STRING_DIFFERENT: {fn: this.filterStringDifferent, scope: this},
  *   STRING_CONTAINS: {fn: this.filterStringContains, scope: this},
  *   STRING_DOESNT_CONTAIN: {fn: this.filterStringDoesntContains, scope: this},
  *   STRING_STARTS_WITH: {fn: this.filterStringStartsWith, scope: this},
  *   STRING_ENDS_WITH: {fn: this.filterStringEndsWith, scope: this},
  *   STRING_LIST: {fn: this.filterList, scope: this},
  *   STRING_NOT_IN_LIST: {fn: this.filterNotInList, scope: this}};
  * </PRE>
  * If, in the mapping, the scope field is null, the default scope (window) is used
  * To use this class you should instantiate the class,
  * and then use the filter method of the class as argument of the filterBy method of the store<br>
  * <h4> Example</h4>
  * If you have a grid, with a Store with local data, to filter the grid you simply call the apply function
  * <PRE>
  * var localFilterResolver=new Ext.ux.netbox.core.LocalStoreFilterResolver(filterModel);
  * function filterGrid(){
  *   localFilterResolver.apply(store);
  * }
  * </PRE>
  * @constructor
  */
Ext.define('Ext.ux.netbox.core.LocalStoreFilterResolver', {
	constructor: function(filterModel, mapping) {
	  
	  this.mapping=null;
	  if(mapping==undefined){
	    this.mapping={
	      NUMBER_EQUAL: {fn: this.filterNumberEqual, scope: this},
	      NUMBER_NOT_EQUAL: {fn: this.filterNumberDifferent, scope: this},
	      NUMBER_GREATER: {fn: this.filterNumberGreater, scope: this},
	      NUMBER_GREATER_OR_EQUAL: {fn: this.filterNumberGreaterOrEqual, scope: this},
	      NUMBER_LESS: {fn: this.filterNumberLess, scope: this},
	      NUMBER_LESS_OR_EQUAL: {fn: this.filterNumberLessOrEqual, scope: this},
	      NUMBER_RANGE: {fn: this.filterNumberRange, scope: this},
	      STRING_EQUAL: {fn: this.filterStringEquals, scope: this},
	      STRING_DIFFERENT: {fn: this.filterStringDifferent, scope: this},
	      STRING_CONTAINS: {fn: this.filterStringContains, scope: this},
	      STRING_DOESNT_CONTAIN: {fn: this.filterStringDoesntContains, scope: this},
	      STRING_STARTS_WITH: {fn: this.filterStringStartsWith, scope: this},
	      STRING_ENDS_WITH: {fn: this.filterStringEndsWith, scope: this},
	      STRING_LIST: {fn: this.filterList, scope: this},
	      STRING_NOT_IN_LIST: {fn: this.filterNotInList, scope: this},
	      DATE_EQUAL:{fn: this.filterDateEqual, scope: this},
	      DATE_GREATER:{fn: this.filterDateGreater, scope: this},
	      DATE_GREATER_OR_EQUAL:{fn: this.filterDateGreaterOrEqual, scope: this},
	      DATE_LESS:{fn: this.filterDateLess, scope: this},
	      DATE_LESS_OR_EQUAL:{fn: this.filterDateLessOrEqual, scope: this},
	      DATE_RANGE:{fn: this.filterDateRange, scope: this},
	      DATE_PERIOD:{fn: this.filterDatePeriod, scope: this}
	    };
	  }
	  
	  this.filterModel=filterModel;
	},
	
  escapeRegExp: function(s){
    return s.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
  },
  
  calcolateValue: function(value){
    if(value.length==0){
      return("");
    } else {
      return(value[0].value);
    }
  },
  
  calcolateValueNumber: function(value){
    if(value.length==0){
      throw("Not a number");
    } else {
      var val=parseFloat(value[0].value);
      if(isNaN(val)){
        throw("Not a number");
      }
      return(val);
    }
  },
  
  calcolateValueDate: function(value){
    if(value.length==0){
      throw("Not a date");
    } else {
      var date=Date.parseDate(value[0].value,'Y-m-d H:i:s');
      if(!date){
        throw("Not a date");
      }
      return(date);
    }
  },
  
  filterStringEquals: function(record, value,column){
    return(record.get(column)===this.calcolateValue(value));
  },
  
  filterStringDifferent: function(record, value,column){
    return(!this.filterStringEquals(record, value,column));
  },
  
  filterList:  function(record, value,column){
    for(var i=0; i<value.length;i++){
      if(this.filterStringEquals(record, [value[i]],column)){
        return(true);
      }
    }
    return(false);
  },
  
  filterNotInList:  function(record, value,column){
    return(!this.filterList(record, value,column));
  },
  
  filterStringStartsWith: function(record, value,column){
    var val=this.escapeRegExp(this.calcolateValue(value));
    var pattern = Ext.create('RegExp','^' + val,'');
    return(record.get(column).match(pattern)!==null);
  },
  
  filterStringEndsWith: function(record, value,column){
    var val=this.escapeRegExp(this.calcolateValue(value));
    var pattern = Ext.create('RegExp',val+'$','');
    return(record.get(column).match(pattern)!==null);
  },
  
  filterStringContains: function(record, value,column){
    var val=this.escapeRegExp(this.calcolateValue(value));
    var pattern = Ext.create('RegExp','.*'+val+'.*','');
    return(record.get(column).match(pattern)!==null);
  },
  
  filterStringDoesntContains:function(record, value,column){
    return(!this.filterStringContains(record, value,column));
  },
  
  filterNumberEqual: function(record, value,column){
    var val;
    try {
      val=this.calcolateValueNumber(value);
    } catch (e){
      return(false);
    }
    return(record.get(column)===val);
  },
  
  filterNumberDifferent:function(record, value,column){
    return(!this.filterNumberEqual(record, value,column));
  },
  
  filterNumberGreater: function(record, value,column){
    var val;
    try {
      val=this.calcolateValueNumber(value);
    } catch (e){
      return(false);
    }
    return(record.get(column)>val);
  },
  
  filterNumberLessOrEqual: function(record, value,column){
    var val;
    try {
      val=this.calcolateValueNumber(value);
    } catch (e){
      return(false);
    }
    return(!this.filterNumberGreater(record, value,column));
  },
  
  filterNumberLess: function(record, value,column){
    var val;
    try {
      val=this.calcolateValueNumber(value);
    } catch (e){
      return(false);
    }
    return(record.get(column) < val);
  },
  
  filterNumberGreaterOrEqual: function(record, value,column){
    var val;
    try {
      val=this.calcolateValueNumber(value);
    } catch (e){
      return(false);
    }
    return(!this.filterNumberLess(record, value,column));
  },
  
  filterNumberRange: function(record, value,column){
    if(value.length!=2){
      return(false);
    }
    var matchLower=this.filterNumberGreaterOrEqual(record,[value[0]],column);
    var matchUpper=this.filterNumberLessOrEqual(record,[value[1]],column);
    return(matchLower && matchUpper);
  },
  
  filterDateEqual: function(record, value,column){
    var date;
    try {
      date=this.calcolateValueDate(value);
    } catch (e){
      return(false);
    }
    return(record.get(column).getTime()==date.getTime());
  },
  
  filterDateGreater: function(record, value,column){
    var date;
    try {
      date=this.calcolateValueDate(value);
    } catch (e){
      return(false);
    }
    return(record.get(column).getTime()>date.getTime());
  },
  
  filterDateLessOrEqual: function(record, value,column){
    var val;
    try {
      val=this.calcolateValueDate(value);
    } catch (e){
      return(false);
    }
    return(!this.filterDateGreater(record, value,column));
  },
  
  filterDateLess: function(record, value,column){
    var date;
    try {
      date=this.calcolateValueDate(value);
    } catch (e){
      return(false);
    }
    return(record.get(column).getTime() < date.getTime());
  },
  
  filterDateGreaterOrEqual: function(record, value,column){
    var date;
    try {
      date=this.calcolateValueDate(value);
    } catch (e){
      return(false);
    }
    return(!this.filterDateLess(record, value,column));
  },
  
  filterDateRange: function(record, value,column){
    if(value.length!=2){
      return(false);
    }
    var matchLower=this.filterDateGreaterOrEqual(record,[value[0]],column);
    var matchUpper=this.filterDateLessOrEqual(record,[value[1]],column);
    return(matchLower && matchUpper);
  },
  
  filterDatePeriod: function(record, value,column){
    if(value.length!=1){
      return(false);
    }
    var upper=Ext.create('Date');
    upperValue={label: upper.format('Y-m-d H:i:s'),value:upper.format('Y-m-d H:i:s')};
    var lower;
    if(value[0].value==='LAST_YEAR'){
      lower=upper.add(Date.YEAR,-1);
    } else if (value[0].value==='LAST_MONTH'){
      lower=upper.add(Date.MONTH,-1);
    }else if (value[0].value==='LAST_WEEK'){
      lower=upper.add(Date.DAY,-7);
    }else if (value[0].value==='LAST_DAY'){
      lower=upper.add(Date.DAY,-1);
    }else if (value[0].value==='LAST_HOUR'){
      lower=upper.add(Date.HOUR,-1);
    }else if (value[0].value==='LAST_QUARTER'){
      lower=upper.add(Date.MINUTE ,-15);
    } else {
      return(false);
    }
    var lowerValue={label: lower.format('Y-m-d H:i:s'),value:lower.format('Y-m-d H:i:s')};
    return(this.filterDateRange(record, [lowerValue,upperValue],column));
  },
  
  apply : function(store){
    store.filterBy(this.filter,this);
  },
  
  filter: function(record,id,filterObj){
    if(filterObj==undefined)
      filterObj=this.filterModel.getFilterObj();
    if(filterObj==null)
      return(true);
    if(filterObj.operatorId!=undefined){
      var fn=this.mapping[filterObj.operatorId].fn;
      var scope=this.mapping[filterObj.operatorId].scope;
      if(scope===undefined || scope === null){
        scope=window;
      }
      toReturn=fn.call(scope,record,filterObj.values,filterObj.fieldId);
      return(toReturn);
    } else {
      var ret=this.filter(record,id,filterObj.left);
      if(ret===true && filterObj.logicalOperator===Ext.ux.netbox.core.CompositeFilter.OR)
        return true;
      if(ret===false && filterObj.logicalOperator===Ext.ux.netbox.core.CompositeFilter.AND)
        return(false);
      ret=this.filter(record,id,filterObj.right);
      return(ret);
    }
  }
});
