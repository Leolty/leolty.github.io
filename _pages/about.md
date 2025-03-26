---
layout: about
title: About
permalink: /
subtitle: |
  Ph.D. Student at UC San Diego <br>
  <span 
      style="white-space: nowrap; 
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 2px 4px;
            border-radius: 3px;
            user-select: none;"
      onmousemove="
                  const bounds = this.getBoundingClientRect();
                  const x = (event.clientX - bounds.left) / bounds.width;
                  const y = (event.clientY - bounds.top) / bounds.height;
                  const brackets = this.querySelectorAll('.bracket');
                  brackets.forEach(b => {
                      const bx = (b.getBoundingClientRect().left - bounds.left) / bounds.width;
                      const distance = Math.abs(x - bx);
                      const strength = Math.max(0, 1 - distance * 2);
                      const moveX = (x - 0.5) * 4;
                      const moveY = (y - 0.5) * 2;
                      b.style.transform = `translate(${moveX * strength}px, ${moveY * strength}px) scale(${1 + strength * 0.1})`;
                      b.style.opacity = 0.7 + (strength * 0.3);
                  });"
      onmouseover="this.style.opacity='0.9'; 
                  this.style.letterSpacing='0.4px';
                  this.style.transform='scale(1.02) translateY(-1px)';
                  this.querySelector('.tooltip').style.opacity='1';
                  this.querySelector('.tooltip').style.transform='translateX(8px)';" 
      onmouseout="this.style.opacity='1'; 
                  this.style.letterSpacing='0';
                  this.style.transform='scale(1) translateY(0)';
                  this.querySelector('.tooltip').style.opacity='0';
                  this.querySelector('.tooltip').style.transform='translateX(0)';
                  Array.from(this.querySelectorAll('.bracket')).forEach(b => {
                      b.style.transform='scale(1) translateY(0)';
                      b.style.opacity='0.7';
                  });"
      onclick="this.classList.add('copied');
              navigator.clipboard.writeText('til040@ucsd.edu');
              this.querySelector('.tooltip').textContent='Copied!';
              this.style.transform='scale(0.98) translateY(0)';
              let circle = document.createElement('span');
              circle.className = 'click-effect';
              circle.style.cssText = 'position:absolute; pointer-events:none; background:rgba(0,0,0,0.05); border-radius:50%; transform:scale(0); animation:clickEffect 0.5s ease-out; width:100%; height:100%; left:0; top:0;';
              this.appendChild(circle);
              setTimeout(() => circle.remove(), 500);
              setTimeout(() => {
                this.querySelector('.tooltip').textContent='Click to copy';
                this.style.transform='scale(1.02) translateY(-1px)';
              }, 1000)">
      <style>
          @keyframes clickEffect {
              from { transform: scale(0); opacity: 0.3; }
              to { transform: scale(2); opacity: 0; }
          }
      </style>
      til040 <span class="bracket" style="opacity: 0.7; transition: transform 0.2s ease-out, opacity 0.2s ease"><span style="opacity: 0.9">🌀</span></span> ucsd <span class="bracket" style="opacity: 0.7; transition: transform 0.2s ease-out, opacity 0.2s ease"><span style="opacity: 0.9">✨</span></span> edu
      <span class="tooltip" style="opacity: 0;
                                  position: absolute;
                                  left: 100%;
                                  transform: translateX(0);
                                  font-size: 13px;
                                  font-family: 'Courier New', monospace;
                                  background: rgba(0,0,0,0.02);
                                  padding: 2px 6px;
                                  border-radius: 3px;
                                  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                                  pointer-events: none;
                                  white-space: nowrap;
                                  margin-left: 4px;
                                  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
                                  backdrop-filter: blur(4px);">Click to copy</span>
  </span>



profile:
  align: right
  image: me_by_cc.jpg
  anime_versions:
    - ghibli_3.png
    - gay_4.png
    - ghibli_1.png
    - gay_3.png
    - gay_1.png
    - ghibli_2.png
    - ghibli_4.png
  image_circular: false # crops the image to make it circular
  address:
  note: 🎨 Anime-style images were generated using <a href="https://openai.com/index/introducing-4o-image-generation/">GPT-4o</a>.

news: true  # includes a list of news items
latest_posts: false  # includes a list of the newest posts
selected_papers: true # includes a list of papers marked as "selected={true}"
services: true  # includes a list of services
social: false  # includes social icons at the bottom of the page
---

I am a **Ph.D. student** (2024-) in Computer Science at [UC San Diego](https://ucsd.edu/), advised by Prof. [Julian McAuley](https://cseweb.ucsd.edu/~jmcauley/). This summer, I will join AWS AI Labs as an applied scientist intern in the [Amazon Q Developer](https://aws.amazon.com/q/developer/) team.

My research focuses on **Natural Language Processing (NLP)**, and I am broadly interested in **Large Language Models (LLMs)**. Specifically, I explore areas such as **reasoning** ([LLM Reasoners](https://arxiv.org/abs/2404.05221)), **tool augmentation** ([ToolkenGPT](https://arxiv.org/abs/2305.11554)), and **code generation** ([RepoBench](https://arxiv.org/abs/2306.03091), [StarCoder2](https://arxiv.org/abs/2402.19173)). I am also interested in building **code agents**. Currently, I am deeply engaged in **LLM evaluation**, believing that *the future belongs to those who do evals*. [$$^†$$](https://x.com/TheGregYang/status/1839561802247799112)

Prior to my Ph.D. studies, I completed my Master's degree in Computer Science at UC San Diego, working with Prof. [Julian McAuley](https://cseweb.ucsd.edu/~jmcauley/) and Prof. [Zhiting Hu](http://zhiting.ucsd.edu/index.html). During this time, I also collaborated with Prof. [Muhao Chen](https://muhaochen.github.io/) from UC Davis. Before that, I earned my Bachelor's degree from [Wuhan University](https://en.whu.edu.cn/). I have also interned at **NVIDIA**, working with [Gaoyan Xie](https://www.linkedin.com/in/gaoyan-xie-b2170517/) and his team on **CUDA code agents**.