// $Id$

Ext.namespace('Ext.ux.netbox.number');

/** It instantiates a new NumberField
  * @class This is the class that implements the field to use if the data to filter is a number.
  * It contains as default the following operation:
  * <ul>
  *   <li> NUMBER_EQUAL </li>
  *   <li> NUMBER_NOT_EQUAL </li>
  *   <li> NUMBER_GREATER </li>
  *   <li> NUMBER_GREATER_OR_EQUAL </li>
  *   <li> NUMBER_LESS </li>
  *   <li> NUMBER_LESS_OR_EQUAL </li>
  *   <li> NUMBER_RANGE </li>
  * </ul>
  * The default operation is NUMBER_EQUAL
  * @param {String} id The Field id.
  * @param {String} label Optional. The label of the filter. If not supplied the id is used.
  * @constructor
  * @extends Ext.ux.netbox.core.Field
  */
Ext.ux.netbox.number.NumberField = function(id,label) {
  Ext.ux.netbox.number.NumberField.superclass.constructor.call(this,id,label);
  var equalOperator = new Ext.ux.netbox.number.NumberOperator("NUMBER_EQUAL","=");
  this.addOperator(equalOperator);
  this.setDefaultOperator(equalOperator);
  this.addOperator(new Ext.ux.netbox.number.NumberOperator("NUMBER_NOT_EQUAL","!="));
  this.addOperator(new Ext.ux.netbox.number.NumberOperator("NUMBER_GREATER",">"));
  this.addOperator(new Ext.ux.netbox.number.NumberOperator("NUMBER_GREATER_OR_EQUAL",">="));
  this.addOperator(new Ext.ux.netbox.number.NumberOperator("NUMBER_LESS","<"));
  this.addOperator(new Ext.ux.netbox.number.NumberOperator("NUMBER_LESS_OR_EQUAL","<="));
  this.addOperator(new Ext.ux.netbox.number.NumberRangeOperator());
}

Ext.extend(Ext.ux.netbox.number.NumberField,Ext.ux.netbox.core.Field,/** @scope Ext.ux.netbox.number.NumberField.prototype */{});