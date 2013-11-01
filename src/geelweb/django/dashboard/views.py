from django.http import HttpResponse
from django.template import RequestContext
from django_widgets.loading import registry

def load_widget(request, widget_name):
    widget = registry.widgets.get(widget_name)
    return HttpResponse(widget.render(RequestContext(request)))
