// $Id$

/** It takes in input an object with an attribute, the menu (Ext.menu.Menu )to show as context menu
  * or directly the config object as described below.<br>
  * The items that populate the menu must have the following two custom properties passed in the config:
  * <ul>
  *   <li><b>isToShow</b>: Function<p style="margin-left:1em">Function that indicates whether the item should be displayed in context. Optional
      If not present:
        <ul>
          <li>If the item doesn't have a submenu it will be displayed if the click happened on a cell (i.e. not in the white space outside the rows)</li>
          <li>If the item has a submenu, if there is at least one item visible in the submenu </li>
        </ul>
      </p></li>
  *   <li><b>handler</b>: Function<p style="margin-left:1em">Function invoked when the menu item is selected</p></li>
  * </ul>
  * Both this functions have the same signature, the parameters are the following:
  * <ul>
  *  <li><b>grid</b>: Ext.grid.GridPanel <p style="margin-left:1em">The grid over which the menu is shown</p></li>
  *  <li><b>row</b>: int <p style="margin-left:1em">The row number <b>NB</b> if the user doesn't click on a row it's -1</p></li>
  *  <li><b>column</b>: int <p style="margin-left:1em">The column number <b>NB</b> if the user doesn't click on a column it's -1 (It happens if it clicks on the blank space, or if it clicks exactly over the border of a row..)</p></li>
  *  <li><b>item</b>: Ext.menu.Item <p style="margin-left:1em">The column number <b>NB</b> The item to show/hide, or the clicked item </p></li>
  * </ul>
  * @class This class is a plugin for Ext.grid.GridPanel, and it manages the context menu on a grid. A context menu is a menu that is shown when you right click on the grid, showing actions depending on the content of the cell.
  * When the user clicks on the action, the action has a the row and the column of the cell the user clicked.<br>
  * <B>NB</B>: The context menu will be activated even if the user clicks in the grid outside any cells (for example if the grid is empty). In this case the row and/or the column will be -1
  * <h4>Example</h4>
  * In the following example the context menu is visible only on the even rows of the table, and when the user clicks it an alert with the coordinates of the clicked cell is shown.
  * <PRE>
  * var contextMenu= new Ext.menu.Menu({
  *   items:[{
  *     text: 'prova1',
  *     isToShow: function(grid,row,column){
  *       if(row%2==0){
  *         return(true);
  *       } else {
  *         return(false);
  *       }
  *     },
  *     handler: function(grid,row,column){
  *       alert('row: '+row+' col: '+column);
  *     }
  *   }]
  * });
  * 
  * var contextMenuManager=new Ext.ux.netbox.ContextMenuManager({menu: contextMenu});
  * var gridPanel=new Ext.grid.GridPanel({
  *   store: ....,
  *   columns:....,
  *   plugins: [contextMenuManager],
  *   .....
  * });
  *   
  * </PRE>
  * @constructor
  * @param {Object} config Configuration options
  * @config {Ext.menu.Menu} menu The mandatory menu or a config object for instantiate the menu
  */
Ext.define('Ext.ux.netbox.ContextMenuManager', {
	constructor: function(config) {
	  this.menu=config.menu;  
  },  
  
  init: function(gridPanel){
    this.gridPanel=gridPanel;
    this.gridPanel.on("cellcontextmenu",this.onCellcontextmenuEvent,this);
  },
  
  onCellcontextmenuEvent : function(grid, cell, rowIndex, cellIndex, e){
	  this.onCellcontextmenu(grid, cell, rowIndex, cellIndex, e, null);
  },
  
  onCellcontextmenu : function(grid, cell, rowIndex, cellIndex, e, menu){
	var menuUndefined=false;
    if(!menu){
        menuUndefined=true;
	    if(!(this.menu instanceof Ext.menu.Menu)){
	     this.menu=Ext.create('Ext.menu.Menu',this.menu);
	    }
	    menu=this.menu;
    }   

    e.stopEvent();
    var isSomethingVisible=false;
    for(var i=0;i<menu.items.getCount();i++){
      var itemTmp=menu.items.get(i);
      var scope=itemTmp.initialConfig.scope ? itemTmp.initialConfig.scope : window;
      var visible;
      if(itemTmp.initialConfig.isToShow){
        visible=itemTmp.initialConfig.isToShow.call(scope, grid, rowIndex, cellIndex,itemTmp);
        if(visible && itemTmp.menu){
          this.onCellcontextmenu(grid, cell, rowIndex, cellIndex, e, itemTmp.menu);
        }
      } else {
        if(!itemTmp.menu){
          visible = (rowIndex >=0 && cellIndex>=0);
        } else {
          visible=this.onCellcontextmenu(grid, cell, rowIndex, cellIndex, e, itemTmp.menu);
        }
      }
      if(visible){
        itemTmp.setVisible(true);
        if(itemTmp.initialConfig.handler){
          var handler=Ext.bind(itemTmp.initialConfig.handler,scope,[grid, rowIndex, cellIndex,itemTmp],false);
          itemTmp.setHandler(handler);
        }
        isSomethingVisible=true;
      } else {
        itemTmp.setVisible(false);
      }
    }
    if(isSomethingVisible){
      this.menu.showAt([e.getPageX(),e.getPageY()]);
    }
    return isSomethingVisible;
  },

  
  onContextmenu : function(grid, e, cell, recordIndex, cellIndex){
    var t = e.getTarget();
    var header = this.gridPanel.getView().findHeaderIndex(t);
    if(header !== false){
      return;
    }
    var row=-1;
    var col=-1;
    if(this.gridPanel.getView().findRowIndex(t)!==false){
      row=this.gridPanel.getView().findRowIndex(t);
    }
    if(this.gridPanel.getView().findCellIndex(t)!==false){
      col=this.gridPanel.getView().findCellIndex(t);
    }
    this.onCellcontextmenu(this.gridPanel,row,col,e);
  }

});
