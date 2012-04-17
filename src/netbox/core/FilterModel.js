// $Id$

/** Creates a new FilterModel. It can have as input parametr a fieldManager or the config to build the fieldManager
  * @class The filter model is the core class of the whole filter design, and probably the one you will interact most. It's the class that mantains the filter, it's the class used to obtain
  * an export of the filter in a predefined way (look at getFilterObj for more information about the format), to import a filter, to add or remove a filter and so on. All the views (for example QuickFilterModelView, StaticFilterModelView and DynamicFilterModelView)
  * just shows the data contained in the filter model, and use the filterModel to perform some operation on the filter.
  * A filter model only manages elementary filters that have their field inside the fieldManager that is used to build the filterModel.
  * <h4> Examples </h4>
  * Build a filter model given the fieldManager
  * <pre>
  * var fieldManager=new Ext.ux.netbox.core.FieldManager(fieldManager);
  * </pre>
  * Build a filter model using the config to a fieldManager:
  * <pre>
  *  var filterCfg=[
  *    {id: 'company',label: 'Company'},
  *    {id: 'price',label: 'Price', type: 'float'},
  *    {id: 'change',label: 'Change', type: 'float'},
  *    {id: 'pctChange',label: '% Change', type: 'float'},
  *    {id: 'lastChange',label: 'Last Updated', type: 'date', format: 'd/m/Y H:i'},
  *    {id: 'shouldBuy',label: 'Should Buy', type: 'enum', availableValues: availableValuesStore, remoteStore: false}
  *  ];
  *  var fieldManager=new Ext.ux.netbox.core.FieldManager(filterCfg);
  * </pre>
  * @constructor
  * @param {Mixed} fieldManager A Ext.ux.netbox.core.FieldManager or a config to create a FieldMAnager. In this last case the fieldManager will be built directly by the filter model
  */
