from django_widgets import Widget

class ClockWidget(Widget):
    name = "ClockWidget"
    description = """
    Widget to display a clock. Inspired by
    http://www.script-tutorials.com/html5-clocks.
    """
    template = 'dashboard/widgets/clock.html'

class HelloWidget(Widget):
    name = "HelloWidget"
    description = "Display an Hello World message"

    def render(self, context, value=None, options=None):
        return u'Hello world!'
