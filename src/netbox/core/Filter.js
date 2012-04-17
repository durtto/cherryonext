// $Id$

/** This class is an abstract one. See ElementaryField or CompositeField
  * @class The base class for the filter. A filter can be of 2 type:
  * <ol>
  * <li> elementary. It's a filter made only of a condition, for example foo = 'bar'</li>
  * <li> composite. It's a filter made of other filters, that are connected together using a logical operator (AND, OR etc...). Actualy only the AND and OR operators are supported.</li>
  * </ol>
  * This is an abstract class ( a lot of the methods of this class just thow an exception). You should not instantie this class directly. See Ext.ux.netbox.core.CompositeFilter and Ext.ux.netbox.core.ElementaryFilter
  * @constructor
  */
Ext.define('Ext.ux.netbox.core.Filter', {
	extend: 'Ext.util.Observable',
	constructor: function() {
		  Ext.ux.netbox.core.Filter.superclass.constructor.call(this);
	},
  
  getFilterObj : function(){
    throw("getFilterObj is an abstract method!");
  },
  
  setFilterObj : function(filter){
    throw("setFilterObj is an abstract method!");
  },
  
  getElementaryFilterById : function(id){
  	throw("getElementaryFilterById is an abstract method!");
  },
  
  getElementaryFiltersByFieldId : function(fieldId){
  	throw("getElementaryFiltersByFieldId is an abstract method!");
  }

});
