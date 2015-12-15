# Introduction #

The example is not RDBMS independent (it works for Oracle)

For a usage scenario, in a controller action you can write:

```
    def query = "from Device"
    if (params.filter != null) {
       	query += " where ${Filter.getSqlWhereCondition(params)}"
    }
    def n = device.findAll(query,[max:params.limit.toInteger(),offset:params.start.toInteger()])
```


# Details #

Filter.groovy source code

```
import grails.converters.*;

class Filter {
	def operator = [
		STRING_EQUAL: ' = ',
		STRING_DIFFERENT: ' != ',
		STRING_CONTAINS: ' like ',
		STRING_DOESNT_CONTAINS: 'not like ',
		STRING_STARTS_WITH: ' like ',
		STRING_ENDS_WITH: ' like ',
		NUMBER_EQUAL: ' = ',
		NUMBER_NOT_EQUAL: ' != ',
		NUMBER_GREATER: ' > ',
		NUMBER_GREATER_OR_EQUAL: ' >= ',
		NUMBER_LESS: ' < ',
		NUMBER_LESS_OR_EQUAL: ' <= ',
		NUMBER_RANGE: ' between ',
		DATE_EQUAL: ' = ',
		DATE_GREATER: ' > ',
		DATE_GREATER_OR_EQUAL: ' >= ',
		DATE_LESS: ' < ',
		DATE_LESS_OR_EQUAL: ' <= ',
		DATE_RANGE: ' between '
		]
		
	def converter = new JSON()
	
	private static final INSTANCE = new Filter()

	private Filter() {}

	
	static String getSqlWhereCondition (param, fieldMap = null) {
		if (param.filter == null) return null
		def filter = INSTANCE.converter.parse(param.filter)
		
		return INSTANCE.getSqlSlot(filter, fieldMap)
	}
	
	String getSqlSlot (filter, fieldMap) {
		if (filter.logicalOperator != null) {
			return getSqlSlot(filter.left, fieldMap) + " AND " + getSqlSlot(filter.right, fieldMap)
		} else {
			// use the field mapping if defined
			def field = filter.fieldId
			if (fieldMap && fieldMap[filter.fieldId]) {
				field = fieldMap[filter.fieldId]
			}
			switch (filter.operatorId)  {
				case "DATE_PERIOD":
					if (filter.values[0] == null) {return "1<>1"}
					return formatDatePeriod(field,filter.values[0].value)					
					break
				case "STRING_LIST":
					return formatStringInList(field, filter.values)
					break
				case ["STRING_EQUAL", "STRING_DIFFERENT", "STRING_CONTAINS", "STRING_DOESNT_CONTAINS", "STRING_STARTS_WITH", "STRING_ENDS_WITH"]:
					return formatString(field, filter.operatorId, filter.values[0])
					break
				default:
					return field + operator[filter.operatorId] + formatValue(filter.operatorId,filter.values)
			}
		}
	}

	String formatStringInList(field, values) {
		List vlist
		String res
		
		values.each {
			if (it.value == "") {
				// do nothing 
			} else {
				vlist << it.value
			}
		}
		
		if (vlist.size()) {
			res = "field in (${vlist.join()})"	
		}
		return res
	}

    String formatDatePeriod(field,value) {
      	if(value == 'LAST_YEAR'){
        	value="sysdate-TO_YMINTERVAL('01-00')"
      	} else if (value =='LAST_MONTH') {
        	value="ADD_MONTHS(sysdate,-1)"
      	} else if (value =='LAST_WEEK') {
        	value="sysdate -7"
      	} else if (value =='LAST_DAY') {
        	value="sysdate -1"
      	} else if (value =='LAST_HOUR') {
        	value="sysdate -(1/24)"
      	} else if (value == 'LAST_QUARTER') {
        	value="sysdate - (1/96)"
      	} else {
        	return("1<>1")
      	}
      	
      	return field + " > " + value
 	}

	String formatString(field, op, values) {
		String fval = field + operator[op]

		if(!values) {
			switch (op) {
				case "STRING_EQUAL":
					return "$field is null"
					break
				case "STRING_DIFFERENT":
					return "$field is not null"
					break
				default:
					throw new Exception("Internal Error")
			}
		}
		
		switch (op) {
			case "STRING_CONTAINS":
				fval += "'%${values.value}%'"
				break
			case "STRING_STARTS_WITH":
				fval += "'${values.value}%'"
				break
			case "STRING_ENDS_WITH":
				fval += "'%${values.value}'"
				break
			case "STRING_DOESNT_CONTAIN":
				fval += "'%${values.value}%'"
				break
	    	default:
				fval += "'${values.value}'"
		}
		return fval
	}
	
	
	
	
	String formatValue (operator, values) {
		String fval = ""
		
		if(!values.size()) {return "''"}
		
		switch (operator) {
		case "NUMBER_RANGE":
			fval = values[0].value + " AND " + values[1].value
			break
		case "DATE_RANGE":
			fval = "to_date('${values[0].value}', 'YYYY-MM-DD HH24:MI:SS') AND to_date('${values[1].value}', 'YYYY-MM-DD HH24:MI:SS')"
			break
		case ["DATE_EQUAL","DATE_GREATER","DATE_GREATER_OR_EQUAL","DATE_LESS","DATE_LESS_OR_EQUAL"]:
			fval = "to_date('${values[0].value}', 'YYYY-MM-DD HH24:MI:SS')"
			break
		case ["NUMBER_EQUAL","NUMBER_GREATER","NUMBER_GREATER_OR_EQUAL","NUMBER_LESS","NUMBER_LESS_OR_EQUAL"]:
			fval = values[0].value
			break
	    default:
			fval = "'${values[0].value}'"
		}
		return fval
	}
}
```