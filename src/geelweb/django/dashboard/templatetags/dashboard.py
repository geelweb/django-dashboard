from django import template

from django_widgets.loading import registry

register = template.Library()

class WidgetsListNode(template.Node):
    def render(self, context):
        t=template.loader.get_template('dashboard/widgets.html')
        return t.render(template.Context({'widgets': registry.widgets.viewvalues()}))

class DashboardNode(template.Node):
    def render(self, context):
        t=template.loader.get_template('dashboard/index.html')
        return t.render(template.Context())

@register.tag(name='list_widgets')
def list_widgets(parser, token):
    return WidgetsListNode()

@register.tag(name='dashboard')
def dashboard(parser, token):
    return DashboardNode()
