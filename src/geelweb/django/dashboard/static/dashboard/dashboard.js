var iDashboard = {
    jQuery : $,

    settings : {
    },

    init : function()
    {
        this.widgets = this.getWidgets();
        this.renderWidgets()
    },

    getWidgets : function()
    {
        if (!('localStorage' in window && window['localStorage'] !== null)) {
            return [];
        }

        if (!localStorage.widgets) {
            return [];
        }

        return JSON.parse(localStorage.widgets)
    },

    renderWidgets : function()
    {
        for (var i=0; i<this.widgets.length; i++) {
            var widget = this.widgets[i];
            this.renderWidget(widget);
        }
    },

    renderWidget : function(widget)
    {
        var $ = this.jQuery,
            column = $(widget.column),
            container = $('<li class="widget" id="'+widget.slug+'"></li>');
        column.append(container);
        container.load('/dashboard/widget/load/' + widget.name + '/', function(responseText, textStatus, XMLHttpRequest) {
            iWidget.decorateWidget($('#' + widget.slug));
            iWidget.addWidgetControl($('#' + widget.slug));
            iWidget.makeWidgetSortable($('#'+widget.slug+' .widget-head'));

            if (widget.color) {
                $('#'+widget.slug+' .widget-head').addClass(widget.color);
            }
            $('span.widget-title', '#'+widget.slug+' .widget-head').text(widget.title);
        });
    },

    addWidget : function(widget_name)
    {
        var widget = {
            'name': widget_name,
            'title': widget_name,
            'slug': Math.random().toString(36).substring(7),
            'column': '#column1',
        };
        this.widgets.push(widget);
        this.renderWidget(widget);
        this.saveDashboardState();
    },

    saveDashboardState : function()
    {
        if (!('localStorage' in window && window['localStorage'] !== null)) {
            return;
        }

        localStorage.widgets = JSON.stringify(this.widgets);
    },

    removeWidget : function(elm)
    {
        var slug = elm.find('.widget').attr('id');
        for (var i=0; i<this.widgets.length; i++) {
            if (slug == this.widgets[i].slug) {
                this.widgets.splice(i, 1);
                break;
            }
        }
        this.saveDashboardState();
    },

    updateWidget : function(elm, settings={})
    {
        var slug = elm.attr('id');
        for (var i=0; i<this.widgets.length; i++) {
            if (slug == this.widgets[i].slug) {
                this.widgets[i] = $.extend({}, this.widgets[i], settings);
                break;
            }
        }
        this.saveDashboardState();
    },
};

iDashboard.init();
