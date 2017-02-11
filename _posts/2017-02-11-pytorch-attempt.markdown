---
layout: post
title: "My first attempt on Pytorch"
excerpt: ""
date: 2017-02-10 19:30:28 -0500
comments: true
mathjax: true
---

Maybe I'm too stupid, but pytorch is a much easier tool to use compared to tensorflow.

I wrote a prototype of image captioning model using pytorch in two days. The link is [here](https://github.com/ruotianluo/neuraltalk2.pytorch).

For pytorch, you don't need to think about each node to be a operation in the graph. And you don't need to use tf.cond, tf.while, ... to build your graph. In pytorch, every things is what it is. You can print out the value of the variable after you compute it. You can use a normal while loop; you can use a normal if statement. Everything is the same as what was in original python.

The pytorch is also a computational graph system, however, it only exists in the backend. The way they build the graph is, build the graph when they are executing: the while loop was not in the graph until the loop is run.

One big advantage of pytorch is you can easily run some code which is not in the graph. For tensorflow, you'd better put every calculation in the graph, so that you could have them run in c++ and cuda. The more you want to put in the graph, the uglier the code would be. The seperation between the tensorflow session and python makes people so unpleasant. However, in pytorch, you can use the algorithm written for cudatensor just under python.

(Think of beam search, the current way people does it, is to send it back and forth into the session, which is so inconvenient.)

Up to now, I'm using someone's vgg and resnet code for my project. The tensorflow provides official model zoo, however, they don't provide the example code to use it, and stupid me can't make the official one to work...... However in pytorch, loading a pretrained model is only one line!

-------

The former are mostly my complaints about tensorflow. Tensorflow is definitely good, and computational graph could be much faster if optimized well (which is not true in tf now). But it's definitely not a good tool for researchers, because it's to complicated for building prototypes. However, pytorch, even torch is more friendly for research.

Here is some experience of my experience using pytorch:

- If you want something in your graph, make it a Variable. If you want it to be some constant (relative to the graph), you could do these calculation using torch.Tensor.
- If you want to do stop_gradient of v, you can use v.detach() or do `Variable(v.data)`, detach doesn't work well now, but the later one means you create a new Variable using the data of v. The new variable is not connected to the previous v.
- Or, you could use Variable(xxx, requires_grad=False) when you build the variable, for example, like input variable. But it could only be used if you are creating the variable. The immediate variable can only be detached using the previous way.
- If you run forward multiple times(like during inference), but no backward, all the immediate states would be saved, and won't be overwritten. So if you don't do anything, you will get 'out of memory' (true story). The first thing is to detach all the variables using the previous two methods. The states won't be saved if they are needed to calculate the gradient of variables. The second method, is you can use `volatile` option of Variable. if volatile is true, then the states won't be saved. A good property of volatile is, it is 'contaiminated'. If any input of the operation is volatile, then the output variable is also volatile. It's useful when you want to do inference. You can forget all the states without doing anything to the origina 'graph', just let the input variable be volatile.
- If you don't backward, the states would all be saved. However, once you do backward, all the immediate states would be removed. If you still want the states, for example, to do another backward, you can use `retain_variables=True` in the option of backward.

Note: the states here has general meanings. For example, for a fully connected layer, if you want the gradient of W, the input tensor has to be saved. However, if you only want to do inference, the input tensor could be thrown. This is the difference of saving the states and not.

---

In the end, all these above are my own opinions. I could be very short-sighted. I think although pytorch is still in beta version, it's very promising, at least I think in academia.

