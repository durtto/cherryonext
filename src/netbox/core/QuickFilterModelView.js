// $Id$

/** Create a new QuickFilterModelView.
  * @class Provides a view on FilterModel and allows to quickly add filters directly from a grid using a context menu.
  * In this way you right click on a cell of the grid (for example the cell containing the value "John" in the name column), a context menu appears,
  * you select the operator from the context menu (for example "=") and a filter is added (name = "John"). <br>
  * <b>NB</b> By default it will use the value in the store as value, and what returned by the renderer of the column as label
  * Default operators are as follows, divided by datatype:<p><em>
  * <b>String</b>: ['STRING_EQUAL','STRING_DIFFERENT']<br>
  * <b>Enummerative</b>: ['STRING_EQUAL','STRING_DIFFERENT']<br>
  * <b>Number</b>: ['NUMBER_EQUAL','NUMBER_NOT_EQUAL','NUMBER_GREATER','NUMBER_GREATER_OR_EQUAL','NUMBER_LESS','NUMBER_LESS_OR_EQUAL']<br>
  * <b>Date</b>: ['DATE_EQUAL','DATE_GREATER','DATE_GREATER_OR_EQUAL','DATE_LESS','DATE_LESS_OR_EQUAL']</em></p>
  * You can define your own list of operators for each field in the config of the class.
  * @constructor
  * @extends Ext.util.Observable
  * @param {Object} config An object which may contain the following properties:
  * @config {Ext.ux.netbox.core.FilterModel} filterModel The FilterModel (mandatory) which is associated the QuickFilter.
  * @config {Array of Object} fieldsOptions The options (otional) for configure the operators to show or add new custom getter function
  * Each element of the array has the following fields:
  * <ul>
  *   <li> <b>id:</b> <em>id of the field</em></li>
  *   <li> <b>operators:</b> <em>array of operators id. This is the set of operators available in the quick filter for the field</em></li>
  *   <li> <b>getterFn</b>: <em>
  *       function that, given the value in the grid, returns the value for the filter.
  *       Usefull for example when the rendered value is totally different from the store value.
  *       This function has the following attributes:
  *       <ul>
  *         <li><b>tableValue:</b> The value in the Store that is displayed in the cell of the grid</li>
  *         <li><b>fieldId:</b> The id of the field on which the elementary filter will be created</li>
  *         <li><b>operatorId:</b> The id of the operator choose by the user</li>
  *         <li><b>grid:</b> The grid on which the user clicked</li>
  *         <li><b>row:</b> the row on which the user clicked</li>
  *         <li><b>column:</b> the column on which the user clicked</li>
  *       </ul>
  *     </em>
  *   </li>
  * </ul>
  * @config {boolean} duplicatedElementaryFiltersAllowed True to allow 2 equals elementary filter (i.e. to allow name='John' 2 times). Optional. Default false
  * @config {boolean} isStatic True to use QuickFilter with StaticFilterModelView. Optional. Default false
  * <h4> Example </h4>
  * <pre>
  * var quickFilter= new Ext.ux.netbox.core.QuickFilterModelView({
  *   filterModel: filterModel,
  *   //for the grid's column inPortfolio the value in the store is different from the rendered one....
  *   fieldsOptions: [{
  *     id: "inPortfolio",
  *     getterFn: function(value,fieldId,operatorId,grid,row,column){
  *       return([{
  *         value: value,
  *         label: inPortfolio(value)
  *       }]);
  *     }
  *   }]
  * });
  * quickFilter.on("filterChanged",filterTable);
  * var contextMenuManager=new Ext.ux.netbox.ContextMenuManager({menu: {items:[quickFilter.getFilterMenu(),quickFilter.getRemoveFilterMenu()]}});
  * var grid = new Ext.grid.GridPanel({
  *     store: ....,
  *     columns: ....,
  *     plugins: [contextMenuManager],
  *   });
  * </pre>
  */
