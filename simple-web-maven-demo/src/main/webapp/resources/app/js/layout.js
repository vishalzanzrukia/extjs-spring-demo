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
        return '<a href="' + val + '" style="cursor:pointer;">' + val + '</a>';
    }

//    var records = new Array();
//    var columndata = new Array();
    
    // create the data store
    var store = Ext.create('Ext.data.Store', {
    	fields : [],
        data: [],
        paging : false,
        reader: {
            type: 'json',
            root: 'data'
        }
    });
    
    
    /*var createStore = function(fielddata, values) {
        store = Ext.create('Ext.data.ArrayStore', {
		    fields: fielddata,
		    data: values
        });
    }*/

    
    Ext.define('Ext.ux.data.reader.DynamicReader', {
        extend: 'Ext.data.reader.Json',
        alias: 'reader.dynamicReader',
        alternateClassName: 'Ext.data.reader.DynamicReader',

        readRecords: function(data) {
            if (data.length > 0) {
                var item = data[0];
                var fields = new Array();
                var columns = new Array();
                var p;

                for (p in item) {
                    if (p && p != undefined) {
                        // floatOrString type is only an option
                        // You can make your own data type for more complex situations
                        // or set it just to 'string'
                        fields.push({name: p, type: 'string'});
                        columns.push({text: p, dataIndex: p});
                    }
                }

                data.metaData = { fields: fields, columns: columns };
            }

            return this.callParent([data]);
        }
    });
    
    // create the Grid
    var grid = Ext.create('Ext.grid.Panel', {
//        store: store,
//        stateful: true,
//        stateId: 'stateGrid',
//        columns: [],
       /* selModel: {
            selType: 'rowmodel'
        },*/
        height: 350,
        width: 600,
        title: 'Array Grid for Importing',
//        renderTo: 'grid-example',
        /*viewConfig: {
            stripeRows: true
        },*/
        
        initComponent: function() {
            console.log('DynamicGrid initComponent!');
            var me = this;

           /* if (me.url == '') {
                Ext.Error.raise('url parameter is empty! You have to set proper url to get data form server.');
            }
            else {*/
                Ext.applyIf(me, {
                    columns: [],
                    forceFit: true,
                    store: Ext.create('Ext.data.Store', {
                        // Fields have to be set as empty array. Without this Ext will not create dynamic model.
                        fields: [],
                        // After loading data grid have to reconfigure columns with dynamic created columns
                        // in Ext.ux.data.reader.DynamicReader
                        listeners: {
                            'metachange': function(store, meta) {
                                me.reconfigure(store, meta.columns);
                            }
                        },
                        autoLoad: false,
//                        autoLoad: true,
                        remoteSort: false,
                        remoteFilter: false,
                        remoteGroup: false,
                        proxy: {
                            reader: 'dynamicReader',
                            type: 'rest'//,
//                            url: me.url
                        }
                    })
                });
//            }

            me.callParent(arguments);
        }
    });

    Ext.define('Ext4Example.view.Viewport', {
        extend: 'Ext.Viewport',    
        layout: 'fit',

        initComponent: function() {
            console.log('Viewport initComponent!');

            var me = this;
            
            Ext.apply(me, {
                items: [
                    {
                        xtype: 'grid',
                        height: 350,
                        width: 600,
                        title: 'Array Grid for Importing',
                        initComponent: function() {
                            console.log('DynamicGrid initComponent!');
                            var me = this;

                           /* if (me.url == '') {
                                Ext.Error.raise('url parameter is empty! You have to set proper url to get data form server.');
                            }
                            else {*/
                                Ext.applyIf(me, {
                                    columns: [],
                                    forceFit: true,
                                    store: Ext.create('Ext.data.Store', {
                                        // Fields have to be set as empty array. Without this Ext will not create dynamic model.
                                        fields: [],
                                        // After loading data grid have to reconfigure columns with dynamic created columns
                                        // in Ext.ux.data.reader.DynamicReader
                                        listeners: {
                                            'metachange': function(store, meta) {
                                                me.reconfigure(store, meta.columns);
                                            }
                                        },
                                        autoLoad: false,
//                                        autoLoad: true,
                                        remoteSort: false,
                                        remoteFilter: false,
                                        remoteGroup: false,
                                        proxy: {
                                            reader: 'dynamicReader',
                                            type: 'rest'//,
//                                            url: me.url
                                        }
                                    })
                                });
//                            }

                            me.callParent(arguments);
                        }
                        
                    }
                ]
            });
                    
            me.callParent(arguments);
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
                            var records = new Array();
                            for(var i = 0; i < res.data.length; i++) {
                                records.push(res.data[i]);
                            }
                            
                           /* store.fields = ['column_0','column_1','column_2'];
                            grid.columns = [
                                            {
                                                text     : 'Company',
                                                flex     : 1,
                                                sortable : true,
                                                dataIndex: 'column_0'
                                            },
                                            {
                                                text     : 'Web Site',
                                                flex     : 1,
                                                sortable : false,
                                                dataIndex: 'column_1',
                                                renderer : link
                                            },
                                            {
                                                text     : 'Text',
                                                width    : 75,
                                                sortable : false,
                                                dataIndex: 'column_2'
                                        	}];
                            
                            grid.getView().refresh();*/
//                            grid.getView().refresh();
//                            grid.getStore().removeAll();
                            store.loadData(records);
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