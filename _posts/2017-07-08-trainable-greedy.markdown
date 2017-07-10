---
layout: post
title: "Reading notes: trainable greedy decoding"
excerpt: ""
date: 2017-07-08 19:30:28 -0500
comments: true
mathjax: true
---

If you have read my previous [post](http://ruotianluo.github.io/2017/01/20/rl-image-captioning/), you should know that if you want to use reinforcement learning to do sequence predcition, the current mothods assumed that the model samples the word according to the output probability of the network so that you could use the reinforce algorithm. In fact, during generation, we never use sample, but use greedy decoding, or beam search (at least in NMT and image captioning). According to my own experiment, using cross entropy loss to train a model, sample gives poor result: if the greedy decoding can achieve 0.8 CIDER, sample can only get 0.4. Qualitatively, it can also be found that the result of the sample will be incorrect at some words.


If you use reinforce to train, your actual training goal is not to improve greedy decoding output but your sample outputs. If you run my [self-critical code](https://github.com/ruotianluo/self-critical.pytorch) (reinforce a variant) code, you will find that sample, greedy decoding or beam search give almost identical output. My understanding is REINFORCE doesn't care diversity, and is very mode seeking. The goal is just to get a high CIDER score mode (you will find reinforce will destroy perplexity). (In fact I do not have the actual evidence saying that the final distribution is single mode, because I only see one mode, you may use the diversity beam search algorithm to see if there are other modes)


So to get better sample result, the model sacrificed diversity, to achieve high CIDER.


Secondly, there is actually training test discrepency, because sample is used during training, but greedy decoding (or beam search) is used during test. Although we can actually get better test result by training by sample, but in fact it's just a side effect. It would be interesting that how we can directly optimize greedy decoding?

In [this paper](https://arxiv.org/abs/1702.02429), they propose a way to train directly greedy decoding. They use the RL algorithm in a different perspective, which is inspiring to me.

## Method

Look back at rl settings. The general RL is, given an enviroment, you want to get an agent that look at the enviroment state and make an action; the environment would give you a reward. You want your agent get as more reward as possible.

In the previous RL method, our agent is an RNN: the input is state (the hidden vector from previous time step) and the current action, and the output is an action, sampled from a multinomial distribution (softmax output). The range of action is all the words. The environment is actually the CIDER score.


However, the idea of ​​this article is: treat the whole rnn + greedy decoding + cider score as an environment; state is still the rnn hidden vector, however the agent is now a function whose input is the state, and output is a noise vector. The noise vector will be added on to the original hidden vector, and then be sent through fc + softmax + greedy decoding + cider score to get the reward.


So now, the entire environment a function, which takes a noise vector as input and outputs the reward of the output of the greedy decoding after the hidden vector is perturbed. If you treat rnn as part of the environment, then it doesn't matter if you use sample, greedy decoding or beam search, because the model-free RL method does not care how environment works.


(The choice of action does not constrain to a noise vector. The reason they use noise vector is because their previous paper NPAD has found that if the hidden vector is added on a noise vector, the result could be better. Another understanding is that the agent here is actually a residual module.

The change of the thinking (decoding as a part of the environment rather than the action of the agent) is essencial. In fact, the action can also be other things, even the entire network parameters.


Since the current action is deterministic real value, they use the DDPG algorithm. Due to the instability of the critic, they modify the algorithm a little bit and propose the critic-aware algorithm, that is, when critic is bad, the esitimated gradients will be neglected.


That's all.
