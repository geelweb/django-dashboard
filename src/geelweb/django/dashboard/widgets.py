from django_widgets import Widget

class ClockWidget(Widget):
    name = "Clock Widget"
    description = """
    Widget to display a clock. Inspired by
    http://www.script-tutorials.com/html5-clocks.
    """
    template = 'dashboard/widgets/clock.html'

class HelloWidget(Widget):
    name = "Hello World"
    description = "Display an Hello World message"

    def render(self, context, value=None, options=None):
        return u'Hello world!'
