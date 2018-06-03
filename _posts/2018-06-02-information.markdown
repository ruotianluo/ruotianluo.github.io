---
layout: post
title: "Reading notes: Information-theoretic analysis of generalizationcapability of learning algorithms"
excerpt: ""
date: 2018-06-02 2:40:21 -0500
comments: true
mathjax: true
---

[Paper link](https://arxiv.org/abs/1705.07809)


Claim:
- I am not a theory guy. I'm super bad at theory.
- This is just the homework of my ML Theory class. I think it could be good to share.

TL;DR
In this paper, the authos bound the generalizaiton error with the mutual information between training set and output model.

Here is a video from their nips spotlight presentation, it's very clear: [link](https://www.facebook.com/nipsfoundation/videos/1553539891403911/). start from 34:00.

---

## Motivation

In the information-theoretic language, learning algorithms can be viewed as a randomized mapping, or a channel, which takes a training dataset as input and generates a hypothesis (e.g. weights of a neural network) as output. To measure the information capacity of a channel, we would calculate the mutual information of input and output of the channel. When the channel is a learning algorithm, it turns out that the mutual information of input and output is closely related to generalization error.

{% include image.html
            img="/assets/information/figure.png"
            title=""
            caption="" %}

From existing notions of stability like differential privacy, it has been shown that the generalization capability of a learning algorithm depends on how sensitive the output of the algorithm is to local change of the input dataset. The less dependent the output hypothesis $$W$$ is on the input dataset $$S$$, the better the algorithm generalizes. This intuitively leads to the connection between mutual information and generalization error.

Traditionally, the generalization error is measured by the richness of the model space (e.g. VC dimension or Rademacher complexity), or by the stability of the learning algorithm. However, mutual information contains all these different aspects of a learning problem: the data distribution, the learning algorithm, the model space, and potentially the loss function.

In this paper, the authors show that the generalization error can be bounded by the mutual information between the input and the output of the learning algorithm. Furthermore, the authors show this mutual information can be used as a guide to design learning algorithm and how this is related to existing methods or techniques.

---

## Problem formulation


In the standard framework of statistical learning theory, there is an instance space $$\mathsf{Z}$$, a hypothesis space $$\mathsf{W}$$ and a non-negative loss function: $$\mathsf{W} \times \mathsf{Z} \rightarrow \mathbb R^+$$. A learning algorithm characterized by a Markov kernel $$P_{W\vert S}$$ takes as input a dataset of size n, i.e., an n-tuple

$$S = (Z_1, \ldots, Z_n)$$

of i.i.d. random elements of $$\mathsf{Z}$$ with some unknown distribution $$\mu$$, and picks a random element $$W$$ of $$\mathsf{W}$$ as the output hypothesis according to $$P_{W\vert S}$$. The population risk of a hypothesis $$w \in \mathsf{W}$$ on $$\mu$$ is 

$$L_\mu(w) \triangleq {\mathbb E}_{Z\sim \mu}[l(w, Z)] = \int_\mathsf{Z} l(w,z)\mu(\mathrm{d}z)$$

The goal of learning to make population risk of the output hypothesis $$W$$ to be small, in expectation or with high probability, under any $$\mu$$. Since $$\mu$$ is unknown, $$L_\mu(w)$$ is not directly computable, but one can compute the empirical risk of $$w$$ on the datset $$S$$ as a proxy, defined as

$$L_S(w) \triangleq \frac{1}{n} \sum_{i=1}^n l(w,Z_i)$$

For a learning algorithm characterized by $$P_{W\vert S}$$, the generalization error on $$\mu$$ is defined as $$L_\mu(W) - L_S(W)$$, and its expected value is denoted as

$$\text{gen}(\mu, P_{W\vert S}) \triangleq {\mathbb E}_{S,W\sim P_{S,W}} [L_\mu(W)-L_S(W)]$$

where the expectation is taken with the joint distribution $$P_{S,W} = \mu^{\otimes n}\otimes P_{W\vert S}$$. The expected population risk can then be decomposed as

$${\mathbb E}_{W}[L_\mu(W)] = {\mathbb E}_{S,W}[L_S(W)] + \text{gen}(\mu, P_{W\vert S})$$

The first term tells how well the output hypothesis fits the dataset, while the second term reflects how well the output hypothesis generalizes. So ideally we want both terms to be small.

---

## Upper bound generalization error

The first step is to connect the $$\text{gen}(\mu, P_{W\vert S})$$ with the $$I(S;W)$$. Let's first rewrite the expected population error.

$${\mathbb E}_{S \sim \mu^{\otimes n}} [L_S(w)]  = \frac{1}{n}\sum_{i=1}^{n}{\mathbb E}_{z_i\sim\mu}[l(w,z_i)] = L_\mu(w)$$

$${\mathbb E}_W[L_\mu(W)] = {\mathbb E}_W{\mathbb E}_S[L_S(W)]$$

Then we get the generalization error to be:

$$\text{gen}(\mu, P_{W\vert S}) = {\mathbb E}_{W\sim P_W,S\sim P_S}[L_S(W)] - {\mathbb E}_{S,W \sim P_{W,S}}[L_S(W)]$$

Note that the first term on the right side is an expectation over marginalized $$W$$, $$S$$, while the second term is an expectation over joint distribution. Intuitively, if $$W$$, $$S$$ are independent, the RHS is 0, i.e. generalization error is 0. While there is a dependence between $$S$$ and $$W$$, this will lead to non-zero $$\text{gen}(\mu, P_{W\vert S})$$ value.


If $$f(\bar{X},\bar{Y})$$ is $$\sigma$$-subgaussian under $$P_{\bar{X},\bar{Y}}=P_X\otimes P_Y$$, then

$$\vert {\mathbb E}[f(X,Y)] - {\mathbb E}[f(\bar{X}, \bar{Y})]\vert  \leq \sqrt{2\sigma^2I(X;Y)}$$

This lemma gives a general bound of absolute value between expectation taken over joint distribution and taken marginalized distribution. The bound is a function of mutual information between two random variables. By applying this lemma, the authors get the upper bound of generalization error.


Suppose $$l(w,Z)$$ is $$\sigma$$-subgaussian under $$\mu$$ for all $$w\in\mathsf{W}$$, then

$$\vert \text{gen}(\mu, P_{W\vert S})\vert  \leq \sqrt{\frac{2\sigma^2}{n}I(S;W)}$$

---
## Design algorithm according to mutual information

- The simplest, we can just limit the hypothesis space to be a finite space, because

$$I(S;W)\leq H(\mathsf W)\leq \log \vert \mathsf{W} \vert$$

If the hypothesis sapce is inifrinity, we can quantize the output to a limited finite space.

- Use mutual information as regularization technique.

Upon the basic empirical risk minimization, we can add mutual information regularizer.

$$P^*_{W\vert S} = {\arg\inf}_{P_{W\vert S}}\left ({\mathbb E}[L_S(W)]+\frac{1}{\beta}I(S;W)\right )$$

To eliminate the dependence on the $\mu$ to compute $$I(S;W)$$, instead of using $$I(S;W)$$, they replace with its the upper bound $$D(P_{W\vert S}\|Q\vert P_S)$$

- data preprocessing，post processing

According to the chain rule of mutual information, if we add channels between input and output, it alwasy reduce the mutual information.

Thus, A lot of tricks or techniques people use in learning can also be regarded as controlling input-output mutual information, for example, data augmentation, postprocessing.



