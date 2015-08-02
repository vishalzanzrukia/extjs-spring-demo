Ext.define('Ext.view.pagelimitBoundList', {
    extend: 'Ext.view.View',
    alias: 'widget.boundlist',
    alternateClassName: 'Ext.BoundList',
    requires: ['Ext.layout.component.BoundList', 'Ext.toolbar.Paging'],

    /**
     * @cfg {Number} pageSize
     * If greater than `0`, a {@link Ext.toolbar.Paging} is displayed at the bottom of the list and store
     * queries will execute with page {@link Ext.data.Operation#start start} and
     * {@link Ext.data.Operation#limit limit} parameters. Defaults to `0`.
     */
    pageSize: 0,

    /**
     * @property {Ext.toolbar.Paging} pagingToolbar
     * A reference to the PagingToolbar instance in this view. Only populated if {@link #pageSize} is greater
     * than zero and the BoundList has been rendered.
     */

    // private overrides
    autoScroll: true,
    baseCls: Ext.baseCSSPrefix + 'pageLimitboundlist',
    itemCls: Ext.baseCSSPrefix + 'pageLimitboundlist-item',
    listItemCls: '',
    shadow: false,
    trackOver: true,
    refreshed: 0,

    ariaRole: 'listbox',

    componentLayout: 'boundlist',

    renderTpl: ['<div id="{id}-listEl" class="list-ct"></div>'],

    initComponent: function() {
        var me = this,
            baseCls = me.baseCls,
            itemCls = me.itemCls;
            
        me.selectedItemCls = baseCls + '-selected';
        me.overItemCls = baseCls + '-item-over';
        me.itemSelector = "." + itemCls;

        if (me.floating) {
            me.addCls(baseCls + '-floating');
        }

        if (!me.tpl) {
            // should be setting aria-posinset based on entire set of data
            // not filtered set
            me.tpl = Ext.create('Ext.XTemplate',
                '<ul><tpl for=".">',
                    '<li role="option" class="' + itemCls + '">' + me.getInnerTpl(me.displayField) + '</li>',
                '</tpl></ul>'
            );
        } else if (Ext.isString(me.tpl)) {
            me.tpl = Ext.create('Ext.XTemplate', me.tpl);
        }

        if (me.pageSize) {
            me.pagingToolbar = me.createPagingToolbar();
        }

        me.callParent();

        me.addChildEls('listEl');
    },

    createPagingToolbar: function() {
        return Ext.widget('pagingtoolbar', {
            pageSize: this.pageSize,
            store: this.store,
            border: false
        });
    },

    onRender: function() {
        var me = this,
            toolbar = me.pagingToolbar;
        me.callParent(arguments);
        if (toolbar) {
            toolbar.render(me.el);
        }
    },

    bindStore : function(store, initial) {
        var me = this,
            toolbar = me.pagingToolbar;
        me.callParent(arguments);
        if (toolbar) {
            toolbar.bindStore(store, initial);
        }
    },

    getTargetEl: function() {
        return this.listEl || this.el;
    },

    getInnerTpl: function(displayField) {
        return '{' + displayField + '}';
    },

    refresh: function() {
        var me = this;
        me.callParent();
        if (me.isVisible()) {
            me.refreshed++;
            me.doComponentLayout();
            me.refreshed--;
        }
    },

    initAria: function() {
        this.callParent();

        var selModel = this.getSelectionModel(),
            mode     = selModel.getSelectionMode(),
            actionEl = this.getActionEl();

        // TODO: subscribe to mode changes or allow the selModel to manipulate this attribute.
        if (mode !== 'SINGLE') {
            actionEl.dom.setAttribute('aria-multiselectable', true);
        }
    },

    onDestroy: function() {
        Ext.destroyMembers(this, 'pagingToolbar', 'listEl');
        this.callParent();
    }
});