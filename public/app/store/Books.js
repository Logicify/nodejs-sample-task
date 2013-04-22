Ext.define('BM.store.Books', {
    extend: 'Ext.data.Store',
    model: 'BM.model.Book',
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