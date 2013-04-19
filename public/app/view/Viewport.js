/**
 * User: knorr
 */
Ext.define('BM.view.Viewport', {
        extend: 'Ext.container.Viewport',
        layout: 'auto',

        requires: [
            'BM.view.book.List',
            'BM.view.book.Edit'
        ],

        initComponent: function () {
            this.items = [
                {
                    xtype: 'bookList'
                }
            ];

            this.callParent();
        }
    }
);