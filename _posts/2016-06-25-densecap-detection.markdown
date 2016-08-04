---
layout: post
title: "Detection using Densecap"
excerpt: "Densecap provides a similar framework of faster-rcnn which however produces captions for each region. I modify it to make it a faster-rcnn"
date: 2016-08-03 01:50:40 -0500
comments: true
---

This post is about my recent(?) github repository [Faster-RCNN-Densecap-torch](https://github.com/ruotianluo/Faster-RCNN-Densecap-torch). Obviously there is a repository called faster-rcnn.torch, but it is never finished. So I built a Faster-RCNN based on Densecap. 

I started doing this more than one month ago (even this blog post was started more than one month ago), but however I was meeting some bottleneck now: the result was not good enough. And I have put this project aside for a while)

In this post, I will

- compare some differences from neuraltalk2 to Densecap.
- introduce some difference between faster-rcnn and densecap and my modification
- show my result and some analysis

# Some differences in design of neuraltalk2 with Densecap

- Put configuration options in a single train_opt.lua file, which is quite common way now. (I saw it in fb.resnet.torch)
- Unit tests. This is actually not a modification; nueraltalk2 also has unit tests. However, the unit tests in Densecap are more organized. (Unit tests are important!) (However it turns out some unit test codes are wrong.....)
- Put evaluation related code in a single file. Better encapsulation.

# Densecap v.s. faster-rcnn

In densecap, it's a concatenated network of four parts. Conv1, conv2, localization layer and recognition network. conv1 and conv2 and recog_base (a part of recogition network) are from a pretrained convnet (vgg-16). However, conv1 is fixed during all training (That's why it's splitted).

Localization layer includes Region Proposal Network and ROIPooling layer. In training time, localization layer takes input of the conv features. And the localization layer outputs the positive and negative regions and their pooled features, as well as the ground truth labels (in voc, there 20 class labels plus backgound). To produce the positive and negative samples, the localization layer needs to know the ground truth (bounding boxes and labels). In testing time, the localization layer provides 300 (or more) proposed regions which are processed by nonmaximum suppression, and the feature of these (No positive and negative in testing). In both training and testing, image size needs to be provided to do ROI pooling.

The recognition layer takes the input of region features and get 'fc8' using recog_base. And the network further do classification and box coordinate regression.

A hacky part of densecap is that the loss on RPN is computed internally in the localization layer. 

Although they are pretty much similar, there are still some differences.

- There are two different sampling strategies in the faster-rcnn. For RPN, they chose 128 anchors which is inside the image bound, and 25% are positive (IOU > 0.7) and 75% negtative(IOU < 0.3). They use these sampled anchors to train the RPN. And in Fast-RCNN part, the sampling strategy is: sample 256 regions, in which halp are positive (IOU > 0.5) and half are negative (0.1 < IOU < 0.5). However, in densecap, they use the same set of sampled boxes and following the RPN sampling stratetries. It's not clear what's the effect.<br>
I have already add an additional layer called AnchorTarget (same as the py-faster-rcnn), which was in anchor_target branch and has been merged to master now. I was suspecting it's because the sampling strategy makes the network worse than original faster-rcnn, however it turns out the new layer is not helping.

- No ground truth feeding to the fast-rcnn part. (I may put it on schedule some day. Not super complicated)
- ROI pooling layer is differentiable. (Not known how this affects result. Actually we can still train end-to-end without making it differentiable)


- **Captioning to detection (of course this is a differnce)**<br>
The basic idea is to replace the language model with a classifier.<br>
The good thing is, the input and output and target of the linear classifier is almost the same as that of language model. Except for for each region the caption is a sequence of indices, however for class label is just a length-1 sequence of index.<br>
The main change is in preprocess.py and the DataLoader part.

- The evaluation code in densecap is based on there own designed metric, but fortunately they provide some good encapsulation of evaluator and the code for calculating average precision which is also useful for me. In the evaluation, I created 21 evaluators, among which evaluator[0] is measuring the AP of RPN, and the other 20 evaluators are used to evaluate the result of 20 classes.

# Result
Currently I trained using voc2012-trainval + voc2007-trainval and test on voc2007-test (although I said test, but more or less I regard this as a validation set). The result is much worse than the faster-rcnn paper. The mAP is around ~0.6.

The main problem I think is because the RPN is not working properly. In the paper they had a graph showing that the recall at 300 of the RPN is 1.0. But my recall is only ~0.4.

I will get back to this some time in the future to see what is happening.