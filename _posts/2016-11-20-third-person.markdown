---
layout: post
title: "Reading notes: Third person imitation learning"
excerpt: ""
date: 2016-08-04 10:50:40 -0500
comments: true
mathjax: true
---

I have planned to write down some reading notes for a long time. Finally got a chance to do so.

### Title: Third person imitation learning

**By OpenAI**, [Paper link](https://openreview.net/pdf?id=B16dGcqlx)

#### **Background**

This paper is about imitation learning in reinforcement learning. Imitation learning is to learn the policy from the actions and states (trajectories) of an expert instead of maximizing expected reward. The benefit is, first, no need to specify a reward; second, presumably faster to learn. Recall that, the supervised learning of policy network in AlphaGo is exactly imitation learning.

However, one limitation of imitation learning is, the viewpoint of the expert should be the same as that of the learning agent. However, human can learn things from a third person view point. For example, we can learn cooking by looking at other cooking. So in this paper, the authors propose a method to do imitation learning from third person viewpoint, without knowing the relation between third person viewpoint and first person viewpoint.

#### **Related work**

This paper use the idea from [Generative Adversarial Imitation Learning](https://arxiv.org/pdf/1606.03476v1.pdf), which uses GAN to do first person imitation learning.

$$\max_{\pi_\theta}\min_{\mathcal{D}_R} - \mathbb{E}_{\pi_\theta}[\log \mathcal{D}_R(s)] - \mathbb{E}_{\pi_E}[\log(1- \mathcal{D}_R(s))]$$

This is similar to the form of GAN. Recall that GAN is learning a generator that the discriminator cannot tell the generated images from real images. Here the GAN is trying to learn a policy that the discriminator cannot tell the state \\(s\\) is originated from a imitator policy or an expert policy. From the theory of GAN, we know in the end, the discriminator will be unable to classify the states, so that the policy can behave similar to expert policy.

To similify the expression:

$$\max_{\pi_\theta}\min_{\mathcal{D}_R} \mathcal{L}_R = \sum_iCE(\mathcal{D}_R(s_i), c_{l_i})$$

\\(s_i\\) is state \\(i\\), \\(c_{l_i}\\) is the class label (if the state is from expert or non-expert). \\(CE\\) is cross entropy loss.

#### **To third person**

First modification is: instead of using states as the input of discriminator, they use the embedding of observations here. The reason is the states here are not necessarily in the same space any more and neither do observations. So they use a feature extractor \\(D_F\\) to embed the observations into the same space.

To ensure that the \\(D_F\\) embeds the observations into the same space, the features should contains no information regarding the domain label. (i.e. third person view vs. first person view. In the paper, the authors refer to expert vs. novice domain)

This leads to a constaint optimization problem:

$$\max_{\pi_\theta}\min_{\mathcal{D}_R} \mathcal{L}_R = \sum_iCE(\mathcal{D}_R(D_F(o_i)), c_{l_i}) \\
s.t. \mathsf{MI}(D_F(o_i); d_{l_i}) = 0
$$

MI means mutual infomation, which is the second modification.

However, how to describe MI in math? They use another GAN. They introduce another discriminator \\(\mathcal{D}_D\\), which tries to tell if the feature is from first person view or third person view. In the end, the feature extractor \\(D_F\\) should be able to fool the discriminator, so that the features from different views can be in the same space. (I think their original idea is from [this](https://arxiv.org/pdf/1409.7495v2.pdf), but I interpret it differently)

**From now, the formula may be different from the paper, because I think there are some flaws in the paper.**

$$\max_{D_F}\min_{\mathcal{D}_D} \mathcal{L}_D = \sum_iCE(\mathcal{D}_D(D_F(o_i)), d_{l_i})$$

To combine this two GANs, they have

$$\max_{\pi_\theta}\min_{\mathcal{D}_R}\max_{D_F}\min_{\mathcal{D}_D} \mathcal{L}_R + \lambda\mathcal{L}_D = \sum_iCE(\mathcal{D}_R(D_F(o_i)), c_{l_i}) + \lambda\sum_iCE(\mathcal{D}_D(D_F(o_i)), d_{l_i})$$

where \\(\lambda\\) is a trade-off term between two losses.

Now comes another modification: instead of using the observation feature of one time point as the input of \\(\mathcal{D}_R\\), they use two frames so that the input conatins the enviromental change affected by the agent's actions. 

$$\max_{\pi_\theta}\min_{\mathcal{D}_R}\max_{D_F}\min_{\mathcal{D}_D} \mathcal{L}_R + \lambda\mathcal{L}_D = \sum_iCE(\mathcal{D}_R(D_F(o_i), D_F(o^\prime_{i})), c_{l_i}) + \lambda\sum_iCE(\mathcal{D}_D(D_F(o_i)), d_{l_i})$$

where \\(o^\prime_i\\) is the observation \\(n\\) frames after \\(o_i\\)

#### **Training**

Data:

In principle, we only need the traces of an expert from third person view. So that during training, we only have non-expert from first person view, and an expert form third person view. It's will be too easy for the two discriminators because the features are too different so that you can use eithor view information or policy information to discriminate.

To help training, they also collect the third person non-expert. In this case, \\(\mathcal{D}_R\\) has to be able to tell from expert from non-expert.

Optimization:
The training is still split into two stages, and the model is trained iteratively. They split after the first max, which means, first do \\(\max_{\pi_\theta}\\) and then do 
$$\min_{\mathcal{D}_R}\max_{D_F}\min_{\mathcal{D}_D}$$. To deal with the $$\max_{D_F}$$ among the $$\min$$s, they use a **gradient reverse layer** $$\mathcal G$$. Which forwards in the same way, but flip the sign when backpropogating. This mean, instead of minimizing the objective, maximizing it. So they turn the whole optimization into:

$$\max_{\pi_\theta}\min_{\mathcal{D}_R, D_F, \mathcal{D}_D} \mathcal{L}_R + \lambda\mathcal{L}_D = \sum_iCE(\mathcal{D}_R(D_F(o_i), D_F(o^\prime_{i})), c_{l_i}) + \lambda\sum_iCE(\mathcal{D}_D(\mathcal{G}(D_F(o_i))), d_{l_i})$$

Note that flip the gradient is actually the same as two stage training, but doing two stages at once.


#### **Experiment**

I'm not a big fan of experiments section always (actually that's a bad thing). They tried three tasks: pointmass, reacher and pendulum.

It seems that the domain confusion helps a lot and stablize the training. The figure 4 in the paper shows the domain confusion accuracy during training. The ideal situation is the accuracy become lower and lower until converge to 0.5. The first figure in figure 4 is quite good. However, in the second one, the accuracy was bad at the beginning, and in the third one, the accuracy goes up again. It's a little unexpected.

#### **Conclusion**

In general, I like this paper very much. However, I don't know how hard to make a GAN work, especially this is a GAN in GAN. I haven't tried training a GAN before, but I heard that GAN is really hard to train. Should try some GAN some day.
 
