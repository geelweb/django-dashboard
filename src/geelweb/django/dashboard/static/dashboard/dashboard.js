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
        return [
            {'name': 'ClockWidget', 'column':'#column2', 'title': 'Paris', 'color': 'color-blue'}
        ];
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
            slug = Math.random().toString(36).substring(7),
            container = $('<li class="widget" id="'+slug+'"></li>');
        column.append(container);
        container.load('/dashboard/widget/load/' + widget.name + '/', function() {
            iWidget.addWidgetControl($('#' + slug));
            iWidget.makeWidgetSortable($('#'+slug+' .widget-head'));

            if (widget.color) {
                $('#'+slug+' .widget-head').addClass(widget.color);
            }
            $('span#title', '#'+slug+' .widget-head').text(widget.title);
        });
    },

    addWidget : function(widget_name)
    {
        this.renderWidget({'name': widget_name, 'column': '#column1', 'title': widget_name});
    },
};

iDashboard.init();
