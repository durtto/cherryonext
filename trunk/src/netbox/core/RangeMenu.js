// $Id$

Ext.namespace('Ext.ux.netbox.core');

/** Creates a new RangeMenu, a menu containing 2 input box that represents the range value between 2 values.
  * @class This is a private class used by RangeField (it's the popup)
  * @extends Ext.menu.Menu
  * @constructor
  * @ignore
  */
Ext.ux.netbox.core.RangeMenu = function(textCls,fromCfg,toCfg,fieldValidateFunc){
  if(textCls===undefined){
    textCls = Ext.form.TextField;
    textCls.anchor = "100%";
  }
  this.editorFrom=new textCls(fromCfg);
  this.editorTo=new textCls(toCfg);
  this.editorFrom.validate=fieldValidateFunc;
  this.editorTo.validate=fieldValidateFunc;

  this.editorFrom.fieldLabel=this.fromText;
  this.editorTo.fieldLabel=this.toText;

  this.initComponent();

  Ext.ux.netbox.core.RangeMenu.superclass.constructor.apply(this,arguments);
};

Ext.extend(Ext.ux.netbox.core.RangeMenu, Ext.menu.Menu,/** @scope Ext.ux.netbox.core.RangeMenu.prototype */{

  fromText : 'from',  
  toText   : 'to',

  hideOnClick: false,
  layout: "form",
  labelWidth: 38,
  style: {'background-image': 'none'},
  // Needed as it is defined into a MenuLayout but not into the FormLayout
  // that we use for this RangeMenu
  layoutConfig: {  
	doAutoSize : function () {
	}
  },
  
  initComponent: function () {
       Ext.apply(this, {items: [this.editorFrom, this.editorTo]});
       Ext.ux.netbox.core.RangeMenu.superclass.initComponent.call(this);
       this.addEvents({'update': true});
       var items = this.items.items;
       for (var i = 0; i < items.length; i++) {
           items[i].on("keyup", this.onKeyUp, this);
       }
  },
  /** setValue
    * @ignore
    */
  setValue: function(data){
    var from="";
    var to="";
    if(data.length==2){
      from=data[0].label;
      to=data[1].label;
    } else if (data.length==1) {
      from=data[0].label;
    }
    if(to==="") {
        this.editorTo.setRawValue("");
    }else {
	this.editorTo.setValue(to);
    }
    if (from==="") {
        this.editorFrom.setRawValue("");
    } else {
        this.editorFrom.setValue(from);
    }

    this.fireEvent("update", this);
  },
  /** onKeyUp
    * @ignore
    */  
  onKeyUp: function(event){
    if(event.getKey() == event.ENTER && this.isValid()){
      this.hide(true);
      return;
    }
  },
  /** getValue
    * @ignore
    */  
  getValue: function(){
    var result = [{value: this.editorFrom.getValue(), label: this.editorFrom.getValue()}, 
                  {value: this.editorTo.getValue(), label: this.editorTo.getValue()}];
    return result;
  },
  /** isValid
    * @ignore
    */ 
  isValid: function(){
    return (this.editorFrom.isValid() && this.editorTo.isValid());
  },
   /** It sets as invalid the from and to fields
    * @private
    * @param {String} msg The message to show to the user
    * @ignore
    */
  markInvalid: function(msg){
    this.editorFrom.markInvalid(msg);
    this.editorTo.markInvalid(msg);
  },
   /** It clears the invalid mask from the from and to fields
    * @private
    * @ignore
    */ 
  clearInvalidFields: function(){
    this.editorFrom.clearInvalid();
    this.editorTo.clearInvalid();
  }

});
