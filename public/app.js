Ext.Loader.setConfig({ enabled: true });
Ext.application({
    name: 'ExtJsSample',
    appFolder: 'app',
    controllers: [
        'BookController'
    ],
    launch: function () {
        Ext.create('Ext.container.Viewport', {
            layout: 'auto',
            items: {
                xtype: 'bookList'
            }
        });
    }
});