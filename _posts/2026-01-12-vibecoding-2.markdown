---
layout: post
title: "Vibe coding with english/number/word tracing pad"
excerpt: ""
date: 2026-01-12 00:00:00 -0500
comments: true
mathjax: true
---

# My personal LLM benchmark

After I created the Chinese tracing webpage last time, I was trying to add English word tracing. It kind of become my go-to LLM testing query.

I tried with Gemini 2.5 Pro; it kind of works, but not very well. When Gemini 3.0 Pro came out, I tried it, and it actually worked quite well. However, I only used the Gemini website, not agent mode.

The results are here:
- Gemini 2.5 Pro (canvas mode): https://github.com/ruotianluo/chinese-learning/blob/main/index_eng2.html
- Gemini 3.0 Pro (canvas mode): https://github.com/ruotianluo/chinese-learning/blob/main/index_eng3.html

While Gemini 3.0 can actually provide quite decent results, but it feels incomplete.

Due to the recent popularity of Codex, Antigravity, and Claude CLI (also seeing Andrej Karpathy's Twitter, Midjourney CEO's Twitter), I decided to use these to do the English word tracing again.

# Why is it a hard task?

You cannot do this without having visual understanding.

The "Sparks of AGI" paper has a unicorn SVG test. This is somewhat similar. I want the AI (I honestly feel weird saying AI; I guess I am an old stubborn dude) to actually show the right trace by keypoints (so the user has to pass each keypoint to count as correct writing). The stroke order needs to be correct.

It is already hard for models to generate correct keypoints blindly. When I tried with Gemini 3, I had to manually test all the letters and check if they looked correct; basically, I was the eye of Gemini.

The good thing about the recent agents is that it has its own feedback loop. Not only can it see what it built, but it can also interact to ensure the interface is correct.

Unfortunately, even though it seems like a task that the agent is capable of, not all models can do it well.

# My results.

## ChatGPT

I used agent mode to do this task. I assume there is a coding agent in the backend using Codex, so it shouldn't be bad at this task. However, it did not provide good results, not even as good as the Gemini 3.0 Pro webpage version.

It was so unsatisfactory that I didn't even bother uploading it to GitHub: I asked it to create an iPad-friendly page like an iPad app, but it just couldn't do that even after I asked like 5 times.

## Antigravity with Gemini 3.0 Pro

You would expect it to perform well because the Gemini 3.0 Pro on the website is already doing well. However, it is just not as smart as I thought. I definitely engaged much less compared to when I used the website version, but still, I expected the UI to be cooler (isn't that Gemini 3.0 Pro's strongest part?) and the UX to be better.

In the end, it did provide something fairly usable, but it was quite simple and somewhat primitive.

## Antigravity with Opus 4.5.

Since I work for Waymo, I didn't really experiment with the Claude model that much. (The frustrating thing is I cannot even use the Google Interval Antigravity because Waymo code is private to Google.) 

Anyway, I finally understand what people mean when they say Opus 4.5 is good. It is indeed good...... Overall, the final webpage is very much complete, not just a primitive demo. I did have to make some suggestions in the middle, like the initial words being pretty thin and tall for some reason, so I had to tell it to normalize them. But overall, the experience was pretty smooth.

I guess it is like working with a software engineer; other models are very passive and come back to you and I need to provide ten suggestions every time. But for Opus 4.5, it is pretty proactive. Not only is the UI good, but the UX is also good (I explicitly said the word tracing is for my 4-year-old).

The final result is [here](https://ruotianluo.github.io/word_tracing/).

# Conclusion

Claude win win win.

# Fun thing in the end.

When I said I wanted to do word tracing, none of these models considered lowercase letters......... I had to tell all of them: "Hey, add lowercase as well." Interesting.