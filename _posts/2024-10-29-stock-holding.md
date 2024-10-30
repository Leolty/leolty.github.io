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

<!-- Holdings Table -->
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
      <th data-field="pl_percent" data-sortable="true" data-sorter="plPercentSorter">P/L (%)</th>
      <th data-field="pl_dollar" data-sortable="true">P/L ($)</th>
    </tr>
  </thead>
  <tbody>
    {% for stock in site.data.stock_holdings.stocks %}
      {% assign value = stock.qty | times: stock.curr_price %}
      {% assign cost_basis = stock.qty | times: stock.cost_price %}
      {% assign pl_dollar = value | minus: cost_basis %}
      {% assign pl_percent = pl_dollar | times: 100.0 | divided_by: cost_basis %}
      
      <!-- Assign CSS class based on P/L percentage -->
      {% if pl_percent >= 0 %}
        {% assign pl_class = "pl-positive" %}
      {% else %}
        {% assign pl_class = "pl-negative" %}
      {% endif %}
      
      <tr>
        <td>{{ stock.symbol }}</td>
        <td>{{ stock.qty }}</td>
        <td>{{ stock.curr_price }}</td>
        <td>{{ stock.cost_price }}</td>
        <td>{{ value | round: 2 }}</td>
        <td>{{ cost_basis | round: 2 }}</td>
        <td data-sort-value="{{ pl_percent }}" class="{{ pl_class }}">{{ pl_percent | round: 2 }}%</td>
        <td>{{ pl_dollar | round: 2 }}</td>
      </tr>
    {% endfor %}
  </tbody>
</table>

<!-- Custom Sorter Script -->
<script>
  // Define a custom sorter for the P/L (%) column
  function plPercentSorter(a, b) {
    // Parse the numeric values from data-sort-value
    var aVal = parseFloat(a);
    var bVal = parseFloat(b);
    
    // Handle NaN cases by treating them as zero
    if (isNaN(aVal)) aVal = 0;
    if (isNaN(bVal)) bVal = 0;
    
    // Return the difference for ascending order
    return aVal - bVal;
  }

  // Register the custom sorter with Bootstrap Table
  $(document).ready(function() {
    // Extend Bootstrap Table's default sorters with the custom sorter
    $.extend($.fn.bootstrapTable.defaults.sorters, {
      plPercentSorter: plPercentSorter
    });

    // Initialize the Bootstrap Table
    $('#holdings-table').bootstrapTable();
  });
</script>

<!-- Optional CSS for Positive and Negative P/L -->
<style>
/* Styles for P/L (%) column */
.pl-positive {
  color: #28a745; /* Muted green */
  font-weight: bold;
}

.pl-negative {
  color: #dc3545; /* Muted red */
  font-weight: bold;
}
</style>


&nbsp;

<div id="portfolioChartContainer" style="width: 100%; overflow: auto; max-width: 900px; max-height: 500px;">
    <div id="portfolioChart" style="width: 850px; height: 500px;"></div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    var chartDom = document.getElementById('portfolioChart');
    var myChart = echarts.init(chartDom);

    // Calculate portfolio data from stock holdings
    var portfolioData = [];
    {% for stock in site.data.stock_holdings.stocks %}
        portfolioData.push({
            name: "{{ stock.symbol }}",
            value: {{ stock.qty | times: stock.curr_price | round: 2 }}
        });
    {% endfor %}

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
                    data: portfolioData
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
    {% assign total_value = 0 %}
    {% assign total_cost = 0 %}
    {% for stock in site.data.stock_holdings.stocks %}
      {% assign value = stock.qty | times: stock.curr_price %}
      {% assign cost = stock.qty | times: stock.cost_price %}
      {% assign total_value = total_value | plus: value %}
      {% assign total_cost = total_cost | plus: cost %}
    {% endfor %}
    {% assign total_profit = total_value | minus: total_cost %}
    {% assign profit_margin = total_profit | times: 100.0 | divided_by: total_cost %}
    <tr>
      <td>{{ total_cost | round: 2 }}</td>
      <td>{{ total_value | round: 2 }}</td>
      <td>{{ total_profit | round: 2 }}</td>
      <td>{{ profit_margin | round: 2 }}%</td>
    </tr>
  </tbody>
</table>
