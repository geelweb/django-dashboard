function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}
//var csrftoken = $.cookie('csrftoken');
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
            // Send the token to same-origin, relative URLs only.
            // Send the token only if the method warrants CSRF protection
            // Using the CSRFToken value acquired earlier
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

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
        container.load('/dashboard/widget/load/' + widget.name + '/', widget.settings, function(responseText, textStatus, XMLHttpRequest) {
            iWidget.decorateWidget($('#' + widget.slug));
            iWidget.addWidgetControl($('#' + widget.slug));
            iWidget.makeWidgetSortable($('#'+widget.slug+' .widget-head'));

            if (widget.color) {
                $('#'+widget.slug+' .widget-head').addClass(widget.color);
            }
            $('span.widget-title', '#'+widget.slug+' .widget-head').text(widget.title);
            $('input[name="title"]', '#'+widget.slug).attr('value', widget.title);

            var settings_inputs = $('input[name^="settings["]', '#'+widget.slug);
            for (var i=0; i<settings_inputs.length; i++) {
                if (!widget.settings) {
                    continue;
                }
                var n = $(settings_inputs[i]).attr('name');
                var r = new RegExp("settings.'([^']+)'.");
                var p = r.exec(n)[1];
                $(settings_inputs[i]).attr('value', widget.settings[p]);
            }

            var settings_selects = $('select[name^="settings["]', '#'+widget.slug);
            for (var i=0; i<settings_selects.length; i++) {
                if (!widget.settings) {
                    continue;
                }
                var n = $(settings_selects[i]).attr('name');
                var r = new RegExp("settings.'([^']+)'.");
                var p = r.exec(n)[1];
                $(settings_selects[i]).val(widget.settings[p]);
            }
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

    updateWidget : function(elm, settings)
    {
        settings = settings || {};

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
