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
            'messageList': {
                itemdblclick: this.editMessage,
                removeitem: this.removeMessage
            },
            'messageList > toolbar > button[action=create]': {
                click: this.onCreateMessage
            },
            'messageCreate button[action=save]': {
                click: this.doCreateMessage
            },
            'messageCreate button[action=save]': {
                click: this.updateMessage
            }
        });
    },
    editMessage: function (grid, record) {
        var view = Ext.widget('messageEdit');
        view.down('form').loadRecord(record);
    },
    removeMessage: function (msg) {
        Ext.Msg.confirm('Remove Message', 'Are you sure?', function (button) {
            if (button == 'yes') {
                Ext.getStore("MessageStore").remove(msg);
            }
        }, this);
    },
    onCreateMessage: function () {
        var view = Ext.widget('messageCreate');
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
    updateMessage: function (button) {
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