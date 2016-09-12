---
layout: post
title: Hello, World!
---
First post on this Jekyll-based Github-hosted blog.

{% highlight ruby %}
def show
  @widget = Widget(params[:id])
  respond_to do |format|
    format.html # show.html.erb
    format.json { render json: @widget }
  end
end
{% endhighlight %}
