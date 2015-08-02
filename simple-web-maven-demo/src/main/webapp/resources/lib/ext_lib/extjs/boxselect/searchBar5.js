/**
 * @class Ext.ux.form.field.BoxSelect
 * @extends Ext.form.field.ComboBox
 * 
 * BoxSelect for ExtJS 4, an extension of ComboBox that allows selecting and editing multiple values
 * displayed as labelled boxes within the field, as seen on facebook, hotmail and other sites.
 * The component started off as a port of BoxSelect for Ext 2 
 * (http://www.sencha.com/forum/showthread.php?134751-Ext.ux.form.field.BoxSelect), but eventually turned
 * into a complete rewrite adding better support for queryMode: 'remote' and 
 * better keyboard navigation and selection of values
 * @author vishal zanzrukia
 * @requires BoxSelect.css
 * @xtype boxselect
 * 
 * this is searchBar3 + searchBar4
 */
Ext.require(['*']);

Ext.define('Ext.ux.PanelFieldDragZone', {
//▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾▾
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
    	
    	/*////////////////////console.log(e);
    	return {
            field: e,
            ddel: d
        };
    	
    	//////alert(e);*/
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
var mapMeasItem='';
var mapItemIdComboId='';
var allSearchBarParentPanelsId='';
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
	//	alert('in to EVENT');
		//alert('hello...11233');
		//Ext.msg.alert('hhh');
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
			//////////////////////console.log('dummy store size     '+this.dummystore.length);
		/*	if(this.dummystore.length === 0)
			{
				this.store.load();
				this.queryMode='local';
				i=0;
				//////////////////////console.log('hi before load');
				this.store.each(function(rec)
						{
							this.dummystore.add((rec.data[this.valueField]),rec);
							this.selectedRecords1.add((rec.data[this.valueField]),rec);
							i++;
						}, this);
				this.store.removeAll();
				this.selectedRecords.clear();
				//////////////////////console.log('hiiiiiiiiiii'+i);
				this.recAdded=true;
				this.recSelected=false;
				this.eventcalled=false;
				//////////////////////console.log('dummy store size     '+this.dummystore.length);
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
		
		//////////////////////console.log('dummy store size     '+this.dummystore.length);
		if(this.dummystore.length === 0)
		{
			//keep below line out of comment or keep autoload:false of this store..!! by v.j.
			this.store.load();
			
			
			//this.queryMode='local';
			i=0;
			//////////////////////console.log('hi before load');
			this.store.each(function(rec)
					{
						this.dummystore.add((rec.data[this.valueField]),rec);
						this.selectedRecords1.add((rec.data[this.valueField]),rec);
						i++;
					}, this);
			this.store.removeAll();
			this.selectedRecords.clear();
			//////////////////////console.log('hiiiiiiiiiii'+i);
			this.recAdded=true;
			this.recSelected=false;
			this.eventcalled=false;
			//////////////////////console.log('dummy store size     '+this.dummystore.length);
		}
		else
		{
			//this.queryMode='local';
			this.recAdded=false;
			this.recSelected=false;
		}
		
	},
	
	resetAll:function()
	{
		this.removeRecords.clear();
		this.setValue(' ');
		this.getRawValue();
		return ;
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
			//////////////////////console.log('dummy store size     '+this.dummystore.length);
			if(this.dummystore.length === 0)
			{
				this.store.load();
				this.queryMode='local';
				i=0;
				//////////////////////console.log('hi before load');
				this.store.each(function(rec)
						{
							this.dummystore.add((rec.data[this.valueField]),rec);
							this.selectedRecords1.add((rec.data[this.valueField]),rec);
							i++;
						}, this);
				this.store.removeAll();
				this.selectedRecords.clear();
				//////////////////////console.log('hiiiiiiiiiii'+i);
				this.recAdded=true;
				this.recSelected=false;
				this.eventcalled=false;
				//////////////////////console.log('dummy store size     '+this.dummystore.length);
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
				
				//////////////////////console.log('called');
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
				////////////////////////console.log('called');
				if(this.getCursorPosition()>0)
				{
					
						this.called=true;
						this.popUpRecords();
						
						////////////////////////console.log('called:    '+this.i);
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
		
		if(e.getKey()==13)
		{
			////////alert('hello');
			var keys=Ext.getCmp('_keyword').getValue();
			////////alert(keys);
		    if(keys=='')
		    {
		    
		    }
		    else
		    {
		    	/*var isDateValid=Ext.getCmp('datePicker_searchBar_id').wasValid;
     			////alert(Ext.getCmp('datePicker_searchBar_id').getValue());
     			if(Ext.getCmp('datePicker_searchBar_id').getValue()==null||isDateValid)
     			{*/
     				if(Ext.getCmp('recordGrid_id').isHidden())
			    		Ext.get('searchBar_region_id').mask('Loading...');
			    	getAllMappingString();
			    	newQueryFlag=true;
			    	reportSpamButtonCheck="false";
			    	recordStore.proxy.extraParams.measValues=measMapString;
			    	recordStore.proxy.extraParams.keyWords=allKeywordString;
			    	recordStore.proxy.extraParams.groupingValues=grouppingString;
			    	recordStore.proxy.extraParams.conjuctionValues=dropValueString;
			    	recordStore.proxy.extraParams.callfrom='fromSearchButton';
			    	recordStore.proxy.extraParams.date=null;
			    	//recordStore.proxy.extraParams.date=Ext.getCmp('datePicker_searchBar_id').getValue();
			    	recordStore.loadPage(1);
			    	if(!advancedSearchWindow.isHidden())
			    	{
			    		advancedSearchWindow.close();
			    	}
     				//////alert(date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear());	
     			/*}
     			else
     			{
     				TINY.box.show({html:'Please enter valid date..!',animate:false,close:false,mask:false,boxid:'success',autohide:1,top:33,left:590,width:200,height:40});
     			}*/
		    }
		}
		
		////////alert('e.getKey() down::'+e.getKey());
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
			//////////////////////////console.log('hiiiiiiiiiiiiiiiiiiiiiiiiii'+this.items.getCount());
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
		////////alert('e.getKey() press::'+e.getKey());
		this.recAdded=false;
		this.recSelected=false;
		//this.queryMode='local';
		
		
		if(!this.multiSelect && e.getKey() != '13')
		{
			//////////////////////console.log('hiiii multi false'+e.getKey());
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
	popUpRecords:function()
	{
		this.store.removeAll();
		this.selectedRecords.clear();
		var i=0;
		
		//added by v. j.
		/*var firstChar=this.inputEl.dom.value.substring(0,1);
		var withoutFirstChar=this.inputEl.dom.value.substring(1,this.inputEl.dom.value.length);
		////////alert(firstChar+withoutFirstChar+'::and::'+firstChar.charCodeAt(0));
		var firstAscii=firstChar.charCodeAt(0);
		var searchKey;
		if(firstAscii>=97 && firstAscii<=122)
		{
			////////alert('hello');
			////////alert(firstChar.fromCharCode(firstAscii-32)+withoutFirstChar);String.fromCharCode(firstAscii);
			//this.inputEl.dom.value=String.fromCharCode(firstAscii-32)+withoutFirstChar;
			searchKey=String.fromCharCode(firstAscii-32)+withoutFirstChar;
			////////alert(this.inputEl.dom.value);
			////////alert(firstChar.fromCharCode(firstChar.charCodeAt(0)-32)+withoutFirstChar);
		}*/
		if((this.inputEl.dom.value.length) === 1)
		{
			return;
		}
		
		////////alert('this.prevVal :'+this.prevVal );
		if((this.inputEl.dom.value.substring(0,2)) != this.prevVal || (this.inputEl.dom.value.length) < (this.prevLen))
		{
			this.reloadRec();
			this.prevVal=(this.inputEl.dom.value.substring(0,2));
		}
		this.prevLen = this.inputEl.dom.value.length;
		this.selectedRecords1.each(function(rec)
		{
			this.i=this.i + 1;
			if(/*rec.get(this.valueField).substring(0,this.getCursorPosition()) === this.inputEl.dom.value||*/rec.get(this.valueField).substring(0,this.getCursorPosition()).toLowerCase()===this.inputEl.dom.value.toLowerCase())
			//if(rec.get(this.valueField).substring(0,this.getCursorPosition()).toLowerCase().indexOf(this.inputEl.dom.value.toLowerCase())!=-1)
			{
				//hello comment these 2 "if" for add same keyword in boundlist
				if(!(this.removeRecords.containsKey(rec.get(this.valueField))))
				{
					if(!(this.selectedRecords.containsKey(rec.get(this.valueField))))
					{
						i=i+1;
						////////alert('this.valueField:'+this.valueField);
						this.selectedRecords.add((rec.data[this.valueField]),rec);
						
						if(i<10)
							this.store.add(rec);
						//////////////////////////console.log('called'+this.i);
					}
				}
			}
			else
			{
				this.selectedRecords1.remove(rec);
				//////////////////////////console.log('removed'+this.i);
			}
		}, this);
	},
	onKeyUp: function(e) {
		////////alert('e.getKey() key UP::'+e.getKey());
		if (!Ext.isDefined(this.stopKeyUpEvent) || this.stopKeyUpEvent === false) {
			this.callParent(arguments);	
		}
		this.stopKeyUpEvent = false;
		/*if(e.getKey() === e.BACKSPACE )
		{
			this.callParent(arguments);
		}*/
		if(e.getKey() === e.BACKSPACE || e.getKey() === e.DELETE )
		{
			//this.resetStore();
		}
		if(e.getKey() === e.BACKSPACE )
		{
			this.popUpRecords();
			
			/*this.called=true;
			this.store.removeAll();
			this.selectedRecords.clear();
			var i=0;
			if((this.inputEl.dom.value.length) === 1)
			{
				return;
			}
			
			////////alert('this.prevVal :'+this.prevVal );
			if((this.inputEl.dom.value.substring(0,2)) != this.prevVal || (this.inputEl.dom.value.length) < (this.prevLen))
			{
				this.reloadRec();
				this.prevVal=(this.inputEl.dom.value.substring(0,2));
			}
			this.prevLen = this.inputEl.dom.value.length;
			this.selectedRecords1.each(function(rec)
			{
				this.i=this.i + 1;
				if(rec.get(this.valueField).substring(0,this.getCursorPosition()).toLowerCase()===this.inputEl.dom.value.toLowerCase())
				{
					//hello comment these 2 "if" for add same keyword in boundlist
					if(!(this.removeRecords.containsKey(rec.get(this.valueField))))
					{
						if(!(this.selectedRecords.containsKey(rec.get(this.valueField))))
						{
							i=i+1;
							////////alert('this.valueField:'+this.valueField);
							this.selectedRecords.add((rec.data[this.valueField]),rec);
							
							if(i<10)
								this.store.add(rec);
							//////////////////////////console.log('called'+this.i);
						}
					}
				}
				else
				{
					this.selectedRecords1.remove(rec);
				}
			}, this);*/
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
			
			//hello comment this "if" for add same keyword in boundlist
			if (!this.removeRecords.containsKey(value)) {

			  // ////////////////////console.log("hi"+this.valueField+" "+value);
				//var record = this.store.findRecord(this.valueField, value);

			  // ////////////////////console.log("hi"+this.valueField+" "+value);
				//var record = this.store.findRecord(this.valueField, value);
				
				
				
				
				var record = this.ezDIfindRecord(value);
				//////////////////console.log(' '+record);

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
				//////////////////////////console.log('record added');
				this.removeRecords.add(value, record);
				//////////////////////////console.log('value'+value+'record'+record);
				this.store.remove(record);
				if(typeof this.displayFieldTpl === 'string')
					this.displayFieldTpl = new Ext.XTemplate(this.displayFieldTpl);
			
				////////alert('dis:'+record.get(this.displayField));
				var caption;
				//edited by vj
				var displayFiled=this.displayField;
				if(Ext.isDefined(this.displayFieldTpl))
					caption = this.displayFieldTpl.apply(record.data);
				else if(Ext.isDefined(this.displayField))
				{
					caption = value;
				}	
					
				////////alert(record);
				this.addItem(record, value,displayFiled);
			}		
		}, this);
		
	},	
	
	

	ezDIfindRecord :function(value)
	{
		var re=null;
		this.store.each(function(rec)
		{
			//////////////////console.log(rec.data.key);
			if( rec.data.key === value)
			{
				re=rec;
				return re;
			}
		},this);
		return re;
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
		////////////////////////console.log(value+ val1 + '       value');
		if(value === val1)
		{
			return '';
			////////////////////////console.log('hii in reset');
		}
		 ////////////////////////console.log('value to raw');
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
				if (start <= this.items.indexOf(otherItem) && this.items.indexOf(otherItem) <=end) {		
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
			     // ////////////////////console.log(item);
			      var panel=Ext.getCmp(item.id+'_panel');
			  	  if(panel!=null)
			  		panel.destroy();
		          },*/
				//'select': this.onItemSelected,
				 //scope: this
			}
		});
		////////alert('before render:'+item.id);
		//item.render(this.frame, this.frame.dom.childNodes.length-1);
		////////alert('before add:'+item.id);
		//
		//this.items.add(item.id, item);
		//added by vj
		////////alert('width:'+this.frame.dom.childNodes.length);
		
		
		var keys=Ext.getCmp('_keyword').getValue();
	    if(keys=='')
	    {
	    	if(!Ext.getCmp('reset_save_panel_id').isHidden())
    		{
	    		Ext.getCmp('reset_save_panel_id').setVisible(false);
		    	Ext.getCmp('_keyword').setWidth(Ext.getCmp('_keyword').getWidth()+45);
    		}
	    }
	    else
	    {
	    	if(Ext.getCmp('reset_save_panel_id').isHidden())
    		{
	    		Ext.getCmp('reset_save_panel_id').setVisible(true);
		    	Ext.getCmp('_keyword').setWidth(Ext.getCmp('_keyword').getWidth()-45);	    		
    		}
	    }
		
		
		//  
		allSearchBarParentPanelsId+=item.id+'_panel:::::';
		var formPanel = Ext.create('Ext.Panel', {
			id: item.id+'_panel',
			autoEl: {
				tag: 'li'//,
		  },
			//plugins: Ext.create('Ext.ux.PanelFieldDragZone'),
	        //region     : 'center',
	       // title      : 'Generic Form Panel',
			 //bodyStyle  : 'padding:0px,background-color: #DFE8F6,width:auto',
			
		   bodyStyle  : 'padding:0px 0px 0px 0px;background-color:#DEE7F8;vertical-align:middle;',//#DFE8F6; border-color: #000;//background-color:#DEE7F8;
	       defaults:{margin:'0'},
	      //  autoHeight: true,
	       // autoWidth: true,
	       // labelWidth : 100,
			//border:false,
			//height:18,
			autoScroll:true,
			layout:{type:'hbox',pack:'start',align:'middle'},
			listeners:{
				onrender:function()
				{
						//this.callParent(arguments);		
					
		
				      
				        				
						
				
				  /*this.frame = this.inputEl.wrap({
			            tag : 'li'//,
			            //cls: 'boxselect x-form-text'
			        });*/
			        				
					/*if (this.stacked) {
						this.frame.addCls('stacked');
					}
								
					this.inputEl.wrap({
						tag: 'li'
					});*/
				},
				afterRender:function(  container,  layout,  opts )
				{
					////////alert('hi');
				     // ////////////////////console.log(opts);
				      //layout.innerCt.doLayout();
				    //  ////////////////////console.log(layout);
				     // ////////////////////console.log(container);
				     
						
				}
			},
	       // width      : 200,
	      
	       // height:65,
	        //margins    : '0 0 0 0',
	        items      : [item]
	        
	    });
		  
		//var formPanelDropTargetEl1 =  item.dom;
		 // var formPanelDropTargetEl =  formPanel.body.dom;
		////////alert('hi'+panel.title);
		//formPanel.doAutoRender();
		formPanel.render(this.frame, this.frame.dom.childNodes.length-1);
		//this.items.add(formPanel.id, formPanel);
		//this.ownerCt.doLayout();
		//end by vj
		
		//this.items.add(item.id, item);
		
		this.ownerCt.doLayout(); 
		////////alert(item.getHeight());
		//formPanel.setWidth('auto');
		formPanel.setWidth(item.getWidth());
		//formPanel.setHeight(item.getHeight());
	//	var panelDropTargetEl =  panel.body.dom;
		
		
		
	    var formPanelDropTargetEl =  formPanel.body.dom;

	    var formPanelDropTarget = Ext.create('Ext.dd.DropTarget', formPanelDropTargetEl, {
	      //  ddGroup: 'GridExample',
	        notifyEnter: function(ddSource, e, data) {
	    
	    	////////alert(ddSource);
	    	
	    	////////alert('hi');
	    	
	            //Add some flare to invite drop.
	          //  formPanel.body.stopAnimation();
	           // formPanel.body.highlight();
	        },
	        notifyDrop  : function(ddSource, e, data){
	        	
	        //	////////////////////console.log(formPanel.id);
	        //	////////////////////console.log(ddSource.el.id);
	        	
	        	var destPanelId=formPanel.id;
	        	var destItemID=destPanelId.slice(0,destPanelId.length-6);
	        	var sourceItemId=data.sourceEl.id;//ddSource.el.id
	        	if(sourceItemId.indexOf('label')!=-1)
	        	{
	        		sourceItemId=sourceItemId.slice(0,sourceItemId.length-6);
	        	}
	        	var sourcePanelId=sourceItemId+'_panel';
	        	var sourceItem=Ext.getCmp(sourceItemId);
	        	var destPanel=Ext.getCmp(destPanelId);
	        	//////////////////////console.log(ddSource);
	        	//////////////////////console.log(e);
	        	//////////////////////console.log(data);
	        	//////////////////////console.log('id'+data.sourceEl.id);
	        	//////////////////////console.log(data.sourceEl.textContent);
	        	var source_key_text=data.sourceEl.textContent;
	        	//var dest_key_text=Ext.getCmp(destItemID).value.get('key');
	        	//////////////////////console.log('width:'+sourceItem.getWidth());
	        	//////////////////////console.log('before value'+sourceItemId);
	        	//////////////////////console.log();
	        	//////////////////////console.log('before item value');
	        	//////////////////////console.log(Ext.getCmp(sourceItemId).value.get('key'));
	        	//Ext.getCmp(destPanelId).insert(1,Ext.get(sourceItemId));
	        	
	        	
	        	
	        	
	        	
	        	//////////////////////console.log('destItemID'+destItemID);
	        	//sourceItemId.
	        	////////////////////console.log('source:'+sourcePanelId);
	        	////////////////////console.log('dest:'+destPanelId);
	        	if(sourcePanelId!=destPanelId)
	        	{
	        		
	        		var p=Ext.getCmp(destPanelId);
	        		var combo_flag=false;
	        		for(i=0;i<p.items.length;i++)
	        		{
	        			//////////////////////console.log(p.items.items[i].xtype);
	        			if(p.items.items[i].xtype=='panel')
	        			{
	        		      combo_flag=true;		
	        			}
	        		}
	        		if(p.items.length==1)
	        		{
	        			try
	        			{
	        				//setDropMapping(Ext.getCmp(destItemID).value.data.v);
	        				setDropMapping(Ext.getCmp(destItemID).value.data.key);
		        			//mapdropDown+=Ext.getCmp(destItemID).value.data.v+"#"+destPanelId+'_combo'+"\n";
	        				mapdropDown+=Ext.getCmp(destItemID).value.data.key+"#"+destPanelId+'_combo'+"\n";
		        			mapItemIdComboId+=destItemID+'#'+destPanelId+'_combo'+'\n';
	        				
	        			}
	        			catch(e)
	        			{
	        				////////alert(getDestItemId(mapdropDown));
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
	        			
	        			////////alert('destPanel.getWidth():'+destPanel.getWidth());
	        			destPanel.setWidth(destPanel.getWidth()+43);
	        			destPanel.insert(0, new Ext.Panel({
		    		    	width:43,
		    		        height:18,
		    		    	id:destPanelId+'_panel_combo',
		    		    	bodyStyle:{"padding":"0px 0px 1px 0px","vertical-align": "middle"},
		    		    	defaults:{margin:'-2 0 0 0'},
		    		    	border:false,
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
		    		    	            return '<div style="font-size:12px;">{name}</div>';
		    		    	        }
		    		    	    },
		    		    		value:'OR',
		    		    		width:45,
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
	        		
	        		var newPanelWidth=0;
	        		destPanel.insert(1,Ext.create('Ext.ux.BoxSelect.Item1', {
		    			id: Ext.id(null, 'boxitem-item'),
		    			caption:/*dest_key_text+'<b>and</b>'+*/source_key_text,
		    			value:Ext.getCmp(sourceItemId).value,
		    			disabled: this.disabled,	
		    			listeners: {
		    			    render: myDragZone,
		    			    dispose:dispose,
		    			    beforerender:function( item,eOpts)
		    			    {
	        			
		        			 if(this.value.data.v.indexOf("1")!=-1||this.value.data.v.indexOf("1")!=-1)
		    		         {
		        				 newPanelWidth+=55;
		    		         }
	        			     if(!this.metrics){
	      		 			     this.metrics = Ext.create('Ext.util.TextMetrics', this);
	      		 		      }
	      		             var labelWidth= (this.metrics.getWidth(this.caption)+25);
	      		             this.setWidth(labelWidth);
	      		             newPanelWidth+=item.width;
	        				 this.myDestPanelId=destPanelId;
	        				 this.mySourcePanelId=sourcePanelId;
	        				 this.comboid=destPanelId+'_combo';
	        				//this.setWidth(10+(source_key_text.length*11));
	        				////////alert(destPanel.getWidth()+item.getWidth()+(source_key_text.length*11));
	        			//	destPanel.setWidth(50);
	        				////////alert('itemWidth:'+item.getWidth()+'#destPanel.getWidth():'+destPanel.getWidth());
	        			//	destPanel.setWidth(destPanel.getWidth()+item.getWidth());
	        			//	destPanel.setHeight(300);
	        			//	//////alert('hi');
	        				// destPanel.setWidth(destPanel.getWidth()+item.getWidth()+(source_key_text.length*11)+60);
	        				//destPanel.setWidth(0);
	        				////////alert('hi');
	        				//setDropMapping(Ext.getCmp(sourceItemId).value.data.v);
	        				setDropMapping(Ext.getCmp(sourceItemId).value.data.key);
	        				//mapdropDown+=Ext.getCmp(sourceItemId).value.data.v+"#"+destPanelId+'_combo'+"\n";
	        				mapdropDown+=Ext.getCmp(sourceItemId).value.data.key+"#"+destPanelId+'_combo'+"\n";
	        				mapItemIdComboId+=sourceItemId+'#'+destPanelId+'_combo'+'\n';
	        				
	        				
	        				//setDropMapping(Ext.getCmp(sourceItemId).value.data.v+'#'+destPanelId+'_combo'+'\n');
	        				////////alert(Ext.getCmp(sourceItemId).value.data.v);
	        				//////////////////////console.log(mapdropDown);
	        				////////////////////////console.log(item.id);
		    			    }//,//
		    			   // 'dispose': this.dispose,
		    				//'select': this.onItemSelected,
		    				 //scope: this
		    			}
	        		
		    		}));
	        		destPanel.setWidth(destPanel.getWidth()+newPanelWidth);
	        		//mapdropDown+=Ext.getCmp(sourceItemId).value.data.v+"#"+destPanelId+'_combo'+"\n";
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
	        			////////alert('hi');
	        			var items_count=spanel.items.length;
	        			if(items_count<=2)
	        			{
	        				spanel.destroy();	        				
	        			}
	        			else if(items_count==3)
	        			{
	        				////////alert("deleted");_panel_combo
	        				////////alert(sourcePanelId+'_panel_combo');
	        				Ext.getCmp(sourcePanelId+'_panel_combo').destroy();
	        				 spanel.setWidth(spanel.getWidth()-(43+Ext.getCmp(sourceItemId).getWidth()));
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
	        				////////alert(panelId+'_panel_combo');
	        				Ext.getCmp(panelId+'_panel_combo').destroy();
	        				panel.setWidth(panel.getWidth()-(43+Ext.getCmp(sourceItemId).getWidth()));
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
	        	
	        	////////alert('hi');
	        	 //////////////////////console.log(ddSource.dragData.field.getValue());
	        	////////alert('hi');
	        	

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
		
		////////alert('in autosize');
		if(!this.iAmRendered){
			return;
		}
		
		if(!this.metrics){
			this.metrics = Ext.create('Ext.util.TextMetrics', this.inputEl);
		}
		//////////////////////console.log('tottal height:'+this.metrics.getHeight());
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
	extend: 'Ext.container.Container',
	myDestPanelId:'',
	mySourcePanelId:'',
	comboid:'',
	layout:{type:'hbox',pack:'start',align:'top'},
	//padding:'5 0 0 0',
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
	listeners:{

		afterrender:function()
		{
		        var keyText=this.caption;
		        var thisId=this.id;
		       // //////alert(keyText);
		        this.setHeight(this.getHeight()+20);
		        // this.setWidth(10+(keyText.length*10));
		         if(!this.metrics){
		 			this.metrics = Ext.create('Ext.util.TextMetrics', this);
		 		}
		         var labelWidth= (this.metrics.getWidth(keyText)+25);
		         this.setWidth(labelWidth);
		       // this.setWidth('auto');
		        if(this.value.data.v.indexOf("1")!=-1||this.value.data.v.indexOf("1")!=-1)
		        {
		        	//var keyValue=this.value.data.v;
		        	var keyValue=this.value.data.key;
		        	var textValues=getTextValues(keyValue);
		        	var meas1Value='';
		        	var meas2Value='';
		        	if(textValues!=null)
		        	{
		        		meas1Value=textValues[0];
		        		meas2Value=textValues[1];
		        	}
		        	mapMeasItem+=thisId+'#'+thisId+'_meas1'+'#'+thisId+'_meas2'+'\n';
		        	this.setWidth(this.getWidth()+58);
		        	 this.add(new Ext.form.Label({
		        		    id:thisId+'_label',
		        		    style:{"cursor":"move"},
			        		text:keyText,
		        		   // html:'<font style="cursor:move;display:inline;">'+keyText+'</font>',
			        		padding:'2 5 0 0'//,
			        		//style:{'cursor':'move'}
			        		//id:th
			        	}));
		        	 
		        	//this.setWidth(this.getWidth()+70);
		        	////////alert(this.getHeight());
		        	//this.setHeight(this.getHeight()+20);
		        	
		        	 /*xtype: 'numberfield',
		             itemId: 'inputItem',
		             name: 'inputItem',
		             cls: Ext.baseCSSPrefix + 'tbar-page-number',
		             allowDecimals: false,
		             minValue: 1,
		             hideTrigger: true,
		             enableKeyEvents: true,
		             selectOnFocus: true,
		             submitValue: false,
		             width: me.inputItemWidth,*/
		        	 
		        	 
		        	 this.add(new Ext.form.NumberField({
							id:thisId+'_meas1',
				             cls: Ext.baseCSSPrefix + 'tbar-page-number',
				             allowDecimals: true,
				             allowBlank:false,
				             //minValue: 1,
				             //maxValue: 99,
				             hideTrigger: true,
				             enableKeyEvents: true,
				             selectOnFocus: true,
				             submitValue: false,
							value:meas1Value,
							width:25,
							height:18,
						//	padding:'0 10 0 0',
							listeners:
							{
				        		render:function()
				        		{
				        	    	this.focus(true,400);
				        			this.getEl().on('mousedown', function(e, t, eOpts) {Ext.getCmp(thisId+'_meas1').focus(true,400);}); 
				        			
				        		}
			        	    }
							
						}));
		        	 
		        	 this.add(new Ext.form.NumberField({
							id:thisId+'_meas2',
							 cls: Ext.baseCSSPrefix + 'tbar-page-number',
				             allowDecimals: true,
				             allowBlank:false,
				             //minValue: 2,
				             //maxValue: 100,
				             hideTrigger: true,
				             enableKeyEvents: true,
				             selectOnFocus: true,
				             submitValue: false,
							width:25,
							height:18,
							value:meas2Value,
							padding:'0 0 0 3',
							listeners:
							{
				        		render:function()
				        		{
				        	    	//this.focus(true,400);
				        			this.getEl().on('mousedown', function(e, t, eOpts) {Ext.getCmp(thisId+'_meas2').focus(true,400);}); 
				        		}
			        	    }
						}));
		             
		        	/*this.add(new Ext.form.TextField({
						id:thisId+'_meas1',
						value:meas1Value,
						width:25,
						height:18,
					//	padding:'0 10 0 0',
						listeners:
						{
			        		render:function()
			        		{
			        	    	this.focus(true,400);
			        			this.getEl().on('mousedown', function(e, t, eOpts) {Ext.getCmp(thisId+'_meas1').focus(true,400);}); 
			        			
			        		}
		        	    }
						
					}));*/
		        	/*this.add(new Ext.form.TextField({
						id:thisId+'_meas2',
						width:25,
						height:18,
						value:meas2Value,
						padding:'0 0 0 3',
						listeners:
						{
			        		render:function()
			        		{
			        	    	//this.focus(true,400);
			        			this.getEl().on('mousedown', function(e, t, eOpts) {Ext.getCmp(thisId+'_meas2').focus(true,400);}); 
			        		}
		        	    }
					}));*/
		        	 
		        	 
		        	 
		        	 
		        	/*this.add(new Ext.form.NumberField({
						id:this.id+'_meas1',
						width:35
					}));*/
		        	//Ext.fly('someElId').setStyle('cursor', 'pointer');
		        /*	this.add(new Ext.form.NumberField({
						id:this.id+'_meas2',
						width:35,
						 autoEl: {
							//tag: 'li',
							//cls: 'item-box'
		        	      }
					}));*/
		        }
		        else
		        {
		        	 this.add(new Ext.form.Label({
		        		    id:thisId+'_label',
		        		    text:keyText,
		        		    style:{"cursor":"move"},
			        		//html:'<font style="cursor:move;">'+keyText+'</font>',
			        		padding:'3 0 0 0'//,
			        		//style:{'cursor':'move'}
			        		//id:th
			        	}));
		        }
				
				////////alert('added'+this.id);
		},
		added:function(component,container,pos,eOpts )
		{
			////////alert('added'+this.id);
			//////////////////////console.log(component);
		}
	
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
		   //////////////////////console.log('in on REnder');
		   ////////alert(this.caption);
			Ext.applyIf(this.renderData, {
				caption: this.caption//,
				//v:'hi'
			});
			this.callParent(arguments);
			
			this.addEvents('dispose', 'select');
		
			this.el.addClsOnOver('bit-hover');
			
			this.deleteBtn = this.el.down('div.deletebutton');
		},
		renderTpl: ['<div class="deletebutton"><!-- --></div>'],
		//renderTpl: ['{caption}<div class="deletebutton"><!-- --></div>'],
		dispose: function(withoutEffect) {
		       if(withoutEffect)
		       {
		    	  // setDropMapping(this.value.data.v);
		    	   
		    	 //  //////alert('hello');
		    	   this.destroy();
			   }
			   else
			   {
					////////alert('hello');
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
							// //////alert('items:'+items_count);
			    			if(items_count<=2)
			    			{
			    				//setDropMapping(this.value.data.v);
			    				panel.destroy();
			    			}
			    			else if(items_count==3)
			    			{
			    				////////alert('this.id'+getComboId(this.value.data.v));
			    				//////////////////////console.log(Ext.getCmp(getComboId(this.value.data.v)));
			    				//Ext.getCmp(getComboId(this.value.data.v)).destroy();
			    				////////alert(getComboId(this.value.data.key));
			    				Ext.getCmp(getComboId(this.value.data.key)).destroy();
			    				 panel.setWidth(panel.getWidth()-(this.getWidth()+43));
			    				////////alert('this must be delete'+getComboId(this.id));
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
					         ////////alert('items222:'+items_count);
				    			if(items_count<=2)
				    			{
				    				// //////alert(getPanelId(this.value.data.v));
				    			//	 setDropMapping(this.value.data.v);
				    				 panel.destroy();
				    			}	
				    			else if(items_count==3)
				    			{
				    				////////alert('this.id'+getComboId(this.value.data.v));
				    				//////////////////////console.log(Ext.getCmp(getComboId(this.value.data.v)));
				    				//Ext.getCmp(getComboId(this.value.data.v)).destroy();
				    				////////alert(getComboId(this.value.data.key));
				    				Ext.getCmp(getComboId(this.value.data.key)).destroy();
				    				 panel.setWidth(panel.getWidth()-(this.getWidth()+43));
				    				////////alert('this must be delete'+getComboId(this.id));
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
			var keys=Ext.getCmp('_keyword').getValue();
		    if(keys=='')
		    {
		    	if(!Ext.getCmp('reset_save_panel_id').isHidden())
	    		{
		    		Ext.getCmp('reset_save_panel_id').setVisible(false);
			    	Ext.getCmp('_keyword').setWidth(Ext.getCmp('_keyword').getWidth()+45);
	    		}
		    }
		    else
		    {
		    	if(Ext.getCmp('reset_save_panel_id').isHidden())
	    		{
		    		Ext.getCmp('reset_save_panel_id').setVisible(true);
			    	Ext.getCmp('_keyword').setWidth(Ext.getCmp('_keyword').getWidth()-45);	    		
	    		}
		    }
		    
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


function onSearchButtonClickFun()
{
	

}


function getTextValues(keyValue)
{
	 var mapMeasItemArray=mapMeasItem.split('\n');
	 var textValues=new Array();
	    for(i=0;i<mapMeasItemArray.length-1;i++)
	    {
	    	var a=mapMeasItemArray[i].split('#');
	    	var itemId=a[0];
	    	try
	    	{
	    		var item=Ext.getCmp(itemId);
	    	//	var itemValue=item.value.data.v;
	    		var itemValue=item.value.data.key;
	    		if(itemValue==keyValue)
	    		{
	    			var meas1=Ext.getCmp(a[1]).getValue();
		    		var meas2=Ext.getCmp(a[2]).getValue();
		    		////////////////////console.log(itemValue+'#'+meas1+'#'+meas2);
		    		textValues[0]=meas1;
		    		textValues[1]=meas2;
		    		return textValues;
	    		}
	    		
	    		
	    	}
	    	catch(e)
	    	{
	    		
	    	}
	    }
	    return null;
}



function setDropMapping(str)
{   var arry=[];
    var final_arry=new Array();
    var j=0;
	arry=mapdropDown.split('\n');
	for(i=0;i<arry.length-1;i++)
	{
		if(arry[i].indexOf(str)!=-1)
		{
			
		}
		else
		{
			final_arry[j]=arry[i];
			j++;
		}
			
	}
	//////////////////////console.log('between'+final_arry.length);
	var s='';
	////////alert('final_arry.length#'+final_arry.length);
	for(j=0;j<final_arry.length;j++)
	{
		s+=final_arry[j]+'\n';
	}
	mapdropDown=s;
	////////alert(mapdropDown);
}

function getPanelId(itemValue)
{
	    var arry=[];
		 arry=mapdropDown.split('\n');
		for(i=0;i<arry.length-1;i++)
		{
			if(arry[i].indexOf(itemValue)!=-1)
			{
				return arry[i].split('#')[1];
			}
		}
		return null;
}
function getComboId(itemId)
{
	var arry=[];
	//////////////////////console.log('itemId:'+itemId);
	//////////////////////console.log('mapp:'+mapdropDown);
	 arry=mapdropDown.split('\n'); 
	 for(i=0;i<arry.length-1;i++)
		{
		   //////////////////////console.log('aaray[i]'+arry[i].split('#')[0]);
			//if(arry[i].indexOf(itemId)!=-1)
		    if(arry[i].split('#')[0]==itemId)
			{
				//////////////////////console.log('itemId22:'+itemId);
				var a=arry[i].split('#')[1];
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
     ////////////////////console.log(item.id);*/
	 ////////////////////console.log(item.id);
	 
	/* if(Ext.getCmp(item.id+'_panel')!=null)
		 Ext.getCmp(item.id+'_panel').destroy();*/
     Ext.getCmp('_keyword').removeRecords.remove(item.value);
     //Ext.getCmp('_keyword').remove(item);
	//Ext.getCmp(item.id).dispose(true);
}


function myDispose(item)
{
	////////////////////console.log('before item');
	////////////////////console.log(item);
	/*var panel=Ext.getCmp(item.id+'_panel');
	if(panel!=null)
		panel.destroy();*/
}



function myDragZone(v) {
	//////////////////////console.log('vv:');
   
     //var draggedPanelId=v.id+'_panel';
	//draggedItemId=v.getEl();
	
    v.dragZone = Ext.create('Ext.dd.DragZone', v.getEl(),{
    	
    	getDragData: function(e) {
    	  
        var sourceEl = e.getTarget(v.itemSelector, 30), d;
        var sourceElId=sourceEl.id;
        if(sourceElId.indexOf('gen')!=-1 || sourceElId.indexOf('meas')!=-1 )//||sourceElId.indexOf('label')!=-1)
        {
        	return null;
        }
        ////////////////////console.log(Ext.fly(sourceEl).getXY());
        var xyAry=new Array();
        xyAry[0]=Ext.fly(sourceEl).getX()+10;
        xyAry[1]=Ext.fly(sourceEl).getY()+10;
        if (sourceEl) {
            d = sourceEl.cloneNode(true);
            d.id = Ext.id();
            ////////////////////console.log(sourceEl);
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
	////////alert('in my drop zone');
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
            Ext.Msg.//////alert('Drop gesture', 'Dropped patient ' + data.patientData.name +
                ' on hospital ' + h.data.name);
            return true;
        }
    });

*/}












function initializeDropTarget(targetPanel) {
	////////alert('hihi');
  // Create the DropTarget object and assign it to the panel. Does not
  // have to be assigned to the panel but needs to be assigned to something,
  // or it will get garbage-collected too soon.
  targetPanel.dropTarget = Ext.create('Ext.dd.DropTarget', targetPanel.el);

  // Called once, when dragged item is dropped in the target area. Return false
  // to indicate an invalid drop. DO NOT MODIFY the UI in 
  // this function. Use afterDragDrop and the data object.
  targetPanel.dropTarget.notifyDrop = function(source, evt, data) {
	  
	  ////////////////////console.log('in notifydrop');
	  /*
    if(typeof console != "undefined")
      ////////////////////console.log("notifyDrop:" + source.id);

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
	  ////////////////////console.log('in notifyEnter');
	  /*
    if(typeof console != "undefined")
      ////////////////////console.log("notifyEnter:" + source.id);

    return this.callParent(Array.prototype.slice.call(arguments));
  */};

  // Called once, when dragged item leaves drop area.
  targetPanel.dropTarget.notifyOut = function(source, evt, data) {
	  ////////////////////console.log('in notifyout');
	  /*
    if(typeof console != "undefined")
      ////////////////////console.log("notifyOut:" + source.id);

    return this.callParent(Array.prototype.slice.call(arguments));
  */};

  // Called for each mouse movement as dragged item is over the drop area.
  targetPanel.dropTarget.notifyOver = function(source, evt, data) {
	  ////////////////////console.log('in notifyover');
	  /*
    if(typeof console != "undefined")
      ////////////////////console.log("notifyOver:" + source.id);

    return this.callParent(Array.prototype.slice.call(arguments));
  */};
}