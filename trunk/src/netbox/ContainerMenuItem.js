// $Id$

/** Creates a new ContainerMenuItem. 
  * @class It extends the base functionality of Ext.menu.Item
  * with the possibility of dynamically adding (or removing) a submenu to an item.
  * @constructor
  * @param {Object} config Configuration options. They are exactly the same config option of Ext.menu.Item
  * @extends Ext.menu.Item
  */
Ext.define('Ext.ux.netbox.ContainerMenuItem', {
	extend: 'Ext.menu.Item',
	constructor: function(config) {
	  Ext.ux.netbox.ContainerMenuItem.superclass.constructor.call(this,config);
	},

  getSubMenu : function(){
    return this.menu;
  },

  
  setSubMenu : function(menu){
    this.menu = Ext.menu.MenuMgr.get(menu);
    if(this.getEl()){
      this.getEl().addCls('x-menu-item-arrow');
    }
  },

  
  removeSubMenu : function(){
    this.menu=undefined;
    if(this.getEl()){
      this.getEl().removeClass('x-menu-item-arrow');
    }
  }

});
