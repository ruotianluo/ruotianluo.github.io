---
layout: post
title: "ICLR 2017 summary"
excerpt: ""
date: 2017-05-18 20:31:28 -0500
comments: true
mathjax: true
---



Thanks greg, thanks tti, so that I can go to ICLR without paper accepted, and also first time travel in France, in Europe. Of course the most important thing is to learn. In order not to forget to write a little summary.

Monday morning

C1: Making Neural Programming Architectures Generalize via Recursion

We have discussed it in our reading group but I was listening carefully. After listening to the author, it's much easier to understand. In short, they used a more powerful training data which includes recursion. The advantage of recursion is to provide a proof of generalization, that is to say if all corner cases pass, all the tasks can be done. (A bit like dynamic programming)

So I think the reason for the good results is that all corner cases were memorized.

C2: Learning Graphical State Transitions

An independent work from an undergraduate, and it's also selected the oral, and the presentation is also very good. The task is to dynamically generate a graph, and he treats the problem of generating the graph as a sequence generation problem, using rnn.

C4: Normalizing the Normalizers: Comparing and Extending Network Normalization Schemes

Div-norm. It's kind of like local instance normalization, plus a little smooth tricks.

C5: Neural Program Lattices

This paper is also the neural program. The difference is that this paper is semi-supervised. Training data contains some input-output only pairs, and some with detailed codes. They use ctc as a loss. It's semi-supervised because the program is provided.

I was wondering if it would be effective to integrate prior knowledge instead of directly providing the programs. For example, if I tell you that you can use recursion, but I only provide input-output data, he will not try to discover to generate a program that uses recursion.

C6: Diet Networks: Thin Parameters for Fat Genomics

Computational biology. Deal with n$$<$$p.

C7: Unsupervised Cross-Domain Image Generation

The task is similar to cyclegan. From real face to cartoon face, and also no paired data. But the method is very different, personally I think that cyclegan is more beautiful, and easier to understand. But there is a problem with cyclegan that it's assumed that the transformation is lossless (so there is cycle consistency), and this paper does not seem to need that assumption.

C8: Towards Principled Methods for Training Generative Adversarial Networks

The father of WGAN.

C10: Paying More Attention to Attention: Improving the Performance of Convolutional Neural Networks via Attention Transfer

Gustav said he already had a similar idea. SCOOPED. This article has three attention in its name, very attractive. It's studying teacher student network (training a shallow one to imitate a deep network). The original method of distillation, that is, hope that the output of the softmax to be similar. This paper says that I want not only softmax similar, but also the attention map to be similar. The attention here is calculated from gradient(Code available)

C14: On Large-Batch Training for Deep Learning: Generalization Gap and Sharp Minima

It's saying that the larger batches are easy to obatain sharp minima, so generalize bad. Small batches are easy to train to flat minima. I do not fully clear about the details.

C16: Nonparametric Neural Networks

They can dynamically add the network node during training.

C17: Learning to Generate Samples from Noise through Infusion Training

It seems to be based on denoising autoencoder idea, that is, from some point of space to approach manifold step by step. But in order to be faster during test, they trained another DAE which is trainied from the skipped steps from the original denoising. That is to say the new DAE has larger steps. Did not look at the paper carefully, maybe wrong.

C21: Snapshot Ensembles: Train 1, Get M for Free

Very simple and effective way. Change the learning rate periodically, and save the snapshot at the end of each period. The final ensembles can perform really well.

C25: Multi-Agent Cooperation and the Emergence of (Natural) Language

A very interesting paper. The motivation is: for example, when you learn a language, you can learn from the vocabularies, grammar etc.,  and also from the practical point of view: even if you can't say a complete sentence, but as long as the receiver can understand the meaning of what you say. This paper discover that through a game of cooperation the two agents can develop their own language.

C26: Efficient Vector Representation for Documents through Corruption

Very simple idea, but it seems quite useful. The paper learns a embedding with better properties, like the stop word has smaller embedding norm.

C30: Reinforcement Learning with Unsupervised Auxiliary Tasks

UNREAL, I have already written a blog post about it.

Monday afternoon:

C4: DSD: Dense-Sparse-Dense Training for Deep Neural Networks

The idea is to first train a network (dense), and then prune the weights to zero whose absolute value is less than a threshold. And then continue the training (dense). So that you can get better results. So DSD can be done many times, and can be improved several times. However, it is said that no one can reproduce the work.

C9: What does it take to generate natural textures?

The paper says that we do not need vgg to generate texture, we can use a random layer of network plus a relu on it. Results look good. Interestingly, there must be a nonlinear layer, relu is better than others like sigmoid.

C16: Adversarial machine learning at scale

Imagenet scale adversarial training. Adversarial training is to hope that the network could be robust to adversarial example robust.

