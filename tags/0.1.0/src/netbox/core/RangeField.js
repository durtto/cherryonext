// $Id: RangeField.js 304727 2008-02-14 13:45:03Z SO000377 $

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
  } else {
    this.defaultAutoCreate.size=20;
  }
  Ext.ux.netbox.core.RangeField.superclass.constructor.call(this,config);

  this.addEvents('editingcompleted');
}

Ext.extend(Ext.ux.netbox.core.RangeField,Ext.form.TriggerField,/** @scope Ext.ux.netbox.core.RangeField.prototype */
{
  fromText : 'from: ',
  toText   : ', to: ',
  /**
     * @cfg {String/Object} autoCreate A DomHelper element spec, or true for a default element spec (defaults to
     * {tag: "input", type: "text", size: "20", autocomplete: "off"})
     */
  defaultAutoCreate : {tag: "input", type: "text", size: "20", autocomplete: "off"},
  readOnly: true,
  rangeValue: null,

  /** onTriggerClick
    * @private
    */
  onTriggerClick: function(){
    if(this.disabled){
      return;
    }
    if(this.menu == null){
      this.menu = new Ext.ux.netbox.core.RangeMenu(this.textCls,this.fromConfig,this.toConfig);
      this.menu.on('hide', this.fireEditingCompleted, this);
    }

    this.menu.on(Ext.apply({}, this.menuListeners, {
      scope:this
    }));
    var menuEl=this.menu.getEl();
    var width=Math.max(this.wrap.getWidth(),this.minListWidth)
    menuEl.setWidth(width);
    this.menu.doLayout(width-menuEl.getBorderWidth('lr')-menuEl.getPadding('lr')-menuEl.getMargins('lr'));
    this.menu.show(this.el);
    this.menu.setValue(this.rangeValue);
    
  },
  /** validateBlur
    * @private
    */
  validateBlur: function(e){
    return(this.menu && !this.menu.getEl().contains(e.target));
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
    valueFrom = val[0] !== undefined ? val[0] : {value:''};
    valueTo = val[1] !== undefined ? val[1] : {value:''};
    formattedValue=this.fromText+valueFrom.value+this.toText+valueTo.value;
    Ext.ux.netbox.core.RangeField.superclass.setValue.call(this, formattedValue);
    this.rangeValue=val;
    if(this.menu!=null){
      this.menu.setValue(this.rangeValue);
    }
  },
  /** fireEditingCompleted
    * @private
    */
  fireEditingCompleted: function(){
    this.fireEvent('editingcompleted');
  }

});