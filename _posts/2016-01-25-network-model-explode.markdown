---
layout: post
title: "Learn from neuraltalk2: Wow, why my network model file is so big!"
excerpt: "I have just met the problem seeing my saved network model is extremely big. And the answer can be found in the neuraltalk2."
date: 2016-01-25 18:17:40 -0600
update: 2016-05-03 18:17:40 -0600
comments: true
---

##<b>Important update:</b>##

The way in this post is old now. People use clearState() to clean the intermediate variables, although it works worse than the way below, but it's easier and is harder to introduce bugs.

---
---

First, I'm happy that some one read my posts and emailed me asking some question. I know my blog posts are really coarse, I'll try to make it more ordered.

In this post, I want to talk about saving network model. What happened to me is: I'm training a simple logistic regression, the parameter should be around 400000 float numbers, i.e. ~2MB. But when I save the model directly using 
{% highlight lua %}
torch.save(filename, nn)
{% endhighlight %}
The t7 turns to be 2.2 GB, which is incredible!

I guessed it was the problem of intermediate variables the network save like gradInput, gradWeight, output, buffer etc. However, but it's still impossible to be that big. I tried to remove the intermediate variable one by one, and found that the memory decrease by 2GB when I remove output of a layer which is a 50*4000 tensor. This made me feel puzzled.

Here what I said can only partly explain this situation; I'm still not know why removing a output can cause dramatically decrease. The same question has also been asked before, here is some links: [problem with getParameters](https://github.com/torch/DEPRECEATED-torch7-distro/issues/33), [Large size of saved model, using torch.save?](https://github.com/torch/torch7/issues/411), [How to load trained weights?](https://groups.google.com/forum/#!topic/torch7/fcy0-5v6M08)


To use gradient descent, we need to access update the parameters with the gradient. (Here we suppose you want to use external library to optimize like <b>optim</b>, or using you own code. If you are using the nn.StochasticGradientDescent, you do need to worry about it. I may discuss a little bit about "standard" optimization way.) So the way to get the weight reference and the gradient reference is:
{% highlight lua %}
params, grad_params = nn:getParameters()
{% endhighlight %}
So the simplest gradient descent is 
{% highlight lua %}
params:add(-lr, grad_params)
{% endhighlight %}
<b>getParameters()</b> will rearrange the parameters in the network, to make them contiguous; and also allocate a large space for intermediate variables (haven't tested).

In order to keep our saved model thin, we need to have a new network, which only contains the parameters that we want to save, and use it for save.
{% highlight lua %}
thin_nn = nn:clone('weight', 'bias', 'gradWeight', 'gradBias')
{% endhighlight %}
Pay attention, the clone() here is different from the clone of Tensor (value copy). The clone() of network module can be either deep copy or share, see the reference here [nn clone()](http://nn.readthedocs.org/en/rtd/module/index.html#nn.Module.clone). If we add variable name in clone(), it means thin_nn has these internal variables, and these variables share the memory with that of nn, i.e. thin\_nn is a pruned verision of nn which can sychronize the necessary parameters with nn.

Now, instead of save nn, you can save thin\_nn which should be much smaller than saving nn.

In the neuraltalk2, there is a more sophisticated way. Let's see define, read and save respectively:

- Define
{% highlight lua %}
-- flatten and prepare all model parameters to a single vector. 
-- Keep CNN params separate in case we want to try to get fancy with different optims on LM/CNN
local params, grad_params = protos.lm:getParameters()
local cnn_params, cnn_grad_params = protos.cnn:getParameters()
print('total number of parameters in LM: ', params:nElement())
print('total number of parameters in CNN: ', cnn_params:nElement())
assert(params:nElement() == grad_params:nElement())
assert(cnn_params:nElement() == cnn_grad_params:nElement())

-- construct thin module clones that share parameters with the actual
-- modules. These thin module will have no intermediates and will be used
-- for checkpointing to write significantly smaller checkpoint files
local thin_lm = protos.lm:clone()
thin_lm.core:share(protos.lm.core, 'weight', 'bias') -- TODO: we are assuming that LM has specific members! figure out clean way to get rid of, not modular.
thin_lm.lookup_table:share(protos.lm.lookup_table, 'weight', 'bias')
local thin_cnn = protos.cnn:clone('weight', 'bias')
-- sanitize all modules of gradient storage so that we dont save big checkpoints
net_utils.sanitize_gradients(thin_cnn)
local lm_modules = thin_lm:getModulesList()
for k,v in pairs(lm_modules) do net_utils.sanitize_gradients(v) end

-- create clones and ensure parameter sharing. we have to do this 
-- all the way here at the end because calls such as :cuda() and
-- :getParameters() reshuffle memory around.
{% endhighlight %}
Here is something different: the thin\_lm and thin\_cnn doesn't save gradWeight and gradBias (I don't think the two net\_utils.santize\_gradients is necessary, but haven't verified; net\_utils.santize\_gradients is to set the gradient varibales of network to nil). thin_lm is a customized module, so there is a more complicated way to process.

- Read
{% highlight lua %}
local loaded_checkpoint = torch.load(opt.start_from)
protos = loaded_checkpoint.protos
net_utils.unsanitize_gradients(protos.cnn)
local lm_modules = protos.lm:getModulesList()
for k,v in pairs(lm_modules) do net_utils.unsanitize_gradients(v) end
{% endhighlight %}
When we read the protos from the checkpoint, it doesn't has a gradient variable. We need to add them in to make the network work, so here we need do net_utils.unsanitize_gradients.
- Save
{% highlight lua %}
local save_protos = {}
save_protos.lm = thin_lm -- these are shared clones, and point to correct param storage
save_protos.cnn = thin_cnn
checkpoint.protos = save_protos
{% endhighlight %}
Saving is easy: just save the thin version instead of the original version.

- Training
To clarify, we don't need to touch anything about the network module actually, everything is in the params and grad\_params.


Finally thanks to my senior labmate who helped me to figure out the problem.

#### Feel free to comment. :)

----

##Update:##
Need to be careful to some "strange" layers. For <b>SpatialBatchNormalization</b>> you also need to share <b>running_mean</b> and <b>running_var</b>!