The ways to generate an adversarial example are: 1. to reduce the probability of the true label of the image; 2 to reduce the probability of the current prediciton of the image; 3 to increase the probability the least likely category of the image. The first method has a label leaking problem, resulting in that the the trained network on is more confident on adversarial examples than the real picture. The final result is on method 3 (called step 1.1. in the paper)

C30: Q-Prop: Sample-Efficient Policy Gradient with An Off-Policy Critic

Oral, but I do not fully understand.

C31, C32, C33: I seemed to miss these three poster during the conference.........

C33: Third Person Imitation Learning

Domain adversarial seems very hot. This paper has also been also discussed in my previous post.

Tuesday morning

C6: Mode Regularized Generative Adversarial Networks

Deal with the mode collapse by adding a autoencoder-like reconstruction loss. But there is a problem, how to ensure that the output of the encoder is of the same disctribution as  your samples.

C7: End-to-end Optimized Image Compression

I really like this paper; I discussed this paper in our reading group. In fact, it is a variational autoencoder with fixed lambda. Although they enjoy the same math, but the derivation, including approximation of the quantization is very interesting. The results are also very good.

C15: Introspection: Accelerating Neural Network Training By Learning Weight Evolution

This paper is dank. This is essentially a meta learning problem. They first draw the parameter updating curve during training and found that this curve seems to follow some pattern. So they trained a network, whose input is the random selection of the four old parameter values and output a new paramter value. They trained a two layers mnist convnet, and trained their network using training history of the mnist network. They eventually use the pretrained network to update larger networks (googlenet, vgg etc on imagenet) and the results will be better.

This conclusion is very impressing because I remember some previous meta-learning algorithm can not transfer between different network structures.

C19: A Baseline for Detecting Misclassified and Out-of-Distribution Examples in Neural Networks

TTI's work, from an undergraduate. The high level topic is the deep learning safety: according to the output of the network, distinguish if the input is misclassified or the input could be out-of-distribution.

C23: Unrolled Generative Adversarial Networks

The idea is to prevent mode hopping during G, D training. So during training, unroll the future update, since we know in the future the mode will hop, so now the training can avoid that phenomenon.

C33: Improving Policy Gradient by Exploring Under-appreciated Rewards

The idea is that if the probability of output is low for an action, but the reward it gains is high, the probability of this action will be pushed up harder.

Tuesday afternoon:

C6: Learning to Perform Physics Experiments via Deep Reinforcement Learning

I understand the story, but I did not understand the details. The motivation is that people don't learn from observation, but from interactions of the environment. The task of this paper is given a physical environment, the agent needs to pass some operations (such as poke) to answer some physical questoins (like the quality).

C12: LR-GAN: Layered Recursive Generative Adversarial Networks for Image Generation

Didn't see this paper before. The results are very interesting. The idea is generate foreground and background separately when generating an image. After trained on the bird dataset, the model will find the foreground having the shape of the birds. So it can be considered that this model can unsupervisedly to learn the foreground background segmentation.

C17: Categorical Reparameterization with Gumbel-Softmax

This provides a differentiable argmax operation.

C27: Frustratingly Short Attention Spans in Neural Language Modeling

I did not listen to poster, but I read the conclusions of their paper. The title interesting enough. Basically it's saying lstm is not really long.

Wednesday morning:

C1: Deep Multi-task Representation Learning: A Tensor Factorisation Approach

The paper is talking about when you are doing multi-task training, you mostly manually define which layers to share, which to not share. So he propose to use tensor factorization to find the sharing automatically. That is, although for different tasks, we can train multiple network parameters, but parameters are shard bases. And then by specifying the maximum rank when factorization, you can determine the extent of sharing. (Full rank is equivalent to no share). The idea is cool, but this method needs to be improved, because now it introduced more hyperparameters.

C3: Delving into Transferable Adversarial Examples and Black-box Attacks

The paper discussed that although the adversarial example is transferable, but it's hard to specify the class to cheat. That is to say for a black box network, input a cat-to-dog adversarial generated from another model, it is difficult to be classified as dog in the black box network. This paper found that with adversarial example for one network doesn't work, but examples of multiple models. If we find an adversarial example that can fool a lot of models, that's also easier for fool other models.

C7: Regularizing CNNs with Locally Constrained Decorrelations

A new regularization method. You don't want the weights between the channels be too correalated. Imagine a layer of the network, if the correlation between the channel is high, it's saying some channels are wasted. This paper adds penalty on the weights correlation, hoping the weights to be as orthogonal as possible.

C8: Generative Multi-Adversarial Networks

In order to make GAN stable, the author used several different discriminators. These discriminators can have different network structures. The benefit of doing so is 1. the generator must fool all the discriminators 2. It's easy to get gradient starting from the weak discriminators 3 multiple discriminators are harder to cause mode collapse (at least you can one discriminator for one mode) In fact, there is another paper which has multiple generators and discriminators, and they are connected randomly during training.

C9: Visualizing Deep Neural Network Decisions: Prediction Difference Analysis

