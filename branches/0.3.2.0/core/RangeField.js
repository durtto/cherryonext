// $Id$

Ext.namespace('Ext.ux.netbox.core');

/** Create a new RangeField
  * A range field is a widget used to edit ranges. It's a trigger field that has in the popup 2 Ext.form.TextField (or classes derived by a TextField)
  * to allow the user to enter the from and the to end points of a range 
  * @extends Ext.form.TriggerField
  * @constructor
  * @param {Object} config Configuration options
  * <ul>
  *   <li> fromConfig The config for the from object</li>
  *   <li> toConfig The config for the from object</li>
  *   <li> textCls The Class to use as from and to (for example Ext.form.TextField)</li>
  *   <li> minListWidth The min width (in pixel) of the popup. Optional. Default 20 </li>
  *   <li> fieldSize The size of the field (in number of characters). Optional. Default 20</li>
  * </ul>
  */
Ext.ux.netbox.core.RangeField = function(config){
  this.textCls=config.textCls;
  this.fromConfig=config.fromConfig;
  this.toConfig=config.toConfig;
  if(config.minListWidth){
    this.minListWidth=config.minListWidth;
  } else {
    this.minListWidth=100;
  }
  if(config.fieldSize){
    this.defaultAutoCreate.size=config.fieldSize;
  }
  Ext.ux.netbox.core.RangeField.superclass.constructor.call(this,config);
}

Ext.extend(Ext.ux.netbox.core.RangeField,Ext.form.TriggerField,/** @scope Ext.ux.netbox.core.RangeField.prototype */{
  /**
     * @cfg {String/Object} autoCreate A DomHelper element spec, or true for a default element spec (defaults to
     * {tag: "input", type: "text", size: "20", autocomplete: "off"})
     */  
  defaultAutoCreate : {tag: "input", type: "text", size: "20", autocomplete: "off"},
  readOnly: true,
  rangeValue: null,
  
  initComponent: function () {
	Ext.ux.netbox.core.RangeField.superclass.initComponent.call(this);
  },
  /** onTriggerClick
    * @private
    */
  onTriggerClick: function(){
    if(this.disabled){
      return;
    }
    if(this.menu == null){
      this.menu = new Ext.ux.netbox.core.RangeMenu(this.textCls,this.fromConfig,this.toConfig,this.validate.createDelegate(this));
    }
    if (this.menuListeners) {
	this.menu.on(Ext.apply({}, this.menuListeners, {scope:this}));
    }
    this.menu.setWidth(this.getWidth());
    this.menu.show(this.getEl());
    this.menu.setValue(this.rangeValue);
  },
  /** getValue
    * @private
    */  
  getValue: function(){
    if(this.menu !== undefined)
      this.rangeValue=this.menu.getValue();
    return(this.rangeValue);
  },
  /** setValue
    * @private
    */  
  setValue: function(val){
    valueFrom = val[0] !== undefined ? val[0] : {value:'',label:''};
    valueTo = val[1] !== undefined ? val[1] : {value:'',label:''};
    formattedValue=this.fromText+": "+valueFrom.label+", "+this.toText+": "+valueTo.label;
    Ext.ux.netbox.core.RangeField.superclass.setValue.call(this, formattedValue);
    this.rangeValue=val;
    if(this.menu!=null){
      this.menu.setValue(this.rangeValue);
    }
  },
  /** It marks the field as invalid. It renders as invalid the from and to field too
    * @private
    * @param {String} msg The message to show to the user
    * @ignore
    */
  markInvalid: function(msg){
    Ext.ux.netbox.core.RangeField.superclass.markInvalid.call(this,msg);
    if(this.menu){
      this.menu.markInvalid(msg);
    }
  },
  /** Overwrites the clearMask function to manage the masks of the from and to fields
    */  
  clearInvalid: function(){
    Ext.ux.netbox.core.RangeField.superclass.clearInvalid.call(this);
    if(this.menu){
      this.menu.clearInvalidFields();
    }
  },
  /** validateBlur
    * @private
    */
  validateBlur: function(e){
    return(this.menu && this.menu.getEl() && !this.menu.getEl().contains(e.target));
  }

});
