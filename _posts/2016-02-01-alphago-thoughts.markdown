---
layout: post
title: "Some thoughts about AlphaGo"
excerpt: "I want to talk briefly about this 'exciting' powerful Go AI."
date: 2016-02-01 15:17:40 -0600
comments: true
---

Two years ago, I built a Go AI on a 13x13 board on our AI course. To be honest, our AI is really weak compared to human. Of cause, this AlphaGo is really great, but I still don't think it's a big improvement as people 'scared' about.

Backgrounds:
Policy means what to play for next move. Value means for current board state, I will win or not.
Monte Carlo Tree Search is say, instead of search the whole tree(tree of moves), we explore in a certain depth and a certain breadth, and evaluate each move according to the rollouts of all the following moves.
Rollouts mean I randomly (or in some policy) play the game, and return the final result of the game.

I believe there has been a lot of posts about Go AI introduction.

There are some novel points in this paper: value network. They use value network to assist the rollouts.(I think it could work in a better way, it's not a intuitively 'correct' way to use value network.) And reinfocement Learning policy network, but it's funny.

Let's what are not decent in this paper.

- They use fast policy function. This is used when they are doing rollouts. This function is not a neural network, insteand, it's a linear function, which is a naive way to do rollouts.

- Secondly, they use value networks combined with rollouts, but in the graph, the value networks works better than rollouts. But the results show combination makes it more powerful. Wierd.

- Google are talking about their AI is learning by itself. However, in the paper, the RL network is not used in the match system. Of cause they used it for training value network, but it's wierd to say they can self-learn.

- Features they use. For board, they use multiple handcrafted features, liberty, captures, etc. Although they said raw board can also work better than other system, but it's still not decent.

- Google is too rich. They are using 1200+ CPUs and 176 GPUs. I think it's powerful in much sense because of these hardwares.

Of course, it does show some progression. It shows that the deep neural network can has some intuition for search, have a sense of board state like human. But I don't think it's more exciting to me than image caption generation.