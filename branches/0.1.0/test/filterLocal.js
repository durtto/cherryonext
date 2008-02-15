function escapeRegExp(s){
  return s.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
}

function calcolateValue(value){
  if(value.length==0){
    return("");
  } else {
    return(value[0].value);
  }
}

function calcolateValueNumber(value){
  if(value.length==0){
    thorws("Not a number");
  } else {
    return(parseFloat(value[0].value));
  }
}


var filterStringEquals=function(record, value,column){
  return(record.get(column)===calcolateValue(value));
}

var filterStringDifferent=function(record, value,column){
  return(!filterStringEquals(record, value,column));
}

var filterStringStartsWith=function(record, value,column){
  var val=escapeRegExp(calcolateValue(value));
  var pattern = new RegExp('^' + val,'');
  return(record.get(column).match(pattern));
}

var filterStringEndsWith=function(record, value,column){
  var val=escapeRegExp(calcolateValue(value));
  var pattern = new RegExp(val+'$','');
  return(record.get(column).match(pattern));
}

var filterStringContains=function(record, value,column){
  var val=escapeRegExp(calcolateValue(value));
  var pattern = new RegExp('.*'+val+'.*','');
  return(record.get(column).match(pattern));
}

var filterStringDoesntContains=function(record, value,column){
  return(!filterStringContains(record, value,column));
}

var filterNumberEqual=function(record, value,column){
  var val;
  try {
    val=calcolateValueNumber(value);
  } catch (e){
    return(false);
  }
  return(record.get(column)===val);
}

var filterNumberDifferent=function(record, value,column){
  return(filterStringDifferent(record, value,column));
}

var filterNumberGreater=function(record, value,column){
    var val;
  try {
    val=calcolateValueNumber(value);
  } catch (e){
    return(false);
  }
  return(record.get(column)>val);
}

var filterNumberLessOrEqual=function(record, value,column){
  return(!filterNumberGreater(record, value,column));
}

var filterNumberLess=function(record, value,column){
  var val;
  try {
    val=calcolateValueNumber(value);
  } catch (e){
    return(false);
  }
  return(record.get(column) < val);
}

var filterNumberGreaterOrEqual=function(record, value,column){
  return(!filterNumberLess(record, value,column));
}

var mapping={
  NUMBER_EQUAL: filterNumberEqual,
  NUMBER_NOT_EQUAL: filterNumberDifferent,
  NUMBER_GREATER: filterNumberGreater,
  NUMBER_GREATER_OR_EQUAL: filterNumberGreaterOrEqual,
  NUMBER_LESS: filterNumberLess,
  NUMBER_LESS_OR_EQUAL: filterNumberLessOrEqual,
  STRING_EQUALS: filterStringEquals,
  STRING_DIFFERENT: filterStringDifferent,
  STRING_CONTAINS:  filterStringContains,
  STRING_DOESNT_CONTAIN: filterStringDoesntContains,
  STRING_STARTS_WITH: filterStringStartsWith,
  STRING_ENDS_WITH: filterStringEndsWith};

function filter(record,id,filterObj){
  if(filterObj==undefined)
    filterObj=filterManager.getFilter();
  if(filterObj==null)
    return(true);
  if(filterObj.operation!=undefined){
    var fn=mapping[filterObj.operation];
    return(fn(record,filterObj.values,filterObj.id));
  } else {
    var ret=filter(record,id,filterObj.left);
    if(ret)
      return(filter(record,id,filterObj.right));
    else
      return ret;
  }
}
