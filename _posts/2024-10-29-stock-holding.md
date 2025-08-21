---
layout: post
title: My US Stock Holdings
date: 2024-10-29
description: A concise log of my current holdings in US stocks, updated regularly to monitor value shifts, industry performance, and overall returns.
tags: personal
pretty_table: true
related_posts: false
hidden: true

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

<!-- Custom CSS for this page -->
<link rel="stylesheet" href="{{ '/assets/css/stock-holdings.css' | relative_url }}">

<!-- Custom JavaScript for this page -->
<script src="{{ '/assets/js/stock-holdings.js' | relative_url }}"></script>
<script>
  // Pass Jekyll data to JavaScript
  window.stocksData = [
    {% for stock in site.data.stock_holdings.stocks %}
    {
      name: "{{ stock.name }}",
      symbol: "{{ stock.symbol }}",
      qty: {{ stock.qty }},
      cost_price: {{ stock.cost_price }},
      sector: "{{ stock.sector }}"
    }{% if forloop.last == false %},{% endif %}
    {% endfor %}
  ];
</script>

This page tracks my current portfolio of U.S. stock investments. Please note the following:
> 📌 The information presented here is for personal tracking purposes only. It does not constitute investment advice or recommendations of any kind.
> 
> 💹 The gains and losses shown reflect only my active holdings. Positions that have been fully closed are not included, so this data does not represent my overall investment performance or historical returns.

### Holdings Breakdown

<div class="section-heading">📊 Current Portfolio Status</div>

<!-- Fetching Indicator and Refresh Button -->
<div id="fetching-container" style="display: flex; justify-content: center; align-items: center; margin-bottom: 30px;">
  <button id="refresh-button" class="refresh-button"><span class="refresh-icon">🔄</span> Refresh Data</button>
  <div id="fetching-indicator" class="fetching-indicator" style="margin-left: 15px;">
    Fetching data, please wait...
              </div>
              </div>

<!-- Placeholder for the holdings table -->
<div id="holdings-table-container" style="display: none; margin-top: 20px;">
  <!-- The table will be generated dynamically after data retrieval -->
              </div>

&nbsp;

<!-- Portfolio Chart Container -->
<div id="portfolioChartContainer" style="width: 100%; overflow: visible; max-width: 900px; margin: 40px auto;">
  <div id="portfolioChart" style="width: 850px; height: 480px; margin: 0 auto;"></div>
</div>

<!-- Sector Distribution Chart Container -->
<div id="sectorChartContainer" style="width: 100%; overflow: visible; max-width: 900px; margin: 40px auto;">
  <div id="sectorChart" style="width: 850px; height: 400px; margin: 0 auto;"></div>
</div>

&nbsp;

### Investment Summary

<div class="section-heading">💼 Portfolio Performance</div>

<!-- Placeholder for the summary table -->
<div id="summary-table-container" style="display: none;">
  <!-- The summary table will be generated dynamically after data retrieval -->
</div>

&nbsp;

