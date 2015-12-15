## Version 0.3.1 <sup>2008-10-30</sup> ##
### Incompatibilities with previous version ###
None.
### Changes ###
  * Fix: drop down list box lose their value in StaticFilterModelView
  * French translation (thanks to guillaume DOT crico AT gmail.com)

## Version 0.3.0 <sup>2008-10-03</sup> ##
### Incompatibilities with previous version ###
  * Changed signature of constructor of AvailableValuesEditor
### Changes ###

  * A LOT of bug fixes
  * Added possibility to reconfigure the fieldManager to completely change the set of the fields (thanks to donssmith)
  * Better design of StaticFilterModelView: it now handles resizes a lot better
  * Possibility to use quick filter in replace mode: if a filter on a given field is already existing, the quick filter view will replace this one and not one a new
  * Possibility to specify "Match all" or "Match one" filter in Dynamic Filter Model View
  * management of case insensitive search in fields with available values

## Version 0.2.0 <sup>2008-03-14</sup> ##
### Incompatibilities with previous version ###
  * Changed from STRING\_EQUALS to STRING\_EQUAL the id of the operation = between strings
  * Not allowd by default to have 2 equals elementary filters added using QuickFilter
  * To return an error from the backends call in the preferences manager you have to return an error http code
### Changes ###

  * Implemented enhancement [validation of elementary filters](http://code.google.com/p/cherryonext/issues/detail?id=5)
  * Fixed bug [PHPFilterResolver.php doesn't work with Charry On Ext 0.1.1 any more](http://code.google.com/p/cherryonext/issues/detail?id=8)
  * Fixed bug [Error with StaticFilterModel if the filterModel is not named filterModel](http://code.google.com/p/cherryonext/issues/detail?id=9)
  * Better error management in PreferenceManager & PreferenceManagerView
  * Better management of quick filters' labels. As default it now uses the grid renderer to render the values
  * Added ability to set a default value to the filter different from the empty one
  * Fixed demos according to BlueCamel forum post
  * Fixed bug on quick filter signaled by BlueCamel (quick filter on column without filter)
  * Added `enum` among the field types
  * Added ability to add additional filters in getFilterObj method of FilterModel
  * Added more automatic tests
  * Changed default to quick filter: ignore duplicated filters


## Version 0.1.1 <sup>Released on 2008-02-20</sup> ##
Added ability to edit dates using DateTimeField.

## Version 0.1.0 <sup>Released on 2008-02-18</sup> ##
First release.