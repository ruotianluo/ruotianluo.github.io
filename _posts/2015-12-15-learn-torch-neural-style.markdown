---
layout: post
title: "Learn torch from a COOL application: using DL to imitate artistic style"
excerpt: "It's a super cool stuff, trying to transform a normal picture to a given artistic picture style. And you can try it by yourself and meanwhile learn torch.
"
date: 2015-12-15 16:19:40 -0600
comments: true
---

This posts will cover this cool application: given a content picture and an artwork, generate a new picture with content of the content picture and style of the artwork.
<div> <img src="/assets/neural_style.jpg" title="What neural styles does!"></div>
Em.. Unfortunately there will be no more pictures in the post.

You can browse their [github](https://github.com/jcjohnson/neural-style), there are plenty of demos. And you can also read their paper, to understand the principle or see more pictures.

It is similar to many image reconstructions using neural network: instead of optimizing network weights, fix the weights, and do gradient descent on image input. So, what we need is how to define the loss.

First, forget about the loss. Let's see what we can learn from their code.

1. How to use VGG.
2. ......Em, this is enough for a newbie like me.

So, have fun. :)

(I am going to Chinatown for dinner. Will update if have deeper understanding of this work.)