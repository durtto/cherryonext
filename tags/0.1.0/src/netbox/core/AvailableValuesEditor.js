// $Id: AvailableValuesEditor.js 303649 2008-02-13 14:23:18Z SO000377 $

Ext.namespace('Ext.ux.netbox.core');

/** This constructor instantiates an editor with an Ext.ux.Andrie.Select to use as editor widget
  * @class This class is used to edit a value of a elementary filter when a set of available values must be shown.
  * The values MUST be in the format [{label:..., value:...}]
  * @constructor
  * @param {Ext.data.Store} store The store used to retrieve the data. It must have 2 columns, label (which will be used as displayField)
  * and value (which will be used as labelField
  * @param {boolean} remote true if the store is remote, false if the data is local (ie, if store is a Ext.data.SimpleStore)
  * @config {Object} config See the parameter with the same name of Ex.ux.FilterEditor. The only added parameter in the config is multiSelect.
  * If true more than one selection is allowed, if false the maximum number of selecte items is 1
  * @extends Ext.ux.netbox.FilterEditor
  */

Ext.ux.netbox.core.AvailableValuesEditor=function(store,remote,config){
  var mode;
  if(remote){
    mode='remote';
  } else {
    mode='local';
  }
  if(config==undefined){
    config={};
  }
  if(config.multiSelect==undefined){
    config.multiSelect=false;
  }
  this.fieldCombo=new Ext.ux.Andrie.Select({
    store         : store,
    displayField  : 'label',
    valueField    : 'value',
    selectOnFocus : true,
    mode          : mode,
    triggerAction : 'all',
    selectOnFocus : true,
    typeAhead     : true,
    multiSelect   : config.multiSelect
  });
  if(!config.multiSelect){
    this.fieldCombo.on('select',this.completeEdit,this);
  }
  Ext.ux.netbox.core.AvailableValuesEditor.superclass.constructor.call(this,this.fieldCombo,config);
  this.store=store;
}

Ext.extend(Ext.ux.netbox.core.AvailableValuesEditor,Ext.ux.netbox.FilterEditor,/** @scope Ext.ux.netbox.core.AvailableValuesEditor.prototype */{

  /** This method sets the value. This means that it sets the value of the inner combo.
    * If the value is an array with at least one element, the value to set is the array of the given elements.
    * Otherwise the value will be the empty string.
    * @param {Object} value The value to set.
    */
  setValue: function(value){
    var val=[];
    var rawVal=[];
    var label='';
    if(value!=undefined && value!=null && Ext.type(value)=="array"){
      if(value.length>0){
        for(var i=0; i< value.length; i++){
          val.push(value[i].value);
          if(value[i].label!=undefined){
            rawVal.push(value[i].label);
          } else {
            rawVal.push(value[i].value);
          }
        }
      }
    }
    this.originalValue=value;

    Ext.ux.netbox.core.AvailableValuesEditor.superclass.setValue.call(this,val);
    /* Hack to show the right label even if the store is not loaded.*/
    Ext.form.ComboBox.superclass.setValue.call(this.fieldCombo,rawVal.join(","));
    this.fieldCombo.value=val;
    this.fieldCombo.rawValueArray=rawVal;
  },
  /** This method gets the value. It searches the values in the store to have, with the values, the labels. If the store is not loaded,
    * since the user didn't modify the value, it returns the original value.
    * @return {Array} An array ob objects in the format {label:..., value:...}
    */
  getValue: function() {
    var val=Ext.ux.netbox.core.AvailableValuesEditor.superclass.getValue.call(this);
    if(Ext.type(val)=='string'){
      if(val===''){
        return([]);
      }
      val=val.split(',');
    }
    var toReturn=[];
    for(var i=0; i<val.length;i++){
      var j=this.store.find('value',val[i]);
      if(j<0)
        continue;
      var record=this.store.getAt(j);
      toReturn.push({label: record.get('label'), value: val[i]});
    }
    //if the user clicks on the field and then it presses Enter, the store is not loaded...
    if(val.length>0 && toReturn.length==0)
      return(this.originalValue);
    else
      return toReturn;
  }
});
