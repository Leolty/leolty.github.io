---
layout: distill
title: Research Statement
date: 2023-12-17 03:48:00
description: My research statement for PhD application
tags: agent reasoning evaluation
related_posts: false
featured: false

authors:
  - name: Tianyang Liu
    url: "https://leolty.github.io/"
    affiliations:
      name: UC San Diego

bibliography: 2023-12-17-research-statement-for-phd-application.bib

# Optionally, you can add a table of contents to your post.
# NOTES:
#   - make sure that TOC names match the actual section names
#     for hyperlinks within the post to work correctly.
#   - we may want to automate TOC generation in the future using
#     jekyll-toc plugin (
#
toc:
  - name: Introduction
  - name: Understanding the Capabilities and Limitations of LLMs
  - name: Enabling Advanced Symbolic Reasoning with LLMs
  - name: Building Applications of LLMs
  - name: Conclusion
---

I am deeply fascinated by the transformative capabilities of Large Language Models (LLMs) such as ChatGPT in the field of Natural Language Processing (NLP). These models, powered by vast training data and huge computational power, have revolutionized the NLP landscape with unprecedented natural language understanding and generation capabilities. These advances represent a paradigm shift in our field, catalyzing a multitude of novel and intriguing research directions. I am particularly drawn to **understanding the capabilities and limitations of LLMs**, **enabling advanced symbolic reasoning with LLMs**, and **developing innovative and practical LLM-based applications**. My goal is to augment the capabilities and accessibility of LLMs, thereby transforming them into general agents applicable across various domains, broadening their utility and amplifying their impact.

### Understanding the Capabilities and Limitations of LLMs

I am interested in mapping out the capabilities and limitations of LLMs and exploring the boundaries of what they can and cannot do. This involves multifaceted analysis of their performance and rigorous evaluation of their robustness across diverse scenarios, from simple text generation to complex problem-solving tasks.

