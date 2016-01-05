---
layout: post
title: "Exceed Lua Heap Limit"
excerpt: "As I mentioned before, there is the annoying Lua Heap Limit. This is some solution."
date: 2016-01-05 15:17:40 -0600
comments: true
---

As I mentioned in previous posts, one big problem I met in Lua is the Lua Heap Limit (1Gb for 64-bit, 4Gb for 32-bit). It seems to be the problem of LuaJIT.

Here is a [stackoverflow reference](http://stackoverflow.com/questions/27015150/how-to-get-past-1gb-memory-limit-of-64-bit-luajit-on-linux).

It's detailed enough. To summarize, ffi which use C, can escape from LuaJIT (Only when using malloc). And lds is based on ffi, which has Array, Vector, and Hash-map. Another I know can exceed the limit is fb.ffivector, which obviously is based on ffi. I'm not sure about the difference between these.

Of course, follows my last post, you can use fb.python, can also exceed the memory limit.