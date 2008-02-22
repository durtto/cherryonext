// $Id: StringField.js 301942 2008-02-12 13:24:41Z SO000377 $

Ext.namespace('Ext.ux.netbox.string');

/** It creates a new string field
  * @param {String} id The id of the field
  * @param {String} label Optional. The label of the field. If not supplied the id is used.
  * @constructor
  * @extends Ext.ux.netbox.core.Field
  * @class This is the class that implements the field to use if the type is string.
  * It contains as default the following operators:
  * <ul>
  *   <li> STRING_EQUAL </li>
  *   <li> STRING_DIFFERENT </li>
  *   <li> STRING_CONTAINS </li>
  *   <li> STRING_DOESNT_CONTAIN </li>
  *   <li> STRING_STARTS_WITH </li>
  *   <li> STRING_ENDS_WITH </li>
  * </ul>
  * The default operator is STRING_EQUAL.
  * The STRING_LIST and STRING_NOT_LIST operations should be manually added if needed.
  */
Ext.ux.netbox.string.StringField = function(id,label) {
  Ext.ux.netbox.string.StringField.superclass.constructor.call(this,id,label);
  var equalOperator = new Ext.ux.netbox.core.Operator("STRING_EQUAL",this.stringEqualsLabel);
  this.addOperator(equalOperator);
  this.setDefaultOperator(equalOperator);
  this.addOperator(new Ext.ux.netbox.core.Operator("STRING_DIFFERENT",this.stringDifferentLabel));
  this.addOperator(new Ext.ux.netbox.string.TextFieldOperator("STRING_CONTAINS",this.containsText));
  this.addOperator(new Ext.ux.netbox.string.TextFieldOperator("STRING_DOESNT_CONTAIN",this.doesntContainsText));
  this.addOperator(new Ext.ux.netbox.string.TextFieldOperator("STRING_STARTS_WITH",this.startsWithText));
  this.addOperator(new Ext.ux.netbox.string.TextFieldOperator("STRING_ENDS_WITH",this.endsWithText));
}

Ext.extend(Ext.ux.netbox.string.StringField,Ext.ux.netbox.core.Field,/** @scope Ext.ux.netbox.string.StringField.prototype */{
  stringEqualsLabel: "=",
  stringDifferentLabel: "!=",
  containsText: "contains",
  doesntContainsText: "doesn't contain",
  startsWithText: "starts with",
  endsWithText: "ends with",
    /** Label of the STRING_LIST operation
    * @property
    */
  stringListText: "in",
  /** Label of the STRING_NOT_IN_LIST operation
    * @property
    */
  stringNotListText: "not in"
});