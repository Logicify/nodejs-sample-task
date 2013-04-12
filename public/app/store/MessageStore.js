Ext.define('ExtJsSample.store.MessageStore', {
    extend: 'Ext.data.Store',
    model: 'ExtJsSample.model.Message',
    autoLoad: false,
    autoSync: false,
    proxy: {
        type: 'ajax',
        pageParam: false,
        startParam: false,
        limitParam: false,
        noCache: false,
        api: {
            create: '/rest/newBook',
            read: '/rest/search',
            update: '/rest/update'
        },
        reader: {
            type: 'json',
            readRecordsOnFailure: false
        },
        writer: {
            type: 'json',
            writeAllFields: false
        }
    }
});