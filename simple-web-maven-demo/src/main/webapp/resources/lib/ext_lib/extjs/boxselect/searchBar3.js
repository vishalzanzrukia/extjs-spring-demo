/**
 * @class Ext.ux.form.field.BoxSelect
 * @extends Ext.form.field.ComboBox
 * 
 * BoxSelect for ExtJS 4, an extension of ComboBox that allows selecting and editing multiple values
 * displayed as labelled boxes within the field, as seen on facebook, hotmail and other sites.
 * 
 * The component started off as a port of BoxSelect for Ext 2 
 * (http://www.sencha.com/forum/showthread.php?134751-Ext.ux.form.field.BoxSelect), but eventually turned
 * into a complete rewrite adding better support for queryMode: 'remote' and 
 * better keyboard navigation and selection of values
 *  
 * @author vishal zanzrukia
 * @requires BoxSelect.css
 * @xtype boxselect
 */
Ext.require(['*']);

Ext.define('Ext.ux.PanelFieldDragZone', {

    extend: 'Ext.dd.DragZone',

    constructor: function(){},

//  Call the DRagZone's constructor. The Panel must have been rendered.
    init: function(panel) {
        if (panel.nodeType) {
            Ext.ux.PanelFieldDragZone.superclass.init.apply(this, arguments);
        } else {
            if (panel.rendered) {
                Ext.ux.PanelFieldDragZone.superclass.constructor.call(this, panel.getEl());
               // var i = Ext.fly(panel.getEl()).select('input');
               // i.unselectable();
            } else {
                panel.on('afterlayout', this.init, this, {single: true});
            }
        }
    },

    scroll: false,

//  On mousedown, we ascertain whether it is on one of our draggable Fields.
//  If so, we collect data about the draggable object, and return a drag data
//  object which contains our own data, plus a "ddel" property which is a DOM
//  node which provides a "view" of the dragged data.
    getDragData: function(e) {
    	var d = document.createElement('div');

    	return {
            field: e,
            ddel: d
        };

        var t = e.getTarget('input');
        if (t) {
            e.stopEvent();

//          Ugly code to "detach" the drag gesture from the input field.
//          Without this, Opera never changes the mouseover target from the input field
//          even when dragging outside of the field - it just keeps selecting.
            if (Ext.isOpera) {
                Ext.fly(t).on('mousemove', function(e1){
                    t.style.visibility = 'hidden';
                    Ext.defer(function(){
                        t.style.visibility = '';
                    }, 1);
                }, null, {single:true});
            }

//          Get the data we are dragging: the Field
//          create a ddel for the drag proxy to display
            var f = Ext.ComponentQuery.query('field[inputEl]{inputEl.id=="' + t.id + '"}')[0];
            
            d.className = 'x-form-text';
            d.appendChild(document.createTextNode(t.value));
            Ext.fly(d).setWidth(f.getEl().getWidth());
            return {
                field: f,
                ddel: d
            };
        }
    },

//  The coordinates to slide the drag proxy back to on failed drop.
    getRepairXY: function() {
      // return this.dragData.field.getEl().getXY();
    }
});
var mapdropDown= '';

