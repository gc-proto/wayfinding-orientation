# covid-19-guidance
TBS prototypes for Covid-19 by the TBS Digital Transformation Office for Canada.ca

## Prototyping for usability research during COVID-19 crisis 
[See all prototype links](http://test.canada.ca/covid-19-guidance/hc-links-en.html)

You can now build your page in low-code or no code. This repo will output `html` pages from `markdown` files. Just put a few parameters as your front matter like so:

`markdown-filename.md`
```
---
altLangPage: "#"                                   # Optional. Use the url of the alternate language page to display the language toggle
breadcrumbs:                                       # By default the Canada.ca crumbs is already set
  - title: "[The title]"
    link:  "[The url]"
css: [https://domain.ca/your-stylesheet.css]       # Optional. You can add custom css to your page
dateModified: [2021-99-99]                         # ISO date
lang:   [en | fr]                                  # Either "en" or "fr"
layout: default                                    # Available: default, fluid, layout-home, no-container, wothout-h1
pageclass: cnt-wdth-lmtd                           # Optional. You can use "cnt-wdth-lmtd" to limit the lenght of content lines to 65 characters
script: [https://domain.ca/your-awesome-script.js] # Optional. You can add custom javascript to your page
title:  [The title of the current page]            # This value will set the title and h1 tag
---

This is a simple web page using the GCWeb Jekyll theme

## Header 2

> No code blockquote

<blockquote>
GCWeb blockquote
</blockquote>

### Header 3
* This is an unordered list following a header.
* This is an unordered list following a header.
* This is an unordered list following a header.

1. This is an ordered list following a header.
2. This is an ordered list following a header.
3. This is an ordered list following a header.

<div class="row">
  <div class="col-md-6">
    <p>Complexe HTML layouts are supported too!</p>
  </div>
  <div class="col-md-6">
    <p>Use classes, HTML5 tags or any unsupported features by Markdown</p>
  </div>
</div>
```
The `layout: default` parameter will output the header and footer automatically. You can now focus on the relevant content in between the hat and shoes.

Questions and feedback: post an issue to @lisafast
