<?php

  function isDecimalNumber($n) {
    return (string)(float)$n === (string)$n;
  }
  function calculateValue($value){
    if(count($value)===0){
      return("");
    } else {
      return(str_replace("'","''",$value[0]->value));
    }
  }
  function escapeForLike($value){
    $value=str_replace("\\","\\\\",$value);
    $value=str_replace("_","\\_",$value);
    $value=str_replace("%","\\%",$value);
    return($value);
  }
  function string_equals($field,$value){
    $val=calculateValue($value);
    if($val===""){//in Oracle empty string and null value are the same thing
      return($field."is null");
    } else {
      return($field."='".$val."'");
    } 
  }
  
  function string_different($field,$value){
    $val=calculateValue($value);
    if($val===""){//in Oracle empty string and null value are the same thing
      return($field."is not null");
    } else {
      return($field."<>'".$val."'");
    } 
  }
  
  function string_list($field,$value){
    $values=Array();
    $toReturn="";
    foreach($value as $val){
      $val=calculateValue($val);
      if($val===""){
        $toReturn="(".$field."is null";
      } else {
        $values[]=$val;
      }
    }
    if(count($values)>0){
      if(strlen($toReturn)>0){
        $toReturn.=" or";
      }
      $toReturn.=" ".$field." in ('".implode("','",$values)."')";
    }
    return($toReturn);
  }
  
  function string_not_in_list($field,$value){
    return("not ".string_list($field,$value));
  }
  
  function string_starts_with($field,$value){
    $val=calculateValue($value);
    if($val===""){
      return ("1=1");
    }
    $val=escapeForLike($val);
    return($field." like '".$val."%' escape '\\'");
  }
  
  function string_ends_with($field,$value){
    $val=calculateValue($value);
    if($val===""){
      return ("1=1");
    }
    $val=escapeForLike($val);
    return($field." like '%".$val."' escape '\\'");
  }
  
  function string_contains($field,$value){
    $val=calculateValue($value);
    if($val===""){
      return ("1=1");
    }
    $val=escapeForLike($val);
    return($field." like '%".$val."%' escape '\\'");
  }
  
  function string_doesnt_contains($field,$value){
    return("not ".string_contains($field,$value));
  }
  
  function number_equals($field,$value){
    $val=calculateValue($value);
    if($val===""){
      return($field." is null");
    }elseif(isDecimalNumber($val)){
      return($field."=".$val);
    }else{
      return("1<>1");//it's not a number, always false
    }
  }
  
  function number_differents($field,$value){
    $val=calculateValue($value);
    if($val===""){
      return($field." is not null");
    }elseif(isDecimalNumber($val)){
      return($field."<>".$val);
    }else{
      return("1=1");//it's not a number, always true
    }
  }
  
  function number_greater($field,$value){
    $val=calculateValue($value);
    if(isDecimalNumber($val)){
      return($field.">".$val);
    }else{
      return("1<>1");//it's not a number, always false
    }
  }
  
  function number_less_or_equal($field,$value){
    $val=calculateValue($value);
    if(isDecimalNumber($val)){
      return($field."<=".$val);
    }else{
      return("1<>1");//it's not a number, always false
    }
  }
  
  function number_less($field,$value){
    $val=calculateValue($value);
    if(isDecimalNumber($val)){
      return($field."<".$val);
    }else{
      return("1<>1");//it's not a number, always false
    }
  }
  
  function number_greater_or_equal($field,$value){
    $val=calculateValue($value);
    if(isDecimalNumber($val)){
      return($field.">=".$val);
    }else{
      return("1<>1");//it's not a number, always false
    }
  }
  
  function number_range($field,$value){
    if(count($value)!==2){
      return("1<>1"); //if I don't have 2 numbers always return false
    }
    
    $valFrom=Array(0=>$value[0]);
    $valTo=Array(0=>$value[1]);
    
    return("(".number_greater_or_equal($field,$valFrom). " and ".number_less_or_equal($field,$valTo).")");
  }
  
  function date_equal($field,$value){
    $val=calculateValue($value);
    if($val===""){
      return($field." is null");
    } else {
      return($field."=to_date('".$val."','YYYY-MM-DD HH24:MI:SS')");
    }
  }
  
  function date_greater($field,$value){
    $val=calculateValue($value);
    if($val===""){
      return($field." is null");
    } else {
      return($field.">to_date('".$val."','YYYY-MM-DD HH24:MI:SS')");
    }
  }
  
  function date_less_or_equal($field,$value){
    $val=calculateValue($value);
    if($val===""){
      return($field." is null");
    } else {
      return($field."<=to_date('".$val."','YYYY-MM-DD HH24:MI:SS')");
    }
  }
  
  function date_less($field,$value){
    $val=calculateValue($value);
    if($val===""){
      return($field." is null");
    } else {
      return($field."<to_date('".$val."','YYYY-MM-DD HH24:MI:SS')");
    }
  }
  
  function date_greater_or_equal($field,$value){
    $val=calculateValue($value);
    if($val===""){
      return($field." is null");
    } else {
      return($field.">=to_date('".$val."','YYYY-MM-DD HH24:MI:SS')");
    }
  }
  
  function date_range($field,$value){
    if(count($value)!==2){
      return("1<>1"); //if I don't have 2 dates always return false
    }
    
    $valFrom=Array(0=>$value[0]);
    $valTo=Array(0=>$value[1]);
    
    return("(".date_greater_or_equal($field,$valFrom). " and ".date_less_or_equal($field,$valTo).")");
  }
  function date_period($field,$value){
    $val=calculateValue($value);
    if($val===""){
      return("1<>1");
    } else {
      if($val==='LAST_YEAR'){
        $val="sysdate-TO_YMINTERVAL('01-00')";
      }elseif ($val==='LAST_MONTH'){
        $val="ADD_MONTHS(sysdate,-1)";
      }elseif ($val==='LAST_MONTH'){
        $val="sysdate -7";
      }elseif ($val==='LAST_DAY'){
        $val="sysdate -1";
      }elseif ($val==='LAST_HOUR'){
        $val="sysdate -(1/24)";
      }elseif ($val==='LAST_QUARTER'){
        $val="sysdate -(1/96)";
      } else {
        return("1<>1");
      }
      return($field." > ".$val);
    }
  }
  $mapping=Array(      
      'NUMBER_EQUAL' => 'number_equals',
      'NUMBER_NOT_EQUAL'=> 'number_differents',
      'NUMBER_GREATER'=> 'number_greater',
      'NUMBER_GREATER_OR_EQUAL'=> 'number_greater_or_equal',
      'NUMBER_LESS'=> 'number_less',
      'NUMBER_LESS_OR_EQUAL'=> 'number_less_or_equal',
      'NUMBER_RANGE'=> 'number_range',
      'STRING_EQUALS'=> 'string_equals',
      'STRING_DIFFERENT'=> 'string_different',
      'STRING_CONTAINS'=> 'string_contains',
      'STRING_DOESNT_CONTAIN'=> 'string_doesnt_contains',
      'STRING_STARTS_WITH'=> 'string_starts_with',
      'STRING_ENDS_WITH'=> 'string_ends_with',
      'STRING_LIST'=> 'string_list',
      'STRING_NOT_IN_LIST'=> 'string_not_in_list',
      'DATE_EQUAL'=>'date_equal',
      'DATE_GREATER'=>'date_greater',
      'DATE_GREATER_OR_EQUAL'=>'date_greater_or_equal',
      'DATE_LESS'=>'date_less',
      'DATE_LESS_OR_EQUAL'=>'date_less_or_equal',
      'DATE_RANGE'=>'date_range',
      'DATE_PERIOD'=>'date_period'
  );
    
  function getSQL($filterObj){
    global $mapping;
    if($filterObj==null)
      return("1=1");
    if(isset($filterObj->operatorId)){
      return($mapping[$filterObj->operatorId]($filterObj->fieldId,$filterObj->values));
    } else {
      $leftSql=getSQL($filterObj->left);
      $rightSql=getSQL($filterObj->right);
      return("(".$leftSql." ".$filterObj->logicalOperator." ".$rightSql.")");
    }
  }
  
?>
