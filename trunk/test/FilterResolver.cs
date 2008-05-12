using System;
using System.Data;
using System.Collections;

/// <summary>
/// This class is used to resolve Cherry Filters in SQL where clause
/// The input method is the fwtSQL method.
/// The produced SQL was tested against SQL Server 2005
/// </summary>

public class FilterResolver
{

    public FilterResolver()
    {
    }

    public string getSql(IDictionary filter)
    {
        if (filter.Contains("operatorId"))
        {
            string operatorId = (string)filter["operatorId"];
            string fieldId = (string)filter["fieldId"];
            object[] values = (object[])filter["values"];

            if (operatorId.Equals("STRING_EQUAL"))
                return this.string_equal(fieldId, values);
            else if (operatorId.Equals("STRING_DIFFERENT"))
                return this.string_different(fieldId, values);
            else if (operatorId.Equals("STRING_STARTS_WITH"))
                return this.string_starts_with(fieldId, values);
            else if (operatorId.Equals("STRING_ENDS_WITH"))
                return this.string_ends_with(fieldId, values);
            else if (operatorId.Equals("STRING_CONTAINS"))
                return this.string_contains(fieldId, values);
            else if (operatorId.Equals("STRING_DOESNT_CONTAIN"))
                return this.string_doesnt_contains(fieldId, values);
            else if (operatorId.Equals("STRING_LIST"))
                return this.string_list(fieldId, values);
            else if (operatorId.Equals("STRING_NOT_IN_LIST"))
                return this.string_not_in_list(fieldId, values);
            else if (operatorId.Equals("NUMBER_EQUAL"))
                return this.number_equals(fieldId, values);
            else if (operatorId.Equals("NUMBER_NOT_EQUAL"))
                return this.number_differents(fieldId, values);
            else if (operatorId.Equals("NUMBER_GREATER"))
                return this.number_greater(fieldId, values);
            else if (operatorId.Equals("NUMBER_GREATER_OR_EQUAL"))
                return this.number_greater_or_equal(fieldId, values);
            else if (operatorId.Equals("NUMBER_LESS"))
                return this.number_less(fieldId, values);
            else if (operatorId.Equals("NUMBER_LESS_OR_EQUAL"))
                return this.number_less_or_equal(fieldId, values);
            else if (operatorId.Equals("NUMBER_RANGE"))
                return this.number_range(fieldId, values);
            else if (operatorId.Equals("DATE_EQUAL"))
                return this.date_equal(fieldId, values);
            else if (operatorId.Equals("DATE_GREATER"))
                return this.date_greater(fieldId, values);
            else if (operatorId.Equals("DATE_GREATER_OR_EQUAL"))
                return this.date_greater_or_equal(fieldId, values);
            else if (operatorId.Equals("DATE_LESS"))
                return this.date_less(fieldId, values);
            else if (operatorId.Equals("DATE_LESS_OR_EQUAL"))
                return this.date_less_or_equal(fieldId, values);
            else if (operatorId.Equals("DATE_RANGE"))
                return this.date_range(fieldId, values);
            else if (operatorId.Equals("DATE_PERIOD"))
                return this.date_period(fieldId, values);
            else
                return "";
        }
        else
        {
            string leftSql = this.getSql((IDictionary)filter["left"]);
            string rightSql = this.getSql((IDictionary)filter["right"]);
            return "(" + leftSql + " " + filter["logicalOperator"] + " " + rightSql + ")";
        }
    }

    private string calculateValue(object[] values)
    {
        if (values.Length == 0)
        {
            return "";
        }
        else
        {
            string valueStr = (string)((IDictionary)values[0])["value"];
            return valueStr.Replace("'", "''");
        }
    }

    private string escapeForLike(string valueStr)
    {
        valueStr = valueStr.Replace("\\", "\\\\");
        valueStr = valueStr.Replace("_", "\\_");
        valueStr = valueStr.Replace("%", "\\%");
        return valueStr;
    }

    private string string_equal(string fieldId, object[] values)
    {
        string valueStr = this.calculateValue(values);
        string toReturn = "";
        if (valueStr == "")
        {
            toReturn += "(";
        }
        toReturn += fieldId + "='" + valueStr + "'";
        if (valueStr == "")
        {
            toReturn += " or " + fieldId + " is null)";
        }
        return toReturn;
    }

    private string string_different(string fieldId, object[] values)
    {
        string valueStr = this.calculateValue(values);
        string toReturn = "";
        if (valueStr == "")
        {
            toReturn += "(";
        }
        toReturn += fieldId + "<>'" + valueStr + "'";
        if (valueStr == "")
        {
            toReturn += " or " + fieldId + " is not null)";
        }
        return toReturn;
    }

    private string string_starts_with(string fieldId, object[] values)
    {
        string valueStr = this.calculateValue(values);
        valueStr = escapeForLike(valueStr);
        return fieldId + " like '" + valueStr + "%' escape '\\'";
    }

    private string string_ends_with(string fieldId, object[] values)
    {
        string valueStr = this.calculateValue(values);
        valueStr = escapeForLike(valueStr);
        return fieldId + " like '%" + valueStr + "' escape '\\'";
    }

