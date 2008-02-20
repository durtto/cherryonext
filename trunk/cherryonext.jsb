<?xml version="1.0" encoding="utf-8"?>
<project path="" name="Cherry On Ext" author="Netbox Team" version="1.0" copyright="$projectName&#xD;&#xA;Copyright(c) 2008, $author, RowFitLayout is from Kirill Hryapin, Select is from Andrei Neculau, DateTimeField is from Jozef Sakalos.&#xD;&#xA;This is free software; you can redistribute it and/or modify it&#xD;&#xA;under the terms of the GNU Lesser General Public License as&#xD;&#xA;published by the Free Software Foundation version 3.0 of&#xD;&#xA;the License, or (at your option) any later version.&#xD;&#xA;&#xD;&#xA;This software is distributed in the hope that it will be useful,&#xD;&#xA;but WITHOUT ANY WARRANTY; without even the implied warranty of&#xD;&#xA; MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.&#xD;&#xA;&#xD;&#xA;You should have received a copy of the GNU Lesser General Public&#xD;&#xA;License along with this software; if not, write to the Free&#xD;&#xA;Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA&#xD;&#xA;02110-1301 USA, or see the FSF site: http://www.fsf.org." output="." source="False" source-dir="$output\source" minify="true" min-dir="$output\build" doc="False" doc-dir="$output\docs" master="true" master-file="$output\yui-ext.js" zip="true" zip-file="$output\yuo-ext.$version.zip">
  <directory name="src" />
  <directory name="src\external" />
  <target name="Filter" file="$output\cherryonext.js" debug="True" shorthand="False">
    <include name="src\external\RowFitLayout.js" />
    <include name="src\external\Select.js" />
    <include name="src\external\DateTime.js" />
    <include name="src\netbox\core\Operator.js" />
    <include name="src\netbox\core\Field.js" />
    <include name="src\netbox\core\Filter.js" />
    <include name="src\netbox\core\ElementaryFilter.js" />
    <include name="src\netbox\core\CompositeFilter.js" />
    <include name="src\netbox\core\FieldManager.js" />
    <include name="src\netbox\core\FilterModel.js" />
    <include name="src\netbox\core\DynamicFilterModelView.js" />
    <include name="src\netbox\core\StaticFilterModelView.js" />
    <include name="src\netbox\FilterEditor.js" />
    <include name="src\netbox\core\AvailableValuesEditor.js" />
    <include name="src\netbox\core\TextValuesEditor.js" />
    <include name="src\netbox\string\TextFieldOperator.js" />
    <include name="src\netbox\string\StringListOperator.js" />
    <include name="src\netbox\string\StringField.js" />
    <include name="src\netbox\number\NumberOperators.js" />
    <include name="src\netbox\number\NumberField.js" />
    <include name="src\netbox\InputTextMask.js" />
    <include name="src\netbox\date\DateTextEditor.js" />
    <include name="src\netbox\date\DateOperators.js" />
    <include name="src\netbox\date\DateField.js" />
    <include name="src\netbox\core\RangeField.js" />
    <include name="src\netbox\core\RangeMenu.js" />
    <include name="src\netbox\core\RangeItem.js" />
    <include name="src\netbox\core\LocalStoreFilterResolver.js" />
    <include name="src\netbox\ErrorDialog.js" />
    <include name="src\netbox\ContainerMenuItem.js" />
    <include name="src\netbox\ContextMenuManager.js" />
    <include name="src\netbox\core\QuickFilterModelView.js" />
    <include name="src\netbox\PreferenceManager.js" />
    <include name="src\netbox\PreferenceManagerView.js" />
    <include name="src\netbox\core\FilterHeaderPlugin.js" />
  </target>
  <directory name="src" />
  <file name="src\external\RowFitLayout.js" path="external" />
  <file name="src\external\Select.js" path="external" />
  <file name="src\external\DateTime.js" path="external" />
  <file name="src\netbox\string\TextFieldOperator.js" path="netbox\string" />
  <file name="src\netbox\string\StringListOperator.js" path="netbox\string" />
  <file name="src\netbox\string\StringField.js" path="netbox\string" />
  <file name="src\netbox\core\Filter.js" path="netbox\core" />
  <file name="src\netbox\core\ElementaryFilter.js" path="netbox\core" />
  <file name="src\netbox\core\AvailableValuesEditor.js" path="netbox\core" />
  <file name="src\netbox\core\CompositeFilter.js" path="netbox\core" />
  <file name="src\netbox\core\Field.js" path="netbox\core" />
  <file name="src\netbox\core\DynamicFilterModelView.js" path="netbox\core" />
  <file name="src\netbox\core\RangeItem.js" path="netbox\core" />
  <file name="src\netbox\core\TextValuesEditor.js" path="netbox\core" />
  <file name="src\netbox\core\LocalStoreFilterResolver.js" path="netbox\core" />
  <file name="src\netbox\core\FilterModel.js" path="netbox\core" />
  <file name="src\netbox\core\Operator.js" path="netbox\core" />
  <file name="src\netbox\core\RangeField.js" path="netbox\core" />
  <file name="src\netbox\core\RangeMenu.js" path="netbox\core" />
  <file name="src\netbox\core\FieldManager.js" path="netbox\core" />
  <file name="src\netbox\core\StaticFilterModelView.js" path="netbox\core" />
  <file name="src\netbox\ErrorDialog.js" path="netbox" />
  <file name="src\netbox\ContainerMenuItem.js" path="netbox" />
  <file name="src\netbox\ContextMenuManager.js" path="netbox" />
  <file name="src\netbox\core\QuickFilterModelView.js" path="netbox\core" />
  <file name="src\netbox\number\NumberOperators.js" path="netbox\number" />
  <file name="src\netbox\number\NumberField.js" path="netbox\number" />
  <file name="src\netbox\date\DateField.js" path="netbox\date" />
  <file name="src\netbox\date\DateTextEditor.js" path="netbox\date" />
  <file name="src\netbox\date\DateOperators.js" path="netbox\date" />
  <file name="src\netbox\FilterEditor.js" path="netbox" />
  <file name="src\netbox\InputTextMask.js" path="netbox" />
  <file name="src\netbox\PreferenceManager.js" path="netbox" />
  <file name="src\netbox\PreferenceManagerView.js" path="netbox" />
  <file name="src\netbox\core\FilterHeaderPlugin.js" path="netbox\core" />
</project>