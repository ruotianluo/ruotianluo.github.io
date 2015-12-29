---
layout: post
title: "How to deal with GPU 'out of memory'"
excerpt: "To be honest, it's not a tutorial to save gpu memory usage. It's more like a discussion. So feel free to comment.
"
date: 2015-12-28 13:17:40 -0600
comments: true
---

To be honest, it's not a tutorial of how to save GPU memory usage. As I said, I'm a newbie to torch, and also to cuda or gpu, and also to any large scale problems. I actually rarely care about memory issues before.

Let's start now. As we have known, GPU is faster in float calculation. But there is one thing that really costs time: communication between main memory and GPU memory.

However with the size of the GPU memory, sometimes we have to save many things in main memory (even in disk), and move to GPU when needed.
So here are some things to take care about:

- Operations that copies value. This is what I met, I tryied to use torch.cat to concatenate two matrices. Suddenly the memory is out of use. Although I don't know why concatenation need memory reallocation, we need to be aware of that issue.
- What needs no memory reallocation (I'm not quite sure): torch.split, torch.concat(in torchx)
- Don't be too urge copying data to GPU. It's not necessary to copy the data if the data doesn't need to do mass calculation. Especially when preprocessing data, like cut-off.
- If the data to calculate cannot fit in the GPU memory, just split it. For example, reduce batch size (for batch gradient descent). Compared to the enhancement of the calculation speed, the cost of moving data is acceptable.
- cutorch provide a function to monitor the usage of GPU memory. (I don't know if there is some debuging tool which can monitor the usage change of GPU memory)
- The GPU memory is limited, don't duplicate the data in it. (Which I did so.)

I haven't found any tutorial on managing GPU memory on torch. If some reader found some thing like that, please comment. Thanks a lot.


