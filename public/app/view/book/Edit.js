Ext.define('BM.view.book.Edit', {
    extend: 'Ext.window.Window',
    alias: 'widget.bookEdit',

    layout: 'fit',
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
                        labelWidth: 50,
                        allowBlank: false,
                        blankText: 'This field is required',
                        fieldLabel: 'Title'
                    },
                    {
                        xtype: 'textfield',
                        name: 'Author',
                        labelWidth: 50,
                        allowBlank: false,
                        fieldLabel: 'Author'
                    },
                    {
                        xtype: 'textfield',
                        name: 'Tags',
                        labelWidth: 50,
                        allowBlank: false,
                        fieldLabel: 'Tags'
                    },
                    {
                        xtype: 'textareafield',
                        name: 'Text',
                        labelWidth: 50,
                        allowBlank: false,
                        fieldLabel: 'Text'
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