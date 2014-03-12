Ext.define('ExtJsSample.controller.BookController', {
    extend: 'Ext.app.Controller',
    stores: [
        'BookStore'
    ],

    models: [
        'Book'
    ],

    views: [
        'book.List',
        'book.Edit'
    ],
    init: function () {
        this.control({
            'bookList > gridpanel': {
                itemdblclick: this.editBook
            },
            'bookList button[action=createNewRecord]': {
                click: this.createBook
            },
            'bookList textfield': {
                search: this.onSearch
            },
            'bookList button[action=search]': {
                click: this.onSearch
            },
            'bookList button[action=logout]': {
                click: this.onLogout
            },
            'bookEdit button[action=save]': {
                click: this.doSaveBook
            }

        });
    },

    editBook: function (grid, record) {
        var view = Ext.ComponentQuery.query('#bookEditPanel')[0];
        if (!view) {
            view = Ext.widget('bookEdit');
        }
        view.down('form').getForm().loadRecord(record);
        view.setTitle('Edit book info');

    },

    createBook: function () {
        var view = Ext.ComponentQuery.query('#bookEditPanel')[0];
        if (!view) {
            view = Ext.widget('bookEdit');
        }
        view.down('form').getForm().reset();
        view.setTitle('Create new book');
    },

    onSearch: function () {
        var store = Ext.getStore("BookStore");
        var searchQuery = Ext.ComponentQuery.query('#bookListPanel [name=searchField]')[0].getValue();
        searchQuery = searchQuery.replace(/[\W]+/g, ',');
        store.load({
            params: {q: searchQuery}
        })
    },

    onLogout: function () {
        Ext.Msg.show({
            title:'Logout',
            msg: 'You are about to logout. Is it correct?...',
            buttons: Ext.Msg.YESNO,
            fn: function(btn){
                if (btn == 'yes'){
                    Ext.Ajax.request({
                        url: '/logout',
                        method: 'GET',
                        success: function(){
                            document.location.replace('/');
                        }
                    });
                }
            },
            animEl: 'elId',
            icon: Ext.Msg.QUESTION,
            minWidth: 300
        });

    },

    doSaveBook: function (button) {
        var win = button.up('window'),
            form = win.down('form'),
            record = form.getRecord(),
            values = form.getValues(),
            store = Ext.getStore("BookStore");
        if (values.Tags) {
            values.Tags = values.Tags.split(",");
        }
        if (form.getForm().isValid()) {
            Ext.ComponentQuery.query('#bookListPanel [name=searchField]')[0].setValue("");
            if (record) {
                // as we edit the whole object, we just can exchange IDs and voila.
                values._id = record.data._id;
                record.set(values);
            } else {
                store.add(values);
            }
            Ext.Msg.show({
                title: 'Changes saved',
                msg: 'Changes saved successfully',
                icon: Ext.window.MessageBox.INFO,
                buttons: Ext.Msg.OK
            });
            win.close();
        }
    }
});