https://cherryonext.googlecode.com/svn/wiki/CherryOnExt4.png?display=thumb&width=200&height=200

# Welcome to Cherry On Ext #

Cherry On Ext (**Cherry**) extends the [Ext JS](http://extjs.com) library using Web 2.0 aspects of improved Web interfaces that mimic the real-time responsiveness of desktop applications within the browser window.

Cherry aims to be a rich Ext JS plugin for augmenting the set of functionality needed for Enterprise Rich Internet Application.

Cherry offers facilities for the presentation of huge amount of data: dynamic, static or quick data filtering and the possibility to define and reuse user preferences. Moreover it offers capabilities to allow input mask on text fields.

Software architecture is MVC based and the philosophy behind Cherry, according to Ext JS principles, aims to completely documented, sound designed and clean code.

This first version of Cherry contains some little gems that may be especially appreciated when working with data intensive application. Click [here](http://cherryonext.googlecode.com/svn/demos/demo/allTogether.htm) to see an example.

# News #
## 15 June 2011: change the Cherry on Ext license ##
We released a new version of Cherry on Ext just for change the license from LGPL v3 to New BSD.

This change is in accordance with the Ext JS license of course, and will give to the users of our library more flexibility and freedom.

## 19 March 2010: Trunk now on Ext Js 3.1 ##
Current trunk now is on ExtJs 3.1. Only a subset of Cherry is ported but here is what should work:
  * Dynamic Filter Manager
  * Quick Filter
  * Input Mask

## 30 October 2008: Released new Version 0.3.1 ##
This is a bug fix release (see the [ChangeLog](ChangeLog.md)) with only french translation as new feature.

## 03 October 2008: Released new Version 0.3.0 ##
This is a bug fix release (see the [ChangeLog](ChangeLog.md)) plus some improvements:
  * support of quick filter view with static filter view
  * Match all filters/Match any filter in dynamic filter view

## 14 March 2008: Released new Version 0.2.0 ##

This is a bug fix release (see the [ChangeLog](ChangeLog.md)) plus some improvements:
  * visual filter validation
  * a better preferences error handling
  * support for the new ENUM field type

# Features #

The current version of Cherry is heavily focused on data filtering functionalities: filters can be initially defined and successively applied to data for presentation (in a grid) or manipulation (inside a business process).

A [filter](filter.md) is formed by one or more elementary filter. Each elementary filter has a field related to a value through an operator.

Cherry constraints the operators and the values depending on the field types.

## Static Filter View ##

With this view you have a form, and in this form for each field you have a combo to choose the operator, and a widget to edit the value. The various field can be arranged in columns. Click [here](http://cherryonext.googlecode.com/svn/demos/demo/staticFilter.htm) to see an example.

## Dynamic Filtering ##

Through a Dynamic Filter it is possible to manage on the fly the filter components adding new elementary filters, deleting or modifying existing elements. The modifications may apply to the filtering condition or the referencing values. Click [here](http://cherryonext.googlecode.com/svn/demos/demo/dynamicFilter.htm) to see an example.

## Quick Filtering ##

The Quick Filter permits to build a filter right clicking on a cell of a grid. The component value is the pointed cell value, its column becomes the component field. The operator is selected in the quick filter submenu, populated with field typed operators. Click [here](http://cherryonext.googlecode.com/svn/demos/demo/quickFilter.htm) to see an example.

**NB**: the quick filter and the dynamic filter functionalities may cooperate to build the same filter.

## Preferences ##
To save a particular application status for later reuse is another useful feature needed for enhancing the user experience: think for example to the bookmarks/favorites paradigm applied to store frequently used filtering condition on a grid. Click [here](http://cherryonext.googlecode.com/svn/demos/demo/preferenceManager.htm) to see an example.

## Input Mask Control ##
Input Mask control lets the user enter text inside a preset mask. The preset masks are completely customizable to any set of alpha-numeric characters and can limit the mask by alphabetic, numeric, or alphanumeric placeholders. Click [here](http://cherryonext.googlecode.com/svn/demos/demo/inputTextMask.htm) to see an example.

# Thanks #
  1. To all the people behind the beautiful Ext JS framework.
  1. To Kirill Hryapin for his RowFitLayout.
  1. To Andrei Neculau for his Select widget.
  1. To Jozef Sakalos for his DateTimeField