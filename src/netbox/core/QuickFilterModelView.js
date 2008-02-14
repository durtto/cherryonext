// $Id:$

Ext.namespace('Ext.ux.netbox.core');

/** Create a new QuickFilterModelView. 
  * @class Provides a view on FilterModel and allows to quickly add filters directly from a grid using a context menu. 
  * In this way you right click on a cell of the grid (for example the cell containing the value "John" in the name column), a context menu appears, 
  * you select the operator from the context menu (for example "=") and a filter is added (name = "John") 
  * Default operators are as follows, divided by datatype:<p><em>
  * <b>String</b>: ['STRING_EQUALS','STRING_DIFFERENT']<br>
  * <b>Number</b>: ['NUMBER_EQUAL','NUMBER_NOT_EQUAL','NUMBER_GREATER','NUMBER_GREATER_OR_EQUAL','NUMBER_LE$SS','NUMBER_LESS_OR_EQUAL']<br>
  * <b>Date</b>: ['DATE_EQUAL','DATE_GREATER','DATE_GREATER_OR_EQUAL','DATE_LESS','DATE_LESS_OR_EQUAL']</em></p>
  * You can define your own list of operators for each field in the config of the class.
  * @constructor
  * @extends Ext.util.Observable
  * @param {Object} config An object which may contain the following properties:
  * @config {Ext.ux.netbox.core.FilterModel} filterModel The FilterModel (mandatory) which is associated the QuickFilter.
  * @config {Array of Object} fieldsOptions The Options (otional) for configure the operators to show or add new custom getter function
  * Syntax of fieldsOptions object:<br><PRE>
  * [{
  *     <b>id:</b> <em>id of the filter Type</em>, 
  *     <b>operators:</b> <em>array of operator id. This is the set of operators available in the quick filter for the field</em>,
  *     <b>getterFn</b>: <em>function that, given the value in the grid, returns the value for the filter. Usefull for example when you have a "display" and an id, both from the DB</em>,
  *     <b>getterScope</b>:<em>The scope of the getter function</em>
  *  },
  *  {...}]
  */
Ext.ux.netbox.core.QuickFilterModelView=function(config){

  this.addEvents(/** @scope Ext.ux.netbox.core.QuickFilterModelView.prototype */{
    /** Fires when a quickFilter is added or removed
      * @event filterChanged
      */
    filterChanged : true
  });

  this.filterModel=config.filterModel;
  this.quickFilterItem=null;
  this.removeFilterItem=null;
  this.fieldsOptions=config.fieldsOptions;

  this.stringOperDefault = ['STRING_EQUALS','STRING_DIFFERENT'];
  this.numberOperDefault = ['NUMBER_EQUAL','NUMBER_NOT_EQUAL','NUMBER_GREATER','NUMBER_GREATER_OR_EQUAL','NUMBER_LESS','NUMBER_LESS_OR_EQUAL'];
  this.dateOperDefault = ['DATE_EQUAL','DATE_GREATER','DATE_GREATER_OR_EQUAL','DATE_LESS','DATE_LESS_OR_EQUAL'];
}

