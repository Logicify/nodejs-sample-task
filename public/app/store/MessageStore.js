Ext.define('ExtJsSample.store.MessageStore', {
    extend: 'Ext.data.Store',
    model: 'ExtJsSample.model.Message',
    autoLoad: true,
    autoSync: true,
    proxy: {
        type: 'ajax',
        limitParam: 'size',
        startParam: undefined,
        api: {
            create: '/message/create',
            read: '/message/list',
            update: '/message/update'
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        },
        writer: {
            type: 'json',
            writeAllFields: false
        }
    }
});