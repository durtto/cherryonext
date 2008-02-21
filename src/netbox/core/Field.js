// $Id: Field.js 303993 2008-02-13 17:02:19Z SO000377 $

Ext.namespace('Ext.ux.netbox.core');

/** Implements the field class.
  * @constructor
  * @param {String} id The field id.
  * @param {String} label The label of the filter. If not supplied the id is used. Optional
  * @class A field is an item on whch I want to perform filter operations.
  * For example if I have a grid with a column 'Price' and I want to filter on the price column, surelly I have a filter on the price column.
  * In a filter the operators available are defined (for example, on the Price column I want only to have the =, and > operators. The Price field will have these 2 operators.
  * Among all the operators there is an operator of default, that will be used as default when a new elementary filter is instantiated.
  * A field can have a list of available values, a default way to render and editor for the values of the elementary filters and so on.
  * Usually you should not instantiate a field directly, but the Ext.ux.netbox.core.FieldManager (or directly the Ext.ux.netbox.core.FieldModel) instantiates them.
  */
Ext.ux.netbox.core.Field=function(id,labelIn,defaultValues){
  Ext.ux.netbox.core.Field.superclass.constructor.call(this);
  this.addEvents(/** @scope Ext.ux.netbox.core.Field.prototype */{
    /** Fires when a operator is added
      * @event operatorAdded
      * @param {Ext.ux.netbox.core.Operator} operator The added operator
      */
    operatorAdded : true,
    /** Fires when a operator is removed
      * @event operatorRemoved
      * @param {Ext.ux.netbox.core.Operator} operator The removed operator
      */
    operatorRemoved : true,
    /** Fires when a defaultOperator is changed
      * @event defaultOperatorChanged
      * @param {Ext.ux.netbox.core.Operator} defaultOperator The changed defaultOperator
      */
    defaultOperatorChanged : true
  });
  /** The id of this Field
    * @type String
    * @private
    */
  this.id=id;
  /** The label of this Field
    * @property {String} label
    * @private
    */
  this.label=((labelIn==undefined)?id:labelIn);
  /** The list of all the available operators for this Field
    * @property {Array of Ext.ux.netbox.core.Operator} availableOperators
    * @private
    */
  this.availableOperators=[];
  /** The default operator for this Field
    * @property {Ext.ux.netbox.core.Operator} defaultOperator
    * @private
    */
  this.defaultOperator=null;
  /** The editor used to edit the value of an elementary filter based on this Field,
    * when the operator doesn't provide a specialized implementation.
    * @private
    */
  this.editor=null;
  /** The Store or array used to obtain the list of the available values.
    * It must contain a value field and a label field.
    * Example:<PRE>
    * var store = new Ext.data.SimpleStore({
    * fields: ['label', 'value'],
    * data : exampleData
    * });</PRE>
    * <B>NB:</B> Both fields must be strings
    * @property {Ext.data.Store} availableValueStore
    * @private
    */
  this.availableValueStore=null;
  /** This value says if the store used to obtain the availableValues uses remote or local data
    * If true it uses remote data, if false it uses local data. The default is true.
    * @property {boolean} isRemote
    * @private
    */
  this.isRemote=true;
  /** The default values of this Field. Optional.
    * @property {Array} defaultValues
    * @private
    */
  this.defaultValues=((defaultValues==undefined)?[]:defaultValues);

}

