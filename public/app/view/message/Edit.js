Ext.define('ExtJsSample.view.message.Edit', {
    extend: 'Ext.window.Window',
    alias: 'widget.messageEdit',
    id: 'messageEditPanel',

    layout: 'auto',
    autoShow: true,
    initComponent: function () {
        this.items = [
            {
                xtype: 'form',
                bodyStyle: {
                    background: 'none',
                    padding: '10px',
                    border: '0'
                },
                items: [
                    {
                        xtype: 'textfield',
                        name: 'Title',
                        allowBlank: false,
                        fieldLabel: 'Title'
                    },
                    {
                        xtype: 'textfield',
                        name: 'Text',
                        allowBlank: false,
                        fieldLabel: 'Text'
                    },
                    {
                        xtype: 'textfield',
                        name: 'Author',
                        allowBlank: false,
                        fieldLabel: 'Author'
                    },
                    {
                        xtype: 'textfield',
                        name: 'Tags',
                        allowBlank: false,
                        fieldLabel: 'Tags'
                    }
                ]
            }
        ];
        this.buttons = [
            {
                text: 'Save',
                action: 'save'
            },
            {
                text: 'Cancel',
                scope: this,
                handler: this.close
            }
        ];
        this.callParent(arguments);
    }
});