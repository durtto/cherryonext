// $Id$

Ext.namespace('Ext.ux.netbox.date');

/** It creates a new number field
 * @class This is the class that implements the field to use if the type is date.
 * It contains as default the following operator:
 * <ul>
 *   <li> DATE_EQUAL </li>
 *   <li> DATE_GREATER </li>
 *   <li> DATE_GREATER_OR_EQUAL </li>
 *   <li> DATE_LESS </li>
 *   <li> DATE_LESS_OR_EQUAL </li>
 *   <li> DATE_RANGE </li>
 *   <li> DATE_PERIOD </li>
 * </ul>
 * The default operator is DATE_PERIOD
 * @param {String} id The Field id.
 * @param {String} label Optional. The label of the filter. If not supplied the id is used.
 * @param {String} format The format of the date. Supported formats:
 * <PRE>
 * Format  Description                                                               Example returned values
 * ------  -----------------------------------------------------------------------   -----------------------
 * d       Day of the month, 2 digits with leading zeros                             01 to 31
 * m       Numeric representation of a month, with leading zeros                     01 to 12
 * Y       A full numeric representation of a year, 4 digits                         Examples: 1999 or 2003
 * y       A two digit representation of a year                                      Examples: 99 or 03
 * H       24-hour format of an hour with leading zeros                              00 to 23
 * i       Minutes, with leading zeros                                               00 to 59
 * s       Seconds, with leading zeros                                               00 to 59
 *</PRE>
 * @constructor
 * @extends Ext.ux.netbox.core.Field
 */
Ext.ux.netbox.date.DateField = function(id,label,format) {
  Ext.ux.netbox.date.DateField.superclass.constructor.call(this,id,label);
  var periodOperator = new Ext.ux.netbox.date.DatePeriodOperator();
  this.addOperator(periodOperator);
  this.setDefaultOperator(periodOperator);
  this.addOperator(new Ext.ux.netbox.date.DateOperator("DATE_EQUAL","=",format));
  noEmptyAllowed=this.emptyNotAllowedFn.createDelegate(this);
  var op=new Ext.ux.netbox.date.DateOperator("DATE_GREATER",">",format);
  op.addValidateFn(noEmptyAllowed);
  this.addOperator(op);
  op=new Ext.ux.netbox.date.DateOperator("DATE_GREATER_OR_EQUAL",">=",format);
  op.addValidateFn(noEmptyAllowed);
  this.addOperator(op);
  op=new Ext.ux.netbox.date.DateOperator("DATE_LESS","<",format);
  op.addValidateFn(noEmptyAllowed);
  this.addOperator(op);
  op=new Ext.ux.netbox.date.DateOperator("DATE_LESS_OR_EQUAL","<=",format);
  op.addValidateFn(noEmptyAllowed);
  this.addOperator(op);
  this.addOperator(new Ext.ux.netbox.date.DateRangeOperator(format));
}

Ext.extend(Ext.ux.netbox.date.DateField,Ext.ux.netbox.core.Field,/** @scope Ext.ux.netbox.date.DateField.prototype */{
  
});