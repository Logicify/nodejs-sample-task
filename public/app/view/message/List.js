Ext.define('ExtJsSample.view.message.List', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.messageList',
    title: 'Search Result',
    store: 'MessageStore',
    initComponent: function () {
        this.tbar = [
            {
                text: 'Create message', action: 'create'
            }
        ];
        this.columns = [
            { header: 'Title', dataIndex: 'title', width: 200},
            { header: 'Author', dataIndex: 'author', width: 150 },
            { header: 'Tags', dataIndex: 'tags', width: 300 },
            { header: 'Text', dataIndex: 'text', flex: 1 }

        ];
        this.addEvents('removeitem');
        this.actions = {
            removeitem: Ext.create('Ext.Action', {
                text: 'Remove Message',
                handler: function () {
                    this.fireEvent('removeitem', this.getSelected())
                },
                scope: this
            })
        };
        var contextMenu = Ext.create('Ext.menu.Menu', {
            items: [
                this.actions.removeitem
            ]
        });
        this.on({
            itemcontextmenu: function (view, rec, node, index, e) {
                e.stopEvent();
                contextMenu.showAt(e.getXY());
                return false;
            }
        });
        this.callParent(arguments);
    },
    getSelected: function () {
        var sm = this.getSelectionModel();
        var rs = sm.getSelection();
        if (rs.length) {
            return rs[0];
        }
        return null;
    }
});