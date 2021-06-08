---
layout: post
title: "Resume from the middle of an epoch with pytorch-lightning（in one line of code）"
excerpt: ""
date: 2021-06-07 2:10:21 -0500
comments: true
mathjax: true
---

TLDR:

`pip install rtutils`

then, after defining trainer, add:
`rtutils.patch_everything(trainer)`

resume from middle-epoch checkpoint supported.

---

I'm starting to work on some engineering project again.

Because our slurm kills in 4 hours, so if we can break from middle of an epoch and resume, we won't waste the half of the epoch we've run.

I actually had a similar tool before, but before it was a stateful operation. The core idea is to set a state_dict for the dataloader, and then each time the dataloader can load_state_dict to resume. see here [https://github.com/ruotianluo/rtutils/blob/main/rtutils/DataLoader2.py#L6](https://github.com/ruotianluo/rtutils/blob/main/rtutils/DataLoader2.py#L6).

But this feels like more trouble if you want to switch to a different framework, and it's a bit of a pain if it's distributed training (although I added it).

---
The purpose of the new implementation is stateless, so that the changes to the training pipeline are relatively small. Mostly I wanted to put it under pytorch-lightning painlessly, because I found that pytorch-lightning is really sueful.

The core idea is not to change the dataloader, but to change the distirbuted_sampler, so that the behavior of the sampler  is deterministic: if given a seed, and the iteration, I can know what batch should be deterministicly.

(The assumption here is that the dataset does not change during training, and neither is the batch_size.)


In fact, the default distributed_sampler was already deterministic, because each epoch has to set_epoch, and then the sampler will shuffle data according to which epoch is currently.

Then my change is to slightly change the semantics of set_epoch; instead of entering the epoch, we put in the iteration. With the iteration, which epoch and which iteration in this epoch are both known.

(I actually changed the shuffle rule a bit, but after thinking about it, I didn't really need to.)

Then when the first call `__iter__`, the code will drain the sampler indices according to the iteration from set_epoch.

---

At the lightning side, there are a few related changes (or things to notice).
- iteration is total_batch_idx not global_step, because this is actually how many batches the trainer have seen.(while global_step is how many time the model is updated. If there is no accumulate_grad, they are actually the same.)
- since we need to set_epoch with total_batch_idx, we need to save them in the checkpoint. And also we need to change `set_epoch(self.trainer.epoch)` to `set_epoch(self.trainer.total_batch_idx)`.
- When to do validation is done by check if the batch_idx is a multiply of the dataloader size. However, since our dataloader from middle epoch is smaller, so such batch_idx at the end of the first epoch will not trigger the validation. (batch_idx is from enumerate). So we need to modify the related part, and add a starting idx to the enumerate.
- Changed lightning inside set_epoch. to input, total_batch_idx.
After resume, the sampler changed so the size of the dataloader changed. According to the original enumerate train_dataloader, the trainer will not know when to change the validation. so need to enumerate(loader, start_batch_idx).
- Added a on_keyinterrupt callback to model_checkpoint so that if you ctrl-c, it will save to the 'last' checkpoint.
- progressbar: we also want to the progress bar to look like resume from the middle. So we have to change the on_train_epoch_start to update the progress bar before training.

---
Check more here: [https://github.com/ruotianluo/rtutils#stateless-resume-from-checkpoint-saved-in-the-middle-of-one-epoch](https://github.com/ruotianluo/rtutils#stateless-resume-from-checkpoint-saved-in-the-middle-of-one-epoch)