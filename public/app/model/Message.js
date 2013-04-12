Ext.define('ExtJsSample.model.Message', {
    extend: 'Ext.data.Model',
    fields: [ "_id", 'Title', 'Text', 'Author', 'Tags'],
    idProperty: "_id"
});