Ext.define('Ext.ux.form.field.BoxSelect1', {
	extend: 'Ext.form.field.ComboBox',

	alias: 'widget.searchbar',
	
	selectedRecords: null, 

	removeRecords : null,
	
	selectedRecords1 : null,
	
	prevVal : '',
	
	prevLen : 0,
	
	items: null,
	multiSelect : true,
	selectionStartIdx: null,
	selectionEndIdx: null,
	eventcalled:false,
	stacked: false,
	recAdded:false,
	recSelected:false,
	called :false,
	i : 0,
	initComponent:function() {
		Ext.apply(this, {
			hideTrigger: true,
			grow: true
		});
		
	this.selectedRecords = Ext.create('Ext.util.MixedCollection');
	this.selectedRecords1 = Ext.create('Ext.util.MixedCollection');
	this.removeRecords = Ext.create('Ext.util.MixedCollection');
	this.items = Ext.create('Ext.util.MixedCollection');		
	this.callParent(arguments);		
	this.dummystore = Ext.create('Ext.util.MixedCollection');
	}, 	
	
	initEvents: function() {
		this.callParent();
		this.mon(this.inputEl, 'keypress', function(e) {
			this.autoSize();
			if (!e.isSpecialKey()) {
				//this.deselectAll();
			}						
		}, this);
		this.mon(this.inputEl, 'blur', this.deselectAll, this);
		this.mon(this.frame, 'keypress', this.onKeyPress, this);
		this.mon(this.frame, 'keydown', this.onKeyDown, this);
		this.mon(this.frame, 'click', function() {
			this.inputEl.focus();
		}, this);
		this.mon(this, 'resize', this.onResize, this);
		this.loadinit();
		this.store.on('load', function(store){
			this.queryMode='local';
<<<<<<< searchBar3.js
			////////////////////console.log('dummy store size     '+this.dummystore.length);
=======
			//////console.log('dummy store size     '+this.dummystore.length);
>>>>>>> 1.3
		/*	if(this.dummystore.length === 0)
			{
				this.store.load();
				this.queryMode='local';
				i=0;
<<<<<<< searchBar3.js
				////////////////////console.log('hi before load');
=======
				//////console.log('hi before load');
>>>>>>> 1.3
				this.store.each(function(rec)
						{
							this.dummystore.add((rec.data[this.valueField]),rec);
							this.selectedRecords1.add((rec.data[this.valueField]),rec);
							i++;
						}, this);
				this.store.removeAll();
				this.selectedRecords.clear();
<<<<<<< searchBar3.js
				////////////////////console.log('hiiiiiiiiiii'+i);
=======
				//////console.log('hiiiiiiiiiii'+i);
>>>>>>> 1.3
				this.recAdded=true;
				this.recSelected=false;
				this.eventcalled=false;
<<<<<<< searchBar3.js
				////////////////////console.log('dummy store size     '+this.dummystore.length);
=======
				//////console.log('dummy store size     '+this.dummystore.length);
>>>>>>> 1.3
			}
			else
			{
				this.queryMode='local';
				this.recAdded=false;
				this.recSelected=false;
			}*/
		}, this);
	},
	loadinit:function(store)
	{
<<<<<<< searchBar3.js
		////////////////////console.log('dummy store size     '+this.dummystore.length);
=======
		//////console.log('dummy store size     '+this.dummystore.length);
>>>>>>> 1.3
		if(this.dummystore.length === 0)
		{
			this.store.load();
			//this.queryMode='local';
			i=0;
<<<<<<< searchBar3.js
			////////////////////console.log('hi before load');
=======
			//////console.log('hi before load');
>>>>>>> 1.3
			this.store.each(function(rec)
					{
						this.dummystore.add((rec.data[this.valueField]),rec);
						this.selectedRecords1.add((rec.data[this.valueField]),rec);
						i++;
					}, this);
			this.store.removeAll();
			this.selectedRecords.clear();
<<<<<<< searchBar3.js
			////////////////////console.log('hiiiiiiiiiii'+i);
=======
			//////console.log('hiiiiiiiiiii'+i);
>>>>>>> 1.3
			this.recAdded=true;
			this.recSelected=false;
			this.eventcalled=false;
<<<<<<< searchBar3.js
			////////////////////console.log('dummy store size     '+this.dummystore.length);
=======
			//////console.log('dummy store size     '+this.dummystore.length);
>>>>>>> 1.3
		}
		else
		{
			//this.queryMode='local';
			this.recAdded=false;
			this.recSelected=false;
		}
		
	},
	onRender:function(ct, position) {
		// this.iAmRendered is necessary, because ext sets rendered = true in AbstractComponent.onRender
		// and not (as I believe it should) in AbstractComponent.render
		this.iAmRendered = false;
		
		this.callParent(arguments);		
		this.inputEl.removeCls('x-form-text');
		this.inputEl.setWidth(20);

        this.frame = this.inputEl.wrap({
            tag : 'ul',
            cls: 'boxselect x-form-text'
        });
        				
		if (this.stacked) {
			this.frame.addCls('stacked');
		}
					
		this.inputEl.wrap({
			tag: 'li'
		});
		/*this.store.on('load', function(store){
<<<<<<< searchBar3.js
			////////////////////console.log('dummy store size     '+this.dummystore.length);
=======
			//////console.log('dummy store size     '+this.dummystore.length);
>>>>>>> 1.3
			if(this.dummystore.length === 0)
			{
				this.store.load();
				this.queryMode='local';
				i=0;
<<<<<<< searchBar3.js
				////////////////////console.log('hi before load');
=======
				//////console.log('hi before load');
>>>>>>> 1.3
				this.store.each(function(rec)
						{
							this.dummystore.add((rec.data[this.valueField]),rec);
							this.selectedRecords1.add((rec.data[this.valueField]),rec);
							i++;
						}, this);
				this.store.removeAll();
				this.selectedRecords.clear();
<<<<<<< searchBar3.js
				////////////////////console.log('hiiiiiiiiiii'+i);
=======
				//////console.log('hiiiiiiiiiii'+i);
>>>>>>> 1.3
				this.recAdded=true;
				this.recSelected=false;
				this.eventcalled=false;
<<<<<<< searchBar3.js
				////////////////////console.log('dummy store size     '+this.dummystore.length);
=======
				//////console.log('dummy store size     '+this.dummystore.length);
>>>>>>> 1.3
			}
			else
			{
				this.queryMode='local';
				this.recAdded=false;
				this.recSelected=false;
			}
		}, this);*/
		this.iAmRendered = true;
		this.setRawValue(this.rawValue);
		this.store.on('datachanged', function(store){
			if(!this.eventcalled)
			{
<<<<<<< searchBar3.js
				////////////////////console.log('called');
=======
				//////console.log('called');
>>>>>>> 1.3
				this.eventcalled=true;
				this.store.each(function(rec)
					{
						this.dummystore.add((rec.data[this.valueField]),rec);
						this.selectedRecords1.add((rec.data[this.valueField]),rec);
					}, this);
				this.store.removeAll();
				this.selectedRecords.clear();
			}
			if(!this.recSelected)
			{
				this.recSelected=true;
<<<<<<< searchBar3.js
				//////////////////////console.log('called');
=======
				////////console.log('called');
>>>>>>> 1.3
				if(this.getCursorPosition()>0)
				{
						this.called=true;
						this.store.removeAll();
						this.selectedRecords.clear();
						var i=0;				
						if((this.inputEl.dom.value.length) === 1)
						{
							return;
						}
						if((this.inputEl.dom.value.substring(0,2)) != this.prevVal || (this.inputEl.dom.value.length) < (this.prevLen))
						{
							this.reloadRec();
							this.prevVal=(this.inputEl.dom.value.substring(0,2));
						}
						this.prevLen = this.inputEl.dom.value.length;
						this.selectedRecords1.each(function(rec)
						{
							this.i=this.i + 1;
							if(rec.get(this.valueField).substring(0,this.getCursorPosition()) === this.inputEl.dom.value)
							{
								if(!(this.removeRecords.containsKey(rec.get(this.valueField))))
								{
									if(!(this.selectedRecords.containsKey(rec.get(this.valueField))))
									{
										i=i+1;
										this.selectedRecords.add((rec.data[this.valueField]),rec);
										
										if(i<10)
											this.store.add(rec);
<<<<<<< searchBar3.js
										////////////////////////console.log('called'+this.i);
=======
										//////////console.log('called'+this.i);
>>>>>>> 1.3
									}
								}
							}
							else
							{
								this.selectedRecords1.remove(rec);
<<<<<<< searchBar3.js
								////////////////////////console.log('removed'+this.i);
=======
								//////////console.log('removed'+this.i);
>>>>>>> 1.3
							}
						}, this);
<<<<<<< searchBar3.js
						//////////////////////console.log('called:    '+this.i);
=======
						////////console.log('called:    '+this.i);
>>>>>>> 1.3
				}
			}
		}, this);
	},
	reloadRec :function()
	{
		this.selectedRecords1.clear();
			this.dummystore.each(function(rec)
			{
				this.selectedRecords1.add((rec.data[this.valueField]),rec);
			},this);
	},
	onResize : function(w, h, rw, rh){
		this.callParent(arguments);
		this.frame.setWidth(w-4);
		this.autoSize();
	},
	getCursorPosition: function() {
	    if (Ext.isIE) {	    	
			rng=document.selection.createRange();
			rng.collapse(true);
			rng.moveStart("character", -this.inputEl.dom.value.length);
			cursorPos=rng.text.length;					    	
	    } else {
	        cursorPos = this.inputEl.dom.selectionStart;
	    }
		return cursorPos;
	},
	
	
	hasSelectedText: function() {
	    if (Ext.isIE) {
			var sel = document.selection;
			var range = sel.createRange();
			return (range.parentElement() == this.inputEl.dom);	    	
	    } else {this.inputEl.dom.value = '';
		this.selectionStartIdx = this.items.getCount()-1;
		e.stopEvent();
	    	return this.inputEl.dom.selectionStart != this.inputEl.dom.selectionEnd;
	    }		
	},
	
	onKeyDown: function(e) {
		// we only handle the event, if the focus is on an item
		// or the cursor at the beginning of the textfield
	    if (this.selectionStartIdx === null && this.getCursorPosition() !== 0) {
	    	return
	    }	
		//function hasSelectedText is not working for IE please check it
		if(e.getKey() === e.BACKSPACE && this.getCursorPosition() === 0 ){
			// stop combobox default behaviour (opening the list)
			this.stopKeyUpEvent = true;
			this.collapse();
			
			this.inputEl.dom.value = '';
			
			// delete selected items or last item in list
			var noneSelected = true;
<<<<<<< searchBar3.js
			////////////////////////console.log('hiiiiiiiiiiiiiiiiiiiiiiiiii'+this.items.getCount());
=======
			//////////console.log('hiiiiiiiiiiiiiiiiiiiiiiiiii'+this.items.getCount());
>>>>>>> 1.3
			this.items.each(function(item) {
				if (item.isSelected()) {
					item.dispose();
					noneSelected = false;
				}
			});
			if (noneSelected && this.items.getCount() > 0) {
				this.items.get(this.items.getCount()-1).dispose();					
			}
		}
	
	},
	
	
	onKeyPress: function(e) {
		this.recAdded=false;
		this.recSelected=false;
		//this.queryMode='local';
		if(!this.multiSelect && e.getKey() != '13')
		{
			
<<<<<<< searchBar3.js
			////////////////////console.log('hiiii multi false'+e.getKey());
=======
			//////console.log('hiiii multi false'+e.getKey());
>>>>>>> 1.3
			this.items.each(function(item) {
				if (item.isSelected()) {
					item.dispose();
					noneSelected = false;
				}
			});
			//this.onReset();
		}
		if (e.getKey() === 'a'.charCodeAt(0) && e.ctrlKey === true) 
		{
			e.preventDefault();	
			this.selectionEndIdx = 0;
			this.items.each(function(item) {				
				item.select(true);
			});			
			this.inputEl.dom.value = '';
			this.selectionStartIdx = this.items.getCount()-1;
			e.stopEvent();
		}
		
	},
	
	onKeyUp: function(e) {
		if (!Ext.isDefined(this.stopKeyUpEvent) || this.stopKeyUpEvent === false) {
			this.callParent(arguments);	
		}
		this.stopKeyUpEvent = false;
		if(e.getKey() === e.BACKSPACE || e.getKey() === e.DELETE )
		{
			this.resetStore();
		}
	},
	
	deselectAll: function() {	
		this.items.each(function(item) {
			item.deselect();
		});
		this.selectionStartIdx = null;
		this.selectionStartIds = null;
	},
	
	onListSelectionChange: function(list, selectedRecords) {
		this.textFieldVal = "";
		
		if (selectedRecords.length < 1) {
			return;
		}
		this.addValues(selectedRecords[0].get(this.valueField));
		
		this.inputEl.dom.value = '';
		this.applyEmptyText();

		Ext.defer(this.collapse, 1, this);
		this.inputEl.focus();
	},	    
	
    // loadFromRemoteStore specified to load values from a remote store
    // if queryMode === 'remote' and the values are not in the currently loaded subset
	addValues: function(values, loadFromRemoteStore) {
		if (!Ext.isArray(values)) {
			values = [values];
		}
		if (!Ext.isDefined(loadFromRemoteStore)) {
			loadFromRemoteStore = true;			
		}		
		Ext.each(values, function(value) {
			if (!this.removeRecords.containsKey(value)) {
<<<<<<< searchBar3.js
			  // //////////////////console.log("hi"+this.valueField+" "+value);
=======
			  // ////console.log("hi"+this.valueField+" "+value);
>>>>>>> 1.3
				var record = this.store.findRecord(this.valueField, value);
				if (record === null) {
					// in remote mode the record might simply not be loaded
					// if we have already tried loadRemoteStore will be false
		            if (this.queryMode !== 'local' && loadFromRemoteStore) {
		            	var params = {};
		            	params[this.valueField] = values.join(',');            	
		            	this.store.load({
		            		params: params,
		            		callback: function() {
		            			this.addValues(values, false);	
		            		},
		            		scope: this
		            	});		       
		            	return false;
		            }					
					return;
				}
				//this.selectedRecords.add(value, record);
<<<<<<< searchBar3.js
				////////////////////////console.log('record added');
=======
				//////////console.log('record added');
>>>>>>> 1.3
				this.removeRecords.add(value, record);
<<<<<<< searchBar3.js
				////////////////////////console.log('value'+value+'record'+record);
=======
				//////////console.log('value'+value+'record'+record);
>>>>>>> 1.3
				this.store.remove(record);
				if(typeof this.displayFieldTpl === 'string')
					this.displayFieldTpl = new Ext.XTemplate(this.displayFieldTpl);
			
<<<<<<< searchBar3.js
				//////alert('dis:'+record.get(this.displayField));
=======
				////alert('dis:'+record.get(this.displayField));
>>>>>>> 1.3
				var caption;
				//edited by vj
				var displayFiled=this.displayField;
				if(Ext.isDefined(this.displayFieldTpl))
					caption = this.displayFieldTpl.apply(record.data);
				else if(Ext.isDefined(this.displayField))
				{
					caption = value;
				}	
					
<<<<<<< searchBar3.js
				//////alert(record);
=======
				////alert(record);
>>>>>>> 1.3
				this.addItem(record, value,displayFiled);
			}		
		}, this);
		
	},	
	
	onReset : function()
	{
		this.removeRecords.clear();
		this.setValue(' ');
		this.getRawValue();
		return ;
	},
	
	
	
	/**
	 * the mixed-type value is an array of values (for this.valueField), model instances or JSON objects
	 * with model data 
	 */
	valueToRaw: function(value) {
		var rawValues = [];
		val1='reset';
<<<<<<< searchBar3.js
		//////////////////////console.log(value+ val1 + '       value');
=======
		////////console.log(value+ val1 + '       value');
>>>>>>> 1.3
		if(value === val1)
		{
			return '';
<<<<<<< searchBar3.js
			//////////////////////console.log('hii in reset');
=======
			////////console.log('hii in reset');
>>>>>>> 1.3
		}
<<<<<<< searchBar3.js
		 //////////////////////console.log('value to raw');
=======
		 ////////console.log('value to raw');
>>>>>>> 1.3
		Ext.each(value, function(record) {
			if (record.isModel) {
				rawValues.push(record.get(this.valueField));
			}
			else if (Ext.isObject(record)) {
				rawValues.push(record[this.valueField]);
			}
			else {
				rawValues.push(record);
			}
		}, this);
		
		return rawValues.join(',');
	},

	rawToValue: function(rawValue) {
		var rawValues = rawValue.split(',');
		var values = [];			
		Ext.each(rawValues, function(rawValue) {
			var record = this.store.findRecord(this.valueField, rawValue);
			if (record !== null) {
				values.push(record);
			}
		}, this);
		
		return values;
	},
	
	getValue: function(){
		return this.getRawValue();		
	},
	
	getRawValue: function() {		
		if (Ext.isDefined(arguments.callee.caller.$owner) && arguments.callee.caller.$owner.xtype === 'combobox') {
			return this.callParent();
		}
		else {
			return this.valueToRaw(this.removeRecords.items);
		}
	},
		
	setRawValue: function(rawValue) {
		if (Ext.isDefined(arguments.callee.caller.$owner) && arguments.callee.caller.$owner.xtype === 'combobox') {
			return this.callParent(arguments);
		}
		else {
	        rawValue = Ext.value(rawValue, '');
	        this.rawValue = rawValue;
	        if (this.iAmRendered && !Ext.isEmpty(rawValue)) {
				this.removeAllItems();
	        	if (this.store.isLoading()) {
	        		this.store.on('load', function() {
	        			this.addValues(rawValue.split(','));
	        		}, this, {single: true});
	        	}
	        	else {				
					this.store.sort();
					this.addValues(rawValue.split(','));
	        	}	        	
	        }
		}
	},
	
	setValue: function(value) {
		value = Ext.value(value, []);
		this.setRawValue(this.valueToRaw(value));
	},
		
	removeAllItems: function(){
		this.items.each(function(item) {
			item.dispose(true);
		});
		this.items.clear();
	},
	
	resetStore: function(){
		this.selectedRecords.clear();
	},

	
	onItemSelected: function(item, addToSelection) {
		this.inputEl.dom.value = '';
		this.selectionStartIdx = this.items.indexOf(item);				
		if (!addToSelection) {
			this.items.each(function(otherItem) {
				if (otherItem !== item) {
					otherItem.deselect();
				}
			});			
			this.selectionEndIdx = this.selectionStartIdx;
		}
		else {
			if (this.selectionEndIdx === null) {
				this.selectionEndIdx = this.selectionStartIdx;
			}
			var start = Math.min(this.selectionEndIdx, this.selectionStartIdx);
			var end = Math.max(this.selectionEndIdx, this.selectionStartIdx);
			this.items.each(function(otherItem) {
				if (otherItem === item) {
					return;
				}
				if (start <= this.items.indexOf(otherItem) && this.items.indexOf(otherItem) <=
				end) {		
					otherItem.suspendEvents(); // avoid the event being triggered again
					otherItem.select();
					otherItem.resumeEvents();
				}
				else {
					otherItem.deselect();
				}						
			}, this);
		}
	},
	
	onItemDisposed: function(item){
		
			this.removeRecords.remove(item.value);
			this.items.remove(item);
			
	},
		
	addItem: function(id, caption,displayFiled){
<<<<<<< searchBar3.js
		////////////////////console.log('before id'+displayFiled);
	   // //////////////////console.log(id);
		//////alert('id:'+Ext.id(null, 'boxitem-item')+' and capation:'+caption);
=======
		//////console.log('before id'+displayFiled);
	   // ////console.log(id);
		////alert('id:'+Ext.id(null, 'boxitem-item')+' and capation:'+caption);
>>>>>>> 1.3
	   var dispalyField=this.displayField;
		var item = Ext.create('Ext.ux.BoxSelect.Item1', {
			id: Ext.id(null, 'boxitem-item'),
			caption: id.get(displayFiled),//id.data.key,//caption, //edited by vj  
			disabled: this.disabled,
			value: id,
			listeners: {
			    render: myDragZone,
			    dispose:dispose//,
				//'dispose': this.onItemDisposed//,
				/*distroy:function(item){
<<<<<<< searchBar3.js
			     // //////////////////console.log(item);
=======
			     // ////console.log(item);
>>>>>>> 1.3
			      var panel=Ext.getCmp(item.id+'_panel');
			  	  if(panel!=null)
			  		panel.destroy();
		          },*/
				//'select': this.onItemSelected,
				 //scope: this
			}
		});
<<<<<<< searchBar3.js
		//////alert('before render:'+item.id);
=======
		////alert('before render:'+item.id);
>>>>>>> 1.3
		//item.render(this.frame, this.frame.dom.childNodes.length-1);
<<<<<<< searchBar3.js
		//////alert('before add:'+item.id);
=======
		////alert('before add:'+item.id);
>>>>>>> 1.3
		//
		//this.items.add(item.id, item);
		//added by vj
<<<<<<< searchBar3.js
		//////alert('width:'+this.frame.dom.childNodes.length);
=======
		////alert('width:'+this.frame.dom.childNodes.length);
>>>>>>> 1.3
		
		
		
		//  
		var formPanel = Ext.create('Ext.Panel', {
			id: item.id+'_panel',
			//plugins: Ext.create('Ext.ux.PanelFieldDragZone'),
	        //region     : 'center',
	       // title      : 'Generic Form Panel',
	        bodyStyle  : 'padding:0px;background-color: #DFE8F6',
	        defaults:{margin:'0'},
	       // labelWidth : 100,
			border:false,
			height:18,
			autoScroll:true,
			layout:{type:'hbox',align:'middle',pack:'start'},
			listeners:{
				afterRender:function(  container,  layout,  opts )
				{
<<<<<<< searchBar3.js
					//////alert('hi');
				      //////////////////console.log(opts);
=======
					////alert('hi');
				      ////console.log(opts);
>>>>>>> 1.3
				      //layout.innerCt.doLayout();
<<<<<<< searchBar3.js
				      //////////////////console.log(layout);
				      //////////////////console.log(container);
=======
				      ////console.log(layout);
				      ////console.log(container);
>>>>>>> 1.3
				     
						
				}
			},
	       // width      : 200,
	      
	       // height:65,
	        //margins    : '0 0 0 0',
	        items      : [item]
	        
	    });
		  
		//var formPanelDropTargetEl1 =  item.dom;
		 // var formPanelDropTargetEl =  formPanel.body.dom;
<<<<<<< searchBar3.js
		//////alert('hi'+panel.title);
=======
		////alert('hi'+panel.title);
>>>>>>> 1.3
		//formPanel.doAutoRender();
		formPanel.render(this.frame, this.frame.dom.childNodes.length-1);
		//this.items.add(formPanel.id, formPanel);
		//this.ownerCt.doLayout();
		//end by vj
		
		//this.items.add(item.id, item);
		
		this.ownerCt.doLayout(); 
<<<<<<< searchBar3.js
		//////alert(item.getHeight());
=======
		////alert(item.getHeight());
>>>>>>> 1.3
		formPanel.setWidth(item.getWidth());
	//	var panelDropTargetEl =  panel.body.dom;
		
		
		
	    var formPanelDropTargetEl =  formPanel.body.dom;

	    var formPanelDropTarget = Ext.create('Ext.dd.DropTarget', formPanelDropTargetEl, {
	      //  ddGroup: 'GridExample',
	        notifyEnter: function(ddSource, e, data) {
	    
<<<<<<< searchBar3.js
	    	//////alert(ddSource);
=======
	    	////alert(ddSource);
>>>>>>> 1.3
	    	
<<<<<<< searchBar3.js
	    	//////alert('hi');
=======
	    	////alert('hi');
>>>>>>> 1.3
	    	
	            //Add some flare to invite drop.
	          //  formPanel.body.stopAnimation();
	           // formPanel.body.highlight();
	        },
	        notifyDrop  : function(ddSource, e, data){
	        	
<<<<<<< searchBar3.js
	        //	//////////////////console.log(formPanel.id);
	        //	//////////////////console.log(ddSource.el.id);
=======
	        //	////console.log(formPanel.id);
	        //	////console.log(ddSource.el.id);
>>>>>>> 1.3
	        	
	        	var destPanelId=formPanel.id;
	        	var destItemID=destPanelId.slice(0,destPanelId.length-6);
	        	var sourceItemId=data.sourceEl.id;//ddSource.el.id
	        	var sourcePanelId=sourceItemId+'_panel';
	        	var sourceItem=Ext.getCmp(sourceItemId);
	        	var destPanel=Ext.getCmp(destPanelId);
<<<<<<< searchBar3.js
	        	////////////////////console.log(ddSource);
	        	////////////////////console.log(e);
	        	////////////////////console.log(data);
	        	////////////////////console.log('id'+data.sourceEl.id);
	        	////////////////////console.log(data.sourceEl.textContent);
=======
	        	//////console.log(ddSource);
	        	//////console.log(e);
	        	//////console.log(data);
	        	//////console.log('id'+data.sourceEl.id);
	        	//////console.log(data.sourceEl.textContent);
>>>>>>> 1.3
	        	var source_key_text=data.sourceEl.textContent;
	        	//var dest_key_text=Ext.getCmp(destItemID).value.get('key');
<<<<<<< searchBar3.js
	        	////////////////////console.log('width:'+sourceItem.getWidth());
	        	////////////////////console.log('before value'+sourceItemId);
	        	////////////////////console.log();
	        	////////////////////console.log('before item value');
	        	////////////////////console.log(Ext.getCmp(sourceItemId).value.get('key'));
=======
	        	//////console.log('width:'+sourceItem.getWidth());
	        	//////console.log('before value'+sourceItemId);
	        	//////console.log();
	        	//////console.log('before item value');
	        	//////console.log(Ext.getCmp(sourceItemId).value.get('key'));
>>>>>>> 1.3
	        	//Ext.getCmp(destPanelId).insert(1,Ext.get(sourceItemId));
	        	
	        	
	        	
	        	
	        	
<<<<<<< searchBar3.js
	        	////////////////////console.log('destItemID'+destItemID);
=======
	        	//////console.log('destItemID'+destItemID);
>>>>>>> 1.3
	        	//sourceItemId.
<<<<<<< searchBar3.js
	        	//////////////////console.log('source:'+sourcePanelId);
	        	//////////////////console.log('dest:'+destPanelId);
=======
	        	////console.log('source:'+sourcePanelId);
	        	////console.log('dest:'+destPanelId);
>>>>>>> 1.3
	        	if(sourcePanelId!=destPanelId)
	        	{
	        		
	        		var p=Ext.getCmp(destPanelId);
	        		var combo_flag=false;
	        		for(i=0;i<p.items.length;i++)
	        		{
<<<<<<< searchBar3.js
	        			////////////////////console.log(p.items.items[i].xtype);
=======
	        			//////console.log(p.items.items[i].xtype);
>>>>>>> 1.3
	        			if(p.items.items[i].xtype=='panel')
	        			{
	        		      combo_flag=true;		
	        			}
	        		}
	        		if(p.items.length==1)
	        		{
	        			try
	        			{
	        				setDropMapping(Ext.getCmp(destItemID).value.data.v);
		        			mapdropDown+=Ext.getCmp(destItemID).value.data.v+"::"+destPanelId+'_combo'+"\n";
	        			}
	        			catch(e)
	        			{
<<<<<<< searchBar3.js
	        				//////alert(getDestItemId(mapdropDown));
=======
	        				////alert(getDestItemId(mapdropDown));
>>>>>>> 1.3
	        			}
	        			
	        		}
	        		if(!combo_flag)
	        		{
	        			var combo_store = Ext.create('Ext.data.Store', {
		        		    fields: ['name'],
		        		    data : [
		        		        { "name":"AND"},
		        		        {"name":"OR"}
		        		    ]
		        		});
	        			
	        			destPanel.setWidth(destPanel.getWidth()+40);
	        			destPanel.insert(0, new Ext.Panel({
		    		    	width:38,
		    		    	height:16,
		    		    	id:destPanelId+'_panel_combo',
		    		    	bodyStyle:{"padding":"0px 0px 0px 0px","vertical-align": "middle"},
		    		    	defaults:{margin:'-2 0 0 0'},
		    		    	border:true,
		    		    	items:[{
		    		    		xtype:'combo',
		    		    		id:destPanelId+'_combo',
		    		    		 defaultListConfig: {
		    		    	        emptyText: '',
		    		    	        loadingText: 'Loading...',
		    		    	        loadingHeight: 70,
		    		    	        minWidth: 30,
		    		    	        maxHeight: 300,
		    		    	        shadow: 'sides'
		    		    	    },
		    		    		 listConfig: {
		    		    	        getInnerTpl: function() {
		    		    	            return '<div style="font-size:10px;">{name}</div>';
		    		    	        }
		    		    	    },
		    		    		value:'OR',
		    		    		width:40,
		    		            queryMode: 'local',
		    		            store:combo_store,
		    		            displayField:'name',
		    		            valueField:'name',
		    		           // typeAhead: false,
		    		            multiSelect : false//,
		    		           // minChars:1
		    		    	}]
		    		  }));
	        		}
	        			
	        		
	        		destPanel.insert(1,Ext.create('Ext.ux.BoxSelect.Item1', {
		    			id: Ext.id(null, 'boxitem-item'),
		    			caption:/*dest_key_text+'<b>and</b>'+*/source_key_text,
		    			value:Ext.getCmp(sourceItemId).value,
		    			disabled: this.disabled,	
		    			listeners: {
		    			    render: myDragZone,
		    			    dispose:dispose,
		    			    afterrender:function( item,eOpts)
		    			    {
	        				
	        				this.myDestPanelId=destPanelId;
	        				this.mySourcePanelId=sourcePanelId;
	        				this.comboid=destPanelId+'_combo';
	        				destPanel.setWidth(destPanel.getWidth()+item.getWidth());
<<<<<<< searchBar3.js
	        				//////alert('hi');
	        				setDropMapping(Ext.getCmp(sourceItemId).value.data.v);
	        				mapdropDown+=Ext.getCmp(sourceItemId).value.data.v+"::"+destPanelId+'_combo'+"\n";
=======
	        				////alert('hi');
	        				setDropMapping(Ext.getCmp(sourceItemId).value.data.key_value);
	        				mapdropDown+=Ext.getCmp(sourceItemId).value.data.key_value+"::"+destPanelId+'_combo'+"\n";
>>>>>>> 1.3
	        				
<<<<<<< searchBar3.js
	        				//setDropMapping(Ext.getCmp(sourceItemId).value.data.v+'::'+destPanelId+'_combo'+'\n');
	        				//////alert(Ext.getCmp(sourceItemId).value.data.v);
	        				////////////////////console.log(mapdropDown);
	        				//////////////////////console.log(item.id);
=======
	        				//setDropMapping(Ext.getCmp(sourceItemId).value.data.key_value+'::'+destPanelId+'_combo'+'\n');
	        				////alert(Ext.getCmp(sourceItemId).value.data.key_value);
	        				//////console.log(mapdropDown);
	        				////////console.log(item.id);
>>>>>>> 1.3
		    			    }//,//
		    			   // 'dispose': this.dispose,
		    				//'select': this.onItemSelected,
		    				 //scope: this
		    			}
	        		
		    		}));
	        		
	        		//mapdropDown+=Ext.getCmp(sourceItemId).value.data.v+"::"+destPanelId+'_combo'+"\n";
	        			/*Ext.getCmp(destPanelId).insert(1,Ext.create('Ext.ux.BoxSelect.Item1', {
			    			id: Ext.id(null, 'boxitem-item'),
			    			caption:'and',
			    			//value:Ext.getCmp(sourceItemId).value,
			    			disabled: this.disabled,	
			    			listeners: {
			    			   // render: myDragZone,
			    			   // dispose:dispose//,
			    			   // 'dispose': this.dispose,
			    				//'select': this.onItemSelected,
			    				 //scope: this
			    			}
			    		}));
	        			Ext.getCmp(destPanelId).insert(2,Ext.create('Ext.ux.BoxSelect.Item1', {
			    			id: Ext.id(null, 'boxitem-item'),
			    			caption:'or',
			    			//value:Ext.getCmp(sourceItemId).value,
			    			disabled: this.disabled,	
			    			listeners: {
			    			   // render: myDragZone,
			    			   // dispose:dispose//,
			    			   // 'dispose': this.dispose,
			    				//'select': this.onItemSelected,
			    				 //scope: this
			    			}
			    			
			    			
			    		}));*/
	        		//
	        			
	        			
	        			
	        		
	        		var spanel=Ext.getCmp(sourcePanelId);
	        		if(spanel!=null)
	        		{
<<<<<<< searchBar3.js
	        			//////alert('hi');
=======
	        			////alert('hi');
>>>>>>> 1.3
	        			var items_count=spanel.items.length;
	        			if(items_count<=2)
	        			{
	        				spanel.destroy();	        				
	        			}
	        			else if(items_count==3)
	        			{
<<<<<<< searchBar3.js
	        				//////alert("deleted");_panel_combo
	        				//////alert(sourcePanelId+'_panel_combo');
=======
	        				////alert("deleted");_panel_combo
	        				////alert(sourcePanelId+'_panel_combo');
>>>>>>> 1.3
	        				Ext.getCmp(sourcePanelId+'_panel_combo').destroy();
	        				 spanel.setWidth(spanel.getWidth()-(40+Ext.getCmp(sourceItemId).getWidth()));
	        				Ext.getCmp(sourceItemId).dispose(true);
	        			}
	        			else
	        			{
	        				 spanel.setWidth(spanel.getWidth()-(Ext.getCmp(sourceItemId).getWidth())); 
	        				Ext.getCmp(sourceItemId).dispose(true);
	        			}
	        				
	        		}
	        		else
	        		{
	        			var panelId=Ext.getCmp(sourceItemId).myDestPanelId;
	        			var panel=Ext.getCmp(panelId);
	        			var items_count=panel.items.length;
	        			if(items_count<=2)
	        			{
	        				  panel.destroy();	        				
	        			}
	        			else if(items_count==3)
	        			{
<<<<<<< searchBar3.js
	        				//////alert(panelId+'_panel_combo');
=======
	        				////alert(panelId+'_panel_combo');
>>>>>>> 1.3
	        				Ext.getCmp(panelId+'_panel_combo').destroy();
	        				 panel.setWidth(panel.getWidth()-(40+Ext.getCmp(sourceItemId).getWidth()));
	        				Ext.getCmp(sourceItemId).dispose(true);
	        			}
	        			else
	        			{
	        			  panel.setWidth(panel.getWidth()-(Ext.getCmp(sourceItemId).getWidth()));
	          			  Ext.getCmp(sourceItemId).dispose(true);        				
	        			}
	
	        		}
		        	
                }
	        	
	        	//Ext.getCmp(destItemID).destroy();
	        	
<<<<<<< searchBar3.js
	        	//////alert('hi');
	        	 ////////////////////console.log(ddSource.dragData.field.getValue());
	        	//////alert('hi');
=======
	        	////alert('hi');
	        	 //////console.log(ddSource.dragData.field.getValue());
	        	////alert('hi');
>>>>>>> 1.3
	        	

	            // Reference the record (single selection) for readability
	           // var selectedRecord = ddSource.dragData.records[0];

	            // Load the record into the form
	           // formPanel.getForm().loadRecord(selectedRecord);

	            // Delete record from the source store.  not really required.
	            //ddSource.view.store.remove(selectedRecord);

	            //return true;
	        }
	    });
		
		
		
		// in case height has changed (it doesn't work automatically in some cases)
	},
	
	autoSize : function(){
<<<<<<< searchBar3.js
		//////alert('in autosize');
=======
		////alert('in autosize');
>>>>>>> 1.3
		if(!this.iAmRendered){
			return;
		}
		
		if(!this.metrics){
			this.metrics = Ext.create('Ext.util.TextMetrics', this.inputEl);
		}
		var w = Math.max(this.metrics.getWidth(this.inputEl.dom.value + ' ') +  15, 15);
		
		this.inputEl.setWidth(w);
		
		if(Ext.isIE){
			this.inputEl.dom.style.top='0';
		}
	},
	
	/*onEnable: function(){
		this.callParent(arguments);
		this.items.each(function(item) {
			item.enable();
		});
	},

	onDisable: function(){
		this.callParent(arguments);
		this.items.each(function(item) {
			item.disable();
		});
	},*/
	
	/** overrides combobox to align to bodyEl instead of inputel **/
    alignPicker: function() {
        var me = this,
            picker, isAbove,
            aboveSfx = '-above';

        if (this.isExpanded) {
            picker = me.getPicker();
            if (me.matchFieldWidth) {
                // Auto the height (it will be constrained by min and max width) unless there are no records to display.
                picker.setSize(me.bodyEl.getWidth(), picker.store && picker.store.getCount() ? null : 0);
            }
            if (picker.isFloating()) {
                picker.alignTo(me.bodyEl, me.pickerAlign, me.pickerOffset);

                // add the {openCls}-above class if the picker was aligned above
                // the field due to hitting the bottom of the viewport
                isAbove = picker.el.getY() < me.inputEl.getY();
                me.bodyEl[isAbove ? 'addCls' : 'removeCls'](me.openCls + aboveSfx);
                picker.el[isAbove ? 'addCls' : 'removeCls'](picker.baseCls + aboveSfx);
            }
        }
    }
});