Ext.extend(Ext.ux.netbox.core.QuickFilterModelView, Ext.util.Observable,/** @scope Ext.ux.netbox.core.QuickFilterModelView.prototype */
{
  quickFilterText   : 'QuickFilter',
  removeText        : 'Remove filter',
  removeAllText     : 'Remove all',

  /** Creates menu items based on the operators set for the selected field
    * @private
    */
  filterIsToShow : function(grid,row,column){
    if(column==-1){
      return false;
    }else{

      var itemsArray=[];
      var field=this.getField(grid,column);
      var availableOperatorsId;

      if(this.fieldsOptions){
        for(var i=0;i<this.fieldsOptions.length;i++){
          if(this.fieldsOptions[i].id===field.getId() && this.fieldsOptions[i].operators){
            availableOperatorsId=this.fieldsOptions[i].operators;
          }
        }
      }

      if(!availableOperatorsId){
        if(field instanceof Ext.ux.netbox.string.StringField){
          availableOperatorsId=this.stringOperDefault;
        }else if(field instanceof Ext.ux.netbox.number.NumberField){
          availableOperatorsId=this.numberOperDefault;
        }else if(field instanceof Ext.ux.netbox.date.DateField){
          availableOperatorsId=this.dateOperDefault;
        }else{
          var availableOperators = field.getAvailableOperators();
          for(var i=0;i<availableOperators.length;i++){
            availableOperatorsId.push(availableOperators[i].getId());
          }
        }
      }

      for(var i=0;i<availableOperatorsId.length;i++){
        var operator=field.getAvailableOperatorById(availableOperatorsId[i]);
        var filterItem = {
          text: Ext.util.Format.htmlEncode(operator.getLabel()),
          handler: this.setFilter.createDelegate(this,[grid,row,column,field.getId(),operator.getId()],false)
        };
        itemsArray.push(filterItem);
      }

      this.quickFilterItem.setSubMenu(new Ext.menu.Menu({items: itemsArray}));
      return true;
    }
  },

  /** Default getter. Returns the values formatted.
    * @private
    */
  getValues: function(tableValue,fieldId,operatorId){
    return([{label: tableValue, value: tableValue}]);
  },

  /** Default getter for dates. Returns the values formatted, only for dates.
    * @private
    */
  getValuesDate: function(tableValue,fieldId,operatorId){
    var field=this.filterModel.getFieldManager().getFieldById(fieldId);
    var operator=field.getAvailableOperatorById(operatorId);

    return([{label: tableValue.format(operator.getFormat()), value: tableValue.format('Y-m-d H:i:s')}]);
  },

  /** Method that takes care of the filter set on filterModel when selecting a menu item.
    * @private
    */
  setFilter : function(grid,row,column,fieldId,operatorId){

    var record=grid.getStore().getAt(row);
    var tableValue=record.get(grid.getColumnModel().getDataIndex(column));

    var getterFn;
    var getterScope;

    if(this.fieldsOptions){
      for(var i=0;i<this.fieldsOptions.length;i++){
        if(this.fieldsOptions[i].id===fieldId && this.fieldsOptions[i].getterFn){
          getterFn=this.fieldsOptions[i].getterFn;
          if(this.fieldsOptions[i].getterScope)
            getterScope=this.fieldsOptions[i].getterScope;
        }
      }
    }

    if(!getterFn){
      var field=this.getField(grid,column);
      var operator=field.getAvailableOperatorById(operatorId);

      if(operator instanceof Ext.ux.netbox.date.DateOperator && tableValue instanceof Date){
        getterFn=this.getValuesDate;
      }else{
        getterFn=this.getValues;
      }
    }

    if(!getterScope)
      getterScope=this;

    var values=getterFn.call(getterScope,tableValue,fieldId,operatorId);
    var filterObject={fieldId : fieldId, operatorId : operatorId, values : values}
    this.filterModel.addElementaryFilter(filterObject);
    this.fireEvent('filterChanged');

  },

  /** Returns a menu item containing the operators available for the selected field,
    * which corresponds to one of the columns of the grid.
    * @return (Ext.ux.netbox.ContainerMenuItem)
    */
  getFilterMenu : function(){

    if(this.quickFilterItem==null){
      this.quickFilterItem = new Ext.ux.netbox.ContainerMenuItem({
        text     : this.quickFilterText,
        isToShow : this.filterIsToShow,
        scope    : this
      });
    }
    return this.quickFilterItem;
  },

  /** Returns a menu item containing the operators to be removed,
    * in a contextual way to the column of the selected cell.
    * @return (Ext.ux.netbox.ContainerMenuItem)
    */
  getRemoveFilterMenu : function(){

    if(this.removeFilterItem==null){
      this.removeFilterItem = new Ext.ux.netbox.ContainerMenuItem({
        text     : this.removeText,
        isToShow : this.removeFilterIsToShow,
        scope    : this
      });
    }
    return this.removeFilterItem;
  },

  /** Creates menu items based on the operators to be removed, for the selected field.
    * @private
    */
  removeFilterIsToShow : function(grid,row,column){
    var filters=this.filterModel.getAllElementaryFilters();
    if(filters.length > 0){

      var itemsArray=[];

      for(var i=0;i<filters.length;i++){
        var label= filters[i].getField().getLabel()+' '+ filters[i].getOperator().getLabel()+' '+filters[i].getOperator().render(filters[i].getValues());
        var filterItem = {
          text: label,
          handler: this.removeFilterById.createDelegate(this,[filters[i].getId()],false)
        };
        itemsArray.push(filterItem);
      }

      var removeAllFilterItem = {
        text    : this.removeAllText,
        handler : this.removeAllFilters,
        scope   : this
      };
      itemsArray.push(removeAllFilterItem);

      this.removeFilterItem.setSubMenu(new Ext.menu.Menu({items: itemsArray}));
      return true;
    }else{
      return false;
    }
  },

  /** Removes all filters set on the filterModel.
    * @private
    */
  removeAllFilters : function(){
    this.filterModel.setFilterObj(null);
    this.fireEvent('filterChanged');
  },

  /** Removes one filter by id from the filterModel.
    * @private
    */
  removeFilterById : function(filterId){
    this.filterModel.removeElementaryFilterById(filterId);
    this.fireEvent('filterChanged');
  },

  /** Returns the field for the given grid and column.
    * @private
    * @ignore
    */
  getField : function(grid,column){
    var columnId=grid.getColumnModel().getDataIndex(column);
    var field=this.filterModel.getFieldManager().getFieldById(columnId);
    return field;
  }

});