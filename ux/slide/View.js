/**
 *  {@link Ext.ux.slide.View} is a subclass of {@link Ext.Container}
 *  that provides a sliding main view with up to two underlying containers
 *  that can be viewed by "sliding" the top container either left or right.
 *  The concept was inspired by Facebook's mobile app.
 *
 *  @version 0.1.0-dev
 *  @author Weston Nielson <wnielson@github>
 *
 */
Ext.define('Ext.ux.slide.View', {
    extend: 'Ext.Container',
    
    requires: [
        'Ext.Container',
        'Ext.Function'
    ],
    
    xtype: 'slideview',
    
    config: {
        /**
         *  @cfg {Object} container Config or component to use as the main container.
         *  You normally shouldn't have to mess with this.
         */
        container:      true,

        /**
         *  @cfg {Object/Boolean} containerMask Config to use for masking the main container when
         *  is it open.  Set to `false` to disable masking.
         */
        containerMask: {
            xtype: 'mask',
            transparent: true
        },

        /**
         *  @cfg {Integer} containerSlideDelay Number of pixels must be dragged on the main container
         *  before allowing it to slide.  If this number of pixels has been dragged vertically, a
         *  "scroll lock" is enabled and horizontal dragging is forbidden untill the next drag event.
         *
         *  TODO: The name for this is somewhat confusing...
         */
        containerSlideDelay: 5,

        /**
         *  @cfg {Object/Boolean} leftContainer Config or component to use as the right container.
         *  If set to `false` the left container will be disabled.
         */
        leftContainer:  false,

        /**
         *  @cfg {Object/Boolean} rightContainer Config or component to use as the right container.
         *  If set to `false` the right container will be disabled.
         */
        rightContainer: false,

        /**
         *  @cfg {Integer} slideDuration Default slide animation duration.  Used when the
         *  container is opening or closing.
         */
        slideDuration:  250,

        style:          'overflow: hidden',

        /**
         * @cfg {String} shadowStyle CSS to use for styling the shadow when the container is
         * open.  This should be a valid CSS 'box-shadow' argument.  Set to false to disable
         * it.
         */
        shadowStyle: '0 0 4px 1px #999',

        /**
         * @cfg
         * @inheritdoc
         */
        baseCls: Ext.baseCSSPrefix + 'slideview'
    },

    /**
     *  @private
     *
     */
    initialize: function() {
        this.callParent(arguments);

        this.createContainerCSS();
    },

    /**
     *  @private
     *
     *  Created the main container.
     */
    applyContainer: function(config) {
        var me = this;

        if (!Ext.isObject(config)) {
            config = {};
        };

        config.draggable = {
            direction: 'horizontal',
            listeners: {
                dragstart: {
                    fn:     me.onContainerDragstart,
                    order:  'before',
                    scope:  me
                },
                dragend:    me.onContainerDragend,
                scope:      me
            },
            translatable: {
                listeners: {
                    animationstart: function() {
                        this.fireEvent('slidestart', this);
                    },
                    animationend: function(translatable, b, c) {
                        var container       = this.getContainer(),
                            leftContainer   = this.getLeftContainer(),
                            rightContainer  = this.getRightContainer(),
                            draggable       = container.draggableBehavior.draggable,
                            offset          = draggable.getOffset();

                        if (offset.x == 0) {
                            // Closed
                            this.fireEvent('closed', this);

                            if (leftContainer) {
                                //leftContainer.element.setStyle('display', 'none');
                                leftContainer.removeCls('show');
                            }
                            if (rightContainer) {
                                //rightContainer.element.setStyle('display', 'none');
                                rightContainer.removeCls('show');
                            }

                            // Remove mask
                            this.doMaskItem(this.getContainer().getActiveItem(), false);
                        } else {
                            this.fireEvent('opened', this);

                            // Apply mask
                            //this.doMaskItem(this.getContainer().getActiveItem(), true);
                        }

                        // Fire the event now that the animation is done.
                        this.fireEvent('slideend', this);
                    },
                    scope: me // The "x-slidenavigation" container
                }
            }
        };

        if (config) {
            Ext.applyIf(config, {
                style: 'width: 100%; height: 100%; position: absolute; opacity: 1; z-index: 5',
                dragAllowed:        false,
                dragAllowedForced:  false,
                cls:    'x-slideview-container',
                layout: {
                    type: 'card'
                }
            });
        }
        
        container = this.add(Ext.factory(config, Ext.Container, this.getContainer()));
        
        container.element.on({
            drag: function(e, node, opts, eOpts) {
                var deltaX = e.absDeltaX,
                    deltaY = e.absDeltaY;

                // This essentally acts as a vertical 'scroll-lock'.  If the user drags more
                // than 10px vertically, we disable horizontal drag all together.
                if (deltaY > 10 && !container.dragAllowed) {
                    container.dragAllowedForced = true;
                    return false;
                };

                // If vertical scroll-lock hasn't been enforced (``dragAllowedForced``), and
                // ``deltaX`` is large enough, enable horizontal dragging
                if (deltaX > me.getContainerSlideDelay() && !container.dragAllowed && !container.dragAllowedForced) {
                    if (!container.dragAllowed) {
                        me.disableContainerScroll(true);
                    }

                    container.dragAllowed = true;
                    container.element.fireEvent('dragstart', e.deltaX);
                }
            },
            dragstart: function(deltaX) {
                var leftContainer   = me.getLeftContainer(),
                    rightContainer  = me.getRightContainer(),
                    draggable       = container.draggableBehavior.draggable,
                    constraint      = me.getContainerDragConstraint(draggable.offset.x, deltaX);                

                draggable.setConstraint(constraint);

                if (leftContainer) {
                    if (draggable.offset.x >=0 && deltaX > 0) {
                        // Sliding right; show left container
                        me.doMaskItem(me.getContainer().getActiveItem(), true);
                        leftContainer.addCls('show');
                    }
                }

                if (rightContainer) {
                    if (draggable.offset.x <=0 && deltaX < 0) {
                        // Sliding left; show right container
                        me.doMaskItem(me.getContainer().getActiveItem(), true);
                        rightContainer.addCls('show');
                    }
                }
                if (deltaX > 0) {

                }
            },
            dragend: function() {
                if (container.dragAllowed) {
                    // Re-enable scrolling on the child element
                    me.disableContainerScroll(null);
                }

                container.dragAllowedForced = false;
                container.dragAllowed       = false;
            }
        });

        return container;
    },

    /**
     *  @private
     *
     *  Adds a container to the specified position; left or right.
     */
    doApplySideContainer: function(position, config, instance) {
        if (config === false || (position != 'left' && position != 'right')) {
            // Either explicitly set to 'false', or position is invalid
            return false;
        }

        if (config === true) {
            config = {};
        }

        if (config) {
            Ext.applyIf(config, {
                docked: position,
                width:  150,
                cls:    'x-slideview-container-'+position,
                style: 'position: absolute; top: 0; '+position+': 0; bottom: 0;' +
                        'z-index: 1;',
            });
        }

        return this.add(Ext.factory(config, Ext.Container, instance));
    },

    applyLeftContainer: function(config) {
        return this.doApplySideContainer('left', config, this.getLeftContainer());
    },

    applyRightContainer: function(config) {
        return this.doApplySideContainer('right', config, this.getRightContainer());
    },

    /**
     *  @private
     *
     *  Attempts to disable scrolling on the item in the main container.
     *
     *  TODO: This method is not as robust as I'd like.
     *
     */
    disableContainerScroll: function(disable) {
        scrollParent = container.getActiveItem();
        if (scrollParent && scrollParent.getScrollable()) {
            scrollable              = scrollParent.getScrollable();
            scroller                = scrollable.getScroller();
            scroller._scrollState   = scroller.getDisabled();
                
            if (scroller._scrollState != false) {
                scroller.setDisabled(disable);
                scrollable.hideIndicators();
            }
        }
    },

    /**
     *  @private
     *
     *  Determines the constraints of the drag based on which direction
     *  it is moving.
     *
     *  TODO: This isn't working quite properly yet.
     *
     */
    getContainerDragConstraint: function(offsetX, deltaX) {
        var leftContainer   = this.getLeftContainer(),
            rightContainer  = this.getRightContainer(),
            constraint      = {
                min: { x: 0, y: 0 },
                max: { x: 0, y: 0 }
            };

        if (leftContainer && !leftContainer.isDisabled()) {
            constraint.max.x = leftContainer.getWidth();
        }

        if (rightContainer && !rightContainer.isDisabled()) {
            constraint.min.x = -rightContainer.getWidth();
        }

        if (deltaX > 0 && offsetX == 0) {
            // Sliding right
            constraint.min.x = 0;
        } else if (deltaX < 0 && offsetX == 0) {
            // Slading left
            constraint.max.x = 0;
        }

        return constraint;
    },

    /**
     *  @private
     *
     *  Callback for main container dragstart event.  All this does is to disable
     *  dragging unless it has been explicitly enabled.
     *
     */
    onContainerDragstart: function(draggable, e) {
        var container = this.getContainer();

        if (!container.dragAllowed) {
            return false;
        }
    },

    /**
     *  @private
     *
     *  Callback for main container dragevent ends.  This determines where to move
     *  the container, either opend or closed, and takes into account the speed at which
     *  the container is moving and also how far it has been moved.
     *  
     */
    onContainerDragend: function(draggable, e, eOpts) {
        var velocity        = Math.abs(e.deltaX / e.deltaTime),
            direction       = (e.deltaX > 0) ? "right" : "left",
            offset          = Ext.clone(draggable.offset),
            container       = this.getContainer(),
            leftContainer   = this.getLeftContainer(),
            rightContainer  = this.getRightContainer(),
            threshold       = 0,
            width           = 0;

        // TODO: This doesn't work quite properly yet.

        if (offset.x > 0) {
            // Left container is visible
            if (leftContainer) {
                width       = leftContainer.getWidth();
                threshold   = parseInt(width * .60);
            }

            switch (direction) {
                case "right":
                    offset.x = (velocity > 0.50 || offset.x > threshold) ? width : 0;
                    break;
                case "left":
                    offset.x = (velocity > 0.50 || offset.x < threshold) ? 0 : width;
                    break;
            }
            
        } else if (offset.x < 0) {
            // Right container is visible

            if (rightContainer) {
                width       = -rightContainer.getWidth();
                threshold   = parseInt(width * .60);
            }

            switch (direction) {
                case "left":
                    offset.x = (velocity > 0.50 || offset.x < threshold) ? width: 0;
                    break;
                case "right":
                    offset.x = (velocity > 0.50 || offset.x > threshold) ? 0 : width;
                    break;
            }
        }

        this.fireEvent('dragend', this);
        
        this.moveContainer(this, offset.x);
    },

    /**
     *  Closes the container.
     *
     */
    closeContainer: function(duration) {
        this.moveContainer(this, 0, duration);
    },

    /**
     *  @private
     *
     *  Moves the container to a specified ``offsetX`` pixels.  Positive
     *  integer values move the container that many pixels from the left edge
     *  of the window.  If ``duration`` is provided, it should be an integer
     *  number of milliseconds to animate the slide effect.  If no duration is
     *  provided, the default in ``config.slideDuration`` is used.
     *
     */
    moveContainer: function(nav, offsetX, duration) {
        var duration     = duration || this.getSlideDuration(),
            container    = this.getContainer(),
            draggable    = container.draggableBehavior.draggable;

        container.addCls('open');
        draggable.setOffset(offsetX, 0, {
            duration: duration,
            easing: 'ease-out'
        });
    },

    /**
     *  @private
     *
     *  If item masking is enabled, this method will mask the main container whenever it is
     *  not fully closed.
     *
     */
    doMaskItem: function(item, applyMask) {
        var mask        = this.getContainerMask(),
            container   = this.getContainer(),
            doMask      = Ext.isDefined(applyMask) ? applyMask : true;

        if (mask === false) { return; }

        if (doMask) {
            container.setMasked(mask);
            container.getMasked().onEvent = Ext.emptyFn;
        } else {
            container.setMasked(false);
        }
    },

    /**
     *  @private
     *
     *  Construct style element for container shadow and insert into the DOM.
     */
    createContainerCSS: function() {
        var shadowStyle = this.getShadowStyle(),
            id          = this.getId();

        if (shadowStyle) {
            if (!document.getElementById(id)) {
                style           = document.createElement('style');
                style.type      = 'text/css';
                style.innerHTML = '.x-slideview-container.x-dragging, '+
                                  '.x-slideview-container.open { '+
                                  'box-shadow: '+shadowStyle+';'+
                                  '-webkit-box-shadow:'+shadowStyle+';';
                document.getElementsByTagName('head')[0].appendChild(style);
            }
        }
    }
});
