from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    url(r'^widget/load/(?P<widget_name>\w+)/$', 'geelweb.django.dashboard.views.load_widget'),
)
