---
layout: post
title:  "Gemini is Good at Literature Search, But Not by Searching"
excerpt: ""
date: 2026-01-13 00:00:00 -0500
comments: true
mathjax: true
---

I was doing CVPR review, it is something related to RL for MLLM, so I was doing some literature research using Gemini.

Funnily, Gemini mentioned to me Self critical sequence training, saying it is popular recently.

I was like, interesting, I don't know that? I bairly see people talk about self critical sequence training on social media recently, i know similar method ( I mean GRPO) is very popular recently, but people only talk about GRPO, or maybe RLOO, but never SCST.

So I asked, why do you say that it is popular recently, it says:

<blockquote>
The core concept of SCST (Self-Critical Sequence Training)—"leveraging the model's own inference results as a baseline to reduce variance"—is currently undergoing a massive resurgence and transformation in the Reinforcement Learning (RL) phase of Large Language Models (LLMs), particularly within Reasoning Models.

This shift is most prominently reflected in several cutting-edge research directions, with the recent series of works by DeepSeek being the most notable.

1. GRPO (Group Relative Policy Optimization) in DeepSeek-R1 / DeepSeek-V3
This represents the most direct and powerful "revival" and upgrade of the SCST philosophy.

blahblahblah

Why this is the "Rebirth" of SCST: It is essentially Critic-free RL. By using a group of samples generated from the model's current distribution to serve as mutual baselines, it solves the issues of high variance or "weak baselines" that occurred when traditional SCST relied solely on a single greedy output.

</blockquote>

Then I asked: did anyone mention it on social media or so?

<blockquote>
Here are several highly technical papers and reports that explicitly establish the link between current Reasoning/Math RL methods and SCST (Self-Critical Sequence Training) or REINFORCE.

Below are the three most direct "evidence" links:

1. The "Explicit Mention" (The survey that directly names SCST)
Paper: LLM Post-Training: A Deep Dive into Reasoning Large Language Models

Date: Feb 2025 (arXiv:2502.21321)

Link: https://arxiv.org/abs/2502.21321

Why it matters: In section "3.4.2 Policy Gradient Methods," this very recent survey explicitly lists Self-Critical Sequence Training (SCST) and discusses it in detail as the "predecessor" and "theoretical foundation" for modern methods like DeepSeek-R1 (GRPO) and RLOO. It directly explains how SCST eliminates the Critic through a "Self-generated Baseline."


2. RLOO blahblahblah
</blockquote>


Then I asked: Do you know this paper? https://arxiv.org/pdf/2003.09971

<blockquote>
Yes, I am familiar with this paper.

**Title:** *A Better Variant of Self-Critical Sequence Training*
**Author:** Ruotian Luo (TTI-Chicago)
**Date:** March 2020 (arXiv:2003.09971)

### Summary of the Paper

This paper proposes a significant improvement to the standard **SCST** (Self-Critical Sequence Training).

* **The Old Standard (Standard SCST):** Uses the reward of the **Greedy Search** result as the baseline ().
* **The Proposal (The "Better Variant"):** Instead of running a separate greedy decode, it samples  outputs (). For each sample , it uses the **average reward of the other  samples** as the baseline.
* **Mathematical Formulation:**


* **Result:** This reduces gradient variance more effectively than the greedy baseline and eliminates the overhead of the extra greedy decoding pass.

### Connection to the Current "Renaissance" (RLOO & GRPO)

This is actually a fascinating find in the context of our previous discussion. **This paper from 2020 effectively proposed what is now being celebrated as "RLOO" (REINFORCE Leave-One-Out) in the LLM era.**

1. **Cohere's "Back to Basics" (2024):** They introduced **RLOO**, claiming it outperforms PPO. The method they describe is mathematically identical to the baseline proposed in this 2020 paper (using the mean of the "rest" of the samples).
2. **DeepSeek's GRPO (2024):** DeepSeek's **Group Relative Policy Optimization** is also a direct descendant of this idea. It uses the group statistics (mean/std of the  samples) as the baseline, rather than an external Critic or a Greedy Search.

In essence, this paper was **ahead of the curve**. It identified that "Self-Critical" baselines constructed from multiple samples (Leave-One-Out) are superior to single-sample (Greedy) baselines, a concept that has now become the state-of-the-art for reasoning models like DeepSeek-R1.
</blockquote>

I am crying now, thanks gemini's acknowledgement. I was ahead of curve. TTATT


