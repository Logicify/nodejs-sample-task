Ext.define('ExtJsSample.controller.MessageController', {
    extend: 'Ext.app.Controller',
    stores: [
        'MessageStore'
    ],

    models: [
        'Message'
    ],

    views: [
        'message.List',
        'message.Edit'
    ],
    init: function () {
        this.control({
            'messageList > gridpanel': {
                itemdblclick: this.editMessage
            },
            'messageList button[action=createNewRecord]': {
                click: this.createMessage
            },
            'messageList textfield': {
                search: this.onSearch
            },
            'messageList button[action=search]': {
                click: this.onSearch
            },
            'messageEdit button[action=save]': {
                click: this.doSaveMessage
            }

        });
    },

    editMessage: function (grid, record) {
        var view = Ext.ComponentQuery.query('#messageEditPanel')[0];
        if (!view) {
            view = Ext.widget('messageEdit');
        }
        view.down('form').getForm().loadRecord(record);
        view.setTitle('Edit book info');

    },

    createMessage: function () {
        var view = Ext.ComponentQuery.query('#messageEditPanel')[0];
        if (!view) {
            view = Ext.widget('messageEdit');
        }
        view.down('form').getForm().reset();
        view.setTitle('Create new book');
    },

    onSearch: function () {
        var store = Ext.getStore("MessageStore");
        var searchQuery = Ext.ComponentQuery.query('#messageListPanel [name=searchField]')[0].getValue();
        searchQuery = searchQuery.replace(/[\W]+/g, ',');
        store.load({
            params: {q: searchQuery}
        })
    },

    doSaveMessage: function (button) {
        var win = button.up('window'),
            form = win.down('form'),
            record = form.getRecord(),
            values = form.getValues(),
            store = Ext.getStore("MessageStore");
        if (values.Tags) {
            values.Tags = values.Tags.split(",");
        }
        if (form.getForm().isValid()) {
            if (record) {
                // as we edit the whole object, we just can exchange IDs and voila.
                values._id = record.data._id;
                record.set(values);
            } else {
                store.add(values);
            }
            win.close();
        }
    }
});