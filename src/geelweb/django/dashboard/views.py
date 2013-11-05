from django.http import HttpResponse, HttpResponseNotFound
from django.template import RequestContext
from django_widgets.loading import registry

def load_widget(request, widget_name):
    widget = registry.widgets.get(widget_name)
    if widget is None:
        return HttpResponseNotFound()

    value=None
    options=None
    if request.POST:
        options = request.POST.copy()

    return HttpResponse(widget.render(
        RequestContext(request),
        value,
        options))