----
Now that I feel like, hey, gemini doesn't know my paper, but it seems definitely be able to connect GRPO to SCST, while it is not very loud and a common sense in the internet.

So I tried this, turning of web search: 
In deepseekmath, they propose GRPO. I think it is related to some early papers but they didn't cite it. Can you guess what they should give credit? (Don't search)

(To make sure no search, I used ai studio)

**Thinking**
<blockquote>
**Examining GRPO Connections**

I'm currently dissecting the user's request, focusing on DeepSeekMath's GRPO. I've pinpointed its subject and the observation of earlier papers. The goal is to identify how these earlier works are relevant to DeepSeekMath's GRPO algorithm. I'm focusing on finding the related papers for this GRPO method.


**Exploring Omissions and Origins**

I'm now assessing potential omissions in citations, drawing on my existing understanding of the field up to January 2025. My primary aim is to identify papers that might have influenced DeepSeekMath's GRPO method but weren't explicitly referenced. I'm focusing on tracing the algorithm's lineage and any prior related work. This includes deconstructing GRPO: its RL core, the group sampling approach, and the "relative" advantage calculation which replaces the need for a critic, primarily for efficiency.


**Unveiling Reward Normalization**

I'm now focusing on DeepSeekMath's reward normalization technique. It seems they're adapting a standard advantage normalization approach, though applied per prompt group rather than the whole batch. I'm also examining the "self-critical" methods that leverage the model's own inferences as a baseline, in the context of this approach.


**Analyzing Core Similarities**

I'm now diving into the underlying concepts that GRPO leverages. Specifically, I'm identifying some potential missing citations. My current focus centers on connecting the method to concepts such as rejection sampling, rank-based RL approaches, and even aspects of Natural Evolution Strategies. The connection to NES is that GRPO shares the idea of normalizing rewards within a "generation" which is similar to an evolutionary method. I'm exploring how these methods relate to GRPO's approach of optimizing within groups, and comparing the samples relative to one another.


**Connecting Grouped RL to Theory**

I'm currently focusing on GRPO's approach, particularly the use of a "mean baseline" in its policy gradient strategy, similar to fitness normalization within a population. I am exploring variations in REINFORCE, and focusing on papers that apply this average reward per prompt to LLMs as a more specific literature search. I'm also now linking the method to reward weighted and advantage weighted regression.


**Comparing Sampling Strategies**

I am now comparing various sampling strategies in RL, especially those that normalize rewards. I am considering RPO, IPO, and DPO approaches, and how they relate to the online, iterative nature of GRPO. I'm especially focusing on how SCST's self-comparison principle mirrors GRPO's group-based baseline. I am also exploring variance reduction techniques and the leave-one-out baseline and how it contrasts with GRPO's approach.


**Identifying Foundational Citations**

I've just solidified the connection between GRPO and the VIMCO method, particularly the leave-one-out baseline. This offers a clear mathematical parallel to GRPO's normalization. I'm also confirming that GRPO implicitly implements the PPO technique but without the explicit critic network, leaning on batch statistics for advantage calculations. This highlights the PPO's early advantage normalization in detail, but applied groupwise, to explain GRPO's behaviour.


**Tracing Methodological Ancestry**

I'm now integrating the connections between GRPO and earlier works. SCST is a key link. It uses the model's greedy output as a baseline, mirroring GRPO's self-comparison, which uses the mean output. VIMCO provides the mathematical foundation. I'll structure this explanation, highlighting the mechanism and referencing the papers. My task now is to confirm if SCST was indeed cited in relation to reasoning, to ensure the full lineage is complete.


**Finalizing Method Lineage**

I'm now concluding the literature review. I've reconfirmed that GRPO is indeed essentially REINFORCE with a batch-based baseline, and the similarity to Reference-Free methods is also clear. I'm solidifying the VIMCO and SCST connections, and I'll emphasize that the paper should credit VIMCO for its mathematical foundation of its batch gradient estimator, and SCST for its reference-free use case.

</blockquote>

**Output**

<blockquote>
Based on the mechanics of **Group Relative Policy Optimization (GRPO)** described in the DeepSeekMath (and subsequently DeepSeek-R1) work, the algorithm essentially removes the Critic (Value Network) and uses the statistical properties of a group of sampled outputs to estimate the baseline.

