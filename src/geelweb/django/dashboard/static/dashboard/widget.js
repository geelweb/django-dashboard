var iWidget = {

    jQuery : $,

    settings : {
        columns : '.column',
        widgetSelector: '.widget',
        handleSelector: '.widget-head',
        contentSelector: '.widget-content',
        widgetDefault : {
            movable: true,
            removable: true,
            collapsible: true,
            editable: true,
            colorClasses : ['color-yellow', 'color-red', 'color-blue', 'color-white', 'color-orange', 'color-green']
        },
        widgetIndividual : {
            intro : {
                movable: false,
                removable: false,
                collapsible: false,
                editable: false
            },
            gallery : {
                colorClasses : ['color-yellow', 'color-red', 'color-white']
            }
        }
    },

    init : function () {
        this.addWidgetControls();
        this.makeSortable();
    },

    getWidgetSettings : function (id) {
        var $ = this.jQuery,
            settings = this.settings;
        return (id&&settings.widgetIndividual[id]) ? $.extend({},settings.widgetDefault,settings.widgetIndividual[id]) : settings.widgetDefault;
    },

    decorateWidget : function(w) {
        var $ = this.jQuery,
            settings = this.settings;
        if (!w.has(settings.contentSelector).length) {
            var c = $('<div class="'+settings.contentSelector.substring(1)+'"></div>');
            c.html(w.html());
            w.html(c);
        }
        if (!w.has(settings.handleSelector).length) {
            var h = '<div class="'+settings.handleSelector.substring(1)+'"><span class="widget-title"></span></div>';
            w.html(h + w.html());
        }
    },

    addWidgetControl : function (w) {
        var iWidget = this,
            $ = this.jQuery,
            settings = this.settings;
        var thisWidgetSettings = iWidget.getWidgetSettings(w.id);
        if (thisWidgetSettings.removable) {
            $('<a href="#" class="remove pull-right"><span class="glyphicon glyphicon-remove"></span></a>').mousedown(function (e) {
                e.stopPropagation();
            }).click(function () {
                if(confirm('This widget will be removed, ok?')) {
                    $(this).parents(settings.widgetSelector).animate({
                        opacity: 0
                    },function () {
                        $(this).wrap('<div/>').parent().slideUp(function () {
                            $(this).remove();
                            if (iDashboard) {
                                iDashboard.removeWidget($(this));
                            }
                        });
                    });
                }
                return false;
            }).appendTo($(settings.handleSelector, w));
        }

        if (thisWidgetSettings.editable) {
            $('<a href="#" class="edit pull-right"><span class="glyphicon glyphicon-wrench"></span></a>').mousedown(function (e) {
                e.stopPropagation();
            }).click(function(e) {
                e.stopPropagation();
                $(this).parents(settings.widgetSelector)
                    .find('.edit-box').toggle();
            }).appendTo($(settings.handleSelector,w));

            var editBox = $('<div class="edit-box" style="display:none;"/>');
            editBox.append('<ul><li class="item"><label>Change the title?</label><input value="' + $('span.widget-title',w).text() + '"/></li>')
                .append((function(){
                    var colorList = '<li class="item"><label>Available colors:</label><ul class="colors">';
                    $(thisWidgetSettings.colorClasses).each(function () {
                        colorList += '<li class="' + this + '"/>';
                    });
                    return colorList + '</ul>';
                })())
                .append('</ul>')
                .insertAfter($(settings.handleSelector,w));
            iWidget.activateEditBox(editBox);
        }

        if (thisWidgetSettings.collapsible) {
            $('<a href="#" class="widget-collapse pull-left"><span class="glyphicon glyphicon-collapse-up"></span></a>').mousedown(function (e) {
                e.stopPropagation();
            }).click(function(e) {
                e.stopPropagation();
                $(this).css({backgroundPosition: ''})
                    .parents(settings.widgetSelector)
                        .find(settings.contentSelector).toggle(400, function() {
                            var elm = $(this).parents(settings.widgetSelector).find(settings.handleSelector + ' .widget-collapse span');
                            if ($(this).is(':visible')) {
                                elm.removeClass('glyphicon-collapse-down').addClass('glyphicon-collapse-up');
                            } else {
                                elm.removeClass('glyphicon-collapse-up').addClass('glyphicon-collapse-down');
                            }
                        });
            }).prependTo($(settings.handleSelector,w));
        }
    },

    activateEditBox : function(b) {
        var iWidget = this,
            $ = this.jQuery,
            settings = this.settings;

        $('input',b).keyup(function () {
            $(this).parents(settings.widgetSelector).find('span.widget-title').text( $(this).val().length>20 ? $(this).val().substr(0,20)+'...' : $(this).val() );
            iDashboard.updateWidget($(this).parents(settings.widgetSelector), {'title': $(this).val()});
        });
        $('ul.colors li',b).click(function () {

            var colorStylePattern = /\bcolor-[\w]{1,}\b/,
                elm = $(this).parents(settings.widgetSelector).find(settings.handleSelector),
                thisWidgetColorClass = elm.attr('class').match(colorStylePattern)

            if (thisWidgetColorClass) {
                elm.removeClass(thisWidgetColorClass[0]);
            }

            elm.addClass($(this).attr('class').match(colorStylePattern)[0]);
            if (iDashboard) {
                iDashboard.updateWidget($(this).parents(settings.widgetSelector), {'color': $(this).attr('class').match(colorStylePattern)[0]});
            }
            return false;
        });
    },

    addWidgetControls : function () {
        var iWidget = this,
            $ = this.jQuery,
            settings = this.settings;

        $(settings.widgetSelector, $(settings.columns)).each(function () {
            iWidget.addWidgetControl(this);
        });

        $('.edit-box').each(function () {
            iWidget.activateEditBox(this);
        });

    },

    makeWidgetSortable : function(w) {
        var iWidget = this,
            $ = this.jQuery,
            settings = this.settings;
        w.css({
            cursor: 'move'
        }).mousedown(function (e) {
            w.css({width:''});
            $(this).parent().css({
                width: $(this).parent().width() + 'px'
            });
        }).mouseup(function () {
            if(!$(this).parent().hasClass('dragging')) {
                $(this).parent().css({width:''});
            } else {
                $(settings.columns).sortable('disable');
            }
        });
    },

    makeSortable : function () {
        var iWidget = this,
            $ = this.jQuery,
            settings = this.settings,
            $sortableItems = (function () {
                var notSortable = '';
                $(settings.widgetSelector,$(settings.columns)).each(function (i) {
                    if (!iWidget.getWidgetSettings(this.id).movable) {
                        if(!this.id) {
                            this.id = 'widget-no-id-' + i;
                        }
                        notSortable += '#' + this.id + ',';
                    }
                });
                return $('> li:not(' + notSortable + ')', settings.columns);
            })();

        $sortableItems.find(settings.handleSelector).each(function(){
            iWidget.makeWidgetSortable($(this));
        });

        $(settings.columns).sortable({
            items: $sortableItems,
            connectWith: $(settings.columns),
            handle: settings.handleSelector,
            placeholder: 'widget-placeholder',
            forcePlaceholderSize: true,
            revert: 300,
            delay: 100,
            opacity: 0.8,
            containment: 'document',
            start: function (e,ui) {
                $(ui.helper).addClass('dragging');
            },
            stop: function (e,ui) {
                $(ui.item).css({width:''}).removeClass('dragging');
                $(settings.columns).sortable('enable');
                if (iDashboard) {
                    iDashboard.updateWidget(ui.item, {'column': '#' + ui.item.parent().attr('id')});
                }
            }
        });
    }

};

iWidget.init();
