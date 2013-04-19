Ext.define('BM.model.Book', {
    extend: 'Ext.data.Model',
    fields: [ "_id", 'Title', 'Text', 'Author', 'Tags'],
    idProperty: "_id"
});