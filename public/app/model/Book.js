Ext.define('ExtJsSample.model.Book', {
    extend: 'Ext.data.Model',
    fields: [ "_id", 'Title', 'Text', 'Author', 'Tags'],
    idProperty: "_id"
});