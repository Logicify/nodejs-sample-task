Ext.define('BM.store.Books', {
    extend: 'Ext.data.Store',
    model: 'BM.model.Book',
    autoLoad: true,
    autoSync: true,
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