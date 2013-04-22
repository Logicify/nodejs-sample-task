/**
 * User: knorr
 */
Ext.define('BM.controller.Login', {
    extend: 'Ext.app.Controller',

    refs: [
        {
            ref: 'loginForm',
            selector: 'login'
        }
    ],

    init: function () {
        this.control({
            'login button[action=submit]': {
                click: this.submitForm
            },
            'login button[action=reset]': {
                click: this.resetForm
            }
        });
    },

    submitForm: function () {
        var form = this.getLoginForm().getForm();
        if (form.isValid()) {
            form.submit({
                url: '/in' ,

                success: function (form, action) {
                    Ext.Msg.alert('Success', action.result.msg);
                },
                failure: function (form, action) {
                    Ext.Msg.alert('Failed', action.result.msg);
                }
            })
        }
    },

    resetForm: function () {
        this.getLoginForm().getForm().reset();
    }
});