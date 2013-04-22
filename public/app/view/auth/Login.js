/**
 * User: knorr
 */
Ext.define('BM.view.auth.Login', {
    extend: 'Ext.form.Panel',
    alias: 'widget.login',

    title: 'Login Form',

    bodyPadding: 5,
    width: 350,
    layout: 'auto',
    initComponent: function () {
        this.items = [
            {
                xtype: 'textfield',
                fieldLabel: 'User Name',
                name: 'username',
                allowBlank: false
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Password',
                name: 'password',
                allowBlank: false

            }
        ];

        this.buttons = [
            {
                text: 'Reset',
                action: 'reset'
            },
            {
                text: 'Submit',
                formBind: true,
                disabled: true,
                action: 'submit'
            }
        ];

        this.callParent();
    }
});
