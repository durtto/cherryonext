// $Id$

Ext.namespace('Ext.ux.netbox');

Ext.ux.netbox.getErrorResponse = function(text) {
   try {
       v = Ext.util.JSON.decode(text);
   } catch (e) {
       v = text;
   }
   return v;
};

Ext.ux.netbox.ErrorDialog = function(){

    var dialog;
    var messageElement;
    var hideCallback = null;

    // return a public interface
    return {

        closeBtn   : "Close",
        errorTitle : "Error",

        hide : function(){
            dialog.hide();
            if (hideCallback !== null) {
                var dt=new Ext.util.DelayedTask(hideCallback);
                dt.delay(100);
            }
        },

        show : function(msg,title,hideCallback_){
            hideCallback = hideCallback_;
            if(!dialog){ // lazy initialize the dialog and only create it once
                messageElement = new Ext.Panel({
                    id:             'error-dlg-message',
                    autoScroll:     true,
                    deferredRender: false,
                    border:         false
                });
                dialog = new Ext.Window({
                    id:          'error-dlg',
                    modal:       true,
                    width:       400,
                    height:      200,
                    shadow:      true,
                    minWidth:    300,
                    minHeight:   200,
                    closeAction: 'hide',
                    layout:      'fit',
                    plain:       true,
                    items:       [messageElement],
                    buttons: [{
                        text: this.closeBtn,
                        handler: function(){
                            dialog.hide();
                        }
                    }]
                });
            }
            dialog.setTitle(title || this.errorTitle);
            dialog.show();
            messageElement.body.dom.innerHTML = msg;
            dialog.getEl().addKeyListener([Ext.EventObject.ENTER], this.hide, dialog);
        }
    };
}();
