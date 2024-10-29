---
layout: post
title: My US Stock Holdings
date: 2024-10-29
description: A concise log of my current holdings in US stocks, updated regularly to monitor value shifts, industry performance, and overall returns.
tags: personal
pretty_table: true
related_posts: false

authors:
  - name: Tianyang Liu
    url: "https://leolty.github.io/"
    affiliations:
      name: UC San Diego

toc:
  beginning: true

chart:
  echarts: true
---

This post records my latest holdings in select US stocks. I will regularly update it to track changes in values, industry movements, and overall returns. This is purely for personal tracking purposes.

### Holdings Breakdown

##### **Table 1:** Current Stock Holdings with Profit/Loss Details

<table
  id="holdings-table"
  data-toggle="table"
  data-search="false"
  data-pagination="true"
  data-sortable="true"
  data-sort-name="pl_percent"
  data-sort-order="desc"
>
  <thead>
    <tr>
      <th data-field="stock" data-sortable="true">Stock</th>
      <th data-field="qty" data-sortable="true">Qty</th>
      <th data-field="curr_price" data-sortable="true">Curr Price ($)</th>
      <th data-field="cost_price" data-sortable="true">Cost Price ($)</th>
      <th data-field="value" data-sortable="true">Value ($)</th>
      <th data-field="cost_basis" data-sortable="true">Cost Basis ($)</th>
      <th data-field="pl_percent" data-sortable="true">P/L (%)</th>
      <th data-field="pl_dollar" data-sortable="true">P/L ($)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>NVIDIA</td><td>88</td><td>139.70</td><td>70.59</td><td>12,293.60</td><td>6,211.92</td><td>97.90%</td><td>6,081.68</td></tr>
    <tr><td>MicroStrategy</td><td>4</td><td>268.80</td><td>217.00</td><td>1,075.20</td><td>868.00</td><td>23.87%</td><td>207.20</td></tr>
    <tr><td>Apple</td><td>7.64</td><td>232.80</td><td>225.89</td><td>1,778.10</td><td>1,725.33</td><td>3.06%</td><td>52.78</td></tr>
    <tr><td>Microsoft</td><td>4</td><td>427.72</td><td>416.82</td><td>1,710.88</td><td>1,667.28</td><td>2.62%</td><td>43.60</td></tr>
    <tr><td>TSMC</td><td>6</td><td>194.70</td><td>191.98</td><td>1,168.20</td><td>1,151.88</td><td>1.42%</td><td>16.32</td></tr>
    <tr><td>Broadcom</td><td>3</td><td>172.16</td><td>171.18</td><td>516.48</td><td>513.54</td><td>0.57%</td><td>2.94</td></tr>
    <tr><td>Costco</td><td>1.11</td><td>892.69</td><td>889.34</td><td>992.48</td><td>988.76</td><td>0.38%</td><td>3.73</td></tr>
    <tr><td>Intuitive Surgical</td><td>2</td><td>510.88</td><td>520.00</td><td>1,021.76</td><td>1,040.00</td><td>-1.75%</td><td>-18.24</td></tr>
    <tr><td>Eli Lilly</td><td>2.01</td><td>896.28</td><td>917.39</td><td>1,797.65</td><td>1,839.99</td><td>-2.30%</td><td>-42.34</td></tr>
  </tbody>
</table>

### Investment Summary

##### **Table 2:** Overall Investment Metrics

<table
  id="summary-table"
  data-toggle="table"
  data-search="false"
  data-pagination="false"
  data-sortable="true"
>
  <thead>
    <tr>
      <th data-field="total_cost_basis" data-sortable="true">Total Cost Basis ($)</th>
      <th data-field="total_market_value" data-sortable="true">Total Market Value ($)</th>
      <th data-field="total_profit" data-sortable="true">Total Profit ($)</th>
      <th data-field="total_profit_margin" data-sortable="true">Total Profit Margin (%)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>16,006.69</td><td>22,354.35</td><td>6,347.66</td><td>39.66</td></tr>
  </tbody>
</table>

<!-- ```echarts
{
  "title": {
    "text": "Portfolio Breakdown by Stock Value",
    "left": "center"
  },
  "tooltip": {
    "trigger": "item",
    "formatter": "{b}: ${c}"
  },
  "legend": {
    "top": "10%",
    "orient": "horizontal"
  },
  "series": [
    {
      "name": "Stock Value",
      "type": "pie",
      "radius": ["40%", "70%"],
      "avoidLabelOverlap": false,
      "itemStyle": {
        "borderRadius": 10,
        "borderColor": "#fff",
        "borderWidth": 2
      },
      "label": {
        "show": true,
        "formatter": "{b}: {d}%"
      },
      "data": [
        { "value": 12293.60, "name": "NVIDIA" },
        { "value": 1075.20, "name": "MicroStrategy" },
        { "value": 1778.10, "name": "Apple" },
        { "value": 1710.88, "name": "Microsoft" },
        { "value": 1168.20, "name": "TSMC" },
        { "value": 516.48, "name": "Broadcom" },
        { "value": 992.48, "name": "Costco" },
        { "value": 1021.76, "name": "Intuitive Surgical" },
        { "value": 1797.65, "name": "Eli Lilly" }
      ]
    }
  ]
}
``` -->

### Update Log
- **Last Updated:** October 29, 2024, 03:07 AM (PST)
