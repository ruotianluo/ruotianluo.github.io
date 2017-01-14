---
layout: post
title: "Some interesting things happened when building SpatialAdaptiveAveragePooling"
excerpt: ""
date: 2017-1-13 19:30:28 -0500
comments: true
mathjax: true
---

I was reading [self-critical sequence training](https://arxiv.org/abs/1612.00563) paper recently (probably there will be another blog post for two recent image captioning models using Policy Gradient). Other than the interesting algorithm, I carefully read what image features they use, and what hyperparameters they use (Tricks matter!!!!!!!!!!!).

They are using resnet-101; for att2in model (I guess it's exactlty show attent tell?), instead of rescaling and cropping the image to get fixed size 14*14 attentions (actually the number of attentions could be arbitrary number), they use resnet-101 directly on the raw image, and use spatial adaptive average pooling to get the fixed size attentions.

Then I searched on torch/nn and found there was no SpatialAdaptiveAveragePooling while there has been a SpatialAdaptiveMaxPooling for a while. Then I created a feature request on issues and started working on this.

Actually it's my first time to try to contribute to torch. Although I've defined many modules in my own project, I've never touched the c and cuda code of torch before. The reason I would start from this is because I think it shouldn't be too hard to implement such a layer, especially when the code can be borrowed from SpatialAdaptiveMaxPooling.

That's actually true when I was working on the c version. It's actually even easier than the original adaptive max pooling. However, it's less trivial when it comes to the cuda version.

When adaptive max pooling does backward, it's just allocating the gradOutput to the corresponding argmax on gradInput. To avoid write collisions, the code uses atomic add. Atomic add basically means the all these add operations can only be executed serially even when they are called in different threads, aka, no two atomic adds can execute at the same time.

It's true that I can also do similar things. For each point in the gradOutput, I find which points in input contributes to it, and pass the gradient back. This also needs atomic add because one point in input could contribute to mulitple points in the output. However, when the size of input is much larger than the size of output, the atomic add will slow down the layer. How slow it is? I have no idea.

The alternative I choose is to avoid the write collisions, by putting all the write operation of the same point in the same thread. So, I need to calculate one point in gradInput all in one thread. Think of the previous way as passing the gradOutput back, this is more like the gradInput is asking for the message from gradOutput.

The specific algorithm is.

1. For a point i, j in gradInput
2. Find which area in the gradOutput is contributed by i, j. Say from (ii_start, jj_start), to (ii_end - 1, jj_end - 1)
3.     For each point ii, jj in this area
4.     gradInput[i,j] += gradOutput[ii, jj] / pool_region, pool_region is the size of region that point ii, jj is pooled on.

To do step 2, the simplest way is to do brute search, however, one can also derive it.

The pooling strategy is the same as that in SpatialAdaptiveMaxPooling, and is as follow:

For output[ii, jj], the pool region to average is [i_start, j_start] to [i_end - 1, j_end - 1], where i_start, j_start, i_end, j_end are:

```C
int i_start = (int)floor((float)ii / oheight * iheight);
int i_end   = (int)ceil((float)(ii + 1) / oheight * iheight);
// j_start and j_end are similar
```

Interestingly, if you want to do backward, aka, use i, j to get ii_start etc, the formula is symmetric to the previous one:

```C
int ii_start = (int)floor((float)i / iheight * oheight);
int ii_end   = (int)ceil((float)(i + 1) / iheight * oheight);
// ii_start, jj_end are similar
```

**Fun fact comes.**

Although this is theoretically correct, in practice it's not. Try 33.0 / 54 * 90. (You could try it in Python, the result is same as in C).

```Python
>>> 33.0/54*90
55.00000000000001
```

This will leads to a problem when you are trying to do ceil. The numerical result is not the same as analytical result. The reason is float calculation cause loss of accuracy.

There are two ways to deal with this:

- Try to lose as less accuracy as possible when using float calculation. (Still has the risk of being inaccurate)

- Use integer calculation.

The first way is easy but effective, just change to:

```C
(int)floor((float)(i * oheight) / iheight);
```

Altering the division and multiplication helps (even you put the multiplication out of float casting). And use float calculation as late as possible.

The second is:

```C
int ii_start = i * oheight / iheight;
int ii_end   = (i+1) * oheight / iheight + ((i+1) * oheight % iheight)>0?1:0;
// ii_start, jj_end are similar
```

This one is uglier, but is always accurate.


Also speed matters, so I write a C code to test the speed of different implementations (Python can't do this):

```C
#include <stdio.h>
#include <math.h>
#include <sys/time.h>

#define f0(a,b,c) a*c/b
#define f1(a,b,c) (int)floor((float)(a*c)/b)
#define f2(a,b,c) (int)floor((float)(a)/b*c)
#define g1(a,b,c) a*c/b + ((a*c%b==0)?0:1)
#define g2(a,b,c) a*c/b + ((a*c%b>0?1:0))
#define g3(a,b,c) a*c/b + ((a*c%b-1>=0?1:0))
#define g0(a,b,c) (int)(ceil(((float)(a*c))/b))

int main()
{
    struct timeval start, stop;
    gettimeofday(&start, NULL);
    int i;
    for(i=0;i<1000000000;++i)
    {
        f1(33, 54, 90);
    }
    gettimeofday(&stop, NULL);
    printf("%f\n", (double)(stop.tv_usec - start.tv_usec) / 1000000 + (double)(stop.tv_sec - start.tv_sec));
    gettimeofday(&start, NULL);
    for(i=0;i<1000000000;++i)
    {
        f2(33, 54, 90);
    }
    gettimeofday(&stop, NULL);
    printf("%f\n", (double)(stop.tv_usec - start.tv_usec) / 1000000 + (double)(stop.tv_sec - start.tv_sec));
    return 0;
}
```

In terms of speed, they are actually similar (maybe it's a wrong to test?). Note that using macro is around 4 times faster than using a function.


## Wrapup

I currently don't if atomic add is as slow as I think. I will update this blog to tell you if my alternative can work faster than atomic adds.