    private string string_contains(string fieldId, object[] values)
    {
        string valueStr = this.calculateValue(values);
        valueStr = escapeForLike(valueStr);
        return fieldId + " like '%" + valueStr + "%' escape '\\'";
    }

    private string string_doesnt_contains(string fieldId, object[] values)
    {
        return "not " + this.string_contains(fieldId, values);
    }

    private string string_list(string fieldId, object[] values)
    {
        string toReturn = "";
        bool nullValue = false;
        foreach (object value in values)
        {
            string valueStr = this.calculateValue(new object[1] { value });
            if (valueStr == "")
                nullValue = true;
            if (toReturn != "")
                toReturn += ",";
            toReturn += "'" + valueStr + "'";
        }
        toReturn = toReturn.Insert(0, fieldId + " in (");
        toReturn += ")";

        if (nullValue)
        {
            toReturn.Insert(0, "(");
            toReturn = toReturn += " or " + fieldId + " is null)";
        }

        return toReturn;
    }

    private string string_not_in_list(string fieldId, object[] values)
    {
        return "not " + string_list(fieldId, values);
    }

    private string number_equals(string fieldId, object[] values)
    {
        if (values.Length == 0)
            return fieldId + " is null";

        object valueStr = (object)((IDictionary)values[0])["value"];
        return fieldId + " = " + valueStr;
    }

    private string number_differents(string fieldId, object[] values)
    {
        if (values.Length == 0)
            return fieldId + " is not null";

        object valueStr = (object)((IDictionary)values[0])["value"];
        return fieldId + " <> " + valueStr + " or " + fieldId + " is null";
    }

    private string number_greater(string fieldId, object[] values)
    {
        object valueStr = (object)((IDictionary)values[0])["value"];
        return fieldId + " > " + valueStr;
    }

    private string number_greater_or_equal(string fieldId, object[] values)
    {
        object valueStr = (object)((IDictionary)values[0])["value"];
        return fieldId + " >= " + valueStr;
    }

    private string number_less(string fieldId, object[] values)
    {
        object valueStr = (object)((IDictionary)values[0])["value"];
        return fieldId + " < " + valueStr;
    }

    private string number_less_or_equal(string fieldId, object[] values)
    {
        object valueStr = (object)((IDictionary)values[0])["value"];
        return fieldId + " <= " + valueStr;
    }

    private string number_range(string fieldId, object[] values)
    {
        if (values.Length != 2)
            return ("1<>1");

        object[] valFrom = new object[1] { values[0] };
        object[] valTo = new object[1] { values[1] };
        return "(" + number_greater_or_equal(fieldId, valFrom) + " and " + number_less_or_equal(fieldId, valTo) + ")";
    }

    private string date_equal(string fieldId, object[] values)
    {
        string valueStr = this.calculateValue(values);
        if (valueStr == "")
        {
            return fieldId + " is null";
        }
        return fieldId + " = '" + valueStr + "'";
    }

    private string date_greater(string fieldId, object[] values)
    {
        string valueStr = this.calculateValue(values);
        return fieldId + " > '" + valueStr + "'";
    }

    private string date_greater_or_equal(string fieldId, object[] values)
    {
        string valueStr = this.calculateValue(values);
        return fieldId + " >= '" + valueStr + "'";
    }

    private string date_less(string fieldId, object[] values)
    {
        string valueStr = this.calculateValue(values);
        return fieldId + " < '" + valueStr + "'";
    }

    private string date_less_or_equal(string fieldId, object[] values)
    {
        string valueStr = this.calculateValue(values);
        return fieldId + " <= '" + valueStr + "'";
    }

    private string date_range(string fieldId, object[] values)
    {
        if (values.Length != 2)
            return ("1<>1");

        object[] valFrom = new object[1] { values[0] };
        object[] valTo = new object[1] { values[1] };
        return "(" + date_greater_or_equal(fieldId, valFrom) + " and " + date_less_or_equal(fieldId, valTo) + ")";
    }

    private string date_period(string fieldId, object[] values)
    {
        string valueStr = this.calculateValue(values);
        if (valueStr == "LAST_YEAR")
        {
            valueStr = "dateadd(yy,-1,getdate()) and date<=getdate()";
        }
        else if (valueStr == "LAST_MONTH")
        {
            valueStr = "dateadd(mm,-1,getdate()) and date<=getdate()";
        }
        else if (valueStr == "LAST_WEEK")
        {
            valueStr = "dateadd(ww,-1,getdate()) and date<=getdate()";
        }
        else if (valueStr == "LAST_DAY")
        {
            valueStr = "dateadd(dd,-1,getdate()) and date<=getdate()";
        }
        else if (valueStr == "LAST_HOUR")
        {
            valueStr = "dateadd(hh,-1,getdate()) and date<=getdate()";
        }
        else if (valueStr == "LAST_QUARTER")
        {
            valueStr = "dateadd(mi,-15,getdate()) and date<=getdate()";
        }
        else
        {
            return ("1<>1");
        }
        return fieldId + " > " + valueStr;
    }

}
