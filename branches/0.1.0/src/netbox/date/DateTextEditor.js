// $Id: DateTextEditor.js 300311 2008-02-11 13:09:39Z SO000377 $

Ext.namespace('Ext.ux.netbox.date');

/** It instantiates a new DateTextEditor
  * @class This class extends Ext.ux.netbox.core.TextValuesEditor to manage dates as value,
  * parsing the result to verify if it's a valida date.
  * For a description of the parameters look at the documentation of Ext.Editor
  * @constructor
  * @extends Ext.ux.netbox.core.TextValuesEditor
  */
Ext.ux.netbox.date.DateTextEditor = function(config, field){
  Ext.ux.netbox.date.DateTextEditor.superclass.constructor.call(this,config,field);
  if(config.format==undefined){
    config.format='Y-m-d H:i:s';
  }
  this.format=config.format;
}

Ext.extend(Ext.ux.netbox.date.DateTextEditor,Ext.ux.netbox.core.TextValuesEditor,/** @scope Ext.ux.netbox.date.DateTextEditor.prototype */{

  /** This method gets the value. If the value inserted by the user is not a valid date, an empty array is returned.
   */
  getValue: function() {
    var val=Ext.ux.netbox.date.DateTextEditor.superclass.getValue.call(this);
    if(val.length==1){
      var date=Date.parseDate(val[0].value,this.format);
      if(!date){
        return([]);
      }
      val[0].value=date.format('Y-m-d H:i:s');
    }
    return(val);
  }
});