Ext.define('Ext.ux.netbox.core.FilterModel', {
	extend: 'Ext.util.Observable',
	constructor: function(config) {
		  Ext.ux.netbox.core.FilterModel.superclass.constructor.call(this);
		  this.addEvents({
		    
		    elementaryFilterAdded : true,
		    
		    elementaryFilterRemoved : true,
		    
		    filterChanged : true
		  });
		  
		  this.filter=null;
		  
		  if(config instanceof Ext.ux.netbox.core.FieldManager)
		    this.fieldManager=config;
		  else
		    this.fieldManager=Ext.create('Ext.ux.netbox.core.FieldManager',config);
		  this.fieldManager.on("beforeFieldRemoved",this.onBeforeFieldRemoved,this);
		  
		  if(config.logicalOperator===undefined)
		    this.logicalOperator=Ext.ux.netbox.core.CompositeFilter.AND;
		  else
		    this.logicalOperator=config.logicalOperator;
   },
  
  onBeforeFieldRemoved: function(field){
    if(this.getElementaryFiltersByFieldId(field.getId()).length>0)
      return(false);
  },
  
  _createFilter : function (fieldId, operator, values){
    var myField=this.getFieldManager().getFieldById(fieldId);
    if(myField==null) throw ("Field "+fieldId+" not found!");
    var elementaryFilter=myField.getElementaryFilterInstance();
    if(operator!=undefined) elementaryFilter.setOperator(operator);
    if(values!=undefined) elementaryFilter.setValues(values);
    return(elementaryFilter);
  },
  
  _addFilter : function(elementaryFilter){
    if(this.getFilter()==null)
      this.filter=elementaryFilter;
    else
      this.filter=Ext.create('Ext.ux.netbox.core.CompositeFilter',this.getFilter(), this.logicalOperator, elementaryFilter);
    this.fireEvent("elementaryFilterAdded", this, elementaryFilter);
  },
  
  _decodeFilter : function(filterObject){
    if(filterObject.fieldId){
      var myField=this.getFieldManager().getFieldById(filterObject.fieldId);
      if(myField==null) throw ("Field "+filterObject.fieldId+" not found!");
      var operator=myField.getAvailableOperatorById(filterObject.operatorId);
      if(operator===null)
        operator=undefined;
      var elementaryFilter=myField.getElementaryFilterInstance(operator);
      elementaryFilter.setFilterObj(filterObject);
      return(elementaryFilter);
    } else {
      var leftTmp=this._decodeFilter(filterObject.left);
      var rightTmp=this._decodeFilter(filterObject.right);
      var myCompositeFilter=Ext.create('Ext.ux.netbox.core.CompositeFilter',leftTmp,filterObject.logicalOperator,rightTmp);
      return(myCompositeFilter);
    }
  },
  
  _encodeFilter : function(filter){
    if(filter.setValues){
      return(filter.getFilterObj());
    } else {
      var filterTmp=filter.getFilterObj();
      filterTmp.left=this._encodeFilter(filterTmp.left);
      filterTmp.right=this._encodeFilter(filterTmp.right);
      return(filterTmp);
    }
  },
  
  _findAndRemoveFilter : function(parentExpression,expression, matchFn, toRemove){
    if(expression instanceof Ext.ux.netbox.core.ElementaryFilter){
      if(matchFn.call(this,expression)){
        toRemove.push(expression);
        return(true);
      } else {
        return(false);
      }
    }

    var shouldRemoveLeft=this._findAndRemoveFilter(expression,expression.getLeftSide(),matchFn,toRemove)
    var shouldRemoveRight=this._findAndRemoveFilter(expression,expression.getRightSide(),matchFn,toRemove);

    if(shouldRemoveRight && shouldRemoveLeft){
      return(true);
    }

    if(shouldRemoveLeft){
      if(parentExpression.getLeftSide()==expression){
        parentExpression.setLeftSide(expression.getRightSide());
      } else {
        parentExpression.setRightSide(expression.getRightSide());
      }
    }

    if(shouldRemoveRight){
      if(parentExpression.getLeftSide()==expression){
        parentExpression.setLeftSide(expression.getLeftSide());
      } else {
        parentExpression.setRightSide(expression.getLeftSide());
      }
    }

    return(false);
  },
  
  getFieldManager : function(){
    return(this.fieldManager);
  },
  
  getFilter : function(){
    return(this.filter);
  },
  
  getFilterObj : function(evenInvalid,additionalFilterObj,additionalLogicalOper){
    var additionalFilter;
    if(additionalFilterObj===undefined){
      additionalFilter=null;
    } else {
      additionalFilter=this._decodeFilter(additionalFilterObj);
    }
    if(additionalLogicalOper===undefined)
      additionalLogicalOper=Ext.ux.netbox.core.CompositeFilter.AND;
    var filter=this.getFilter();

    var filterToExport=null;
    if(this.getFilter()!==null)

    if(filter===null)
      filterToExport=additionalFilter;
    else{
      filterToExport=this._decodeFilter(this._encodeFilter(this.getFilter()));//clone the filter
      if (additionalFilter !== null){
        filterToExport=Ext.create('Ext.ux.netbox.core.CompositeFilter',filterToExport,additionalLogicalOper,additionalFilter);
      }
    }

    if(filterToExport instanceof Ext.ux.netbox.core.ElementaryFilter){
      if(!filterToExport.isValid()){
        filterToExport=null;
      }
    } else if(filterToExport !== null) {
      var matchFn=function(filter){
        return(!filter.isValid());
      };
      var toRemove=[];
      var shouldRemoveLeft=this._findAndRemoveFilter(filterToExport,filterToExport.getLeftSide(),matchFn,toRemove);
      var shouldRemoveRight=this._findAndRemoveFilter(filterToExport,filterToExport.getRightSide(),matchFn,toRemove);
      if(shouldRemoveLeft && shouldRemoveRight){
        filterToExport=null;
      } else if(shouldRemoveLeft){
        filterToExport=filterToExport.getRightSide();
      }else if(shouldRemoveRight){
        filterToExport=filterToExport.getLeftSide();
      }
    }
    if(filterToExport!=null)
      return(this._encodeFilter(filterToExport));
    else
      return null;
  },
  
  setFilterObj : function(filterObject){
    if(filterObject){
      if(!filterObject.setFilterObj){
        filterObject=this._decodeFilter(filterObject);
      }
    }
    this.filter=filterObject;
    this.fireEvent("filterChanged",this);
  },
  
  getElementaryFilterById : function(id){
    if(this.getFilter()!=null)
      return(this.getFilter().getElementaryFilterById(id));
    return(null);
  },
  
  getElementaryFiltersByFieldId : function(fieldId){
    if(this.getFilter()!=null){
      return(this.getFilter().getElementaryFiltersByFieldId(fieldId));
    }
    return [];
  },
  
  addElementaryFilterByFieldId : function(fieldId){
    var elementaryFilter=this._createFilter(fieldId);
    this._addFilter(elementaryFilter);
    return(elementaryFilter.getId());
  },
  
  addElementaryFilter : function (filterObject){
    var elementaryFilter=this._createFilter(filterObject.fieldId, filterObject.operatorId, filterObject.values);
    this._addFilter(elementaryFilter);
    return(elementaryFilter.getId());
  },
  
  removeElementaryFilterById : function(filterId){
    var removedElementaryFilter=null;
    if(this.getFilter()==null)
      throw("Unable to remove the elementaryFilter with id "+filterId+". The elementaryFilter doesn't exist.");
    if(this.getFilter() instanceof Ext.ux.netbox.core.ElementaryFilter){
      if(this.getFilter().getId()==filterId){
        removedElementaryFilter=this.filter;
        this.filter=null;
      } else {
        throw("Unable to remove the elementaryFilter with id "+filterId+". The elementaryFilter doesn't exist");
      }
    } else {
      var matchFn=function(filter){
        if(filter.getId()===filterId){
          return(true);
        } else {
          return(false);
        }
      };
      var toRemove=[];
      var shouldRemoveLeft=this._findAndRemoveFilter(this.getFilter(),this.getFilter().getLeftSide(),matchFn,toRemove);
      var shouldRemoveRight=this._findAndRemoveFilter(this.getFilter(),this.getFilter().getRightSide(),matchFn,toRemove);
      if(toRemove.length===0){
        throw("Unable to remove the elementaryFilter with id "+filterId+". The elementaryFilter doesn't exist");
      }
      removedElementaryFilter=toRemove[0];
      if(shouldRemoveLeft){
        this.filter=this.getFilter().getRightSide();
      }

      if(shouldRemoveRight){
        this.filter=this.getFilter().getLeftSide();
      }
    }
    this.fireEvent("elementaryFilterRemoved", this, removedElementaryFilter);
  },
  
  getAllElementaryFilters : function(filter){
    if(filter===undefined)
      filter=this.getFilter();
    var elementaryFilters=[];
    if(filter!=null){
      if(filter.setValues){
        elementaryFilters.push(filter);
      } else {
        elementaryFilters=elementaryFilters.concat(this.getAllElementaryFilters(filter.getLeftSide()));
        elementaryFilters=elementaryFilters.concat(this.getAllElementaryFilters(filter.getRightSide()))
      }
    }
    return(elementaryFilters);
  },
  
  getLogicalOperator : function(){
    return this.logicalOperator;
  },
  
  setLogicalOperator : function(logicalOperator){
    if(logicalOperator===Ext.ux.netbox.core.CompositeFilter.OR || logicalOperator===Ext.ux.netbox.core.CompositeFilter.AND)
      this.logicalOperator=logicalOperator;
      //evento?
  },
  
  each: function(fn, scope, filter){
    if(filter===undefined)
      filter=this.getFilter();
    if(filter==null)
      return;
    if(scope===undefined)
      scope=window;
    fn.call(scope,filter);
    if(filter instanceof Ext.ux.netbox.core.CompositeFilter){
      this.each(fn,scope,filter.getLeftSide());
      this.each(fn,scope,filter.getRightSide());
    }
  }

});
