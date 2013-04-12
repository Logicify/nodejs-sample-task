Ext.define('ExtJsSample.view.message.Create', {
    extend: 'Ext.window.Window',
    alias: 'widget.messageCreate',
    title: 'Add Message',
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
                        name: 'title',
                        allowBlank: false,
                        fieldLabel: 'Title'
                    },
                    {
                        xtype: 'textfield',
                        name: 'text',
                        allowBlank: false,
                        fieldLabel: 'Text'
                    },
                    {
                        xtype: 'textfield',
                        name: 'author',
                        allowBlank: false,
                        fieldLabel: 'Author'
                    },
                    {
                        xtype: 'textfield',
                        name: 'tags',
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