Specifically, for a single prompt, GRPO generates multiple outputs, calculates the rewards for all of them, and then computes the advantage for each output by normalizing its reward against the **mean and standard deviation of that specific group**.

If they did not cite them, they likely should have given credit to the following lineages of work, particularly regarding **variance reduction in policy gradients** and **self-critical baselines**:

### 1. VIMCO (Variational Inference for Monte Carlo Objectives)
**Paper:** *Variational Inference for Monte Carlo Objectives* (Mnih & Rezende, 2016)

This is arguably the strongest mathematical predecessor. In VIMCO, the authors proposed a gradient estimator for multi-sample objectives. To reduce variance without learning a separate critic/baseline neural network, they utilized a **"Leave-One-Out" baseline**.
*   **The Connection:** In VIMCO, the baseline for the $k$-th sample is calculated using the average (or geometric mean) of the *other* samples in the batch.
*   **Why it matters:** GRPO does almost exactly this: it uses the group of samples generated from the same input to construct the baseline (the group mean) for the policy gradient update. This allows for training without a separate Value function, which is the main selling point of GRPO (memory efficiency).

### 2. Self-Critical Sequence Training (SCST)
**Paper:** *Self-critical Sequence Training for Image Captioning* (Rennie et al., CVPR 2017)

This paper is a cornerstone in applying REINFORCE to sequence generation (originally image captioning) without a learned critic.
*   **The Connection:** SCST minimizes variance by using the reward of the model's own inference (specifically, the greedy decoding output) as the baseline. The gradient update is based on $R(sample) - R(greedy)$.
*   **Why it matters:** GRPO is essentially a generalized, multi-sample version of SCST. Instead of comparing a sample against a single "greedy" baseline, GRPO compares a sample against the *average* of $N$ stochastic samples ($R(sample) - R(mean)$). The intellectual leap from SCST to GRPO is the transition from a single control variate to a group-based statistical normalization.

### 3. Review of the "Baseline" in REINFORCE
**Paper:** *Simple Statistical Gradient-Following Algorithms for Connectionist Reinforcement Learning* (Williams, 1992)

While this is the foundational RL paper, it explicitly discusses that any baseline $b$ that is dependent on the state (input) but not the action is valid.
*   **The Connection:** Using the **batch average** of rewards as a baseline is a standard, textbook variance reduction technique discussed in early policy gradient literature.
*   **Why it matters:** While DeepSeek likely cited REINFORCE, presenting GRPO as a novel *method* rather than an *application* of this classical variance reduction technique (applied specifically to LLM reasoning groups) overlooks that the "mean-as-baseline" technique is a standard feature of gradient estimators when a Value network is too expensive to train.

### 4. Comparison to Ranking/Contrastive Losses (DPO/RSO/LiPO)
While GRPO is an *online* RL algorithm (generating new samples), it shares DNA with **Direct Preference Optimization (DPO)** or **Identity-PO** in that it attempts to optimize the policy without an explicit reward model or value function (though GRPO *does* use a reward function/verifier, it skips the Value *Network*).

However, the closest mechanism is **"Best-of-N" (Rejection Sampling)** turning into a gradient update. GRPO effectively automates the "Best-of-N" process into the training loop: it pushes the probability of the high-performing samples in the group up and the low-performing ones down, weighted by how far they deviate from the group mean.

### Summary
The most significant missing credit is likely **VIMCO (Mnih & Rezende, 2016)**.

DeepSeek's GRPO is effectively **PPO without the Critic, replacing the Value Function with a VIMCO-style multi-sample baseline.** By not citing VIMCO or SCST, they present the idea of "normalizing rewards relative to the group to avoid training a Critic" as more novel than it historically is in the Variational Inference and Policy Gradient literature.
</blockquote>

I am ASTONISHED. While SCST is cited 3k times (the same volumn as deepseekmath which is only < 2 year old.), VIMCO is only cited 300+ times. RLOO even misses this paper (yeah, RLOO cited SCST, and also some 2019 paper as the group mean source. GRPO cites neither, hmmm, poor scholarship, rich engineering).

I knew VIMCO and I cited it in my paper, but I barely see people mentioning it. (I knew VIMCO because of Yoon Kim gave a talk about his paper Unsupervised Recurrent Neural Network Grammars which uses the technique in VIMCO)

I just skimmed VIMCO, i couldn't even tell how it is related to GRPO by just looking at the equations.


# Conclusion

I guess people should gives their paper to gemini to tell what is missing in related work.