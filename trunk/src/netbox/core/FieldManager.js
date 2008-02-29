// $Id$

Ext.namespace('Ext.ux.netbox.core');

/** Creates a new FieldManager class in the Netbox Filter Framework, eventually instantiating the fields.<br>
  * <b> NB: </b> If availableValues is specified and the type of the field is string the STRING_LIST and STRING_NOT_IN_LIST operators will be added to the fields.
  * @constructor
  * @param (Object) config The configuration options for this object. Optional, if not present an empty FieldManager is created.
  * @config {String} id The id of the field (for example the id of the column)
  * @config {String} label The label of the field (for example the header of the column)
  * @config {Array} defaultValues The default values of the field in the format {value: ... , label: ...} Optional
  * @config {String} type The type of the field. Available values are: string, enum, float, int, date. Default type is string
  * @config {String} format Only for dates, the format of the date. Look Ext.ux.netbox.data.DateFilterType for more details
  * @config {Ext.data.Store} availableValues The store containing the available values for this field. Look at Ext.ux.netbox.core.Field.setAvailableValues for more details
  * @config {boolean} remoteStore True if the store is remote, false otherwise. Look at Ext.ux.netbox.core.Field.setStoreRemote for more details
  * @config {boolean} forceReload True if you want reload the store everytime expand the combo. Look at Ext.ux.netbox.core.Field.setForceReload for more details
  * @config {function} validate The function used to validate the values of the Field. Look at Ext.ux.netbox.core.Field.setValidate for more details
  * @class This class manages the filter fields. You should use an instance of this class (obtained using filterModel.getFieldManager) to add or remove filter fields, or to obtain them to add or remove operators.
  * More than one filter model can have the same FieldManager, allowing to have different sets of filters, but on the same set of fields.
  */
Ext.ux.netbox.core.FieldManager=function(config){
  Ext.ux.netbox.core.FieldManager.superclass.constructor.call(this);
  this.addEvents(/** @scope Ext.ux.netbox.core.FieldManager.prototype */{
    /** Fires when a Field is added
      * @event fieldAdded
      * @param {Ext.ux.netbox.core.Field} field The added field
      */
    fieldAdded : true,
    /** Fires when a Field is removed
      * @event fieldRemoved
      * @param {Ext.ux.netbox.core.Field} field The removed field
      */
    fieldRemoved : true
  });
  /**
    * @property {Ext.util.MixedCollection} fields The list of all fields for this FieldManager
    * @private
    */
  this.fields=new Ext.util.MixedCollection(false,function(field){return(field.getId())});
  if(config!==undefined){
    for(var i=0; i< config.length; i++){
      var field;
      if(config[i].type===undefined){
        config[i].type="string";
      }

      switch(config[i].type){
        case "string":
          field=new Ext.ux.netbox.string.StringField(config[i].id,config[i].label);
          break;
        case "enum":
          field=new Ext.ux.netbox.string.EnumField(config[i].id,config[i].label);
          break;
        case "float":
        case "int":
          field=new Ext.ux.netbox.number.NumberField(config[i].id,config[i].label);
          break;
        case "date":
          field=new Ext.ux.netbox.date.DateField(config[i].id,config[i].label,config[i].format);
          break;
        default:
          continue;
      }
      if(config[i].availableValues!==undefined){
        field.setAvailableValues(config[i].availableValues);
        if(config[i].remoteStore!==undefined){
          field.setStoreRemote(config[i].remoteStore);
        }
        if(config[i].type=="string" || config[i].type=="enum"){
          field.addOperator(new Ext.ux.netbox.string.StringListOperator('STRING_LIST',field.stringListText));
          field.addOperator(new Ext.ux.netbox.string.StringListOperator('STRING_NOT_IN_LIST',field.stringNotListText));
        }
      }
      if(config[i].defaultValues!==undefined)
        field.setDefaultValues(config[i].defaultValues);
      if(config[i].forceReload!==undefined)
        field.setForceReload(config[i].forceReload);
      if(config[i].validate!==undefined)
        field.setValidate(config[i].validate);

      this.addField(field);
    }
  }
}

Ext.extend(Ext.ux.netbox.core.FieldManager,Ext.util.Observable,/** @scope Ext.ux.netbox.core.FieldManager.prototype */
{
  /** This method returns the list of all fields.
    * @return {Array of Ext.ux.netbox.core.Field} The collection of fields for this Filter
    */
  getAllFields : function(){
    return(this.fields.getRange());
  },
  /** This method returns a field by Id or null if it is not found.
    * @param {String} id The id of field
    * @return {Ext.ux.netbox.core.Field} The field with the given id
    */
  getFieldById : function(id){
    var field=this.fields.get(id);
    if(!field){
      return(null);
    }
    return(field);
  },
  /** This method add a Field to the array in FieldManager.
    * If this succeeds the event "fieldAdded" is triggered.
    * @param {Ext.ux.netbox.core.Field} field The Field to add
    */
  addField : function(field){
    this.fields.add(field);
    this.fireEvent("fieldAdded",field);
  },
  /** This method remove a Field from the array in FieldManager.
    * If this succeeds the event "fieldRemoved" is triggered.
    * @param {Ext.ux.netbox.core.Field} field The Field to remove
    */
  removeField : function(field){
    if(this.fields.removeKey(field.getId()))
    this.fireEvent("fieldRemoved",field);
  }

});