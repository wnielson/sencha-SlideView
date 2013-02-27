Ext.define("SlideExample.view.Item", {
    extend: "Ext.Container",

    config: {
        styleHtmlContent: true,
        scrollable: 'vertical',
        //maskOnOpen: true,
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            title:  '',
            ui:     'light'
        }],
        html:   '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi adipiscing egestas massa, eu aliquet lectus fringilla nec. Curabitur ut posuere libero. Aenean elit dui, ultrices et euismod a, pulvinar non nulla. Nam nisi odio, luctus a condimentum at, tristique eu arcu. Nam faucibus sagittis nisl, in fermentum dui aliquet non. Duis non nisi dolor. Integer fermentum, nisl sit amet rutrum varius, nunc sem ultricies tortor, tincidunt aliquam mi lacus at dolor. Fusce consequat mi sit amet justo semper scelerisque sodales dolor commodo. Nulla egestas, elit vel commodo cursus, quam leo hendrerit nulla, ut auctor risus velit sit amet libero. Nunc quis lorem leo. Nulla ut velit erat, eu imperdiet eros. Nunc at leo ut nunc viverra consectetur ut id velit.</p>'+
                '<p>Nulla facilisi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed non velit nunc. Donec luctus nunc vitae mi pellentesque auctor. In ac dui non lacus suscipit interdum. Nunc nec dictum ante. Maecenas nisl nunc, interdum vel elementum a, congue blandit urna. Aliquam erat volutpat. Etiam sed nulla mi, sed malesuada risus.</p>'+
                '<p>Aenean lectus justo, pellentesque sed luctus vel, elementum vitae risus. Sed accumsan turpis a ligula posuere egestas. In lorem lorem, iaculis sit amet semper ac, sollicitudin in lorem. Phasellus feugiat quam eu est tincidunt a rhoncus tortor convallis. Sed mauris nisl, tempor ac ultricies nec, convallis facilisis tellus. Proin aliquam facilisis quam non pretium. Nullam vel nunc lorem. Donec lobortis purus sit amet lorem porttitor facilisis. Morbi imperdiet purus nec mauris elementum lacinia. Nullam quis nunc at neque fermentum volutpat pharetra sit amet turpis. Maecenas venenatis mattis diam, ut iaculis odio lacinia ut. Nam ac nisl non augue pulvinar pretium id quis leo. In hac habitasse platea dictumst.</p>'+
                '<p>Integer vestibulum rhoncus diam eu aliquet. Vivamus nibh orci, elementum vel tristique sed, pretium ac lorem. Ut ac neque lacus, luctus egestas enim. Etiam non erat quam. Praesent nec nunc ligula, eget mattis erat. Proin cursus turpis eu tellus volutpat feugiat at pulvinar augue. Integer vel est felis. Nunc interdum quam at nulla suscipit at elementum tortor convallis. Ut lacus lacus, ullamcorper quis congue et, ultrices nec augue. Phasellus porta condimentum nulla, egestas lobortis quam accumsan placerat. Aliquam porttitor blandit tincidunt. Vestibulum laoreet leo quis sapien blandit vel rutrum nulla auctor. Aenean dignissim enim vel tellus pellentesque vel imperdiet sem suscipit.</p>'+
                '<p>Donec in neque a nisi euismod commodo id sed dui. Sed sodales, eros vel posuere bibendum, nisl mi consectetur elit, vel laoreet tortor odio at urna. Nulla suscipit elit quis elit cursus ullamcorper. Morbi felis justo, scelerisque semper porta ultrices, molestie non dui. Praesent at risus nec tellus varius posuere. Donec feugiat magna non quam tincidunt sed hendrerit lorem rhoncus. Suspendisse fermentum laoreet ante quis suscipit. Nulla ac purus ipsum, a consequat nunc. Suspendisse eros massa, tristique eu lobortis at, pharetra vitae libero. Cras turpis ligula, gravida a dapibus eget, semper et massa. Nullam viverra leo dictum nisl consectetur sit amet mattis tellus dignissim. Maecenas rhoncus ipsum eget mauris consectetur et malesuada augue elementum. Morbi dignissim gravida lacus, nec feugiat ante lacinia eget. Aliquam ornare, ligula nec interdum mollis, odio ipsum adipiscing massa, quis pulvinar sem purus blandit velit. Fusce dapibus, eros quis placerat luctus, mauris odio pellentesque sapien, et varius purus mauris vitae magna.</p>'
    },

    initialize: function() {
        var me = this;

        this.callParent(arguments);

        this.setHtml('<p><strong>'+this.name+'</strong></p>'+this.getHtml());
        
        toolbar = this.down('toolbar').setTitle(this.name);
        toolbar.element.on('doubletap', function() {
            var scroller = me.getScrollable().getScroller();
            scroller.scrollTo(0, 0, true);
        });
    }
});
