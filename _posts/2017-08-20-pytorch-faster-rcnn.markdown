---
layout: post
title: "Some coding work: faster-rcnn under and captioning codebase under pytorch"
excerpt: ""
date: 2017-08-10 15:20:41 -0500
comments: true
mathjax: true
---

#Faster-rcnn

I feel like I'm doing faster-rcnn every summer, which I don't know why. I have a [post](http://ruotianluo.github.io/2016/08/03/densecap-detection/) last year about changing the densecap code to make it a detection model under torch. That model actually is not able to replicate the result (I actually know why now. Don't backprop offset through the Spatial transformer network.)


The motivation last year is that I want to have a faster-rcnn to enhance the captioning results. This year is actually another story.


The reason is my intern fellow told me that he's using tensorflow faster-rcnn. As a pytorch fanatic, I asked why not use pytorch version. And he told me that the existing pytorch version can't reproduce the result in the paper. Then I think, I should do this! (From some unknown confidence that I know faster-rcnn)

Of course, I did not make wheels from scratch; the fellow told me that he used tf-faster-rcnn, which is very good. So I clone from tf-faster-rcnn clone, start to port it into pytorch.

The good thing is I also know tensorflow, so it didn't take me too long to convert the majority of the code. Instead, the devil is in the detail.


Anyway, the current version at least almost match pascal voc results with tf-faster-rcnn. (Although there is always a 1 mAP gap, don't know why.)

For coco, I can get even better result using res101. However, the vgg result is much worse than tf-faster-rcnn. (I have no idea why. But, that's vgg, who cares vgg now. It's 2017.)

The github link of this project is [here](http://link.zhihu.com/?target=https%3A//github.com/ruotianluo/pytorch-faster-rcnn). The pretrained models are provided.



Some insignificant things (but actually take me a lot of time)

1. tensorboard

Although I hate tensorflow very much, I love tensorboard!

Visdom looks good, but it's somewhat less satisfying. (I saw some tensorboard-like inferface for visdom, but didn't have time to look in detail.) 

As the original tensorflow version does summary operation on graph node, and get the summary when running the session. In pytorch, I have no tensorflow graph nodes, so I can't use summary op directly. 

The solution is I created a special graph with only placeholders and summary operations. When you run the session, the only thing you do is collect the summaries.

Although it is stupid, but at least gave me tensorboard visualization of the results.


Then I found one thing called tensorboard-pytorch...........

(Actually there were some standalone tensorboard version, like crayon, the one from mxnet, but they only support some of the functions). Tensorboard-pytorch is the first one I've seen that supports almost all tensorboard features (you can even visualize the pytorch calculation graph). Although you need to install tensorflow to use this, but installing a tensorflow is very convenient.


The code on github now hasn't been changed to use tensorboard_pytorch, because other than this one, there are some other projects emerging recently like inferno, tensorboard_logger etc. So, I'll wait and see.



2. python layers

Both original py-faster-rcnn and tf-faster-rcnn have python layer in the middle. It's taking out the results of the network, and do some operations under python.

In fact it's actually very simple to use python layers in pytorch (much simpler than tensorflow). But I just want everything to be under pytorch.

Another reason is the `crop_and_resize` function is implemented using spatial transformer network (crop_and_resize is a substitution for roi pooling, said performing better), so I thought if everything is under pytorch, you can get offset gradient from stn (however that hurts result).



So I spent a lot of time to modify these layers.

1) nms under gpu

The first attempt is to follow densecap: they have gpu nms using torch. However, it's super slow.

Then I thought about the gpu_nms provided in the py-faster-rcnn and port it into pytorch. (Why do we need to rewrite the gpu_nms when there is one. The reason is the original gpu_nms takes numpy array as input. It's inefficient now because essentially our cudatensors are converted to cpu numpy array and are copied to cuda in gpu_nms. This is a waste of time and spacce (althought it's a subtle waste).)


Then I used cffi to write pytorch operations. The original nms_kernel can be divided into two parts, one is calculating overlap, written in cuda, and the second is suppressing boxes based on overlap which is done under cpu.

I tried do suppression under gpu in my first version: opening a single-threaded kernel..... SLOW!!!

Then I put the supression back to the cpu. Much faster.

(Takes time to understand TH APIs... feel like I can write c again (always forget to write semicolon ....))



2) numpy argsort and torch.sort

It's favorable to use torch.sort because it's run in parallel. However, when debugging, I tried to match nms results, but failed all the time.

And later I found that it's becasue the sorting results are different: torch.sort has a weird behavior for same value elements. You can check it [here](http://link.zhihu.com/?target=https%3A//discuss.pytorch.org/t/order-of-equal-elements-after-torch-sort/5946)

It took me a long time to locate this stupid reason.


3) np.random.choice vs torch.multinomial

There is a step `sample_roi` in `proposal_target_layer`, which does uniform selection of proposal. At first I used torch.multinomial, with all same probability as input. It's super super slow (Averagely 0.02 seconds per iteration) 

Then I used np.random.choice. Way faster (0.003 sec ...)

4) some thing else

Although the nms layer is now faster (about 0.01 second a iteration), the `proposal_target_layer` is still slower than than the original tf=faster-rcnn (0.003 sec per iteration.) But it's not the bottleneck.

Just one tip here, indexing on cuda tensor is really slow. Don't do it if not necessary.

5) bbox_overlap

Previously the bbox_overlap function is implemented in cython. To make the code consistent, I changed it to numpy and torch, which uses basic np and th math operations. In principle these operations should be multi-threaded, and faster than single-thread (the cython version), however the sython version is actually 10 times faster.....
It's not bottleneck either but it's an interesting fact.


#Captioning codebase

I update my neuraltalk2.pytorch code. The README should be much cleaner and consistent; the pretrained models are on. And supports a lot of different captioning models. I achieved 6-th place on the coco captioning leaderboard using my code with single model (with self critical sequence training method).