Ext.define('Ext.ux.BoxSelect.Item1', {
	extend: 'Ext.Component',
	myDestPanelId:'',
	mySourcePanelId:'',
	comboid:'',
	//constrain: true,
    //floating: true,
    //draggable:true,
    
   
  /*  style: {
        backgroundColor: '#fff',
        border: '1px solid black'
    },*/
   // html: '<h1 style="cursor:move">The title</h1>',
    autoEl: {
		tag: 'li',
		cls: 'item-box'
	},
	
	setComboid:function(id)
	{
		this.comboid=id;
	},
	getComboid:function()
	{
		return comboid;
	},
	initEvents: function() {
		if (!this.disabled) {
			this.enableEvents();
		}
	},
	enableEvents: function() {
		this.mon(this.el, 'mousedown', this.onClick, this);
		this.mon(this.deleteBtn, 'mousedown', this.onDeleteClick, this)	;	
	},
	disableEvents: function() {
		this.mun(this.el, 'mousedown', this.onClick, this);
		this.mun(this.deleteBtn, 'mousedown', this.onDeleteClick, this)	;			
	},
	
	onEnable: function() {
		this.enableEvents();
	},

	onDisable: function() {
		this.disableEvents();
	},	

		onRender: function(ct, position)
		{
<<<<<<< searchBar3.js
		   // //////////////////console.log('in on REnder');
		   // ////alert(this.caption);
=======
		   // ////console.log('in on REnder');
		   // //alert(this.caption);
>>>>>>> 1.3
			Ext.applyIf(this.renderData, {
				caption: this.caption//,
				//v:'hi'
			});
			this.callParent(arguments);
			
			this.addEvents('dispose', 'select');
		
			this.el.addClsOnOver('bit-hover');
			
			this.deleteBtn = this.el.down('div.deletebutton');
		},
		renderTpl: ['{caption}<div class="deletebutton"><!-- --></div>'],
		dispose: function(withoutEffect) {
		       if(withoutEffect)
		       {
		    	  // setDropMapping(this.value.data.v);
		    	   
<<<<<<< searchBar3.js
		    	 //  ////alert('hello');
=======
		    	 //  //alert('hello');
>>>>>>> 1.3
		    	   this.destroy();
			   }
			   else
			   {
<<<<<<< searchBar3.js
					//////alert('hello');
=======
					////alert('hello');
>>>>>>> 1.3
					Ext.getCmp('_keyword').removeRecords.remove(this.value);
					
					/*this.el.hide({
						duration: 300,
						listeners: {
							lastframe: Ext.bind(function(){
								this.destroy();
							}, this)
						}
					});*/
	    			/*else
	    				Ext.getCmp(sourceItemId).dispose(true);
	    			}
					*/
				
				
						var panel=Ext.getCmp(this.id+'_panel');
						if(panel!=null)
						{
							var items_count=panel.items.length;
<<<<<<< searchBar3.js
							// ////alert('items:'+items_count);
=======
							// //alert('items:'+items_count);
>>>>>>> 1.3
			    			if(items_count<=2)
			    			{
			    				//setDropMapping(this.value.data.v);
			    				panel.destroy();
			    			}
			    			else if(items_count==3)
			    			{
<<<<<<< searchBar3.js
			    				//////alert('this.id'+getComboId(this.value.data.v));
			    				//////////////////console.log(Ext.getCmp(getComboId(this.value.data.v)));
			    				Ext.getCmp(getComboId(this.value.data.v)).destroy();
=======
			    				////alert('this.id'+getComboId(this.value.data.key_value));
			    				////console.log(Ext.getCmp(getComboId(this.value.data.key_value)));
			    				Ext.getCmp(getComboId(this.value.data.key_value)).destroy();
>>>>>>> 1.3
			    				 panel.setWidth(panel.getWidth()-(this.getWidth()+40));
<<<<<<< searchBar3.js
			    				//////alert('this must be delete'+getComboId(this.id));
=======
			    				////alert('this must be delete'+getComboId(this.id));
>>>>>>> 1.3
			    				this.destroy();
			    			}
			    			else
			    			{
			    				panel.setWidth(panel.getWidth()-(this.getWidth()));
			    			//	setDropMapping(this.value.data.v);
			    				this.destroy();
			    			}
			    				
						}
						else
						{
					         panel=Ext.getCmp(this.myDestPanelId);
					         var items_count=panel.items.length;
<<<<<<< searchBar3.js
					         //////alert('items222:'+items_count);
=======
					         ////alert('items222:'+items_count);
>>>>>>> 1.3
				    			if(items_count<=2)
				    			{
<<<<<<< searchBar3.js
				    				// ////alert(getPanelId(this.value.data.v));
				    			//	 setDropMapping(this.value.data.v);
=======
				    				// //alert(getPanelId(this.value.data.key_value));
				    			//	 setDropMapping(this.value.data.key_value);
>>>>>>> 1.3
				    				 panel.destroy();
				    			}	
				    			else if(items_count==3)
				    			{
<<<<<<< searchBar3.js
				    				//////alert('this.id'+getComboId(this.value.data.v));
				    				//////////////////console.log(Ext.getCmp(getComboId(this.value.data.v)));
				    				Ext.getCmp(getComboId(this.value.data.v)).destroy();
=======
				    				////alert('this.id'+getComboId(this.value.data.key_value));
				    				////console.log(Ext.getCmp(getComboId(this.value.data.key_value)));
				    				Ext.getCmp(getComboId(this.value.data.key_value)).destroy();
>>>>>>> 1.3
				    				 panel.setWidth(panel.getWidth()-(this.getWidth()+40));
<<<<<<< searchBar3.js
				    				//////alert('this must be delete'+getComboId(this.id));
=======
				    				////alert('this must be delete'+getComboId(this.id));
>>>>>>> 1.3
				    				this.destroy();
				    			}
				    			else
				    			{
				    				 panel.setWidth(panel.getWidth()-(this.getWidth()));
				    				//setDropMapping(this.value.data.v);
				    				this.destroy();
				    			}
							       
						}
					
			        }
         
			//this.fireEvent('dispose', this);		
			return this;
		},
		onDeleteClick : function(e){
			e.stopEvent();
			this.dispose();
		},
		onClick : function(e){
			e.stopEvent();
			//this.select(e.shiftKey);
		},
		select: function(addToSelection) {
			if (!Ext.isDefined(addToSelection)) {
				addToSelection = false;
			}
			this.el.addCls('item-box-selected');
			this.fireEvent('select', this, addToSelection);
		},
		isSelected: function() {
			
			return this.el.hasCls('item-box-selected');
		},
		deselect: function() {
			this.el.removeCls('item-box-selected');
		}//,

   /* draggable: {
        delegate: 'h1'
    }*/

	// to avoid applying opacity twice
	/*
	

*/});


