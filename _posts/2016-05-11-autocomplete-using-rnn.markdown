---
layout: post
title: "Autocomplete using RNN: trained on arxiv data."
excerpt: "I had this idea actually, hoping to assist me to write paper. (My poor English!). Glad someone did this."
date: 2016-05-11 12:55:40 -0500
comments: true
---

The original post is [here](https://www.robinsloan.com/notes/writing-with-the-machine/), the author build a server based on [torch-rnn](https://github.com/jcjohnson/torch-rnn), and build a Atom package which could communicate with the server and produce autocomplete result.

[Here](https://github.com/robinsloan/rnn-writer) is the Atom package, and [here](https://github.com/robinsloan/torch-rnn-server) is the code to train the char-rnn and to start the server.

Meanwhile, Andrej Karpathy has a project [arxiv-sanity-preserver](https://github.com/karpathy/arxiv-sanity-preserver), which could contain the source code for the arxiv-sanity-preserver. The functions include fetch the data from arxiv API, download the pdfs, process the pdfs and analyze the pdfs.

So, based on these two project, I want to build a autocomplete server based on arxiv papers. The project is [here](https://github.com/ruotianluo/torch-rnn-server.git).

I use the arxiv-sanity code to download the pdf and process the pdfs to text files, and then follow the torch-rnn-server pipeline to train the model. Nothing fancy :)

However, the result is not satifying, as which is also mentioned in original torch-rnn-server blog post. My intuitive guess is that the data need more cleaning; also the size of the corpus and the type of model used to train also matters.
