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

<!-- Fetching Indicator and Refresh Button -->
<div id="fetching-container" style="display: flex; align-items: center; margin-bottom: 20px;">
  <button id="refresh-button" class="refresh-button">🔄 Refresh Data</button>
  <div id="fetching-indicator" class="fetching-indicator" style="margin-left: 15px;">
    Fetching data, please wait...
  </div>
</div>

<!-- Placeholder for the holdings table -->
<div id="holdings-table-container" style="display: none;">
  <!-- The table will be generated dynamically after data retrieval -->
</div>

<!-- Optional CSS for Positive and Negative P/L -->
<style>
/* Define CSS variables for text color based on the theme */

/* Light mode */
:root {
  --table-text-color: #000000; /* Black */
}

/* Dark mode */
[data-theme='dark'] {
  --table-text-color: #ffffff; /* White */
}

/* Apply the text color to the tables */
#holdings-table, #holdings-table th, #holdings-table td,
#summary-table, #summary-table th, #summary-table td {
  color: var(--table-text-color);
}

/* Styles for P/L (%) column */
.pl-positive {
  color: #28a745; /* Muted green */
  font-weight: bold;
}

.pl-negative {
  color: #dc3545; /* Muted red */
  font-weight: bold;
}

/* Styles for the fetching indicator and refresh button */
#fetching-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.fetching-indicator {
  font-size: 1em;
  color: #555;
}

.fetching-indicator.success {
  color: #28a745;
}

.fetching-indicator.error {
  color: #dc3545;
}

.refresh-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 15px;
  font-size: 1em;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.refresh-button:hover {
  background-color: #0056b3;
}

.refresh-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.refresh-button:focus {
  outline: none;
}

.refresh-button:active {
  background-color: #0056b3;
}
</style>