function setDropMapping(str)
{   var arry=[];
    var final_arry=new Array();
    var j=0;
	arry=mapdropDown.split('\n');
	for(i=0;i<arry.length-1;i++)
	{
		if(arry[i].search(str)!=-1)
		{
			
		}
		else
		{
			final_arry[j]=arry[i];
			j++;
		}
			
	}
<<<<<<< searchBar3.js
	////////////////////console.log('between'+final_arry.length);
=======
	//////console.log('between'+final_arry.length);
>>>>>>> 1.3
	var s='';
<<<<<<< searchBar3.js
	//////alert('final_arry.length::'+final_arry.length);
=======
	////alert('final_arry.length::'+final_arry.length);
>>>>>>> 1.3
	for(j=0;j<final_arry.length;j++)
	{
		s+=final_arry[j]+'\n';
	}
	mapdropDown=s;
<<<<<<< searchBar3.js
	//////alert(mapdropDown);
=======
	////alert(mapdropDown);
>>>>>>> 1.3
}

function getPanelId(itemValue)
{
	    var arry=[];
		 arry=mapdropDown.split('\n');
		for(i=0;i<arry.length-1;i++)
		{
			if(arry[i].search(itemValue)!=-1)
			{
				return arry[i].split('::')[1];
			}
		}
		return null;
}
function getComboId(itemId)
{
	var arry=[];
<<<<<<< searchBar3.js
	//////////////////console.log('mapp:'+mapdropDown);
=======
	////console.log('mapp:'+mapdropDown);
>>>>>>> 1.3
	 arry=mapdropDown.split('\n'); 
	 for(i=0;i<arry.length-1;i++)
		{
			if(arry[i].search(itemId)!=-1)
			{
<<<<<<< searchBar3.js
				//////////////////console.log('itemId:'+itemId);
=======
				////console.log('itemId:'+itemId);
>>>>>>> 1.3
				var a=arry[i].split('::')[1];
				var b=a.split('_combo')[0]+'_panel_combo';
				return b;
			}
		}
	 return null;
}
function getItemId(PanelId)
{

}
function dispose(item)
{
	/*this.removeRecords.remove(item.value);
	this.items.remove(item);
<<<<<<< searchBar3.js
     //////////////////console.log(item.id);*/
	 //////////////////console.log(item.id);
=======
     ////console.log(item.id);*/
	 ////console.log(item.id);
>>>>>>> 1.3
	 
	/* if(Ext.getCmp(item.id+'_panel')!=null)
		 Ext.getCmp(item.id+'_panel').destroy();*/
     Ext.getCmp('_keyword').removeRecords.remove(item.value);
     //Ext.getCmp('_keyword').remove(item);
	//Ext.getCmp(item.id).dispose(true);
}


