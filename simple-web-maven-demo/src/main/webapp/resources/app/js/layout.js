Ext.require([
    'Ext.form.field.File',
    'Ext.form.Panel',
    'Ext.window.MessageBox',
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*'
]);

Ext.onReady(function(){
	Ext.QuickTips.init();
	
	// setup the state provider, all state information will be saved to a cookie
    Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));
    

    function link(val,meta,rec) {
        return '<a href="' + val + '" style="cursor:pointer;">' + rec.get('company') + '</a>';
    }


    var records = [];
    
    // create the data store
    var store = Ext.create('Ext.data.Store', {
    	fields : ['column_0','column_1','column_2'],
        data: records,
        paging : false
    });

    // create the Grid
    Ext.create('Ext.grid.Panel', {
        store: store,
        stateful: true,
        stateId: 'stateGrid',
        columns: [
            {
                text     : 'Company',
                flex     : 1,
                sortable : true,
                dataIndex: 'company'
            },
            {
                text     : 'Web Site',
                flex     : 1,
                sortable : false,
                dataIndex: 'website',
                renderer : link
            },
            {
                text     : 'Text',
                width    : 75,
                sortable : false,
                renderer : 'usMoney',
                dataIndex: 'price'
        	}],
        selModel: {
            selType: 'rowmodel'
        },
        height: 350,
        width: 600,
        title: 'Array Grid for Importing',
        renderTo: 'grid-example',
        viewConfig: {
            stripeRows: true
        }
    });

    
    
    
    
    
    
	Ext.create('Ext.form.Panel', {
        renderTo: 'upload_form',
        width: 500,
        frame: true,
        title: 'Upload Excel Form',
        bodyPadding: '10 10 0',
        defaults: {
            anchor: '100%',
            allowBlank: false,
            msgTarget: 'side',
            labelWidth: 50
        },

        items: [{
            xtype: 'filefield',
            id: 'file_path_field',
            emptyText: 'Select an excel file',
            fieldLabel: 'File',
            name: 'file_path_field'
        }],

        buttons: [{
            text: 'Save',
            handler: function(){
                var form = this.up('form').getForm();
                if(form.isValid()){
                    form.submit({
                        url: 'uploadfile',
                        waitMsg: 'Uploading file...',
                        success: function(fp, o) {
                            alert('Processed file on the server..!');
                            var res = Ext.decode(o.response.responseText, true);
                            console.log(res);
                        },
                        failure: function(a,b) {
                        	alert("Something went wrong..!");
                        }
                    });
                }
            }
        },{
            text: 'Reset',
            handler: function() {
                this.up('form').getForm().reset();
            }
        }]
    });
});