// $Id$
/*
 * Italian translation
 */

if(Ext.ux.netbox.core.DynamicFilterModelView){
   Ext.apply(Ext.ux.netbox.core.DynamicFilterModelView.prototype, {
      deleteText        : 'Elimina',
      filterText        : 'Campo',
      operatorText      : 'Operazione',
      valueText         : 'Valore',
      comboText         : 'Seleziona un campo',
      logicOpeAndText   : 'Verifica tutti',
      logicOpeOrText    : 'Verifica almeno uno'

   });
}

if(Ext.ux.netbox.PreferenceManagerView){
   Ext.apply(Ext.ux.netbox.PreferenceManagerView.prototype, {
      addText           : 'Aggiungi preferenza',
      addTooltipText    : 'Salva la attuale configurazione',
      manageText        : 'Gestisci preferenze',
      manageTooltipText : 'Gestisci le configurazioni salvate',
      okText            : 'OK',
      cancelText        : 'Annulla',
      modifyText        : 'Modifica preferenza',
      modifyBtnText     : 'Modifica',
      deleteBtnText     : 'Elimina',
      closeBtnText      : 'Chiudi',
      nameText          : 'Nome',
      descText          : 'Descrizione',
      defaultText       : 'Predefinita',
      loadingText       : 'Caricamento in corso...'
   });
}

if(Ext.ux.netbox.core.QuickFilterModelView){
   Ext.apply(Ext.ux.netbox.core.QuickFilterModelView.prototype, {
      quickFilterText : 'QuickFilter',
      removeText      : 'Rimuovi filtri',
      removeAllText   : 'Rimuovi tutti'
   });
}

if(Ext.ux.netbox.core.RangeMenu){
   Ext.apply(Ext.ux.netbox.core.RangeMenu.prototype, {
      fromText : 'da',
      toText   : 'a'
   });
}

if(Ext.ux.netbox.core.RangeField){
	  Ext.apply(Ext.ux.netbox.core.RangeField.prototype, {
	     fromText : 'da',
	     toText   : 'a�'
	  });
	}

if(Ext.ux.netbox.date.DateRangeOperator){
   Ext.apply(Ext.ux.netbox.date.DateRangeOperator.prototype, {
      fromText : 'da',
      toText   : 'a',
      includeText : 'compreso',
      bothFromAndToNotEmpty: "Sia 'da' che 'a' devono essere avvalorati",
      fromBiggerThanTo: "'da' è più grande di 'a'",
      fromNotADate: "Da non è una data valida",
      toNotADate: "A non è una data valida",
      toAndFromNotADate: "Sia 'da' che 'a' non sono date valide"
   });
}

if(Ext.ux.netbox.number.NumberRangeOperator){
   Ext.apply(Ext.ux.netbox.number.NumberRangeOperator.prototype, {
      fromText : 'da',
      toText   : 'a',
      includeText : 'compreso',
      bothFromAndToNotEmpty: "Sia 'da' che 'a' devono essere avvalorati",
      fromBiggerThanTo: "'Da' è più grande di 'a'",
      fromNotANumber: "Da non è un numero valido",
      toNotANumber: "A non è un numero valido",
      toAndFromNotANumber: "Sia 'Da' che 'A' non sono numeri validi"
   });
}

if(Ext.ux.netbox.date.DatePeriodOperator){
   Ext.apply(Ext.ux.netbox.date.DatePeriodOperator.prototype, {
      periodText  : "periodo",
      yearText    : "ultimo anno",
      monthText   : "ultimo mese",
      weekText    : "ultima settimana",
      dayText     : "ultimo giorno",
      hourText    : "ultima ora",
      quarterText : "ultimo quarto d'ora",
      valueNotExpected: "valore non previsto"
   });
}

if(Ext.ux.netbox.core.Field){
  Ext.apply(Ext.ux.netbox.core.Field, {
    emptyNotAllowed: "Valore vuoto non consentito"
  });
}

if(Ext.ux.netbox.string.StringField){
   Ext.apply(Ext.ux.netbox.string.StringField.prototype, {
     stringEqualsLabel: "=",
     stringDifferentLabel: "!=",
     containsText: "contiene",
     doesntContainsText: "non contiene",
     startsWithText: "inizia con",
     endsWithText: "finisce con",
     stringListText: "in lista",
     stringNotListText: "non in lista",
     emptyNotAllowed: "Valore vuoto non consentito"
   });
}

if(Ext.ux.netbox.DefaultPreferenceManagerErrorManager){
  Ext.apply(Ext.ux.netbox.DefaultPreferenceManagerErrorManager.prototype, {
     failedToApplyDefaultPreferenceTitle: "Impossibile applicare la preferenza predefinita",
     failedToApplyPreferenceTitle: "Impossibile applicare la preferenza",
     failedToSavePreferenceTitle: "Impossibile salvare la preferenza",
     failedToDeletePreferenceTitle: "Impossibile eliminare le preferenze selezionate",
     failedToLoadPreferenceTitle: "Impossibile caricare le preferenze"
  });
}

if(Ext.ux.netbox.date.RangeEditor){
  Ext.apply(Ext.ux.netbox.date.RangeEditor.prototype, {
	  fromText    : 'da',
	  toText      : 'a'
  });
}

if(Ext.ux.netbox.date.DateField){
  Ext.apply(Ext.ux.netbox.date.DateField.prototype, {
      periodText  : "periodo",
      yearText    : "ultimo anno",
      monthText   : "ultimo mese",
      weekText    : "ultima settimana",
      dayText     : "ultimo giorno",
      hourText    : "ultima ora",
      quarterText : "ultimo quarto d'ora",
      valueNotExpected: "valore non previsto"
  });
}

if(Ext.ux.netbox.string.EnumField){
  Ext.apply(Ext.ux.netbox.string.EnumField.prototype, {
	     stringEqualsLabel: "=",
	     stringDifferentLabel: "!=",
	     containsText: "contiene",
	     doesntContainsText: "non contiene",
	     startsWithText: "inizia con",
	     endsWithText: "finisce con",
	     stringListText: "in lista",
	     stringNotListText: "non in lista",
	     emptyNotAllowed: "Valore vuoto non consentito"
  });
}

if(Ext.ux.netbox.number.EnumIntField){
  Ext.apply(Ext.ux.netbox.number.EnumIntField.prototype, {
	     stringEqualsLabel: "=",
	     stringDifferentLabel: "!=",
	     containsText: "contiene",
	     doesntContainsText: "non contiene",
	     startsWithText: "inizia con",
	     endsWithText: "finisce con",
	     stringListText: "in lista",
	     stringNotListText: "non in lista",
	     emptyNotAllowed: "Valore vuoto non consentito"
  });
}

if(Ext.ux.netbox.date.DateTimeEditor){
	  Ext.apply(Ext.ux.netbox.date.DateTimeEditor.prototype, {
		  selectText: "Chiudi"
	  });
}

