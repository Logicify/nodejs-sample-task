Ext.define('ExtJsSample.view.book.List', {
    extend: 'Ext.form.Panel',
    alias: 'widget.bookList',
    id: 'bookListPanel',

    title: 'Book management system',
    store: 'BookStore',

    height: 540,
    width: 620,
    style: 'margin:0 auto; margin-top:50px;',
    layout: 'absolute',
    bodyPadding: 10,
    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'button',
                    action: 'logout',
                    x: 550,
                    y: 5,
                    width: 60,
                    text: 'Logout',
                    style: "border: solid #F00;"
                },
                {
                    xtype: 'textfield',
                    x: 10,
                    y: 50,
                    formBind: true,
                    width: 433,
                    fieldLabel: 'Keyword',
                    labelWidth: 60,
                    name: 'searchField',
                    selectOnFocus: true,
                    listeners: {
                        specialkey: function (f, e) {
                            if (e.getKey() == e.ENTER) {
                                this.fireEvent("search")
                            }
                        }
                    }
                },
                {
                    xtype: 'button',
                    action: 'search',
                    x: 460,
                    y: 50,
                    width: 150,
                    text: 'Search'
                },
                {
                    xtype: 'gridpanel',
                    store: 'BookStore',
                    x: 10,
                    y: 90,
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
                    y: 480,
                    width: 150,
                    text: 'Create New Book'

                }
            ]
        });

        me.callParent(arguments);
    }
});