function myDispose(item)
{
<<<<<<< searchBar3.js
	//////////////////console.log('before item');
	//////////////////console.log(item);
=======
	////console.log('before item');
	////console.log(item);
>>>>>>> 1.3
	/*var panel=Ext.getCmp(item.id+'_panel');
	if(panel!=null)
		panel.destroy();*/
}



function myDragZone(v) {
<<<<<<< searchBar3.js
	////////////////////console.log('vv:');
=======
	//////console.log('vv:');
>>>>>>> 1.3
   
     //var draggedPanelId=v.id+'_panel';
	//draggedItemId=v.getEl();
	
    v.dragZone = Ext.create('Ext.dd.DragZone', v.getEl(),{
    	
    	getDragData: function(e) {
    	  
        var sourceEl = e.getTarget(v.itemSelector, 30), d;
<<<<<<< searchBar3.js
        //////////////////console.log(Ext.fly(sourceEl).getXY());
=======
        ////console.log(Ext.fly(sourceEl).getXY());
>>>>>>> 1.3
        var xyAry=new Array();
        xyAry[0]=Ext.fly(sourceEl).getX()+10;
        xyAry[1]=Ext.fly(sourceEl).getY()+10;
        if (sourceEl) {
            d = sourceEl.cloneNode(true);
            d.id = Ext.id();
<<<<<<< searchBar3.js
            //////////////////console.log(sourceEl);
=======
            ////console.log(sourceEl);
>>>>>>> 1.3
            return v.dragData = {
                sourceEl: sourceEl,
                repairXY: xyAry,
                ddel: d//,
                //patientData: v.getRecord(sourceEl).data
            };
        }
    },
    	 getRepairXY: function() {
        return this.dragData.repairXY;
    	}
    });
    
 
    
    
}