This paper tries to visualize the impact of each region on the classification results. There is a similar approach before, replace the area mean value, that is, gray, and compare the results of classification. This paper suggests that instead of using mean, use the marginal probability of the pixel. The meaning is that we are not interested in how changing to grey will affect the result, but how the region changing to other color will affect the result. You can think of gray as an approximation of the marginal. This paper actually also uses an approximation to the marginal, where they replace the pixel by surrounding pixels, and then calculate the classification differences. For each region, this must be done several times to get a better marginal. The reason why the interception of the surrounding background is taken into account is because of the correlation between the pixels. Although this method makes sense, the speed is very low: one image needs 30 minutes.

C10: FractalNet: Ultra-Deep Neural Networks without Residuals

Paper from our group.

C11: Faster CNNs with Direct Sparse Convolutions and Guided Pruning

They design the the convolution layer kernel size by observing the data spectrum. Intuitively, if the spectrum found that data are correlated ouside three pixels, then you can set the convolution size to be 3.

C14: Automatic Rule Extraction from Long Short Term Memory Networks

Visualization for two-class LSTM classifier visualization. For each step of input, it can give a positive and negative score.

C15: Adversarially Learned Inference

Bigan from MILA, almost the same. The only difference is the addition of a noise like VAE.

C22: On Detecting Adversarial Perturbations

The idea is to add a detector in the network to predict whether it is adversarial. But there is a problem, because this adversarial detector also has adversarial examples, so he used the dynamic adversarial training: training data according to the updated adversarial detector. Actually a bit like GAN! Finally he claims that this training will lead to nash equilibrium. (That is, for advesarial detector, the accuray is 0.5?)

C23: Understanding deep learning requires rethinking generalization

Anyway, everyone knows this paper.

C24: Adversarial Feature Learning

Bi-GAN

C30: PGQ: Combining policy gradient and Q-learning

Policy gradient is good, but there is a problem that it's on policy. The sample cost is relatively high. So this article is trying to combine the policy grandient and q learning. He derived a realation between policy to Q value, so that Q function is a function of policy function. So when you are updating the policy gradient, you can update the policy; when you are doing q learning, you can update the policy (because it will go back from q function backprop)

C32: Learning to Navigate in Complex Environments

They used a depth estimation as a auxiliary task. I asked if they tried pixel control in UNREAL, since there's no additional inforamtion needed from the enviroment. They told me they are from different groups, no communications, sad.

Wednesday afternoon:

C1: Learning recurrent representations for hierarchical behavior modeling

I didn't read it. But itshis poster is very hot, people are still around half an hour after the end of the last day.

C7: Amortised MAP Inference for Image Super-resolution

An oral, a little bit messy? Did not read carefully, but in this paper DAE works really bad, however I remember in plug & play, DAE works well.

C10: A Learned Representation For Artistic Style

Google's paper, quick multi-style transformations. 1. Use instance noramlizaiton to do the style transfer. 2. Replace the scale layer of the instance noramlization to achieve different styles.

C11: Learning to Remember Rare Events

Listened carefully for a while. The idea is to add a memory when training a classifier so that the model can remember samples. How to maintain it? When a new sample comes in, find the closest one in memory, and if the closest one has a different class to it, then replace it (the reason for it is simple, because this new sample is more rare). If the class label is the same, merge into this memory slot. Anyway, it looks good. But the maintenance of the memory cost is still very high, according to the author

C19: Tighter bounds lead to improved classifiers

Well, the author suggested to treat classification problem as RL problem, that is, optimize $$\sum_P$$, rather than $$\sum \log P$$. But since it's hard to optimize (he guessed, he had not tried .....), so he made a bound, and optimize the bound rather than directly optimize the objective function (feeling somewhat similar to the EM idea). There is an interesting result, he can improve the training accuracy of the linear classifier on mnist (although it can not improve the test time).

C20: Why Deep Neural Networks for Function Approximation?

A theory paper.

C22: Dropout with Expectation-linear Regularization

This article first makes a theoretical analysis about the gap between ensemble dropout and general expectation dropout during test time. And then they minimize the gap as a regularizer.

C23: HyperNetworks

He has a small RNN, this RNN share weights. He also has a large "RNN", which don't share weighs, but can be infinitely long. Why? Because the weights of the second RNN is the output of the first RNN. So this hypernetwork can change the weight of the second RNN at different times according to the change of input. They do this to increase the capacity of the second RNN, because now it is not mandatory to share weight.

C30: Zoneout: Regularizing RNNs by Randomly Preserving Hidden Activations

Zoneout. Zoneout is the "dropout" on the rnn time dimension, either by maintaining the hidden vector of previous time step or update as usual.

C32: Learning Visual Servoing with Deep Features and Trust Region Fitted Q-Iteration

A variant of Q learning. Add a upper bound and a lower bound, and let the gap of q function to  the two bounds to be as small as possible. The intuition is a little vague for me, but it's effective.
