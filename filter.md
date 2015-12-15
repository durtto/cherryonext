# What is a filter? #
In Cherry On Ext filters have only only 2 components:
  1. conditions that are made of a field, an operator and a value. For example: `name = John`. This are known as elementary filters. In the example, name is the field, = is the operator and John is the value
  1. conditions that are the composition of 2 filters (left and right), connected with a logical operator. For example `name = John and age > 12`. In the example and is the logical operator, `name = John` is the left side and `age > 12` is the right side
# Filter Model #
This is the UML class diagram of the filter explained in the above paragraph

![http://cherryonext.googlecode.com/svn/wiki/FilterModel.png](http://cherryonext.googlecode.com/svn/wiki/FilterModel.png)

# Managing Filters #
Cherry mantaines the filter internally as explained above. To interact with cherry you can use the classes, or in a easier way you can use some javascript object that reflects the internal cherry model.
First of all let's show an example:
```
{left:
  {fieldId:"field2",
    operatorId:"STRING_LIST",
    values:[{value:"valoreRemoto3",label:"labelRemota3"},{value:"valoreRemoto1",label:"labelRemota1"}]
   },
  logicalOperator:"AND",
  right:{
    fieldId:"field4",
    operatorId:"DATE_EQUAL",
    values:[{"value":"2008-02-25 00:30:00","label":"25/02/2008 00:30"}]
  }
}
```
This is the rapresentation of `field2 in labelRemota3,labelRemota1 AND field4 = 25/02/2008 00:30`

As you can see a composite filter is an object with 3 attributes, left, right and logicalOperator. An elementary filter is an object with three attributes too, fieldId, operatorId and values. Values depends from the operator, but usually it's an array of object with value and label attributes.