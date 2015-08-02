 
var jsonData = 'wrong';
 


//
Ext.define('File', {
    extend: 'Ext.data.Model',
    proxy: {
        type: 'ajax',
        url : 'GetFileMissingValueServlet',
        method:'POST',
        reader: {
            type: 'json',
            root:'file_data'
			}		
        },
fields: [
	        {name: 'fmv_id',  mapping: 'fmv_id'},
	        {name: 'fmv_type',   mapping: 'fmv_type'},
	        {name: 'fmv_value', mapping: 'fmv_value'},
	        {name: 'file_id', mapping: 'file_id'}
	    ]	    	    
});


var store1 = Ext.create('Ext.data.Store', {
    model: 'File'	   	   
});
//


Ext.define('User', {
    extend: 'Ext.data.Model',
    proxy: {
        type: 'ajax',
        url :'GetFileServlet',//'GetAllFileNamesServlet' ,////'GetFileNameServlet',
        method:'POST',
        reader: {
            type: 'json',
            root:'files',
            totalProperty: 'totalCount'
			}		
        },
fields: [
	        {name: 'docId',  mapping: 'docId'}
	       
	    ]	    	    
});

var flag=false;
var docid;
var currentDocid;
var simpsonsStore = Ext.create('Ext.data.Store', {
    model: 'User',
    remoteSort: true,
    pageSize: 20
});
       // Data store for grid end
          Ext.define('Ezdi.Grid', {
            extend: 'Ext.grid.GridPanel',
        	//  extend: 'Ext.grid.Panel',
            alias: 'widget.prepgrid',
         initComponent:function() {
         var config = {
        		 store:simpsonsStore,
        		 autoRender:true,
        		 //autoScroll:true,
        		 //autoHeight:true,
        		 columns: [
        		  	     { header: 'File Names',  dataIndex: 'docId', flex: 1,sortable:true}
        		  	    ],
               	            
            listeners:{
            	itemclick:function(view, record, item, index, e ) {
        	// Ext.Msg.alert('row clicked'+record.get('docId'));
        	       Ext.getCmp('file_grid').enable(true);
        	       Ext.getCmp('done-btn').enable(true);
            		 docid = record.get('docId');
            		 store1.proxy.extraParams.file_name=docid;
            		 store1.load();
            		/*var tempStore= */
            		 //Ext.getCmp('store1').load();
            		/* tempStore.proxy.extraParams.file_id=docid;
            		 tempStore.load();*/
            		// store1.load();
            		 
            	//	 //console.log('flag:'+flag);
            		 
            		if(!Ext.getCmp('_' + docid)&&!flag)
            		{     
            			flag=true;
            			currentDocid=docid;
            			Ext.Ajax.request({
            				url:'GetFileDataServlet',            				
            				headers: {
            					'my-header':'docid'
            				},
            				params: {'docid': docid},            				
            				success:function(result,request){
            						
            					 jsonData = result.responseText;
            					 
            					 Ext.getCmp('resultpanel').add({
            	            			title:'<b>'+docid+'</b>',
            	            			id:'_' + docid,
            	            			autoScroll:true,
            	            		//	closable:true,
            	            			//padding:'10 10 10 10',
            	            			bodyPadding: 5,
            	            			html:'<p style="color:#333333;">'+jsonData+'</p>',
            	            			//html:'<p style="background-color:#C6DEFF;">'+jsonData+'</p>',
            	            			bodyStyle:{"background-color":"#f1f1f1"} 
            	            			/*border:true,
            	            			layout:
            	            			{
	            						 	type: 'hbox',
	            						 //   pack: 'start',
	            						    align: 'stretch'
            	            			},
            	            			//defaultMargins: {top: 0, right: 0, bottom: 0, left: 5},
            	            			items:[
            	            			       {
            	            			    	   bodyPadding:10,
            	            			    	   html:jsonData,
            	            			    	   title:'Original File',
            	            			    	   flex:1//,
            	            			    	  // collapsible:true//,
            	            			    	  // closable:true
            	            			       },
            	            			       {
            	            			    	   bodyPadding:10,
            	            			    	   html:jsonData2,
            	            			    	   title:'Preprocessed File',
            	            			    	   flex:1//,
            	            			    	   //closable:true
            	            			       }]*/
            	            		//	html: jsonData 
            	            		});
            					 Ext.getCmp('resultpanel').setActiveTab('_' + docid);
            					}
                         });
            			//Request End
            			//docTabStore.proxy.extraParams.doctabdata=record;
            		//jsonData='';
            		}
            		else if(!Ext.getCmp('_' + docid)&&flag)
            		{
            			Ext.MessageBox.show({
            		        title:'<span style="font-size:14px;color:blue ;font-family:verdana;">Warning</span>',
            		       // msg: 'Two column numbers must be different from each other.</br><span style="color:#B00000 ;font-size:14px;">First Name</span> and <span style="color:#B00000;font-size:14px;">Document Id</span> has same column number <span style="color:green;font-size:14px;">'+docId+'</span>.',
            		        msg: 'You already opened <span style="color:green ;font-size:12px;">'+currentDocid+'</span>.</br>Please complete this file proccessing first and then open another file.',
            		        buttons: Ext.MessageBox.OK,		                   
            		        icon: Ext.MessageBox.INFO
            		    });
            			Ext.getCmp('resultpanel').setActiveTab('_' + currentDocid);
            		}
            		else{
            			Ext.getCmp('resultpanel').setActiveTab('_' + docid);
            		}
            	}
          },
          
           
         viewConfig:{//forceFit:true,
        	 autoLoad:false//,
        	 //autoScroll:true
        	 },
         loadMask:true
         }; // eo config object
         Ext.apply(this, Ext.apply(this.initialConfig, config));
       //  this.store.load({params:{start:0, limit:30}});
         this.bbar = Ext.create('Ext.PagingToolbar',
        {
        	             store: simpsonsStore,
        	             prependButtons: true,
        	             displayInfo: true,
        	             displayMsg: 'Displaying topics {0} - {1} of {2}',
        	             emptyMsg: "No topics to display"
          });
       
         /*this.on({
            // afterlayout:{scope:this, single:true, fn:function() {
         
             });
            // });*/
        Ezdi.Grid.superclass.initComponent.apply(this, arguments);
       // simpsonsStore.loadPage(1);
         // apply config
         //Ext.apply(this, Ext.apply(this.initialConfig, config));
          
          
         // call parent
          
         // load the store at the latest possible moment
         
         
        // Ezdi.Grid.on("rowclick", Ext.Msg.alert('Status','GotIT'), this);
          
         } // eo function initComponent
         });