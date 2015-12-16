---
layout: post
title: "Learn torch from a <b>COOL</b> application: using DL to imitate artistic style"
excerpt: "It's a super <b>cool</b> stuff, trying to transform a normal picture to a given artistic picture style. And you can try it by yourself and meanwhile learn torch.
"
date: 2015-12-15 16:19:40 -0600
comments: true
update_date: 2015-12-16 16:19:40 -0600
---
**Update: I add some more details of principle at the end of the post.**

This posts will cover this cool application: given a content picture and an artwork, generate a new picture with content of the content picture and style of the artwork. The following picture is copied from their paper.
<div> <img src="/assets/neural_style/neural_style.jpg" title="What neural styles does!"></div>
Em.. Unfortunately there will be no more pictures in the post.

You can browse their [github](https://github.com/jcjohnson/neural-style), there are plenty of demos. And you can also read their paper, to understand the principle or see more pictures.

It is similar to many image reconstructions using neural network: instead of optimizing network weights, fix the weights, and do gradient descent on image input. So, what we need is how to define the loss.

First, forget about the loss. Let's see what we can learn from their code.

1. How to use VGG.
2. ......Em, this is enough for a newbie like me.

So, have fun. :)

<s>(I am going to Chinatown for dinner. Will update if have deeper understanding of this work.)</s>

----

##Update:##
I tried some more.
<div> <img src="/assets/neural_style/lowpoly.png" title="Low poly."></div>
<div> <img src="/assets/neural_style/mondrian.png" title="Mondrian"></div>
Can you tell what these two styles are. Honestly, the Mondrian one looks really bad, but you can still tell. And the low poly one works really good (you cannot ask too much).


------


### More details in principle: ###
There are two kinds of reconstruction in this work. One is called content reconstruction. It tries to reconstruct the input image using the feature of original image (in different layers) and the preset network. The objective is to let the generated image and the original image have the nearest features in the same layer. So the loss function is square loss.

Another reconstruction is a little trickier, called style reconstruction. The only difference to content reconstruction is the objective. We don't care about content of the image; we care about the style, or in another word, pattern. So, to lead to this final objective, the author defines a matrix called Gram matrix. For each layer, there is a Gram matrix, which is correlation matrix of different filter responses on this layer. That is, for each layer, we have multiple channels, for each channel, we have a filter response (either pooling or rectfication or convolution), then for each pair of filter responses, we calculate a correlation, so finally there is a square correlation matrix.

The loss is the square loss between gram matrix of generated image and original image. So, here what the author claims is that this gram matrix can capture the similarity of the style of different images.

There is an example of style reconstruction and content reconstruction in their paper.

So, how do we generate the artistic picture? For lower layers, we calculate loss of style reconstruction, and for higher layers, we calculate loss of content reconstruction. And to minize the aggregated loss, we can generate a cool picture.