<!-- JavaScript Code -->
<script>
document.addEventListener("DOMContentLoaded", async function () {
  // API Key
  const apiKey = 'cshj6s1r01qu99bg0oe0cshj6s1r01qu99bg0oeg'; // Replace with your Finnhub API key

  // Stocks Data from YAML File
  var stocks = [
    {% for stock in site.data.stock_holdings.stocks %}
    {
      name: "{{ stock.name }}",
      symbol: "{{ stock.symbol }}",
      qty: {{ stock.qty }},
      cost_price: {{ stock.cost_price }}
    }{% if forloop.last == false %},{% endif %}
    {% endfor %}
  ];

  // Global variables
  var isFetching = false;
  var fetchRetryTimeout = null;
  var chartData = []; // Global variable to store chart data

  // Function to display fetching indicator
  function showFetchingIndicator(message, type = 'info') {
    const indicator = document.getElementById('fetching-indicator');
    indicator.innerText = message;
    indicator.classList.remove('success', 'error');
    if (type === 'success') {
      indicator.classList.add('success');
    } else if (type === 'error') {
      indicator.classList.add('error');
    }
    indicator.style.display = 'block';
  }

  // Function to hide fetching indicator
  function hideFetchingIndicator() {
    document.getElementById('fetching-indicator').style.display = 'none';
  }

  // Function to show error message
  function showError(message) {
    showFetchingIndicator(message, 'error');
  }

  // Function to show success message with fetch time
  function showSuccess(message) {
    showFetchingIndicator(message, 'success');
  }

  // Function to get current time in PST
  function getCurrentPSTTime() {
    const now = new Date();
    const options = {
      timeZone: 'America/Los_Angeles',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    return new Intl.DateTimeFormat('en-US', options).format(now);
  }

  // Function to fetch current price for a given stock
  async function fetchCurrentPrice(stock) {
    const url = `https://finnhub.io/api/v1/quote?symbol=${stock.symbol}&token=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.c) {
        stock.curr_price = data.c;
      } else {
        console.error(`No data for symbol: ${stock.symbol}`);
        stock.curr_price = 0;
        throw new Error(`No data for symbol: ${stock.symbol}`);
      }
    } catch (error) {
      console.error(`Error fetching data for ${stock.symbol}:`, error);
      stock.curr_price = 0;
      throw error;
    }
  }

  // Function to fetch prices for all stocks
  async function fetchAllPrices(stocks) {
    const promises = stocks.map(stock => fetchCurrentPrice(stock));
    await Promise.all(promises);
  }

  // Function to calculate values
  function calculateStocks(stocks) {
    // Perform calculations
    stocks.forEach(stock => {
      stock.stock = `${stock.name}`;
      stock.curr_price = parseFloat(stock.curr_price.toFixed(2));
      stock.cost_price = parseFloat(stock.cost_price.toFixed(2));
      stock.value = parseFloat((stock.qty * stock.curr_price).toFixed(2));
      stock.cost_basis = parseFloat((stock.qty * stock.cost_price).toFixed(2));
      stock.pl_dollar = parseFloat((stock.value - stock.cost_basis).toFixed(2));
      stock.pl_percent = parseFloat(((stock.pl_dollar / stock.cost_basis) * 100).toFixed(2));
      stock.pl_class = stock.pl_percent >= 0 ? 'pl-positive' : 'pl-negative';
    });
  }

  // Function to generate the holdings table dynamically and initialize Bootstrap Table with data
  function generateHoldingsTable(stocks) {
    // Clear previous table if exists
    const container = document.getElementById('holdings-table-container');
    container.innerHTML = '';

    // Calculate total value for proportions
    const totalValue = stocks.reduce((sum, stock) => sum + stock.value, 0);

    // Calculate portfolio weights and add to stocks data
    stocks.forEach(stock => {
      stock.portfolio_weight = (stock.value / totalValue) * 100;
    });

    // Create table element
    var table = document.createElement('table');
    table.id = 'holdings-table';
    table.setAttribute('data-toggle', 'table');
    table.setAttribute('data-search', 'false');
    table.setAttribute('data-pagination', 'true');
    table.setAttribute('data-sortable', 'true');
    table.setAttribute('data-sort-name', 'pl_percent');
    table.setAttribute('data-sort-order', 'desc');

    // Append the table to the container
    container.appendChild(table);

    // Initialize the Bootstrap Table with modified columns
    $('#holdings-table').bootstrapTable({
      data: stocks,
      columns: [
        {
          field: 'stock',
          title: 'Stock',
          sortable: true
        },
        {
          field: 'curr_price',
          title: 'Current Price ($)',
          sortable: true,
          formatter: function(value) {
            return value.toFixed(2);
          }
        },
        {
          field: 'cost_price',
          title: 'Cost Price ($)',
          sortable: true,
          formatter: function(value) {
            return value.toFixed(2);
          }
        },
        {
          field: 'portfolio_weight',
          title: 'Portfolio Weight (%)',
          sortable: true,
          formatter: function(value) {
            return `${value.toFixed(2)}%`;
          }
        },
        {
          field: 'pl_percent',
          title: 'P/L (%)',
          sortable: true,
          formatter: function(value, row) {
            return `<span class="${row.pl_class}">${value.toFixed(2)}%</span>`;
          }
        }
      ]
    });
  }

  // Function to generate the simplified summary table with better styling
  function generateSummaryTable(stocks) {
    // Clear previous table if exists
    const container = document.getElementById('summary-table-container');
    container.innerHTML = '';

    // Calculate total cost and value for overall profit margin
    var total_cost = stocks.reduce((sum, stock) => sum + stock.cost_basis, 0);
    var total_value = stocks.reduce((sum, stock) => sum + stock.value, 0);
    var profit_margin = ((total_value - total_cost) / total_cost) * 100;

    var summaryData = [
      {
        total_profit_margin: profit_margin
      }
    ];

    // Create table element with centered style
    var table = document.createElement('table');
    table.id = 'summary-table';
    table.setAttribute('data-toggle', 'table');
    table.setAttribute('data-search', 'false');
    table.setAttribute('data-pagination', 'false');
    table.setAttribute('data-sortable', 'false');

    // Add custom styles for the summary table
    const style = document.createElement('style');
    style.textContent = `
      #summary-table {
        width: auto !important;
        margin: 0 auto;
        min-width: 300px;
      }
      #summary-table th,
      #summary-table td {
        text-align: center !important;
        font-size: 1.1em;
        padding: 15px !important;
        background-color: var(--table-header-bg);
        border-radius: 8px;
      }
      #summary-table th {
        font-weight: bold;
        border-bottom: 2px solid var(--table-border-color);
      }
      .total-pl-value {
        font-size: 1.2em;
        font-weight: bold;
        padding: 5px 10px;
        border-radius: 4px;
        display: inline-block;
      }
    `;
    document.head.appendChild(style);

    // Append the table to the container
    container.appendChild(table);

    // Initialize the Bootstrap Table with centered and styled profit margin
    $('#summary-table').bootstrapTable({
      data: summaryData,
      columns: [
        {
          field: 'total_profit_margin',
          title: 'Overall Portfolio Return',
          formatter: function(value) {
            const className = value >= 0 ? 'pl-positive' : 'pl-negative';
            return `<span class="total-pl-value ${className}">${value.toFixed(2)}%</span>`;
          }
        }
      ]
    });
  }

  // Function to update the chart
  function updateChart(stocks) {
    // Generate portfolioData
    chartData = stocks.map(stock => ({
      name: stock.name,
      value: stock.value
    }));

    // Update the chart options
    myChart.setOption({
      series: [{
        data: chartData
      }]
    });
  }

  // Function to fetch data and update the page
  async function fetchDataAndUpdate() {
    // Prevent multiple fetches
    if (isFetching) return;

    isFetching = true;
    showFetchingIndicator('Fetching data, please wait...');

    // Disable the refresh button
    const refreshButton = document.getElementById('refresh-button');
    refreshButton.disabled = true;

    try {
      await fetchAllPrices(stocks);
      calculateStocks(stocks);
      generateHoldingsTable(stocks);
      updateChart(stocks);
      generateSummaryTable(stocks);

      // Display the table container after data is loaded
      document.getElementById('holdings-table-container').style.display = 'block';
      document.getElementById('summary-table-container').style.display = 'block';

      // Show success message with fetch time
      const fetchTime = getCurrentPSTTime();
      showSuccess(`Data fetched successfully at ${fetchTime} PST`);

    } catch (error) {
      showError('Fetching error. Retrying in 1 minute...');
      // Retry after 1 minute
      if (fetchRetryTimeout) clearTimeout(fetchRetryTimeout);
      fetchRetryTimeout = setTimeout(() => {
        fetchDataAndUpdate();
      }, 60000); // 60000ms = 1 minute
    } finally {
      isFetching = false;
      // Enable the refresh button
      refreshButton.disabled = false;
    }
  }

  // Initialize the chart (Needs to be global for updateChart function)
  var chartDom = document.getElementById('portfolioChart');
  var myChart = echarts.init(chartDom);

  // Initial chart options (will be updated later)
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
          }
          // Removed data property here to prevent overwriting existing data
        }
      ],
    };
  }

  // Set initial chart theme
  function setChartTheme() {
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    myChart.setOption(getChartOptions(isDarkMode));
  }

  // Initial setup
  setChartTheme();

  // Listen for theme changes using MutationObserver
  const observer = new MutationObserver(setChartTheme);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // Add event listener for the refresh button
  document.getElementById('refresh-button').addEventListener('click', function () {
    fetchDataAndUpdate();
  });

  // Run the fetch data function
  fetchDataAndUpdate();
});
</script>

&nbsp;

<!-- Portfolio Chart Container -->
<div id="portfolioChartContainer" style="width: 100%; overflow: auto; max-width: 900px; max-height: 500px;">
  <div id="portfolioChart" style="width: 850px; height: 500px;"></div>
</div>

&nbsp;

### Investment Summary

&nbsp;

<!-- Placeholder for the summary table -->
<div id="summary-table-container" style="display: none;">
  <!-- The summary table will be generated dynamically after data retrieval -->
</div>

&nbsp;

### My Stock Expectations and Strategies

Here are my expectations and strategies for selected stocks, categorized into **Current Holdings** and **Already Sold** positions. Emojis are used to indicate the status of each stock, with their meanings explained below.

#### Emojis Legend
- **🎯 Achieved:** Target price has been reached.
- **⌛ In Progress:** Target price is yet to be reached.
- **🟢 Hold:** Currently holding the stock.
- **🟠 Sold:** Stock has been sold.

#### Current Holdings

| **Stock**                             | **Target** | **Action** | **Status** | **Comments**                                                                                                 |
|---------------------------------------|------------|------------|------------|--------------------------------------------------------------------------------------------------------------|
| **NVIDIA**                     | >$145     | 🟢     | 🎯         | 🤔 $200+? greedy.                                         |
| **Eli Lilly**                   | >$1,000    | 🟢     | ⌛         | 💸 The market seems overly pessimistic; dips are buying opportunities.                     |
| **Intuitive Surgical**         | ~$600     | 🟢     | ⌛         | 📈 Slow bull. Love it.                      |
| **Costco**                     | >$1,000    | 🟢     | ⌛         | 📈 Great company. Love it. |

#### Already Sold

| **Stock**    | **Target** | **Action** | **Gain** | **Sell Date**       | **Comments**  |
|--------------|------------|------------|----------|----------------------|--------------------------------|
| **MicroStrategy**           | >$250     | 🟠     | 17.32%   | 10/30/2024 at $251    |  😌 $400+? Happy with ~20% gain, but could’ve squeezed more.                      |
| **TSMC**    | >$200     | 🟠     | 1.22%    | 11/07/2024 at $191.22 | 😥 Trump...? |
| **Intuitive Surgical**                         | >$600     | 🟠     | 0.00%    | 11/14 at $541.12 and 11/15/2024 at $533.80   | 🤡 Sell to add $LLY.. |

