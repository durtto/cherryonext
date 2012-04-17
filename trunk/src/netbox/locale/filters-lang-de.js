/*
 * German translation done by Thorsten Müller, Bonn, www.terrestris.de
 */


if(Ext.ux.netbox.core.DynamicFilterModelView){
   Ext.apply(Ext.ux.netbox.core.DynamicFilterModelView.prototype, {
      deleteText        : 'Löschen',
      filterText        : 'Filter',
      operatorText      : 'Operator',
      valueText         : 'Wert',
      comboText         : 'Auswahl des Filters',
      logicOpeAndText   : 'Filter mit UND verknüpft',
      logicOpeOrText    : 'Filter mit ODER verknüpft'

   });
}

if(Ext.ux.netbox.PreferenceManagerView){
   Ext.apply(Ext.ux.netbox.PreferenceManagerView.prototype, {
      addText           : 'Neue Einstellung',
      addTooltipText    : 'Speichern der aktuellen Konfiguration',
      manageText        : 'Bearbeite Einstellungen',
      manageTooltipText : 'Bearbeiten der gespeicherten Konfigurationen',
      okText            : 'OK',
      cancelText        : 'Abbrechen',
      modifyText        : 'Bearbeite Einstellung',
      modifyBtnText     : 'Bearbeiten',
      deleteBtnText     : 'Löschen',
      closeBtnText      : 'Schließen',
      nameText          : 'Name',
      descText          : 'Beschreibung',
      defaultText       : 'Standard',
      loadingText       : 'Laden der Einstellung...'
   });
}

if(Ext.ux.netbox.core.QuickFilterModelView){
   Ext.apply(Ext.ux.netbox.core.QuickFilterModelView.prototype, {
      quickFilterText : 'Schnellfilter',
      removeText      : 'Entferne Filter',
      removeAllText   : 'Entferne alle Filter'
   });
}

if(Ext.ux.netbox.core.RangeMenu){
   Ext.apply(Ext.ux.netbox.core.RangeMenu.prototype, {
      fromText : 'von',
      toText   : 'bis'
   });
}

if(Ext.ux.netbox.core.RangeField){
  Ext.apply(Ext.ux.netbox.core.RangeField.prototype, {
     fromText : 'von',
     toText   : 'bis'
  });
}

if(Ext.ux.netbox.date.DateRangeOperator){
   Ext.apply(Ext.ux.netbox.date.DateRangeOperator.prototype, {
      fromText : 'von',
      toText   : 'bis',
      includeText : 'zwischen',
      bothFromAndToNotEmpty: "'von' und 'bis' sind leer",
      fromBiggerThanTo: "'von' grösser als 'bis'",
      fromNotADate: "'von' ist kein gültiges Datum",
      toNotADate: "'bis' ist kein gültiges Datum",
      toAndFromNotADate: "'von' und 'bis' besitzen kein gültiges Datum"
   });
}

if(Ext.ux.netbox.number.NumberRangeOperator){
   Ext.apply(Ext.ux.netbox.number.NumberRangeOperator.prototype, {
      fromText : 'von',
      toText   : 'bis',
      includeText : 'zwischen',
      bothFromAndToNotEmpty: "'von' und 'bis' sind leer",
      fromBiggerThanTo: "'von' grösser als 'bis'",
      fromNotANumber: "'von' ist keine gültige Zahl",
      toNotANumber: "'bis' ist keine gültige Zahl",
      toAndFromNotANumber: "'von' und 'bis' sind keine gültigen Zahlen"
   });
}

if(Ext.ux.netbox.date.DatePeriodOperator){
   Ext.apply(Ext.ux.netbox.date.DatePeriodOperator.prototype, {
      periodText  : "Zeitraum",
      yearText    : "letztes Jahr",
      monthText   : "letzter Monat",
      weekText    : "letzte Woche",
      dayText     : "letzter Tag",
      hourText    : "letzte Stunde",
      quarterText : "letzte Viertelstunde",
      valueNotExpected: "kein gültiger Wert"
   });
}

if(Ext.ux.netbox.core.Field){
  Ext.apply(Ext.ux.netbox.core.Field, {
    emptyNotAllowed: "Wert darf nicht leer sein"
  });
}

if(Ext.ux.netbox.string.StringField){
   Ext.apply(Ext.ux.netbox.string.StringField.prototype, {
     stringEqualsLabel: "=",
     stringDifferentLabel: "!=",
     containsText: "enthält",
     doesntContainsText: "enthält nicht",
     startsWithText: "beginnt mit",
     endsWithText: "endet mit",
     stringListText: "in Liste",
     stringNotListText: "nicht in Liste",
     emptyNotAllowed: "Wert darf nicht leer sein"
   });
}

if(Ext.ux.netbox.DefaultPreferenceManagerErrorManager){
  Ext.apply(Ext.ux.netbox.DefaultPreferenceManagerErrorManager.prototype, {
     failedToApplyDefaultPreferenceTitle: "Anwenden der Standard-Einstellung nicht möglich",
     failedToApplyPreferenceTitle: "Anwenden der Einstellung nicht möglich",
     failedToSavePreferenceTitle: "Speichern der Einstellung nicht möglich",
     failedToDeletePreferenceTitle: "Löschen der Einstellung nicht möglich",
     failedToLoadPreferenceTitle: "Laden der Einstellung nicht möglich"
  });
}

if(Ext.ux.netbox.date.RangeEditor){
  Ext.apply(Ext.ux.netbox.date.RangeEditor.prototype, {
	     fromText : 'von',
	     toText   : 'bis'
  });
}

if(Ext.ux.netbox.date.DateField){
  Ext.apply(Ext.ux.netbox.date.DateField.prototype, {
      periodText  : "Zeitraum",
      yearText    : "letztes Jahr",
      monthText   : "letzter Monat",
      weekText    : "letzte Woche",
      dayText     : "letzter Tag",
      hourText    : "letzte Stunde",
      quarterText : "letzte Viertelstunde",
      valueNotExpected: "kein gültiger Wert"
  });
}

if(Ext.ux.netbox.string.EnumField){
  Ext.apply(Ext.ux.netbox.string.EnumField.prototype, {
	     stringEqualsLabel: "=",
	     stringDifferentLabel: "!=",
	     containsText: "enthält",
	     doesntContainsText: "enthält nicht",
	     startsWithText: "beginnt mit",
	     endsWithText: "endet mit",
	     stringListText: "in Liste",
	     stringNotListText: "nicht in Liste",
	     emptyNotAllowed: "Wert darf nicht leer sein"
  });
}

if(Ext.ux.netbox.number.EnumIntField){
  Ext.apply(Ext.ux.netbox.number.EnumIntField.prototype, {
	     stringEqualsLabel: "=",
	     stringDifferentLabel: "!=",
	     containsText: "enthält",
	     doesntContainsText: "enthält nicht",
	     startsWithText: "beginnt mit",
	     endsWithText: "endet mit",
	     stringListText: "in Liste",
	     stringNotListText: "nicht in Liste",
	     emptyNotAllowed: "Wert darf nicht leer sein"
  });
}

if(Ext.ux.netbox.date.DateTimeEditor){
	  Ext.apply(Ext.ux.netbox.date.DateTimeEditor.prototype, {
		  selectText: "Schließen"
	  });
}