Ext.extend(Ext.ux.netbox.core.Field,Ext.util.Observable,/** @scope Ext.ux.netbox.core.Field.prototype */
{
  /** This method returns the default values for this Field.
    * @return {Array} The default values for this Field
    */
  getDefaultValues : function(){
    return(this.defaultValues);
  },
  /** This method sets the default values for this Field.
    * @param {Array} values The default values for this Field
    */
  setDefaultValues : function(values){
    this.defaultValues=values;
  },
  /** This method returns the default operator for this Field.
    * Before the setDefaultOperator method is called it returns null.
    * @return {Ext.ux.netbox.core.Operator} The default operator for this Field
    */
  getDefaultOperator : function(){
    return(this.defaultOperator);
  },
  /** This method sets the default operator for this Field.
    * The default operator must be among the operators of this Field. If not an exception is thrown.
    * If this succeeds the event "defaultOperatorChanged" is triggered.
    * @param {Ext.ux.netbox.core.Operator} defaultOperator The default operator for this Field
    */
  setDefaultOperator : function(defaultOperator){
    var id=defaultOperator.getId();
    var oper=this.getAvailableOperatorById(id);
    if (oper==null) throw("operator not among available operators");
    this.defaultOperator=defaultOperator;
    this.fireEvent("defaultOperatorChanged",defaultOperator);
  },
  /** Returns the array or store used to obtain the list of available values for this Field.
    * In this base class it throws an exception since isAvailableValuesAvailable always returns false
    * @return {Ext.data.Store} The store used to obtain the available values
    * @throws {String} If isAvailableValuesAvailable returns false this method throws an Exception
    */
  getAvailableValues : function(){
    if(!this.isAvailableValuesAvailable()){
      throw("Available values not available!")
    }
    return(this.availableValueStore);
  },
  /** This method sets the store or Array of the available values.
    * If the value is not null, isAvailableValuesAvailable values available will return true
    * The store must contain a value field and a label field.
    * Example: <PRE>
    * var store = new Ext.data.SimpleStore({
    * fields: ['label', 'value'],
    * data : exampleData
    * });</PRE>
    * @param {Ext.ux.Store} store The store used to obtain the available values
    */
  setAvailableValues: function(store){
    this.availableValueStore=store;
    this.editor=null;
  },
  /** It says if there is a list of available values.
    * In this implementation it returns false if the setAvailableValues was not called with a Store or Array,
    * or if the last time you called it, the passed value is different from null
    * @return {boolean} true if the operator supports a list of available values, false otherwise
    */
  isAvailableValuesAvailable: function(){
    return(this.availableValueStore!=null);
  },
  /** This method is used to set a variable that says if the store of the available values is local or remote.
    * If isAvailableValuesAvailable returns false the value is ignored. The default is true.
    * <B>NB:</B> This method is used to instantiate the editor, and this happens on the first edit.
    * After this moment every change in the parameter is ignored
    * @param {boolean} isRemote True if the store is remote, false otherwise
    */
  setStoreRemote: function(isRemote){
    this.isRemote=isRemote;
  },
  /** This method returns a value that says if the store of the available values is local or remote.
    * If it returns true the store fetches data from remote, if it returns false the store uses local data.
    * If isAvailableValuesAvailable returns false, the method throws an exception.
    * @return {boolean} True if the store fetches data from remote, false otherwise
    * @throws {String} If isAvailableValuesAvailable returns false this method throws an exception
    */
  isStoreRemote: function(){
    if(!this.isAvailableValuesAvailable()){
      throw(this.getId()+" isStoreRemote: no store available");
    }
    return(this.isRemote);
  },
  /** Add a operator to the list of available operator.
    * If this succeeds the event "operatorAdded" is triggered.
    * If the Field of the operator is not null and different that this one an exception is thrown.
    * @param {Ext.ux.netbox.core.Operator} operator. The operator to add
    * @throw {String} If the operator is already associated to a different filter type
    */
  addOperator : function(operator){
    if(operator.getField()!=null && operator.getField != this){
      throw("Impossible to add the operator "+operator.getId()+" to the Field "+this.getId()+". The operator is already associated to another Field");
    }
    this.availableOperators.push(operator);
    operator.setField(this);
    this.fireEvent("operatorAdded",operator);
  },
  /** This method returns the list of the available operators.
    * @return {Array} An array containing all the available operators.
    * If no operator is available it returns an empty array
    */
  getAvailableOperators : function(){
    return(this.availableOperators);
  },
  /**This method returns the operator by Id.
    * @param {String} id The id of the operator
    * @return {Ext.ux.netbox.core.Operator} The operator with the given id or null if no operator is found
    */
  getAvailableOperatorById : function(id){
    var index=this._getOperatorIndexById(id);
    if(index==null)
      return(null);
    else
      return(this.getAvailableOperators()[index]);
  },
  /** Search an operator and returns the index.
    * @param {String} id The id of the operator to search
    * @return {int} The index of the operator with the given id, or null if the operator doesn't exists
    * @private
    */
  _getOperatorIndexById : function(id){
    var availableOps=this.getAvailableOperators();
    for(var i=0; i<availableOps.length;i++){
      if(availableOps[i].getId()==id){
        return(i);
      }
    }
    return(null);
  },
  /** This method remove an operator from the list of the operators.
    * If this succeeds the event "operatorRemoved" is triggered. Is not possible to remove the defaultOperator.
    * @param {String} id The id of the operator to remove
    * @throws {String} If the operator to remove is the defaultOperator
    * @throws {String} If the operator with the given id is not found
    */
  removeOperator : function(id){
    var index=this._getOperatorIndexById(id);
    if(index==null){
      throw("The operator with the given id doesn't exist");
    } else {
      var operator=this.getAvailableOperators()[index];
      if (operator==this.getDefaultOperator) throw("operator to remove is the DefaultOperator");
      this.availableOperators.splice(index,1);
      this.fireEvent("operatorRemoved",operator);
    }
  },
  /** This method returns an elementaryFilter's instance of the type of this Field.
    * The operator of the elementaryFilter is the default operator of this Field.
    * @return {Ext.ux.netbox.core.ElementaryFilter} The elementaryFilter's instance
    */
  getElementaryFilterInstance : function(){
    var filter=new Ext.ux.netbox.core.ElementaryFilter(this);
    return filter;
  },
  /** This method returns the id of this Field.
    * @return {String} the id of this Field
    */
  getId : function(){
    return(this.id);
  },
  /** This method returns the label of this Field.
    * @return {String} the label of this Field
    */
  getLabel : function(){
    return(this.label);
  },
  /** This method returns a string rendering the value. It's used when the operator doesn't provide a specialized implementation.
    * In this default implementation it returns:
    * <PRE>
    *       Condition                Returns
    *----------------------         ---------
    * is undefined or null          Empty String
    * array with length 0           Empty String
    * array with length > 0         The return of this function called on the the values of the array concatenated using ","
    * object with the label         this function called on value.label
    * and the value fields
    * something else                String(value)
    * </PRE>
    * @param {Object} value The value to render
    * @param {String} operatorId The id of the operator in the Filter
    * @return {String} the HTML fragment used to render the value of the Filter
    */
  render: function(value,operatorId){
    if(value !==undefined && value!==null){
      if(Ext.type(value)=="array"){
        var rendered=[];
        for(var i=0;i<value.length;i++){
          rendered.push(this.render(value[i],operatorId));
        }
        return(rendered.join(","));
      }else {
        if(value.value!==undefined && value.label!==undefined){
          return(this.render(value.label,operatorId));
        }
        return(String(value));
      }
    } else {
      return("");
    }
  },
  /** This method returns the Ext.form.Field used to edit the value of the elementaryFilter based on this Field
    * when the operator doesn't provide a specialized implementation.
    * In this default implementation it simply returns an Ext.ux.netbox.core.AvailableValuesEditor (ie a ComboBox) if there are availble values
    * or a Ext.ux.netbox.core.TextValuesEditor (ie a TextField) otherwise.
    * @param {boolean} cache true to use a cached editor if available, and to put the newly created editor in the cache if not available, false otherwise. The default is true
    * @param {String} operatorId The operatorId actually used in the filter
    * @return {Ext.Editor} The field used to edit the values of this filter
    */
  getEditor: function(cache,operatorId){
    var editor;
    if(cache===undefined){
      cache=true;
    }
    if(this.editor==null || !cache){
      if(!this.isAvailableValuesAvailable()){
        editor=new Ext.ux.netbox.core.TextValuesEditor();
      } else {
        editor=new Ext.ux.netbox.core.AvailableValuesEditor(this.getAvailableValues(),this.isStoreRemote());
      }
      if(cache){
        this.editor=editor;
      }
    } else {
      editor=this.editor;
    }
    return(editor);
  }

});