Ext.define('Ext.ux.netbox.core.QuickFilterModelView', {
	extend: 'Ext.util.Observable',
    constructor: function(config) {
	  this.addEvents({
		    /** Fires when a quickFilter is added or removed
		      * @event filterChanged
		      */
		    filterChanged : true
		  });

		  this.filterModel=config.filterModel;
		  this.quickFilterItem=null;
		  this.removeFilterItem=null;
		  this.fieldsOptions=config.fieldsOptions;
		  if(config.duplicatedElementaryFiltersAllowed===undefined){
		    this.duplicatedElementaryFiltersAllowed=false;
		  } else {
		    this.duplicatedElementaryFiltersAllowed=config.duplicatedElementaryFiltersAllowed;
		  }
		  if(config.isStatic===undefined){
		    this.isStatic=false;
		  } else {
		    this.isStatic=config.isStatic;
		  }
		  this.stringOperDefault = ['STRING_EQUAL','STRING_DIFFERENT'];
		  this.numberOperDefault = ['NUMBER_EQUAL','NUMBER_NOT_EQUAL','NUMBER_GREATER','NUMBER_GREATER_OR_EQUAL','NUMBER_LESS','NUMBER_LESS_OR_EQUAL'];
		  this.intOperDefault    = ['INT_EQUAL'   ,'INT_NOT_EQUAL'   ,'INT_GREATER'   ,'INT_GREATER_OR_EQUAL'   ,'INT_LESS'   ,'INT_LESS_OR_EQUAL'   ];
		  this.longOperDefault   = ['LONG_EQUAL'  ,'LONG_NOT_EQUAL'  ,'LONG_GREATER'  ,'LONG_GREATER_OR_EQUAL'  ,'LONG_LESS'  ,'LONG_LESS_OR_EQUAL'  ];
		  this.dateOperDefault = ['DATE_EQUAL','DATE_GREATER','DATE_GREATER_OR_EQUAL','DATE_LESS','DATE_LESS_OR_EQUAL'];
  },
  
  quickFilterText   : 'QuickFilter',
  removeText        : 'Remove filter',
  removeAllText     : 'Remove all',

  /** Creates menu items based on the operators set for the selected field
   * @private
   */
  filterIsToShow: function(grid,row,column){
    if(column==-1 || this.getField(grid,column)==null){
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
        if(field instanceof Ext.ux.netbox.string.StringField || field instanceof Ext.ux.netbox.string.EnumField){
          availableOperatorsId=this.stringOperDefault;
        }else if(field instanceof Ext.ux.netbox.number.LongField || field instanceof Ext.ux.netbox.number.EnumLongField) {
        	availableOperatorsId=this.longOperDefault;
        }else if(field instanceof Ext.ux.netbox.number.IntField || field instanceof Ext.ux.netbox.number.EnumIntField){
        	availableOperatorsId=this.intOperDefault;
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
        var isToAdd=true;
        var operator=field.getAvailableOperatorById(availableOperatorsId[i]);
        var filterItem = {
          text: Ext.util.Format.htmlEncode(operator.getLabel()),
          handler: Ext.bind(this.setFilter,this,[grid,row,column,field.getId(),operator.getId()],false)
        };

        var filtersList=this.filterModel.getElementaryFiltersByFieldId(field.getId());
        var values=this.getValues(grid,row,column,field.getId(),operator.getId());
        for(var j=0;j<filtersList.length;j++){
          if(filtersList[j].getOperator().getId()===operator.getId() &&
          Ext.JSON.encode(filtersList[j].getValues())===Ext.JSON.encode(values))
            isToAdd=false;
        }
        if(operator.validate(values)!==true)
          isToAdd=false;

        if(isToAdd)
          itemsArray.push(filterItem);
      }

      if(itemsArray.length > 0){
        this.quickFilterItem.setSubMenu(Ext.create('Ext.menu.Menu',{items: itemsArray}));
        return true;
      } else {
        return false;
      }
    }
  },

  /**
   * @private
   */
  getValues: function(grid,row,column,fieldId,operatorId){
    var record=grid.getStore().getAt(row);
    var tableValue=record.get(grid.columns[column].dataIndex);
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
        getterFn=this.getValuesOther;
      }
    }

    if(!getterScope)
      getterScope=this;

    var values=getterFn.call(getterScope,tableValue,fieldId,operatorId,grid,row,column);
    return values;
  },

  getEditor: function(operatorId,filter) {
	  if (this.textFieldEditor===undefined) {
		  this.textFieldEditor=Ext.create('Ext.form.TextField');
	  }
	  return this.textFieldEditor;
  },

  /** Default getter. Returns the values formatted.
   * @private
   */
  getValuesOther: function(tableValue,fieldId,operatorId,grid,row,column){
    var label=grid.columns[column].text;
    return([{label: label, value: tableValue}]);
  },

  /** Default getter for dates. Returns the values formatted, only for dates.
   * @private
   */
  getValuesDate: function(tableValue,fieldId,operatorId,grid,row,column){
    var field=this.filterModel.getFieldManager().getFieldById(fieldId);
    var operator=field.getAvailableOperatorById(operatorId);
    return([{label: field.getLabel(), value: Ext.Date.format(operator.getFormat(),tableValue)}]);
  },

  /** Method that takes care of the filter set on filterModel when selecting a menu item.
   * @private
   */
  setFilter: function(grid,row,column,fieldId,operatorId){
    var values=this.getValues(grid,row,column,fieldId,operatorId);
    var filterObject={fieldId : fieldId, operatorId : operatorId, values : values}
    var addFilter=true;
    if(!this.duplicatedElementaryFiltersAllowed){
      var elementaryFilters=this.filterModel.getElementaryFiltersByFieldId(fieldId);
      for(var i=0; i<elementaryFilters.length;i++){
        //quick way to compare 2 filters
        if(elementaryFilters[i].getOperator().getId()===operatorId
          && Ext.JSON.encode(elementaryFilters[i].getValues())===Ext.JSON.encode(values)){
            addFilter=false;
            break;
        }
      }
    }
    if(this.isStatic){
      var elementaryFilters=this.filterModel.getElementaryFiltersByFieldId(fieldId);
      for(var i=0; i<elementaryFilters.length;i++){
        this.filterModel.removeElementaryFilterById(elementaryFilters[i].getId());
      }
    }
    if(addFilter){
      this.filterModel.addElementaryFilter(filterObject);
      this.fireEvent('filterChanged');
    }
  },

  /** Returns a menu item containing the operators available for the selected field,
   * which corresponds to one of the columns of the grid.
   * @return (Ext.ux.netbox.ContainerMenuItem)
   */
  getFilterMenu: function(){
    if(this.quickFilterItem==null){
      this.quickFilterItem = Ext.create('Ext.ux.netbox.ContainerMenuItem',{
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
  getRemoveFilterMenu: function(){
    if(this.removeFilterItem==null){
      this.removeFilterItem = Ext.create('Ext.ux.netbox.ContainerMenuItem',{
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
  removeFilterIsToShow: function(grid,row,column){
    var filters=this.filterModel.getAllElementaryFilters();
    if(filters.length > 0){

      var itemsArray=[];

      for(var i=0;i<filters.length;i++){
        var label=filters[i].getField().getLabel()+' '+ filters[i].getOperator().getLabel()+' '+filters[i].getOperator().render(filters[i].getValues());
        var iconCls='';
        if(filters[i].isValid()!==true)
          iconCls='x-icon-invalid';
        var filterItem={
          iconCls  : iconCls,
          text     : label,
          handler  : Ext.bind(this.removeFilterById,this,[filters[i].getId()],false),
          isToShow : function(){return(true);}
        };
        itemsArray.push(filterItem);
      }

      var removeAllFilterItem = {
        text    : this.removeAllText,
        handler : this.removeAllFilters,
        scope   : this,
        isToShow: function(){return(true);}
      };
      itemsArray.push(removeAllFilterItem);

      this.removeFilterItem.setSubMenu(Ext.create('Ext.menu.Menu',{items: itemsArray}));
      return true;
    }else{
      return false;
    }
  },

  /** Removes all filters set on the filterModel.
   * @private
   */
  removeAllFilters: function(){
    this.filterModel.setFilterObj(null);
    this.fireEvent('filterChanged');
  },

  /** Removes one filter by id from the filterModel.
   * @private
   */
  removeFilterById: function(filterId){
    this.filterModel.removeElementaryFilterById(filterId);
    this.fireEvent('filterChanged');
  },

  /** Returns the field for the given grid and column.
   * @private
   * @ignore
   */
  getField: function(grid,column){
    var columnId=grid.columns[column].dataIndex;
    var field=this.filterModel.getFieldManager().getFieldById(columnId);
    return field;
  }

});