function myDropZone(v) {
<<<<<<< searchBar3.js
	////alert('in my drop zone');
=======
	//alert('in my drop zone');
>>>>>>> 1.3
	/*
    var gridView = v,
        grid = gridView.up('gridpanel');

    grid.dropZone = Ext.create('Ext.dd.DropZone', v.el, {

//      If the mouse is over a target node, return that node. This is
//      provided as the "target" parameter in all "onNodeXXXX" node event handling functions
        getTargetFromEvent: function(e) {
            return e.getTarget('.hospital-target');
        },

//      On entry into a target node, highlight that node.
        onNodeEnter : function(target, dd, e, data){
            Ext.fly(target).addCls('hospital-target-hover');
        },

//      On exit from a target node, unhighlight that node.
        onNodeOut : function(target, dd, e, data){
            Ext.fly(target).removeCls('hospital-target-hover');
        },

//      While over a target node, return the default drop allowed class which
//      places a "tick" icon into the drag proxy.
        onNodeOver : function(target, dd, e, data){
            return Ext.dd.DropZone.prototype.dropAllowed;
        },

//      On node drop, we can interrogate the target node to find the underlying
//      application object that is the real target of the dragged data.
//      In this case, it is a Record in the GridPanel's Store.
//      We can use the data set up by the DragZone's getDragData method to read
//      any data we decided to attach.
        onNodeDrop : function(target, dd, e, data){
            var rowBody = Ext.fly(target).findParent('.x-grid-rowbody-tr', null, false),
                mainRow = rowBody.previousSibling,
                h = gridView.getRecord(mainRow),
                targetEl = Ext.get(target);

            targetEl.update(data.patientData.name + ', ' + targetEl.dom.innerHTML);
<<<<<<< searchBar3.js
            Ext.Msg.////alert('Drop gesture', 'Dropped patient ' + data.patientData.name +
=======
            Ext.Msg.//alert('Drop gesture', 'Dropped patient ' + data.patientData.name +
>>>>>>> 1.3
                ' on hospital ' + h.data.name);
            return true;
        }
    });

*/}












