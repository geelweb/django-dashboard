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
            container = $('<li class="widget" id="a-random-slug"></li>');
        column.append(container);
        container.load('/dashboard/widget/load/' + widget.name + '/', function() {
            iWidget.addWidgetControl($('#a-random-slug'));
            iWidget.makeWidgetSortable($('#a-random-slug .widget-head'));

            $('#a-random-slug .widget-head').addClass(widget.color);
            $('span#title', '#a-random-slug .widget-head').text(widget.title);
        });
    }
};

iDashboard.init();