My research is rooted in this exploration, continually raising relevant questions about its limitations and potential. A critical area of inquiry in my work is the inadequacy of LLMs in handling long-context generation, a limitation not fully evaluated in current research. With Prof. [Julian McAuley](https://cseweb.ucsd.edu/~jmcauley/) at UCSD, I developed RepoBench<d-cite key="liu2023repobench"></d-cite>, a benchmark for code completion at the repository level, a task emblematic of long-context challenges in LLMs for coding. We revealed that models trained on file-level data face challenges in generalizing to repository-level contexts, which has led to my collaboration with the [BigCode](https://www.bigcode-project.org/) project in developing StarCoder2, which is being trained specifically at the repository level to address these generalization gaps. Additionally, a limitation of LLMs I explored is their inherent struggle with structured data like tables. This deficiency stems from their architecture for the linearization of input data, which is not naturally suited for understanding structured formats. My work<d-cite key="liu2023rethinking"></d-cite> conducted during my summer internship with [Muhao Chen](https://muhaochen.github.io/) at USC, critically examines direct textual reasoning for its robust semantic understanding and symbolic reasoning which enables LLMs to act as agents interacting with a Python shell thereby addressing structural information loss. We revealed that while symbolic reasoning excels in structurally oriented tasks, it often lacks depth in semantic understanding. This inspired our introduction of a simple mixed self-consistency method, aggregating different reasoning paths to effectively and simply achieve new state-of-the-art performance.

In contemplating the future direction, my pivotal concern is the **evaluation of LLMs**. Current prevailing benchmarks may fall prey to superficial *cheating* strategies, casting doubt on their efficacy in assessing model proficiency. Slight changes to prompts, output parsing methods, and metric calculations can lead to huge performance differences. Moreover, language's inherent flexibility complicates the evaluation process in the context of contemporary zero-shot learning. This complexity often leads to evaluations focusing on **easy-to-measure aspects**, which may not align with actual user experiences, resulting in a skewed perception of model performance. At current stage, I am interested in specific aspects like **long-context and long-form generation**. In long-context generation, the primary challenges lie in **hallucination**<d-footnote><strong>Hallucination</strong> is the greatest feature of LLMs, which gives creative capacity to generate novel content. It is not inherently problematic but should be a consideration in practical applications to give reliable generation.</d-footnote> and **memorization**<d-footnote><strong>Memorization</strong> here refers to the capacity for long-term retention of information, such as scenarios involving extensive or multi-turn inputs, instead of the model's ability to memorize the training data.</d-footnote>, where maintaining accuracy over extended contexts is a significant challenge for LLMs. For long-form generation, a crucial aspect is avoiding outputs *saying many things and saying nothing simultaneously*. This requires **balancing logical consistency and accuracy while managing verbosity**. Current models often produce overly verbose responses for simple queries, yet fail to provide comprehensive details with depth in more complex discussions. Striking this balance is essential for their effective application across a range of scenarios. Additionally, I am also interested in exploring areas like **agent-based generation** and brainstorming other **interesting capabilities and limitations of LLMs**.

### Enabling Advanced Symbolic Reasoning with LLMs

The augmentation of LLMs fundamentally relies on bolstering their reasoning capacities, encompassing both intrinsic reasoning abilities and their integration with advanced symbolic reasoning. The intrinsic reasoning ability is crucial as it forms the bedrock of functionality, and the integration of advanced symbolic reasoning empowers LLMs to go beyond their inherent boundaries, equipping them with the ability to  learn and master tools for interacting with the external world.

In my research trajectory, I have explored both intrinsic and extrinsic augmentation of LLMs with Prof. [Zhiting Hu](http://zhiting.ucsd.edu/) to align their performance with this vision. Our work<d-cite key="hao2023llmreasoners"></d-cite>, introduces a unified framework of multi-step reasoning patterns<d-cite key="hao2023reasoning,yao2023tree"></d-cite>, guiding LLMs to reason by exploring and navigating via trees. The process is achieved by interactions with the *world model* and the definition of the *reward*, which enable the LLMs to traverse various reasoning pathways and discern the most rewarding ones, optimizing their reasoning trajectory towards the most accurate and logical inferences. On the other hand, my second research focuses on the integration of LLMs with external tools. My study<d-cite key="hao2023toolkengpt"></d-cite>, accepted for an oral presentation at NeurIPS 2023, diverges from traditional few-shot demonstrations, proposing the idea of *toolkens* to learn tools as tokens. This allows LLMs to seamlessly switch between language processing and tool utilization, invoke external tools, and integrate the results directly into the inference process.

In advancing LLMs, I think the central focus for symbolic reasoning is balancing **robustness** - ensuring precise, safe tool usage, and **flexibility** - facilitating the seamless integration of new tools. Currently, tool learning in LLMs predominantly relies on few-shot demonstrations for shallow tool understanding and fine-tuning methods that allow models to adapt to an agent-style output mode. As we have seen through the evolution of various paradigms, from instruction tuning to RLHF, which have enabled few-shot and zero-shot capabilities, the underlying importance of high-quality data has become increasingly evident. In this context, I am intrigued by the potential of what might be termed *symbolic tuning* in LLMs. I hope that each tool can be formed as learnable parameters, such as token embeddings, and by interacting with these tools, LLMs can acquire high-quality data, which could potentially enable the model to effectively learn about the tools and judiciously call them during the inference. The ultimate goal is to develop LLMs **capable of function calls in a manner that is both elegant and intuitively aligned with human reasoning**, enhancing the models' adaptability, accuracy, and safety. 

### Building Applications of LLMs

The pursuit of scientific research in LLMs is ultimately about their practical application for societal benefit.  However, the unrealistic costs of training these models pose a particular challenge for academic researchers. Despite this, the potential for diverse and impactful applications remains significant. Having largely resolved low-level NLP challenges, LLMs are poised to **transform natural language processing into natural language programming**. In this landscape, the development of language agents is particularly noteworthy. Currently, such agents are generally overly complex and costly, relegating their use to recreation rather than practical utility. My objective is to transform them into genuinely **general and useful agents**, capable of functioning as versatile, autonomous agents with the ability to **perceive**, **act**, and **interact with multimodal environments**. 

Furthermore, the large size of current models is a limitation in itself. Dependence on query APIs for accessing these models can largely restrict their full potential. A shift toward **smaller, more precise expert models** for the creation of more localized and efficient AI is imperative, which I believe will naturally relate to **high-quality data** which I mentioned before. The ultimate goal of my research is to ensure that these models are not only **universally accessible and personalized** but also serve **practical purposes**, such as aiding in speech therapy or assisting the visually impaired, thereby aligning scientific advancements with societal benefits.

### Conclusion

In short-term, I plan to critically assess the capabilities and limitations of current models, focusing on what they can and cannot do. This evaluation will help determine their boundaries and potential areas for improvement across various domains. I intend to concentrate on areas that are challenging to evaluate since focusing solely on problems with definitive answers would be biased. If conditions permit, I aim to enable models to perceive, act, and learn from their environments. Ultimately, I aspire for these models to provide assistance and value to people across diverse domains and cultural backgrounds.