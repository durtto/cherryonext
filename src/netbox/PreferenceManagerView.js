// $Id$

Ext.namespace('Ext.ux.netbox');

/** Creates a new PreferenceManagerView. It takes as input a config object, usefull to config this component.
  * The only mandatory attribute added is PreferenceManager.
  * @constructor
  * @extends Ext.menu.Menu
  * @param {Object} config
  * @config {Ext.ux.netbox.PreferenceManager} preferenceManager The mandatory preference manager
  * @class This class is a view to show the preferences managed by a preference manager. The ui is similar to the bookmark one used by browser
  * <h4> Example </h4>
  * <pre>
  * //toolbar is a standard Ext.Toolbar
  * var prefManagView = new Ext.ux.netbox.PreferenceManagerView({preferenceManager: prefManager});
  * toolbar.add({text: 'Preference', menu: prefManagView});
  * </pre>
  */
Ext.ux.netbox.PreferenceManagerView = function(config){

  Ext.QuickTips.init();

  this.preferenceManager=config.preferenceManager;
  this.preferenceManager.on("preferenceSaved",this.onPreferenceSaved,this);
  this.preferenceManager.on("preferenceDeleted",this.onPreferenceDeleted,this);
  Ext.ux.netbox.PreferenceManagerView.superclass.constructor.call(this,config);

  this.on('beforeshow',this.loadRemotePref, this, {single: true});

  //this.preferenceManager.applyDefaultPreference();
};

