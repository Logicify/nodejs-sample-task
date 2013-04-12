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
        'message.Create',
        'message.Edit'
    ],
    init: function () {
        this.control({
            'messageList > gridpanel': {
                itemdblclick: this.editMessage
            },
            'messageList > button[action=create]': {
                click: this.onCreateMessage
            },
            'messageList > button[action=search]': {
                click: this.onSearch
            },
            'messageCreate button[action=save]': {
                click: this.doCreateMessage
            },
            'messageEdit button[action=save]': {
                click: this.doUpdateMessage
            }
        });
    },

    editMessage: function (grid, record) {
        var view = Ext.widget('messageEdit');
        view.down('form').loadRecord(record);
    },

    onCreateMessage: function () {
        var view = Ext.widget('messageCreate');
    },


    onSearch: function () {
        var form = win.down('form');
        var store = Ext.getStore("MessageStore");
        store.load({
            params: {q: 'alice'}
        })
    },

    doCreateMessage: function (button) {
        var win = button.up('window'),
            form = win.down('form'),
            values = form.getValues(),
            store = Ext.getStore("MessageStore");
        if (form.getForm().isValid()) {
            store.add(values);
            win.close();
        }
    },

    doUpdateMessage: function (button) {
        var win = button.up('window'),
            form = win.down('form'),
            record = form.getRecord(),
            values = form.getValues(),
            store = Ext.getStore("MessageStore");
        if (form.getForm().isValid()) {
            record.set(values);
            win.close();
        }
    }
});