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

&nbsp;

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
    <tr><td>NVIDIA</td><td>88</td><td>141.32</td><td>70.59</td><td>12,436.16</td><td>6,211.92</td><td>100.20%</td><td>6,224.24</td></tr>
    <tr><td>MicroStrategy</td><td>4</td><td>259.50</td><td>217.00</td><td>1,038.00</td><td>868.00</td><td>19.59%</td><td>170.00</td></tr>
    <tr><td>Microsoft</td><td>4</td><td>436.60</td><td>416.82</td><td>1,746.40</td><td>1,667.28</td><td>4.75%</td><td>79.12</td></tr>
    <tr><td>Broadcom</td><td>3</td><td>178.65</td><td>171.18</td><td>535.95</td><td>513.54</td><td>4.36%</td><td>22.41</td></tr>
    <tr><td>Apple</td><td>7.64</td><td>232.88</td><td>225.89</td><td>1,778.71</td><td>1,725.33</td><td>3.10%</td><td>53.41</td></tr>
    <tr><td>TSMC</td><td>6</td><td>196.57</td><td>191.98</td><td>1,179.42</td><td>1,151.88</td><td>2.39%</td><td>27.52</td></tr>
    <tr><td>Costco</td><td>1.11</td><td>886.99</td><td>889.34</td><td>986.14</td><td>988.76</td><td>-0.26%</td><td>-2.61</td></tr>
    <tr><td>Intuitive Surgical</td><td>2</td><td>516.31</td><td>520.00</td><td>1,032.62</td><td>1,040.00</td><td>-0.71%</td><td>-7.38</td></tr>
    <tr><td>Eli Lilly</td><td>2.01</td><td>907.80</td><td>917.39</td><td>1,820.76</td><td>1,839.99</td><td>-1.05%</td><td>-19.24</td></tr>
  </tbody>
</table>

&nbsp;

<div id="portfolioChartContainer" style="width: 100%; overflow: auto; max-width: 900px; max-height: 500px;">
    <div id="portfolioChart" style="width: 850px; height: 500px;"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    var chartDom = document.getElementById('portfolioChart');
    var myChart = echarts.init(chartDom);

    // Define options for light and dark themes
    function getChartOptions(isDarkMode) {
        return {
            title: {
                text: "Portfolio Breakdown by Stock Value",
                left: "center",
                top: "5%",
                textStyle: {
                    fontFamily: '"EB Garamond", serif',
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: isDarkMode ? "#ffffff" : "#000000"
                }
            },
            tooltip: {
                trigger: "item",
                formatter: "{b}: ${c} ({d}%)",
                textStyle: {
                    fontFamily: '"EB Garamond", serif',
                    color: isDarkMode ? "#ffffff" : "#000000"
                },
                backgroundColor: isDarkMode ? "#333333" : "#ffffff",
                borderColor: isDarkMode ? "#ffffff" : "#333333"
            },
            legend: {
                orient: "vertical",
                right: "5%",
                top: "middle",
                itemGap: 10,
                textStyle: {
                    fontFamily: '"EB Garamond", serif',
                    fontSize: 14,
                    color: isDarkMode ? "#ffffff" : "#000000"
                }
            },
            series: [
                {
                    name: "Stock Value",
                    type: "pie",
                    radius: ["40%", "70%"],
                    center: ["40%", "55%"],
                    avoidLabelOverlap: true,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: isDarkMode ? "#333333" : "#ffffff",
                        borderWidth: 2
                    },
                    label: {
                        show: true,
                        formatter: "{b}: {d}%",
                        fontFamily: '"EB Garamond", serif',
                        fontSize: 14,
                        position: 'outside',
                        distanceToLabelLine: 15,
                        color: isDarkMode ? "#ffffff" : "#000000"
                    },
                    labelLine: {
                        show: true,
                        lineStyle: {
                            color: isDarkMode ? "#ffffff" : "#333333"
                        },
                        length: 20,
                        length2: 15
                    },
                    labelLayout: function (params) {
                        return {
                            moveOverlap: 'shiftY'
                        };
                    },
                    emphasis: {
                        scale: true,
                        scaleSize: 10
                    },
                    data: [
                        { value: 12436.16, name: "NVIDIA" },
                        { value: 1038.00, name: "MicroStrategy" },
                        { value: 1778.71, name: "Apple" },
                        { value: 1746.40, name: "Microsoft" },
                        { value: 1179.42, name: "TSMC" },
                        { value: 535.95, name: "Broadcom" },
                        { value: 986.14, name: "Costco" },
                        { value: 1032.62, name: "Intuitive Surgical" },
                        { value: 1820.76, name: "Eli Lilly" }
                    ]
                }
            ],
        };
    }

    // Initial check for dark mode
    function setChartTheme() {
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        myChart.setOption(getChartOptions(isDarkMode));
    }

    // Initial setup
    setChartTheme();

    // Listen for theme changes using MutationObserver
    const observer = new MutationObserver(setChartTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
});
</script>



&nbsp;

### Investment Summary

&nbsp;

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
    <tr><td>16,006.69</td><td>22,554.16</td><td>6,547.47</td><td>40.90</td></tr>
  </tbody>
</table>

&nbsp;

### Update Log
- **Last Updated:** October 29, 2024, 15:41 PM (PST)