Ext.extend(Ext.ux.netbox.PreferenceManagerView, Ext.menu.Menu,/** @scope Ext.ux.netbox.PreferenceManagerView.prototype */
{
  addText           : 'Add preference',
  addTooltipText    : 'Save the actual configuration',
  manageText        : 'Manage preferences',
  manageTooltipText : 'Manage the saved configurations',
  okText            : 'OK',
  cancelText        : 'Cancel',
  modifyText        : 'Modify preference',
  modifyBtnText     : 'Modify',
  deleteBtnText     : 'Delete',
  closeBtnText      : 'Close',
  nameText          : 'Name',
  descText          : 'Description',
  defaultText       : 'Default',

  /** loadRemotePref loading preferences from remote server
    * @private
    */
  loadRemotePref : function(){
    if(this.prefStore===undefined){
      this.prefStore=this.preferenceManager.getAllPreferences();
      this.prefStore.on('load', this.loadRemotePrefAsync, this);
    }
    this.prefStore.load();
  },

  /** loadRemotePrefAsync
    * @private
    */
  loadRemotePrefAsync : function(){
    this.removeAll();
    this.add(
      {text:this.addText, tooltip:this.addTooltipText, handler:this.addPreference, scope:this},
      {text:this.manageText, tooltip:this.manageTooltipText, handler:this.showManageDialog, scope:this},
      '-');
    for(var i=0;i<this.prefStore.getTotalCount();i++){
      var rec=this.prefStore.getAt(i);
      var iconCls='';
      if(rec.get('isDefault')==true)
        iconCls='x-icon-checked';
      this.add({
        id:      rec.get('prefId'),
        text:    rec.get('prefName'),
        tooltip: rec.get('prefDesc'),
        iconCls: iconCls,
        handler: this.applyPreference,
        scope:   this});
    }
  },

  /** addPreference Opens dialog for save the preference
    * @private
    */
  addPreference : function(){
    this.showAddDialog('','','',false);
  },

  /** managePreference Opens dialog for modify the preference
    * @private
    */
  managePreference : function(){
    selModel=this.manageGridPanel.getSelectionModel();
    record=selModel.getSelected();
    if(record)
      this.showAddDialog(record.get('prefId'),record.get('prefName'),record.get('prefDesc'),record.get('isDefault'));
  },

  /** deletePreferences Method for delete the selected preferences
    * @private
    */
  deletePreferences : function(){
    selModel=this.manageGridPanel.getSelectionModel();
    records=selModel.getSelections();
    if(records.length>0){
      var prefIdArray=[];
      for(var i=0;i<records.length;i++){
        prefIdArray.push(records[i].get('prefId'));
      }
      this.preferenceManager.deletePreferences(prefIdArray);
    }
  },
  
  /** showAddDialog Create dialog for add or modify the preference
    * @private
    */
  showAddDialog : function(prefId,prefName,prefDesc,isDefault){
    if(!this.addDialog){
      this.addDialog = new Ext.Window({
        width:       400,
        height:      160,
        minWidth:    400,
        minHeight:   160,
        closeAction: 'hide',
        layout:      'fit',
        plain:       true,
        modal:       true,
        shadow:      true,

        items: this.addForm = new Ext.form.FormPanel({
          labelWidth: 75,
          border:     false,
          bodyStyle: 'background-color:transparent;padding:10px; ',
          items: [{
              id:         'prefId',
              xtype:      'hidden',
              name:       'prefId',
              value:      prefId
            },{
              id:         'prefName',
              xtype:      'textfield',
              fieldLabel: this.nameText,
              name:       'prefName',
              value:      prefName,
              allowBlank: false,
              width:      '96%'
            },{
              id:         'prefDesc',
              xtype:      'textfield',
              fieldLabel: this.descText,
              name:       'prefDesc',
              value:      prefDesc,
              width:      '96%'
            },{
              id:         'isDefault',
              xtype:      'checkbox',
              fieldLabel: this.defaultText,
              name:       'isDefault',
              value:      isDefault
          }]
        }),

        buttons: [{
          text:    this.okText,
          handler: this.savePreference,
          scope:   this
        },{
          text:    this.cancelText,
          handler: function(){this.addDialog.hide();},
          scope:   this
        }]
      });
    } else {
      this.addForm.findById('prefId').setValue(prefId);
      this.addForm.findById('prefName').setValue(prefName);
      this.addForm.findById('prefDesc').setValue(prefDesc);
      this.addForm.findById('isDefault').setValue(isDefault);
    }
    if(prefId!='')
      this.addDialog.setTitle(this.modifyText);
    else
      this.addDialog.setTitle(this.addText);
    //this.addForm.findById('prefName').focus();
    this.addDialog.show();
  },

  /** showManageDialog Create dialog for manage the preferences
    * @private
    */
  showManageDialog : function(){
    if(!this.manageDialog){
      this.manageDialog = new Ext.Window({
        title:       this.manageText,
        width:       600,
        height:      300,
        minWidth:    500,
        minHeight:   250,
        closeAction: 'hide',
        layout:      'fit',
        plain:       true,
        modal:       true,
        shadow:      true,

        items: this.manageGridPanel = new Ext.grid.GridPanel({
          store:   this.prefStore,
          border:  false,
          enableColumnHide: false,
          columns: [{
              id: 'prefId',
              hidden: true,
              dataIndex: 'prefId'
            },{
              id:'prefName',
              header: this.nameText,
              sortable: true,
              dataIndex: 'prefName',
              width: 200
            },{
              id:'prefDesc',
              header: this.descText,
              sortable: true,
              dataIndex: 'prefDesc',
              width: 330
            },{
              id:'isDefault',
              header: this.defaultText,
              sortable: true,
              dataIndex: 'isDefault',
              width: 60,
              renderer: this.imageRenderer
            }
          ],

          viewConfig: {
              forceFit: true
          },

          tbar:[{
              text: this.modifyBtnText,
              cls:  'x-btn-text-icon',
              iconCls: 'x-icon-modify',
              handler: this.managePreference,
              scope: this
          }, '-', {
              text: this.deleteBtnText,
              cls:  'x-btn-text-icon',
              iconCls: 'x-icon-delete',
              handler: this.deletePreferences,
              scope: this
          }, '-', {
              text: this.closeBtnText,
              cls:  'x-btn-text-icon',
              iconCls: 'x-icon-cancel',
              handler: function(){this.manageDialog.hide();},
              scope: this
          }]
        })
      })
    }
    this.manageDialog.show();
  },

  /** imageRenderer
    * @private
    */
  imageRenderer : function(value, metadata, record, rowIndex, colIndex, store){
    if(value==true)
      return('<img class="x-menu-item-icon x-icon-checked" src="'+Ext.BLANK_IMAGE_URL+'"/>');
  },

  /** applyPreference setting preference
    * @private
    */
  applyPreference : function(item, event){
    this.preferenceManager.applyPreference(item.getId());
  },

  /** savePreference saving preference
    * @private
    */
  savePreference : function(){
    var prefId = this.addForm.findById('prefId');
    var prefName = this.addForm.findById('prefName');
    var prefDesc = this.addForm.findById('prefDesc');
    var isDefault = this.addForm.findById('isDefault');
    if (prefName.isValid()){
      this.preferenceManager.savePreference(prefId.getValue(),prefName.getValue(),prefDesc.getValue(),isDefault.getValue());
    }
  },

  /** onPreferenceSaved
    * @private
    */
  onPreferenceSaved : function(prefName,response){
    if(response==true){
      this.prefStore.reload();
      this.addDialog.hide();
    }else{
      Ext.ux.netbox.ErrorDialog.show(response);
    }
  },

  /** onPreferenceDeleted
    * @private
    */
  onPreferenceDeleted : function(prefIdArray,response){
    if(response==true){
      this.prefStore.reload();
    }else{
      Ext.ux.netbox.ErrorDialog.show(response);
    }
  }

});

Ext.menu.BaseItem.prototype.onRender = function(container){
  this.el = Ext.get(this.el);
  container.dom.appendChild(this.el.dom);
  if (this.tooltip) {
   this.el.dom.qtip = this.tooltip;
  }
};