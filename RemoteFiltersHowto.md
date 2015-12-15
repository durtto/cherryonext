In the demos, since we don't have access to a DB in a public web space, we use LocalStoreFilterResolver to filter a local store. Here I will explain how to filter remote data, and I will give an example php code to translate a filter expression to a SQL where clause (Oracle 9i or better)


## Client ##
To filter a grid you have to filter the data in the grid's store. If the store obtains the data from a remote URL, the standard Ext JS way to load the data is the following:
```
store.load({params: {start:0, limit: 20}});
```

If you want to send filter information a way is the following:
```
  store.load({params: {start:0, limit: 20,filter: Ext.util.JSON.encode(filterModel.getFilterObj())}});
```
where filterModel is the Ext.ux.netbox.core.FilterModel used to filter on the grid. In this way your url will have a filter parameter containing the filter object encoded using JSON.
Now, if you try to sort your grid clicking on the header of the cell, you will see that the filter is lost. To have the filter as a persistent options of the store you shoild use the baseParams attribute of the store instead:
```
  store.baseParams=Ext.apply(store.baseParams,{filter: Ext.util.JSON.encode(filterModel.getFilterObj())});
  store.load({params: {start:0, limit: 20}});
```

## Server ##
### Security ###
First of all reapet 3 times with me: the server should not trust the client, the server should not trust the client, the server should not trust the client.
It's not difficult to send you a malicious filter (for example looking at the filters with firebug and changing them manually....). Your server should not send back data if the user should not see them, indipendently from the filter. Write your code and your queries to ensure this.
### Real work ###
On the server you have to decode the object from JSON (there are implementations on most of the languages, just google for JSON <language name>). Then you probably want to transform this object in a SQL where condition.
For details about the structure of the filter object look at [this page](filter.md). In practice what matters is that it's a binary tree, where the leaf are the elementary filters, while the other nodes are the logical operators.
In pseudocode the sql converter should do something like this:
```
function getSQL(filterObject)
start
  if the filterObject is null then
    return noFilter
  end if
  if theFilterObject.left is not defined then //this means that it's a leaf
    return(call to decode the elementary filter in SQL (you can use library such hibernate, or write directly your sql code here);
  else
    leftSQL=getSql(filterObject.left);
    rightSQL=getSql(filterObject.right);
    return(concatenate (leftSQL filterObject.logicalConnector rightSQL));
  end if
end function
```

For an example PHP implementation look at http://code.google.com/p/cherryonext/source/browse/trunk/test/PHPFilterResolver.php

For an example C# implementation look at http://code.google.com/p/cherryonext/source/browse/trunk/test/FilterResolver.cs