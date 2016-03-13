---
layout: post
title: "Cong to AlphaGo: Let's learn torch from Torch based projects on github"
excerpt: "Here is some repositories I collected on github which are implemented in torch/Lua. These can be helpful for us to get used to torch."
date: 2016-03-10 16:10:40 -0600
comments: true
---
First, congratulation to Google Deepmind!!!! I watched the live of the first two games.

I wrote a post about AlphaGo days ago, it has been a commonsense that the information from the nature paper definitely can't explain the great performance of AlphaGo. From the result of the first two games, I think there may be some more techniques they use. I'm expecting another nature publication.

Before the game, I guessed the final score would be 1:4, however AlphaGo has won the first two games, it seems possible to appear 5:0. But Lee Sedol did make some bad moves, so it's still unknown what will happen next three matches.

Whatever, what's important is that AlphaGo is implemented in torch (from the grapevine, but seems quite likely). Deepmind always use torch, and also has released some code.

This post, I hope could be something similar a cheatsheet.

## Find a fabulous page........ [Awesome Torch](https://github.com/ruotianluo/awesome-torch)
There are some intersections, but my following list contains some which this page doesn't has.

# Some tools:

- [display: a browser-based graphics server](https://github.com/szym/display) Seems similar to itorch, but it's more like canvas, you should write code to display things on the web page.
- [net-Toolkit](https://github.com/Atcold/net-toolkit) can help save the model in ascii and clean the model. (Still better to understand, see my previous post)
- [gSLICr](https://github.com/jhjin/gSLICr-torch) wrapper for gSLICr
- [iterm.torch](https://github.com/szagoruyko/iterm.torch) Display image in iterm2.
- [torch-rnn](https://github.com/jcjohnson/torch-rnn) A faster implementation for lstm and gnu.
- [autograed](https://github.com/twitter/torch-autograd) Similar to autograd in Python.

# Projects

- [neural-style](https://github.com/jcjohnson/neural-style)
- [neuraltalk2](https://github.com/karpathy/neuraltalk2)
- [char-rnn](https://github.com/karpathy/char-rnn)
- [fb.resnet.torch](https://github.com/facebook/fb.resnet.torch)
- [DCGAN.torch: Train your own image generator](https://github.com/soumith/dcgan.torch) This is a implentation of a Generative Adversarial Networks. (Has paper)
- [eyescream](https://github.com/facebook/eyescream) LAPGAN, also for image generation, has blog post and paper.
- [torch-gan](https://github.com/skaae/torch-gan) For face generation, based on the eyescream.
- [Neural Conversational Model in Torch](https://github.com/macournoyer/neuralconvo) Implementation of Sequence to [Sequence Learning with Neural Networks](http://arxiv.org/abs/1409.3215) (seq2seq) and reproducing the results in [A Neural Conversational Model](http://arxiv.org/abs/1506.05869) (aka the Google chatbot).
- Deepdream:[(1)](https://github.com/eladhoffer/DeepDream.torch), [(2)](https://github.com/miltonmanfried/deepdream) Two different implentations.
- [LRCN](https://github.com/didw/LRCN)  Long-term Recurrent Convolutional Networks, has paper. (Using the new [torch-rnn](https://github.com/jcjohnson/torch-rnn) module, go to learn how to use)
- [understanding-visual-concepts](https://github.com/willwhitney/understanding-visual-concepts) Unsupervised learning of visual concepts from video, [paper](http://willwhitney.github.io/understanding-visual-concepts/)
- [Neural Turning Machine](https://github.com/kaishengtai/torch-ntm)
- [Variational Autoencoder](https://github.com/y0ast/VAE-Torch): has related paper
- [Spatial Transformer layer](https://github.com/Moodstocks/gtsrb.torch) This is the work from Deepmind!!!! Very interesting work, has a blog post.
- [SNLI attention](https://github.com/cheng6076/SNLI-attention) I have no idea waht it is, but seems interesting.
- [caption generation](https://github.com/eladhoffer/captionGeneration.torch) Including attention mechanism, but I don't think it's a runnable version.
- [captcha.irctc](https://github.com/arunpatala/captcha.irctc) Can recognize captcha!
- [captcha](https://github.com/arunpatala/captcha) Another project about captcha.
- [handwritingnet](https://github.com/jarmstrong2/handwritingnet) Can generate handwriting.
- [facialexpressionrecognition](https://github.com/jarmstrong2/facialexpressionrecognition) Experiments with multiple classifiers to classify facial expressions.
- [faster-rcnn.torch](https://github.com/andreaskoepf/faster-rcnn.torch) Seems halted....
- [DRAW](https://github.com/vivanov879/draw) DRAW: A Recurrent Neural Network For Image Generation
- [SpatialGlimpse](https://github.com/nicholas-leonard/dpnn#nn.SpatialGlimpse) There are a lot more stuff in dpnn.