function initializeDropTarget(targetPanel) {
<<<<<<< searchBar3.js
	//////alert('hihi');
=======
	////alert('hihi');
>>>>>>> 1.3
  // Create the DropTarget object and assign it to the panel. Does not
  // have to be assigned to the panel but needs to be assigned to something,
  // or it will get garbage-collected too soon.
  targetPanel.dropTarget = Ext.create('Ext.dd.DropTarget', targetPanel.el);

  // Called once, when dragged item is dropped in the target area. Return false
  // to indicate an invalid drop. DO NOT MODIFY the UI in 
  // this function. Use afterDragDrop and the data object.
  targetPanel.dropTarget.notifyDrop = function(source, evt, data) {
	  
<<<<<<< searchBar3.js
	  //////////////////console.log('in notifydrop');
=======
	  ////console.log('in notifydrop');
>>>>>>> 1.3
	  /*
    if(typeof console != "undefined")
<<<<<<< searchBar3.js
      //////////////////console.log("notifyDrop:" + source.id);
=======
      ////console.log("notifyDrop:" + source.id);
>>>>>>> 1.3

    // The component that was dropped.
    var droppedPanel = Ext.getCmp(source.id);

    // We can't modify the component that was dropped in this
    // function. However, we can add an event handler on the component
    // that will be called shortly. 
    //
    // In the handler we clone the component (not strictly necessary, we could
    // do that here) and then remove our old component.  
    droppedPanel.dd.afterValidDrop = function() {
      targetPanel.add(droppedPanel.cloneConfig({
        draggable: false,
        title: "Can't Drag This Panel."//,
        	
        
      }));

      droppedPanel.destroy();
    };

    return true;
  */};

  // Called once, when dragged item enters drop area.
  targetPanel.dropTarget.notifyEnter = function(source, evt, data) {
<<<<<<< searchBar3.js
	  //////////////////console.log('in notifyEnter');
=======
	  ////console.log('in notifyEnter');
>>>>>>> 1.3
	  /*
    if(typeof console != "undefined")
<<<<<<< searchBar3.js
      //////////////////console.log("notifyEnter:" + source.id);
=======
      ////console.log("notifyEnter:" + source.id);
>>>>>>> 1.3

    return this.callParent(Array.prototype.slice.call(arguments));
  */};

  // Called once, when dragged item leaves drop area.
  targetPanel.dropTarget.notifyOut = function(source, evt, data) {
<<<<<<< searchBar3.js
	  //////////////////console.log('in notifyout');
=======
	  ////console.log('in notifyout');
>>>>>>> 1.3
	  /*
    if(typeof console != "undefined")
<<<<<<< searchBar3.js
      //////////////////console.log("notifyOut:" + source.id);
=======
      ////console.log("notifyOut:" + source.id);
>>>>>>> 1.3

    return this.callParent(Array.prototype.slice.call(arguments));
  */};

  // Called for each mouse movement as dragged item is over the drop area.
  targetPanel.dropTarget.notifyOver = function(source, evt, data) {
<<<<<<< searchBar3.js
	  //////////////////console.log('in notifyover');
=======
	  ////console.log('in notifyover');
>>>>>>> 1.3
	  /*
    if(typeof console != "undefined")
<<<<<<< searchBar3.js
      //////////////////console.log("notifyOver:" + source.id);
=======
      ////console.log("notifyOver:" + source.id);
>>>>>>> 1.3

    return this.callParent(Array.prototype.slice.call(arguments));
  */};

}