Ext.define('BM.controller.Books', {
    extend: 'Ext.app.Controller',

    stores: ['Books'],
    models: ['Book'],
    refs: [
        {
            ref: 'editView',
            selector: 'bookEdit'
        },
        {
            ref: 'listView',
            selector: 'bookList'
        },
        {
            ref: 'searchField',
            selector: 'bookList textfield'
        }
    ],


    init: function () {
        this.control({
            'bookList > gridpanel': {
                itemdblclick: this.onEditBook
            },
            'bookList button[action=createNewRecord]': {
                click: this.onCreateBook
            },
            'bookList textfield': {
                search: this.onBookSearch
            },
            'bookList button[action=search]': {
                click: this.onBookSearch
            },
            'bookEdit button[action=save]': {
                click: this.doUpdateBook
            }

        });
    },

    onEditBook: function (grid, record) {
        this.initEditView();
        var view = this.getEditView();
        view.setTitle('Edit book info');
        view.down('form').getForm().loadRecord(record);
    },

    onCreateBook: function () {
        this.initEditView();
        var view = this.getEditView();
        view.setTitle('Create new book');
        view.down('form').getForm().reset();
    },

    onBookSearch: function () {
        var store = this.getBooksStore();
        var searchQuery = this.getSearchField.getValue();
        searchQuery = searchQuery.replace(/[\W]+/g, ',');
        store.load({
            params: {q: searchQuery}
        })
    },

    doUpdateBook: function (button) {
        var win = button.up('window'),
            form = win.down('form'),
            record = form.getRecord(),
            values = form.getValues(),
            store = this.getBooksStore();
        if (values.Tags) {
            values.Tags = values.Tags.split(",");
        }
        if (form.getForm().isValid()) {
            this.getSearchField.setValue("");
            if (record) {
                // as we edit the whole object, we just can exchange IDs and voila.
                values._id = record.data._id;
                record.set(values);
            } else {
                store.add(values);
            }
            win.close();
        }
    },

    initEditView: function () {
        if (!this.getEditView()) {
            Ext.widget('bookEdit');
        }
    }
});