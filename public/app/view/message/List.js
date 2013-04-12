Ext.define('ExtJsSample.view.message.List', {
    extend: 'Ext.form.Panel',
    alias: 'widget.messageList',
    title: 'Search',
    store: 'MessageStore',
    height: 500,
    width: 620,
    style: 'margin:0 auto; margin-top:50px;',
    layout: {
        type: 'absolute'
    },
    bodyPadding: 10,
    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'textfield',
                    x: 10,
                    y: 10,
                    formBind: true,
                    width: 433,
                    fieldLabel: 'Keyword',
                    labelWidth: 60,
                    name: 'searchField',
                    selectOnFocus: true
                },
                {
                    xtype: 'button',
                    action: 'search',
                    x: 460,
                    y: 10,
                    width: 150,
                    text: 'Search'
                },
                {
                    xtype: 'gridpanel',
                    store: 'MessageStore',
                    x: 10,
                    y: 50,
                    width: 600,
                    height: 380,
                    title: 'Search Result',
                    columns: [
                        { header: 'Title', dataIndex: 'Title', width: 100},
                        { header: 'Author', dataIndex: 'Author', width: 100 },
                        { header: 'Tags', dataIndex: 'Tags', width: 150 },
                        { header: 'Text', dataIndex: 'Text', flex: 1 }
                    ]
                },
                {
                    xtype: 'button',
                    action: 'createNewRecord',
                    x: 10,
                    y: 440,
                    width: 150,
                    text: 'Create New Record'

                }
            ]
        });

        me.callParent(arguments);
    }
});