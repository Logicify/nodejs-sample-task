Ext.Loader.setConfig({ enabled: true });
Ext.application({
    requires: ['Ext.container.Viewport'],

    name: 'BM',
    appFolder: 'app',

    autoCreateViewport: true,

    models: ['Book'],
    controllers: ['Books'],
    stores: ['Books']
});