Ext.define("SlideExample.view.Main", {
    extend: 'Ext.tab.Panel',
    
    requires: [
        'Ext.dataview.List',
        'Ext.ux.slide.View'
        //'Ext.ux.plugin.ListActions'
    ],

    views: [
        'CoverList',
        'Item'
    ],
    
    config: {
        fullscreen: true,
        xtype: 'tabpanel',
        tabBarPosition: 'bottom',
        layout: {
            type: 'card',
            animation: {
                type: 'fade',
                direction: 'left'
            }
        },

        items: [{
            title: 'Home',
            iconMask: true,
            iconCls: 'home',
            html: '<h3>Slide View for Sencha Touch</h3><p>Code available at: http://github.com/wnielson/sencha-SlideView</p>',
            styleHtmlContent: true,
            style: 'text-align: center',
            items: [{
                docked: 'top',
                xtype: 'toolbar',
                title: 'Slide View',
                ui: 'light'
            }]
        },{
            xtype: 'slideview',
            title: 'Slide View',
            iconMask: true,
            iconCls: 'look',
            containerSlideDelay: 5,
            slideDuration: 500,

            container: {
                items: [{
                    xclass: 'SlideExample.view.Item',
                    name:   'Item 1'
                },{
                    xtype: 'container',
                    layout: 'fit',
                    items: [{
                        xtype: 'toolbar',
                        docked: 'top',
                        title:  'Item 2',
                        ui:     'light'
                    },{
                        xclass: 'SlideExample.view.CoverList'
                    }]
                },{
                    xclass: 'SlideExample.view.Item',
                    name:   'Item 3'
                },{
                    xtype: 'list',
                    itemTpl: '{name}',
                    data: [{
                        name: 'Item 1'
                    },{
                        name: 'Item 2'
                    },{
                        name: 'Item 3'
                    },{
                        name: 'Item 4'
                    },{
                        name: 'Item 5'
                    },{
                        name: 'Item 6'
                    },{
                        name: 'Item 7'
                    },{
                        name: 'Item 8'
                    },{
                        name: 'Item 9'
                    },{
                        name: 'Item 10'
                    }],
                    items: {
                        docked: 'top',
                        xtype: 'toolbar',
                        title: 'Item 4',
                        layout: {
                            pack: 'right'
                        }/*,
                        items: [{
                            xtype: 'button',
                            name: 'listactions'
                        }]
                        */
                    }/*,
                    plugins: [{
                        xclass: 'Ext.ux.plugin.ListActions',
                        actionsToolbar: {
                            items: [{
                                text: 'Delete (0)',
                                ui: 'decline',
                                eventName: 'delete'
                            },{
                                text: 'Move (0)',
                                eventName: 'move'
                            },{
                                text: 'Mark (0)',
                                eventName: 'mark'
                            }]
                        },
                        actionToggleButton: {
                            selector: function(list) {
                                return list.down('button[name="listactions"]');
                            },
                            enableText: 'select',
                            disableText: 'cancel'
                        }
                    }]
                    */
                },{
                    xclass: 'SlideExample.view.Item',
                    name:   'Item 5'
                },{
                    xclass: 'SlideExample.view.Item',
                    name:   'Item 6'
                }]
            },

            leftContainer: {
                xtype: 'list',
                width: 200,
                data: [{
                    name: 'Item 1'
                },{
                    name: 'Item 2'
                },{
                    name: 'Item 3'
                }],
                itemTpl: '{name}',
                items: [{
                    xtype: 'toolbar',
                    docked: 'top',
                    title: 'Left Menu'
                }],
                listeners: {
                    itemtap: function(list, index) {
                        var slideview   = list.getParent(),
                            container   = slideview.getContainer();

                        container.setActiveItem(index);
                        Ext.defer(slideview.closeContainer, 200, slideview);
                    },
                    initialize: function(list) {
                        list.select(0);
                    }
                }
            },
            
            rightContainer: {
                xtype: 'panel',
                width: 200,
                html:'<p>Here is the right panel.  You can put whatever you\'d like over here.</p>',
                styleHtmlContent: true,
                items: [{
                    xtype: 'toolbar',
                    docked: 'top',
                    title: 'Right Container'
                }]
            }

        }]
    }
});
