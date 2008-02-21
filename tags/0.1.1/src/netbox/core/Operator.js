// $Id: Operator.js 304390 2008-02-14 11:03:26Z SO000377 $

Ext.namespace('Ext.ux.netbox.core');

/** Implements the operator class.
  * @constructor
  * @param {String} id The operator id
  * @param {Ext.ux.netbox.core.Field} field The field owner of this operator
  * @class This class is the operator in an elementary filter (for example in 'name = "John"' the operator is '='). 
  * The editing and the rendering of the values are the main role of the operator class. (for example in a date field the editing widget and renderer are totally different if 
  * the operation is DATE_EQUAL or DATE_PERIOD). In this base implementation the class delegates all the behaviour to the associated field, and throws an exception if no field is associtated.  
  */
Ext.ux.netbox.core.Operator=function(id, label){
  /** The id of this Ext.ux.netbox.core.Operator
    * @type String
    * @private
    */
  this.id=id;
  /** The label of this Ext.ux.netbox.core.Operator
    * @property {String} label
    * @private
    */
  this.label=((label==undefined)?id:label);
  /** The field that owns this operator.
    * @type Ext.ux.netbox.core.Field
    * @private
    */
  this.field=null;
}

Ext.ux.netbox.core.Operator.prototype = {

  /** It says if for this operator there is a list of available values. In this base class it always returns false.
    * @return {boolean} true if the operator supports a list of available values, false otherwise
    */
  isAvailableValuesAvailable: function(){
    if(this.getField()==null){
      throw("An operator must be associated to a Field to know if there is the list of the available values!")
    }
    return(this.getField().isAvailableValuesAvailable());
  },
  /** Returns the list of available values. By default it asks to the field the available values.
    * If you have a list of available values specific to the operator, overwrite this method.
    * @return {Array} an array of possible values, where a value is in the format {value: ... , label: ...}. If label is null the value is used as label.
    * @throws {String} If isAvailableValuesAvailable returns false this method throws an Exception
    */
  getAvailableValues: function(){
    if(!this.isAvailableValuesAvailable()){
      throw("Available values not available!")
    }
    if(this.getField()==null){
      throw("An operator must be associated to a field to obtain the list of the available values!")
    }
    return(this.getField().getAvailableValues());
  },
  /** Returns the id of this operator.
    * @return {String} id of the operator
    */
  getId: function(){
    return(this.id);
  },
  /** Returns the label of this operator.
    * @return {String} label of the operator
    */
  getLabel: function(){
    return(this.label);
  },
  /** This function sets the field for this operator.
    * It's called by Ext.ux.netbox.core.Field. It should not be called by itself
    * @param {Ext.ux.netbox.core.Field} field The field that owns this operator
    */
  setField: function(field){
    this.field=field;
  },
  /** This function returns the field of this operator or null if not setted.
    * @return {Ext.ux.netbox.core.Field} field or null if not setted
    */
  getField: function(){
    return(this.field);
  },
  /** This method returns a string rendering the value.
    * The default implementation call the method render of Ext.ux.netbox.core.Field.
    * In this default implementation if the field of the operator is unknown, an exception is thrown
    * @param {Object} value The value to render
    * @return {String} the HTML fragment used to render the value of the elementary filter
    * @throws {String} If this method is called when the field is undefined or null
    */
  render: function(value){
    if(this.getField()==undefined || this.getField()==null){
      throw("Impossible to render a value from the operator "+this.getId()+" which is without field");
    }
    return(this.getField().render(value,this.getId()));
  },
  /** This method returns the Ext.form.Field used to edit the value of the elemenatry filters using this operator.
    * In this default implementation it simply call the getEditor method of Ext.ux.netbox.core.Field.
    * In this default implementation if the field of the operator is unknown, an exception is thrown.
    * @param {boolean} cache true to use a cached editor if available, and to put the newly created editor in the cache if not available, false otherwise. The default is true
    * @return {Ext.form.Field} The Ext.form.Field used to edit the values of this elementary filter
    * @throws {String} If this method is called when the field is undefined or null
    */
  getEditor: function(cache){
    if(this.getField()==undefined || this.getField()==null){
      throw("Impossible to obtain the editor for the operator "+this.getId()+" which is without field");
    }
    return(this.getField().getEditor(cache,this.getId()));
  },
  /** This method convert an old value of an elementary filter to a new value, suitable for this operator.
    * <B>NB:</B> if you want to return an empty operator return [].
    * In this default implementation, if it's an array, and the first element is of type {value: ... , label: ...},
    * an array with only the first element is returned. Otherwise it returns an empty array.
    * @param {Array of Object} values
    */
  convertValue: function(values){
    if(values !==null && values !== undefined && Ext.type(values)=="array"){
      if(values.length>0 && values[0].value!== undefined && values[0].label!== undefined){
        if(values.length==1){
          return(values);
        } else {
          return([values[0]]);
        }
      }
    }
    return([]);
  },
  /** This method returns a boolean that says if the store of the available values is local or remote.
    * If it returns true the store fetches data from remote, if it returns false the store uses local data.
    * In this default implementation it simply call the same method of the field.
    * In this default implementation if the field for the operator is unknown, an exception is thrown.
    * @return {boolean} true if the store fetches data from remote, false otherwise
    * @throws {String} If the field is null or undefined
    */
  isStoreRemote: function(){
    if(this.getField()==undefined || this.getField()==null){
      throw("Impossible to obtain the type of the store (remote/local) for the operator "+this.getId()+" which is without field");
    }
    return(this.getField().isStoreRemote());
  }

};