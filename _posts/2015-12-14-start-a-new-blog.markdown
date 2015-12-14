---
layout: post
title:  "Start a new blog using Jekyll"
date:   2015-12-14 12:56:30 -0600
comments: true
categories: jekyll update
---
Here is the new blog. I really hope I can manage it quite well.

This blog is in Jekyll, em.... Yeah, Still working on it.

The Jekyll website is useful, but not good to start (I think). The best way to start is to download someone's code, much more convenient (I realized it quite late).

Here is some reference.

I borrowed many instructions form this [blog](http://joshualande.com/jekyll-github-pages-poole/), including disqus and google analytics.

About google analytics, I set up a new tracking id for my blog which is not that consistent. There is something called cross domain tracking which can aggregate the user information of both sites (and can recoginize the same user entering both site, which is not true for two tracking ids). Here is [one](https://support.google.com/analytics/answer/1034342?hl=en), which seems to add a invisible link between two sites. Another is [this](https://www.optimizesmart.com/cross-domain-tracking-in-universal-analytics-demystified/), which actually covers several different ways.

For Disqus snippet, [this one](http://www.perfectlyrandom.org/2014/06/29/adding-disqus-to-your-jekyll-powered-github-pages/index.html#disqus_thread) is helpful, it covers more about how to add comments count.

Update: I'm now using the allowlinker methods for cross domain tracking. But I still use two different tracking ids. I'll see how this works.
