---
layout: post
title: "Start with torch"
excerpt: "For newbies who first get hands on deep learning and torch."
date: 2015-12-14 19:15:40 -0600
comments: true
---

Here comes the first meaningful post. This post will talk about some basic tips(?) for torch. 

Personally, I started to use torch three months ago (when I started PhD). I had few experiences in deep learning. I tried some about caffe and theano before but basically remain stick to the tutorial. So this may suit for those newbies like me, but for those who switched to torch, ... 

# Start from beginning
Installation is actually quite easy. Check [torch.ch](torch.ch). It's actually stupid operations, just follow it.
If you want to update torch, try {% highlight bash%}
luarocks install torch
{% endhighlight %}
I didn't try this. Found on Google Groups discussion. (It's surprising that luarocks doesn't has upgrade or update).

#Further into it
The [cheatsheet](https://github.com/torch/torch7/wiki/Cheatsheet) is really helpful.

- The [newbie](https://github.com/torch/torch7/wiki/Cheatsheet#newbies) docs can help learn lua and torch briefly. (I'm still a little confused about metatable.) The biggest difference between torch and theano is that theano is symbolic which is harder to debug (although I'm not familiar theano); torch instead, is much easy to start in some sense especially if you are not familiar with symbolic language. And Torch enjoys better performance.
- For NLP guys, it's good to start with karpathy's [char-rnn](https://github.com/karpathy/char-rnn). The code is easy to deploy and read. It gives a good example of how to encapsulate data and use optim module.
[Oxford Machine Learning course](https://github.com/oxford-cs-ml-2015) is also a good option (or even a better option). Char-rnn is actually based on the code of practice code.
If you want to see some interesting results before understanding the code, read karparthy's blog and try some toy material. It's always better to see something at first rather than start with cold(?) code.
- For computer vision guy. Eh, although I'm a cv guy, but I haven't gone very far. I know [dp](https://github.com/nicholas-leonard/dp) is a good module, it has good abstract of data, modules, optimizations etc. However, since I'm not familiar with pylearn2 (could say dp's father), I still need to spend some time to look at it.

#Bugs I met
- The size of t7 file. There is a memory limit for torch table, so don't try to put too much things to a table, and don't try to save into a file.
- Instead, the Tensor of torch can exceed the memory limit. Yeah! Torch rocks.
- I am using * zbs-torch * which is a light IDE. It's easier to debug. But what sucks is sometimes the code works in terminal **th**, but doesn't work in zbs-torch (I'm still looking for the reason). So try run the code in terminal, and you can always use * mobdebug * module.

I hope this could be a useful file, and I will keep updating.
