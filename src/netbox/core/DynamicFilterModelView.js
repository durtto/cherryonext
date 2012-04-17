// $Id$

Ext.define('Ext.ux.netbox.core.filterModelRecord', {
    extend: 'Ext.data.Model',
    idProperty :'id',
    fields: ['icon',
             'field',
             'operator',
             'values',
             'filter',
             'id'
			]
		});

/** It instantiates a DynamicFilterModelView
  * @class It implements the view for dynamic filters. Dynamic filters mean that the user is allowed to add, remove filter, seeing only the actual filters.
  * It's possible to define more than one filter for the same field.
  * It can be lazyly instantiated using dynamicFilter as xtype.
  * <h4> Example </h4>
  * The following code will instantiate a window with a DynamicFilterModelView inside using lazy initialization
  * <pre>
  * win=new Ext.Window({
  *   title: 'Filters',
  *   width:600,
  *   height:350,
  *   layout: 'border',
  *   closeAction: 'hide',
  *   items: [{ filterModel: filterModel,
  *     region: "center",
  *     xtype: 'dynamicFilter'
  *   }]
  * });
  * </pre>
  * @constructor
  * @param {Object} config
  * @config {Ext.ux.netbox.core.FilterModel}filterModel the filterModel whose filters must be showed
  */
Ext.define('Ext.ux.netbox.core.DynamicFilterModelView', {
	extend: 'Ext.grid.Panel',
	alias : 'widget.dynamicFilter',
	constructor: function(config) {
	  this.filterModel=config.filterModel;

	  this.createFieldCombo();
	  this.createLogicOpeCombo();

	  config=this.createFilterGridConfig(config);
	  Ext.ux.netbox.core.DynamicFilterModelView.superclass.constructor.call(this,config);

	  this.populateFilterStore();
	  this.setLogicOpeCombo();

	  this.on('cellclick', this.removeFilter, this);
//	  this.on('itemclick', this.updateOperatorStore, this);
	  this.on('afteredit', this.updateFilter, this);

	  this.getFilterModel().on('elementaryFilterAdded', this.onFilterAdded, this);
	  this.getFilterModel().on('elementaryFilterRemoved', this.onFilterRemoved, this);
	  this.getFilterModel().on('filterChanged', this.onFilterChanged, this);
	  this.getFilterModel().getFieldManager().on('fieldAdded', this.onFieldAdded, this);
	  this.getFilterModel().getFieldManager().on('fieldRemoved', this.onFieldRemoved, this);

	  this.getView().getRowClass=function(record, index, rowParams, store){
	    var cls = '';
	    var aFilter = record.data.filter;
	    if(!aFilter.isValid()){
	      cls='x-grid3-row-notValid';
	    }
	    return cls;
	  };
  },

  deleteText        : 'Delete',
  filterText        : 'Field',
  operatorText      : 'OperatorId',
  valueText         : 'Value',
  comboText         : 'Select a new field',
  logicOpeAndText   : 'Check all',
  logicOpeOrText    : 'Check at least one',

  
  /** getFilterModel
   * @private
   */
  getFilterModel : function(){
    return(this.filterModel);
  },
  
  /** onFieldAdded
   * @private
   */
  onFieldAdded : function(field){
    this.addFields([field]);
  },
    
  /** onFieldRemoved
   * @private
   */
  onFieldRemoved : function(field){
    this.removeFields(field);
  },
  
  /** onFilterAdded
   * @private
   */
  onFilterAdded : function(filterModel, filter){
    var filterRecord=Ext.create('Ext.ux.netbox.core.filterModelRecord', {
    	icon:'',
    	field:filter.getField(),
        operatorId:filter.getOperator().getId(),
        values:filter.getValues(),
        filter:filter,
        id:filter.getId()});
    this.filterStore.loadData([filterRecord], true);
    filter.on('operatorChanged', this.updateFilterOperator, this);
    filter.on('valueChanged',this.updateFilterValues,this);
  },
  
  /** onFilterRemoved
   * @private
   */
  onFilterRemoved : function(filterModel, filter){
    var recordToRemove=this.filterStore.getById(filter.getId());
    this.filterStore.remove(recordToRemove);
    filter.on('operatorChanged', this.updateFilterOperator, this);
    filter.on('valueChanged',this.updateFilterValues,this);
  },
  
  /** onFilterChanged
   * @private
   */
  onFilterChanged : function(){
    this.populateFilterStore();
    this.setLogicOpeCombo();
  },
  
  /** onEditComplete
   * @private
   */
  onEditComplete: function(ed, value, startValue){
    this.editing=false;
    this.activeEditor=null;
    ed.un('specialkey', this.selModel.onEditorKey, this.selModel);
    if(Ext.JSON.encode(value) !== Ext.JSON.encode(startValue)){
      var r=ed.record;
      //workaround to manage objects in editorGrid
      r.set=function(name, value){
        if(Ext.JSON.encode(this.data[name]) == Ext.JSON.encode(value)){
          return;
        }
        this.dirty=true;
        if(!this.modified){
          this.modified={};
        }
        if(typeof this.modified[name] == 'undefined'){
          this.modified[name]=this.data[name];
        }
        this.data[name]=value;
        if(!this.editing){
          this.store.afterEdit(this);
        }
      }
      var field=this.colModel.getDataIndex(ed.col);
      var e={
        grid: this,
        record: r,
        field: field,
        originalValue: startValue,
        value: value,
        row: ed.row,
        column: ed.col,
        cancel:false,
        renderTo: this
      };
      if(this.fireEvent('validateedit', e) !== false && !e.cancel){
        r.set(field, e.value);
        delete e.cancel;
        this.fireEvent('afteredit', e);
      }
    }
    this.view.focusCell(ed.row, ed.col);
  },
  
  selectOperator : function(combo, records,eOpts){ 
	  var operator=this.operatorCombo.record.get('field').getAvailableOperatorById(this.operatorCombo.getValue());
	  this.operatorCombo.record.get('filter').setOperator(operator);
	  this.operatorCombo.record.set('operator',operator.getId());
  },
  
  getOperatorEditor : function(record,defaultField ){
	  if (this.operatorCellEditor==undefined) {
		  this.operatorCellEditor=Ext.create('Ext.grid.CellEditor', {
			                                                         editorId: this.columns[2].getId(),
			                                                         field: this.operatorCombo
			                                                        }); 
	  }

	  this.updateOperatorStore(record);
	  this.operatorCombo.record=record;
	  return this.operatorCellEditor;
  },
  
  getValueEditor : function(record,defaultField ){
	  var operatorId=record.get('operatorId');
	  var filter=record.get('filter');

	  this.valueCellEditor=record.get('field').getEditor(operatorId,filter,this.columns[3].getItemId());

	  if (this.cellEditingPlugin.editors.containsKey(this.valueCellEditor.editorId)) {
		  this.cellEditingPlugin.editors.removeAtKey(this.valueCellEditor.editorId);
	  }
	  
	  return this.valueCellEditor;
  },
  
  filterChange : function(editor, e, eOpts ) {
	  if (e.field==	"values") {
		  if (!Ext.isArray(e.value)) {
			  e.record.get('filter').setValues([e.value]);
			  e.record.set('values',[e.value]);
		  } else {
			  e.record.get('filter').setValues(e.value);
			  e.record.set('values',e.value);			
		  }
	  } else {
		  operator=e.record.get('field').getAvailableOperatorById(e.value);
		  e.record.set('operatorId',operator.getId());
		  e.record.get('filter').setOperator(operator);
	  }
	  e.record.commit();
  },
  
  createFilterGridConfig : function(config){

    this.filterStore=Ext.create('Ext.data.ArrayStore',{
      fields : ['image','field','operatorId','value','filter','filterId'],
      data : [],
      id : 5});

    this.operatorStore=Ext.create('Ext.data.SimpleStore',{
      fields : ['operatorId','operatorLabel'],
      data : [] });

    this.operatorCombo=Ext.create('Ext.form.ComboBox',{
      store         : this.operatorStore,
      queryMode     : 'local',
      valueField    : 'operatorId',
      displayField  : 'operatorLabel',
      editable      : false,
      triggerAction : 'all',
      lazyRender    : true
    });
    
    this.cellEditingPlugin=Ext.create('Ext.grid.plugin.CellEditing', { clicksToEdit: 1 });
    this.cellEditingPlugin.on('edit',this.filterChange,this);
    
    var cm=[
             {header:this.deleteText  ,renderer:this.imageRenderer   ,width: 50,dataIndex:'image'},
             {header:this.filterText  ,renderer:this.fieldRenderer   ,width:150,dataIndex:'field'},
             {header:this.operatorText,renderer:this.operatorRenderer,width:150,dataIndex:'operatorId', getEditor:Ext.bind(this.getOperatorEditor,this)},
             {header:this.valueText   ,renderer:this.valueRenderer   ,width:300,dataIndex:'values'    , getEditor:Ext.bind(this.getValueEditor,this)}	
           ];

    cm.filterStore=this.filterStore;
    config.store=this.filterStore;
    config.columns=cm;
    config.selType='cellmodel';
    config.plugins=[this.cellEditingPlugin];
    config.cm=cm;
    config.clicksToEdit=1;
    config.autoExpandColumn=cm[3].dataIndex
    config.enableColumnHide=false;
    config.enableColumnMove=false;
    config.enableColumnResize=false;
    config.elements='body, tbar';
    if(config.tbar==undefined){
      config.tbar=[];
    }
    
    config.listeners={
    		          added: { 
    	                      fn:function(grid,container){
                        	               container.on('move',Ext.bind(this.completeEditors,this));
				                 }
 						      }
    };

    config.tbar.push(this.fieldCombo);
    config.tbar.push("-");
    config.tbar.push(this.logicOpeCombo);
    
    return(config);
  },
  
  completeEditLater: function(){
    var scope=this.getColumnModel().getCellEditor(2);
    var fn=scope.completeEdit;
    var task=Ext.create('Ext.util.DelayedTask',fn,scope);
    task.delay(0);
  },
  
  /** populateFilterStore
  *
  */
  populateFilterStore : function(){
    this.filterStore.removeAll();
    for(var i=0; i<this.getFilterModel().getAllElementaryFilters().length; i++){
      this.onFilterAdded(this.getFilterModel(),this.getFilterModel().getAllElementaryFilters()[i]);
    }
  },
  
  /** createFieldCombo
  *
  */
  createFieldCombo : function(){
    var allFields=this.getFilterModel().getFieldManager().getAllFields();
    this.addFields(allFields);

    this.fieldCombo=Ext.create('Ext.form.ComboBox',{
        emptyText     : this.comboText,
        displayField  : 'label',
        valueField    : 'fieldId',
        store         : this.fieldStore,
        mode          : 'local',
        triggerAction : 'all',
        selectOnFocus : true,
        typeAhead     : true,
        editable      : true
        });

    this.fieldCombo.on('select', this.addFilter, this);
  },
    
  /** createLogicOpeCombo
  *
  */  
 createLogicOpeCombo : function(){
    var logicOpeStore=Ext.create('Ext.data.SimpleStore',{
        fields: ['label', 'value'],
        data: [ [this.logicOpeAndText,Ext.ux.netbox.core.CompositeFilter.AND],
                [this.logicOpeOrText,Ext.ux.netbox.core.CompositeFilter.OR] ]
        });
    this.logicOpeCombo=Ext.create('Ext.form.ComboBox',{
        displayField    : 'label',
        valueField      : 'value',
        store           : logicOpeStore,
        mode            : 'local',
        triggerAction   : 'all',
        selectOnFocus   : true,
        editable        : false,
        value           : Ext.ux.netbox.core.CompositeFilter.AND
        });

    this.logicOpeCombo.on('select', this.chgLogicOpe, this);
  },
  
  /** setLogicOpeCombo
  *
  *
  */
  setLogicOpeCombo : function(){
    var filter=this.getFilterModel().getFilter();
    if(filter instanceof Ext.ux.netbox.core.CompositeFilter)
      this.logicOpeCombo.setValue(filter.getLogicalOperator());
  },
  
  /** addFields
  *
  *
  */
  addFields : function(fieldsToAdd){
    var fields=[];
    var i;
    for(i=0; i<fieldsToAdd.length; i++){
      if (i==fieldsToAdd.length) break;
      fields.push([fieldsToAdd[i].getId(), fieldsToAdd[i].getLabel()]);
    }
    this.fieldStore=Ext.create('Ext.data.SimpleStore',{fields: ['fieldId', 'label'], data: fields, id:'fieldId'});

    this.fieldStore.sort('label','ASC');
  },
  
  /** removeFields
  *
  *
  */
  removeFields : function(fieldToRemove){
    var fieldId=fieldToRemove.getId();
    var toRemove=this.fieldStore.getById(fieldId);
    this.fieldStore.remove(toRemove);
  },
  
  /** addFilter
  *
  *
  */
  addFilter : function(combo, records, index){
    var addedId=this.getFilterModel().addElementaryFilterByFieldId(records[0].get('fieldId'));
    this.fieldCombo.clearValue();
    this.filterStore.indexOfId(addedId);
  },
  
  /** chgLogicOpe
  *
  *
  */
  chgLogicOpe : function(combo, record, index){
    var logicOpe = record[0].get('value');
    this.getFilterModel().setLogicalOperator(logicOpe);
    this.getFilterModel().each(
      function(filter){
        if(filter instanceof Ext.ux.netbox.core.CompositeFilter && filter.getLogicalOperator() != logicOpe){
          filter.setLogicalOperator(logicOpe);
        }
      }
    );
  },
  
  /** removeFilter
  *
  *
  */
  removeFilter : function(grid, cell, recordIndex, cellIndex, e){
    if (cellIndex == 0){
      var recordToRemove=grid.getStore().getAt(recordIndex);
      var filter=recordToRemove.get('filter');
      this.getFilterModel().removeElementaryFilterById(filter.getId());
    }
  },
  
  /** updateOperatorStore
  *
  */
  updateOperatorStore : function(record){
      var field=record.get('field');
      var operators=[];
      for(var i=0; i<field.getAvailableOperators().length;i++){
        operators.push([field.getAvailableOperators()[i].getId(),
                        field.getAvailableOperators()[i].getLabel()]);
      }
      this.operatorStore.loadData(operators, false);
   },
  
   /** updateFilter
   *
   */
  updateFilter : function(e){
    if(e.column==2){
      var filter=e.record.get('filter');
      var operatorId=e.record.get('operatorId');
      filter.setOperator(operatorId);
    } else if(e.column==3){
      var filter=e.record.get('filter');
      try{
        filter.setValues(e.record.get('value'));
      } catch(exp){
        var r=this.filterStore.getById(filter.getId());
        r.set('value',filter.getValues());
      }
    }
    this.filterStore.commitChanges();
  },
  
  
  completeEditors: function() {
	  var i=0;
	  for (i=0 ; i<this.filterStore.getCount() ; i++) {
		  if (this.filterStore.getAt(i).get('field').completeEditors!=undefined) {
			  this.filterStore.getAt(i).get('field').completeEditors();
		  }
      }
  },
  
  /** updateFilterOperator
  *
  */
  updateFilterOperator : function(filter){
    var record=this.filterStore.getById(filter.getId());
    if(record.get('operatorId')!=filter.getOperator().getId()){
      record.set('operatorId',filter.getOperator().getId());
    }
//    this.completeEditors();
  },
  
  /** updateFilterValues
  *
  */
  updateFilterValues: function(filter){
    var record=this.filterStore.getById(filter.getId());
    if(Ext.JSON.encode(record.get('value'))!=Ext.JSON.encode(filter.getValues())){
      record.set('value',filter.getValues());
    }
  },
  
  imageRenderer : function(value, metadata, record, rowIndex, colIndex, store){
    return('<img class="x-menu-item-icon x-icon-delete" style="position: inherit; cursor: pointer" src="ext/resources/themes/images/default/tree/s.gif"/>');
  },
  
  /** fieldRenderer
  *
  */
  fieldRenderer : function(value, metadata, record, rowIndex, colIndex, store){
    return(value.getLabel());
  },
  
  /** operatorRenderer
  *
  */
  operatorRenderer : function(value, metadata, record, rowIndex, colIndex, store){
    return(record.get('field').getAvailableOperatorById(value).getLabel());
  },
  
  /** valueRenderer
  *
  */
  valueRenderer : function(value, metadata, record, rowIndex, colIndex, store){
    return(record.get('filter').render(value));
  },

  processEvent : function(name, view, cell, recordIndex, cellIndex, e){
	  Ext.ux.netbox.core.DynamicFilterModelView.superclass.processEvent.call(this,name, e, cell, recordIndex, cellIndex, e);
      if(name=="click"){
	    	this.fireEvent(name, this, view, cell, recordIndex, cellIndex, e);
	    	if (recordIndex>=0) {
		        this.fireEvent('row' + name, this, cell, recordIndex, e);
		        if(cellIndex >=0){
		            this.fireEvent('cell' + name, this, cell, recordIndex, cellIndex, e);
		        }
	        }
      }
  }

});

String.prototype.escHtml = function(){ 
	  var i,e={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'};
	  var t=this;
	  for(i in e) 
	    t=t.replace(Ext.create('RegExp',i,'g'),e[i]); 
	  return t; 
	}
