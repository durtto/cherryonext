Ext.define('Ext.ux.netbox.number.NumberRangeOperator', {
	extend: 'Ext.ux.netbox.core.Operator',
	constructor: function(opType) {
	  Ext.ux.netbox.number.NumberRangeOperator.superclass.constructor.call(this,opType,this.includeText);
	  var validateFn=function(value){
	    var isOk=this.getField().emptyNotAllowedFn(value);
	    if(isOk!==true){
	      return(isOk);
	    }
	    if(value.length!=2){
	      return(this.bothFromAndToNotEmpty);
	    }
	    var fromANumber=this.isNumeric(value[0]);
	    var toANumber=this.isNumeric(value[1]);
	    if(!fromANumber && !toANumber){
	      return(this.toAndFromNotANumber);
	    }
	    
	    if(!fromANumber){
	      return(this.fromNotANumber);
	    }
	    
	    if(!toANumber){
	      return(this.toNotANumber);
	    }
	    
	    if(parseFloat(value[0])>parseFloat(value[1])){
	      return(this.fromBiggerThanTo);
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
  fromNotANumber: "From is not a number",
  toNotANumber: "To is not a number",
  toAndFromNotANumber: "From and to are not numbers",
  isNumeric: function (value){
    if(Ext.type(value)==='number'){
      return(isFinite(value));
    } else if(Ext.type(value)==='string'){
      // I use this function like this: if (isNumeric(myVar)) { }
      // regular expression that validates a value is numeric
      if(value.lastIndexOf(".")===value.length){
        return("A number should not end with a .");
      }
      var RegExp = /^(-)?(\d+)(\.?)(\d*)$/;
      // Note: this WILL allow a number that ends in a decimal: -452.
      // compare the argument to the RegEx
      // the 'match' function returns 0 if the value didn't match
  
      return(value.match(RegExp));
    }
    return(false);
  },

  render: function(value){
    var valueFrom=value[0] == undefined ? '' : value[0].label;
    var valueTo=value[1] == undefined ? '' : value[1].label;
    return(this.fromText+": "+valueFrom+", "+this.toText+": "+valueTo);
  }
});
