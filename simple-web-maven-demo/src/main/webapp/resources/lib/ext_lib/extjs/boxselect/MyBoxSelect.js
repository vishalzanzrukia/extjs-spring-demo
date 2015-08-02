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
 * @author kleins kleins@web.de
 * @requires BoxSelect.css
 * @xtype boxselect
 */
 
var advancemapMeasItem='';
Ext.define('Ext.ux.form.field.BoxSelect', {
	extend: 'Ext.form.field.ComboBox',

	alias: 'widget.MyBoxselect',
	
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
			this.inputEl.focus()
		}, this);
		this.mon(this, 'resize', this.onResize, this);
		this.loadinit();
		this.store.on('load', function(store){
			this.queryMode='local';

			/*if(this.dummystore.length === 0)
			{
				this.store.load();
				this.queryMode='local';
				i=0;

				this.store.each(function(rec)
						{
							this.dummystore.add((rec.data[this.valueField]),rec);
							this.selectedRecords1.add((rec.data[this.valueField]),rec);
							i++;
						}, this);
				this.store.removeAll();
				this.selectedRecords.clear();

				this.recAdded=true;
				this.recSelected=false;
				this.eventcalled=false;

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

		if(this.dummystore.length === 0)
		{
			if(Ext.isChrome)
			{
				this.store.load();
			}
			if(Ext.isGecko||Ext.isGecko2||Ext.isGecko3)
			{
				//for firefox..
				//alert('firefox');
			}
			
			//this.queryMode='local';
			i=0;

			this.store.each(function(rec)
					{
						this.dummystore.add((rec.data[this.valueField]),rec);
						this.selectedRecords1.add((rec.data[this.valueField]),rec);
						i++;
					}, this);
			this.store.removeAll();
			this.selectedRecords.clear();

			this.recAdded=true;
			this.recSelected=false;
			this.eventcalled=false;

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

			if(this.dummystore.length === 0)
			{
				this.store.load();
				this.queryMode='local';
				i=0;

				this.store.each(function(rec)
						{
							this.dummystore.add((rec.data[this.valueField]),rec);
							this.selectedRecords1.add((rec.data[this.valueField]),rec);
							i++;
						}, this);
				this.store.removeAll();
				this.selectedRecords.clear();

				this.recAdded=true;
				this.recSelected=false;
				this.eventcalled=false;

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

				if(this.getCursorPosition()>0)
				{
						this.called=true;
						this.popUpRecords();

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
	
	popUpRecords:function()
	{
		//alert('hi');
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

		if(e.getKey()==13)
		{
			advancedSearchFunctionality();
		}
	
	},
	
	
	onKeyPress: function(e) {
		this.recAdded=false;
		this.recSelected=false;
		//this.queryMode='local';
		if(!this.multiSelect && e.getKey() != '13')
		{
			

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
	
	/*onKeyUp: function(e) {
		if (!Ext.isDefined(this.stopKeyUpEvent) || this.stopKeyUpEvent === false) {
			this.callParent(arguments);	
		}
		this.stopKeyUpEvent = false;
		if(e.getKey() === e.BACKSPACE || e.getKey() === e.DELETE )
		{
			this.resetStore();
		}
	},
	*/
	
	//added by v.j.
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

		if(value === val1)
		{
			return '';

		}

		Ext.each(value, function(record) {
			if (record.isModel) {
				rawValues.push(record.get(this.valueField))
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
	onItemDisposed: function(item){
			this.removeRecords.remove(item.value);
			this.items.remove(item);
	},
		
	addItem: function(id, caption){
	
		var item = Ext.create('Ext.ux.BoxSelect.Item', {
			id: Ext.id(null, 'boxitem-item'),
			caption: caption,
			disabled: this.disabled,
			value: id,
			listeners: {
				'dispose': this.onItemDisposed,
				'select': this.onItemSelected,
				scope: this
			}
		});
		item.render(this.frame, this.frame.dom.childNodes.length-1);
		this.items.add(item.id, item);
		this.ownerCt.doLayout(); // in case height has changed (it doesn't work automatically in some cases)
	},
	
	autoSize : function(){
		if(!this.iAmRendered){
			return;
		}
		
		if(!this.metrics){
			this.metrics = Ext.create('Ext.util.TextMetrics', this.inputEl);
		}
		//var w = Math.max(this.metrics.getWidth(this.inputEl.dom.value + ' ') +  15, 15);
		var w=0;
		if(this.inputEl.dom.value=='')
		{
			w = Math.max(this.metrics.getWidth(this.inputEl.dom.value + ' ') +  1, 1);	
		}
		else
		{
			w = Math.max(this.metrics.getWidth(this.inputEl.dom.value + ' ') +  15, 15);
		}
		
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

Ext.define('Ext.ux.BoxSelect.Item', {
	//extend: 'Ext.Component',
	extend: 'Ext.container.Container',
	disabledCls: '', // to avoid applying opacity twice
	autoEl: {
		tag: 'li',
		cls: 'item-box'
	},
	layout:{type:'hbox',pack:'start',align:'top'},
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
		        	advancemapMeasItem+=thisId+'#'+thisId+'_meas1'+'#'+thisId+'_meas2'+'\n';
		        	this.setWidth(this.getWidth()+58);
		        	 this.add(new Ext.form.Label({
		        		    id:thisId+'_label',
		        		    //style:{"cursor":"move"},
			        		text:keyText,
		        		   // html:'<font style="cursor:move;display:inline;">'+keyText+'</font>',
			        		padding:'0 5 0 0'//,
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
				             minValue: 1,
				             maxValue: 99,
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
				             minValue: 2,
				             maxValue: 100,
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
		        		   // style:{"cursor":"move"},
			        		//html:'<font style="cursor:move;">'+keyText+'</font>',
			        		padding:'0 0 0 0'//,
			        		//style:{'cursor':'move'}
			        		//id:th
			        	}));
		        }
				
				////////alert('added'+this.id);
		}
	},
	
	
	
	
	
	
	
	
	
	renderTpl: ['{caption}<div class="deletebutton"><!-- --></div>'],

	onRender: function(ct, position){
		Ext.applyIf(this.renderData, {
			//caption: this.caption
			caption:''
		});
		this.callParent(arguments);
		
		this.addEvents('dispose', 'select');

		this.el.addClsOnOver('bit-hover');
		
		this.deleteBtn = this.el.down('div.deletebutton');
	},	
	
	initEvents: function() {
		if (!this.disabled) {
			this.enableEvents();
		}
	},
	
	enableEvents: function() {
		this.mon(this.el, 'mousedown', this.onClick, this)
		this.mon(this.deleteBtn, 'mousedown', this.onDeleteClick, this)		
	},
	
	disableEvents: function() {
		this.mun(this.el, 'mousedown', this.onClick, this)
		this.mun(this.deleteBtn, 'mousedown', this.onDeleteClick, this)				
	},
	
	onEnable: function() {
		this.enableEvents();
	},

	onDisable: function() {
		this.disableEvents();
	},	
	
	onClick : function(e){
		e.stopEvent();
		this.select(e.shiftKey);
	},

	onDeleteClick : function(e){
		e.stopEvent();
		this.dispose();
	},		
	
	select: function(addToSelection) {
		if (!Ext.isDefined(addToSelection)) {
			addToSelection = false;
		}
		this.el.addCls('item-box-selected');
		this.fireEvent('select', this, addToSelection);
	},
	
	deselect: function() {
		this.el.removeCls('item-box-selected');
	},
	
	isSelected: function() {
	
		return this.el.hasCls('item-box-selected');
	},		
	
	dispose: function(withoutEffect) {
		if(withoutEffect){
			this.destroy();
		}
		else{
			this.el.hide({
				duration: 300,
				listeners: {
					lastframe: Ext.bind(function(){
						this.destroy()
					}, this)
				}
			});
		}
		
		this.fireEvent('dispose', this);		

		return this;
	}
});
