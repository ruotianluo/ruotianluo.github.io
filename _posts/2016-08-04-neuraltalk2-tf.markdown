---
layout: post
title: "Neuraltalk2 in tensorflow"
excerpt: "I started to learn torch by neuraltalk2. And now I start to learn tensorflow by creating a neuraltalk2."
date: 2016-08-04 10:50:40 -0500
comments: true
---

This post is about my another recent github repository [Neuraltalk2-tensorflow](https://github.com/ruotianluo/neuraltalk2-tensorflow). 

This is a toy project for myself to start to learn tensorflow. I started torch by learning from neuraltalk2. I start my tensorflow with this too.

The idea is to replicate what exactly neuraltalk2 can do, in a almost identical structure. 

## Data preprocessing and dataloader

The preprocessing is exactly the same as the original neuraltalk2 (I copied it), and the dataloader is just written in a different language.

However this should not be the right way to use tensorflow. Tensorflow provides input reader which can fetch data in multi-threads (the input reader is part of the graph). This can prevent creating a seperate h5 file. However, I haven't figure out how to make it work.

## Model

# VGG

I borrow the vgg from [machrisaa/tensorflow-vgg](https://github.com/machrisaa/tensorflow-vgg) and [tensorflow-vgg16](https://github.com/ry/tensorflow-vgg16). I started by using [tensorflow-vgg16](https://github.com/ry/tensorflow-vgg16) which provides a tfmodel file to load the graph. The problem of tfmodel file is that, after you load it, all the tf.Variable are changed to normal tensor. It's ok if you don't want to finetune, but it will be a big trouble when you want to finetune. If you want to make them back to variables, you need to use `add_collection` to manually modify them by their tensor name.

What you could also do is not using the tfmodel file, but every time build the vgg16 graph using the caffemodel file. ('Building the graph' here means you need to specify all the operations and uses the pretrained parameters to initialize the model. However tfmodel has the graph_def information of the whole graph, you could use a saved tfmodel without knowing the structure of the model.) [tensorflow-vgg16](https://github.com/ry/tensorflow-vgg16) actually did that, but building from caffemodel needs caffe installed. So I switch to the alterative [machrisaa/tensorflow-vgg](https://github.com/machrisaa/tensorflow-vgg), which is originated from the [tensorflow-vgg16](https://github.com/ry/tensorflow-vgg16), but changes it from loading from a caffemodel to loading from a npy file. Although you need to download a seperate npy file, at least you don't need to install caffe.

However the original [machrisaa/tensorflow-vgg](https://github.com/machrisaa/tensorflow-vgg) builds a static network (all constant and no dropout), so I modify the code by first defining all the weights and biases to be variable when building the graph. Secondly, I add a variable `training` to control the evaluation and training mode of model. The `training` variable controls the dropout probability.

# RNN

It's very easy to build a simple rnn, because tensorflow has provided many useful wrappers. Of course if you want to do something fancy, you need to hard code more, but for this project, the functions provided by tensorflow are enough to use.

I learn building rnn from this two repositories: [char-rnn-tensorflow](https://github.com/sherjilozair/char-rnn-tensorflow) and  [show_and_tell.tensorflow](https://github.com/jazzsaxmafia/show_and_tell.tensorflow). char-rnn-tensorflow is more compact in the sense that they use more functions from tensorflow, however show_and_tell still is more 'stupid'.

Here I also used a training variable to control the dropout.

# Generator

Generator is nothing fancy, just using a loop function to make the generator to use the previous argmax word. The beam search and sample by probability is not finished yet.

## Checkpoint

The checkpoint is a little different from neuraltalk2. Since tensorflow has its own saver to manage the checkpoint, we cannot specify other information to be saved in the checkpoint file. Therefore I used a infos.pkl to save all the options, iteration and epoch information etc. for resuming the training.

## Tensorboard

Tensorflow provides a very good visualization tool tensorboard. The summaries are saved in the directory with the infos.pkl and the checkpoint files.

In the tensorboard, I visualize the BLEU, CIDEr, METEOR and ROUGE on validation set. You can also see the training loss and validation loss curve. I also put learning rate in so that you can know at which point you changed your learning rate (if you changed it).
<figure>
 <img src="/assets/nt2_tf/nt2_graph.png" title="The computational graph" />
 <figcaption>The computational graph</figcaption>
</figure>
<figure>
 <img src="/assets/nt2_tf/cider.png" title="The CIDEr curve">
 <figcaption>The CIDEr curve</figcaption>
</figure>

## Remained things

- The current progress is enough for researching, because it provides the training and evaluation on validation. But it's currently not enough for demonstration.<br>
I need to provide a pretrained model. <strike>However I can't initialize the network only from the saved model. Every time I build the network, I need to initialize the vgg from the npy file. (I have already have some idea how to fix it)</strike> I will put a pretrained model after I finished training it (probably needs a few days).<br> 
After that, I would add other demonstration related stuff like using camera, or test on single image etc.
- Currently I'm using h5 file. However, we could use tensorflow to do the multi-threaded image loading which would saving time.
- I haven'ted test on stacked LSTM. and GRU yet.
- Schedule sampling
- Beam search and sampling(not argmax) is not supported yet