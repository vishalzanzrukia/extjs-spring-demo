 
var jsonData = 'wrong';
 


Ext.define('User', {
    extend: 'Ext.data.Model',
    proxy: {
        type: 'ajax',
        url :'GetTxtFileNameServlet',//'GetAllFileNamesServlet' ,////'GetFileNameServlet',
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


var simpsonsStore = Ext.create('Ext.data.Store', {
    model: 'User',
    remoteSort: true,
    pageSize: 5
});
       // Data store for grid end
          Ext.define('Ezdi.Grid', {
            extend: 'Ext.grid.GridPanel',
        	//  extend: 'Ext.grid.Panel',
            alias: 'widget.txt_xml_grid',
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
            		var docid = record.get('docId');
            		var docidArray=docid.split(".txt") ;		
            		if(!Ext.getCmp('_' + docid))
            		{     
            			Ext.Ajax.request({
            				url:'GetTxtXmlServlet',            				
            				params: {'docid': docid,'callfrom':'txt'},            				
            				success:function(result,request){
            					 txtData = result.responseText;}
            				});
            			Ext.Ajax.request({
            				url:'GetTxtXmlServlet',            				
            				params: {'docid': docid,'callfrom':'xml'},            				
            				success:function(result,request){
            					 xmlData = result.responseText;
            					// //console.log(xmlData);
            					 Ext.getCmp('resultpanel').add({
            	            			title:'<b>'+docidArray[0]+'</b>',
            	            			id:'_' + docid,
            	            			autoScroll:true,
            	            			closable:true,
            	            			//padding:'10 10 10 10',
            	            			bodyPadding: 5,
            	            			//html:txtData
            	            			border:true,
            	            			layout:
            	            			{
	            						 	type: 'hbox',
	            						 //   pack: 'start',
	            						    align: 'stretch'
            	            			},
            	            			//defaultMargins: {top: 0, right: 0, bottom: 0, left: 5},
            	            			items:[
            	            			       /*{
            	            			    	   bodyPadding:10,
            	            			    	   html:txtData,
            	            			    	   title:'Txt File',
            	            			    	   flex:1//,
            	            			    	  // collapsible:true//,
            	            			    	  // closable:true
            	            			       },*/
            	            			       
            	            			       {
            	            			    	   //width:300,
             	            			    	  // bodyPadding:0,
             	            			    	   flex:1,
             	            			    	  // id:'tabText',
             	            			    	  // html:xmlData,
             	            			    	  // autoLoad:'1.txt',
             	            			    	   title:'Txt File ( '+docid+' )',
             	            			    	   items:[{
             	            			    		 // width: '100%',
             	            			    		   xtype:'textarea',
                 	            			    	   value:txtData,
                 	            			    	   frame:false,
                 	            			    	  // grow:true,
                 	            			    	  width:679,
                 	            			    	  
                 	            			    	 // width:610,
                 	            			           height:'100%',
                 	            			           redaOnly:true
                 	            			    	// padding:10
                 	            			    	   
             	            			    	   }]
             	            			    	   
             	            			    	   //closable:true
             	            			       
            	            			       },
            	            			       {
            	            			    	  // bodyPadding:0,
            	            			    	   flex:1,
            	            			    	  // id:'tabText',
            	            			    	  // html:xmlData,
            	            			    	  // autoLoad:'1.txt',
            	            			    	   title:'Xml File ( '+docid+'.xml )',
            	            			    	   items:[{
            	            			    		   xtype:'textarea',
                	            			    	   value:xmlData,
                	            			    	   frame:false,
                	            			    	  // grow:true,
                	            			    	   width:679,
                	            			           height:'100%',
                	            			           redaOnly:true
                	            			    	  // padding:10
                	            			    	   
            	            			    	   }]
            	            			    	   
            	            			    	   //closable:true
            	            			       }]
            	            		//	html: jsonData 
            	            		});
            					 Ext.getCmp('resultpanel').setActiveTab('_' + docid);
            					}
            				
                				
                        			});
            			//Request End
            			//docTabStore.proxy.extraParams.doctabdata=record;
            		
            		
            		//jsonData='';
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