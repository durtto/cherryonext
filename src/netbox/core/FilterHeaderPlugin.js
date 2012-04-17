// $Id$

/** It creates a new filter header plugin.
  * @class This is a plugin for an Ext.grid.GridPanel useful to highlight the columns of the grid on which there is at least a filter.
  * It assumes that the id of the fields and the dataIndex of the columns are the same.
  * <h4> Example</h4>
  * <pre>
  * grid = new Ext.grid.GridPanel({
  *   store: store,
  *   columns: [
  *     ....
  *   ],
  *   ...
  *   plugins: [new Ext.ux.netbox.core.FilterHeaderPlugin(filterModel)],
  *   ....
  * });
  * </pre>
  * @constructor
  * @param {Ext.ux.netbox.core.FilterModel} filterModel The filterModel that owns the filter
  */
Ext.define('Ext.ux.netbox.core.FilterHeaderPlugin', {
	constructor: function(filterModel) {
	  this.filterModel = filterModel;
  },
  
  filterCls: 'ux-filtered-column',

  
  init : function(grid) {
    this.grid = grid;
    grid.on("render", this.onRender, this);
  },

  
  onRender: function(){
    this.grid.getView().on("refresh", this.onRefresh, this);
    this.updateColumnHeadings(this.grid.getView());
  },

  
  onRefresh: function(view){
    this.updateColumnHeadings(view);
  },

  
  updateColumnHeadings: function(view){
    if(!view || !view.mainHd) return;
    var hds = view.mainHd.select('td').removeClass(this.filterCls);
    for(var i=0, len=view.cm.config.length; i<len; i++){
      var filters = this.filterModel.getElementaryFiltersByFieldId(view.cm.config[i].dataIndex);
      for(var j=0;j<filters.length;j++){
        if(filters[j].isValid()===true){
          hds.item(i).addCls(this.filterCls);
          break;
        }
      }
    }
  }

});
