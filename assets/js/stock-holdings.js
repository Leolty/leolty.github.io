// Stock Holdings Page JavaScript
class StockHoldings {
  constructor() {
    this.apiKey = 'cshj6s1r01qu99bg0oe0cshj6s1r01qu99bg0oeg';
    this.isFetching = false;
    this.fetchRetryTimeout = null;
    this.chartData = [];
    this.myChart = null;
    
    this.init();
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.initChart();
      this.setupEventListeners();
      this.fetchDataAndUpdate();
    });
  }

  // Utility Functions
  getCurrentPSTTime() {
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

  showFetchingIndicator(message, type = 'info') {
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

  hideFetchingIndicator() {
    document.getElementById('fetching-indicator').style.display = 'none';
  }

  showError(message) {
    this.showFetchingIndicator(message, 'error');
  }

  showSuccess(message) {
    this.showFetchingIndicator(message, 'success');
  }

  // API Functions
  async fetchCurrentPrice(stock) {
    const symbol = stock.symbol === "BTC" ? "BINANCE:BTCUSDT" : stock.symbol;
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${this.apiKey}`;
    let retries = 0;
    const maxRetries = 5;
    const baseDelay = 300;
    
    while (retries <= maxRetries) {
      try {
        const response = await fetch(url);
        
        if (response.status === 429) {
          retries++;
          if (retries > maxRetries) {
            throw new Error(`Rate limit exceeded for ${stock.symbol} after ${maxRetries} retries`);
          }
          
          const delay = baseDelay * Math.pow(2, retries) + Math.random() * 100;
          console.log(`Rate limited for ${stock.symbol}, retrying after ${delay.toFixed(0)}ms (retry ${retries}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        const data = await response.json();
        if (data.c) {
          stock.curr_price = data.c;
          return;
        } else {
          console.error(`No data for symbol: ${stock.symbol}`);
          stock.curr_price = 0;
          throw new Error(`No data for symbol: ${stock.symbol}`);
        }
      } catch (error) {
        retries++;
        if (retries > maxRetries || error.message.includes('No data for symbol')) {
          console.error(`Error fetching data for ${stock.symbol}:`, error);
          stock.curr_price = 0;
          throw error;
        }
        
        const delay = baseDelay * Math.pow(2, retries) + Math.random() * 100;
        console.log(`Error for ${stock.symbol}, retrying after ${delay.toFixed(0)}ms (retry ${retries}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  async fetchAllPrices(stocks) {
    const concurrencyLimit = 3;
    
    for (let i = 0; i < stocks.length; i += concurrencyLimit) {
      const batch = stocks.slice(i, i + concurrencyLimit);
      const promises = batch.map(stock => this.fetchCurrentPrice(stock));
      
      await Promise.all(promises).catch(err => console.error('Batch error:', err));
      
      if (i + concurrencyLimit < stocks.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }

  // Data Processing
  calculateStocks(stocks) {
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

  // Emoji indicator (redesigned based on actual performance)
  createEmojiIndicator(row) {
    const type = row.performance_type;
    const displayValue = Math.abs(Math.round(row.pl_percent));
    const prefix = type === 'positive' ? '+' : '-';
    const actualPercent = row.pl_percent; // Use actual percentage, not normalized
    
    let emoji;
    
    if (type === 'positive') {
      // For positive returns, based on actual gain percentage
      if (actualPercent >= 50) emoji = '🤩';        // 50%+ gain - star-struck
      else if (actualPercent >= 30) emoji = '😍';   // 30%+ gain - heart eyes
      else if (actualPercent >= 20) emoji = '😁';   // 20%+ gain - grinning face
      else if (actualPercent >= 10) emoji = '😄';   // 10%+ gain - grinning face with smiling eyes
      else if (actualPercent >= 5) emoji = '😊';    // 5%+ gain - smiling face with smiling eyes
      else if (actualPercent >= 1) emoji = '🙂';    // 1%+ gain - slightly smiling face
      else emoji = '😐';                            // 0-1% gain - neutral face
    } else {
      // For negative returns, based on actual loss percentage
      if (actualPercent <= -50) emoji = '😭';       // 50%+ loss - loudly crying
      else if (actualPercent <= -30) emoji = '😢';  // 30%+ loss - crying face
      else if (actualPercent <= -20) emoji = '😰';  // 20%+ loss - anxious face with sweat
      else if (actualPercent <= -10) emoji = '😞';  // 10%+ loss - disappointed face
      else if (actualPercent <= -5) emoji = '😕';   // 5%+ loss - confused face
      else if (actualPercent <= -1) emoji = '😟';   // 1%+ loss - worried face
      else emoji = '😐';                            // 0-1% loss - neutral face
    }
    
    return `<div class="emoji-indicator">
              <div class="performance-emoji">${emoji}</div>
              <div class="emoji-value emoji-value-${type}">${prefix}${displayValue}%</div>
            </div>`;
  }

  // Chart Functions
  initChart() {
    var chartDom = document.getElementById('portfolioChart');
    this.myChart = echarts.init(chartDom);
    
    var sectorChartDom = document.getElementById('sectorChart');
    this.sectorChart = echarts.init(sectorChartDom);
    
    this.setChartTheme();
    
    // Listen for theme changes
    const observer = new MutationObserver(() => this.setChartTheme());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  setChartTheme() {
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    this.myChart.setOption(this.getChartOptions(isDarkMode));
    this.sectorChart.setOption(this.getSectorChartOptions(isDarkMode));
  }

  getChartOptions(isDarkMode) {
    const colorPalette = [
      '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', 
      '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#6b778d',
      '#b5bd48', '#e44a8c', '#4e9caa', '#8c7853', '#a1488e',
      '#5d7148', '#e77c30', '#4682b4', '#bc8f8f', '#6a5acd'
    ];
    
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
      color: colorPalette,
      tooltip: {
        trigger: "item",
        formatter: function(params) {
          return `${params.data.fullName}: ${params.percent}%`;
        },
        textStyle: {
          fontFamily: '"EB Garamond", serif',
          color: isDarkMode ? "#ffffff" : "#000000"
        },
        backgroundColor: isDarkMode ? "#333333" : "#ffffff",
        borderColor: isDarkMode ? "#ffffff" : "#333333"
      },
      legend: {
        orient: "vertical",
        right: "2%",
        top: "middle",
        itemGap: 12,
        itemWidth: 14,
        itemHeight: 14,
        textStyle: {
          fontFamily: '"EB Garamond", serif',
          fontSize: 13,
          color: isDarkMode ? "#ffffff" : "#000000",
          padding: [0, 0, 0, 8]
        },
        formatter: (name) => {
          const item = this.chartData.find(item => item.symbol === name);
          return item ? item.name : name;
        }
      },
      series: [{
        name: "Stock Value",
        type: "pie",
        radius: ["40%", "65%"],
        center: ["35%", "55%"],
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
          fontSize: 13,
          position: 'outside',
          distanceToLabelLine: 20,
          color: isDarkMode ? "#ffffff" : "#000000"
        },
        labelLine: {
          show: true,
          lineStyle: {
            color: isDarkMode ? "#ffffff" : "#333333"
          },
          length: 25,
          length2: 20
        },
        labelLayout: {
          moveOverlap: 'shiftY'
        },
        emphasis: {
          scale: true,
          scaleSize: 10
        }
      }]
    };
  }

  getSectorChartOptions(isDarkMode) {
    const sectorColors = {
      'Semiconductors': '#007bff',
      'Internet/Cloud': '#17a2b8',
      'Healthcare': '#28a745', 
      'Fintech': '#e83e8c',
      'Traditional Banking': '#fd7e14',
      'ETF': '#6f42c1'
    };
    
    return {
      title: {
        text: "Portfolio Breakdown by Sector",
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
        formatter: function(params) {
          return `${params.name}: ${params.percent}% (${params.data.count} holdings)`;
        },
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
        itemGap: 12,
        textStyle: {
          fontFamily: '"EB Garamond", serif',
          fontSize: 14,
          color: isDarkMode ? "#ffffff" : "#000000"
        }
      },
      series: [{
        name: "Sector Distribution",
        type: "pie",
        radius: ["30%", "60%"],
        center: ["40%", "55%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 8,
          borderColor: isDarkMode ? "#333333" : "#ffffff",
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: "{b}: {d}%",
          fontFamily: '"EB Garamond", serif',
          fontSize: 13,
          color: isDarkMode ? "#ffffff" : "#000000"
        },
        emphasis: {
          scale: true,
          scaleSize: 10
        },
        data: this.sectorData || []
      }]
    };
  }

  updateChart(stocks) {
    // Update portfolio chart data
    this.chartData = stocks.map(stock => ({
      name: stock.name,
      symbol: stock.symbol,
      value: stock.value
    }));

    this.myChart.setOption({
      series: [{
        data: this.chartData.map(item => ({
          name: item.symbol,
          value: item.value,
          fullName: item.name
        }))
      }]
    });
    
    // Update sector chart data
    const sectorMap = {};
    const sectorCounts = {};
    const sectorColors = {
      'Semiconductors': '#007bff',
      'Internet/Cloud': '#17a2b8',
      'Healthcare': '#28a745', 
      'Fintech': '#e83e8c',
      'Traditional Banking': '#fd7e14',
      'ETF': '#6f42c1'
    };
    
    stocks.forEach(stock => {
      const sector = stock.sector || 'Unknown';
      if (!sectorMap[sector]) {
        sectorMap[sector] = 0;
        sectorCounts[sector] = 0;
      }
      sectorMap[sector] += stock.value;
      sectorCounts[sector] += 1;
    });
    
    this.sectorData = Object.entries(sectorMap).map(([sector, value]) => ({
      name: sector,
      value: value,
      count: sectorCounts[sector],
      itemStyle: {
        color: sectorColors[sector] || '#6c757d'
      }
    }));
    
    this.sectorChart.setOption({
      series: [{
        data: this.sectorData
      }]
    });
  }

  // Table Generation
  generateHoldingsTable(stocks) {
    const container = document.getElementById('holdings-table-container');
    container.innerHTML = '';

    var table = document.createElement('table');
    table.id = 'holdings-table';
    table.setAttribute('data-toggle', 'table');
    table.setAttribute('data-search', 'false');
    table.setAttribute('data-pagination', 'true');
    table.setAttribute('data-sortable', 'true');
    table.setAttribute('data-sort-name', 'pl_percent');
    table.setAttribute('data-sort-order', 'desc');

    container.appendChild(table);

    const totalValue = stocks.reduce((sum, stock) => sum + stock.value, 0);
    const maxPerformance = Math.max(...stocks.map(stock => Math.abs(stock.pl_percent)));
    
    stocks.forEach(stock => {
      stock.portfolio_weight = (stock.value / totalValue) * 100;
      stock.performance_type = stock.pl_percent >= 0 ? 'positive' : 'negative';
      
      const normalizedValue = Math.abs(stock.pl_percent) / maxPerformance;
      stock.progress_fill = Math.min(100, normalizedValue * 100);
    });

    $('#holdings-table').bootstrapTable({
      data: stocks,
      pagination: true,
      pageSize: 20,
      pageList: [20, 50, 100, 'all'],
      columns: [
        {
          field: 'indicator',
          title: '',
          sortable: false,
          width: 40,
          align: 'center',
          formatter: (value, row) => {
            return this.createEmojiIndicator(row);
          }
        },
        {
          field: 'stock',
          title: 'Stock',
          sortable: true
        },
        {
          field: 'sector',
          title: 'Sector',
          sortable: true,
          formatter: (value) => {
            return `<span class="sector-tag sector-${value.toLowerCase().replace(/[\s\/]+/g, '-')}">${value}</span>`;
          }
        },
        {
          field: 'curr_price',
          title: 'Price ($)',
          sortable: true,
          formatter: (value) => value.toFixed(2)
        },
        {
          field: 'portfolio_weight',
          title: 'Weight (%)',
          sortable: true,
          formatter: (value) => `${value.toFixed(1)}%`
        },
        {
          field: 'pl_percent',
          title: 'P/L (%)',
          sortable: true,
          formatter: (value, row) => `<span class="${row.pl_class}">${value.toFixed(2)}%</span>`
        }
      ]
    });
  }

  generateSummaryTable(stocks) {
    const container = document.getElementById('summary-table-container');
    container.innerHTML = '';

    const totalStocks = stocks.length;
    const total_cost = stocks.reduce((sum, stock) => sum + stock.cost_basis, 0);
    const total_value = stocks.reduce((sum, stock) => sum + stock.value, 0);
    const total_profit_loss = total_value - total_cost;
    const profit_margin = ((total_value - total_cost) / total_cost) * 100;
    
    const sortedByPerformance = [...stocks].sort((a, b) => b.pl_percent - a.pl_percent);
    const bestStock = sortedByPerformance[0];
    const worstStock = sortedByPerformance[sortedByPerformance.length - 1];
    
    const winners = stocks.filter(stock => stock.pl_percent > 0).length;
    const losers = stocks.filter(stock => stock.pl_percent < 0).length;
    const winRate = (winners / totalStocks) * 100;

    // Calculate average return
    const avgReturn = stocks.reduce((sum, stock) => sum + stock.pl_percent, 0) / totalStocks;

    // Calculate portfolio diversity - using Shannon Diversity Index based on position weights
    const portfolioEntropy = stocks.reduce((entropy, stock) => {
      const weight = stock.portfolio_weight / 100;
      return entropy - (weight > 0 ? weight * Math.log(weight) : 0);
    }, 0);
    const maxEntropy = Math.log(totalStocks);
    const diversityIndex = (portfolioEntropy / maxEntropy) * 100;

    // Calculate sector diversity using REAL sector data
    const sectorMap = {};
    const sectorCounts = {};
    stocks.forEach(stock => {
      const sector = stock.sector || 'Unknown'; // Use real sector data
      if (!sectorMap[sector]) {
        sectorMap[sector] = 0;
        sectorCounts[sector] = 0;
      }
      sectorMap[sector] += stock.portfolio_weight;
      sectorCounts[sector] += 1;
    });
    
    // Find most concentrated sector
    let topSector = '';
    let topSectorWeight = 0;
    Object.entries(sectorMap).forEach(([sector, weight]) => {
      if (weight > topSectorWeight) {
        topSector = sector;
        topSectorWeight = weight;
      }
    });

    // Find largest single position
    const largestPosition = Math.max(...stocks.map(stock => stock.portfolio_weight));
    const largestPositionStock = stocks.find(stock => stock.portfolio_weight === largestPosition);

    // Calculate volatility (standard deviation of returns)
    const variance = stocks.reduce((sum, stock) => {
      return sum + Math.pow(stock.pl_percent - avgReturn, 2);
    }, 0) / totalStocks;
    const volatility = Math.sqrt(variance);

    // Calculate sector-specific metrics
    const sectorAnalysis = Object.entries(sectorMap).map(([sector, weight]) => ({
      sector,
      weight,
      count: sectorCounts[sector],
      // Use simple average return (not weighted) to show which sector has better stock picks
      // Weighted average would bias towards sectors with higher allocation
      avgReturn: stocks
        .filter(stock => stock.sector === sector)
        .reduce((sum, stock) => sum + stock.pl_percent, 0) / sectorCounts[sector],
      // Total contribution to portfolio performance
      totalContribution: stocks
        .filter(stock => stock.sector === sector)
        .reduce((sum, stock) => sum + (stock.pl_percent * stock.portfolio_weight / 100), 0)
    })).sort((a, b) => b.weight - a.weight);

    const bestSector = sectorAnalysis.reduce((best, current) => 
      current.avgReturn > best.avgReturn ? current : best
    );

    const topContributingSector = sectorAnalysis.reduce((best, current) => 
      current.totalContribution > best.totalContribution ? current : best
    );

    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'summary-cards-container';
    container.appendChild(cardsContainer);

    const cards = [
      {
        icon: '📈',
        iconClass: 'overview-icon',
        title: 'Total P/L',
        value: `${profit_margin.toFixed(2)}%`,
        valueClass: profit_margin >= 0 ? 'pl-positive' : 'pl-negative',
        subtext: `${total_profit_loss >= 0 ? '+' : ''}$${total_profit_loss.toLocaleString()}`
      },
      {
        icon: '💰',
        iconClass: 'overview-icon',
        title: 'Portfolio Value',
        value: `$${total_value.toLocaleString()}`,
        subtext: `Cost: $${total_cost.toLocaleString()}`
      },
      {
        icon: '📊',
        iconClass: 'win-rate-icon',
        title: 'Average Return',
        value: `${avgReturn.toFixed(2)}%`,
        valueClass: avgReturn >= 0 ? 'pl-positive' : 'pl-negative',
        subtext: `Volatility: ${volatility.toFixed(1)}%`
      },
      {
        icon: '🎯',
        iconClass: 'win-rate-icon',
        title: 'Win Rate',
        value: `${winRate.toFixed(1)}%`,
        subtext: `${winners} winners, ${losers} losers`
      },
      {
        icon: '🏆',
        iconClass: 'best-icon',
        title: 'Best Performer',
        value: `+${bestStock.pl_percent.toFixed(2)}%`,
        valueClass: 'pl-positive',
        subtext: `${bestStock.symbol} - ${bestStock.name}`
      },
      {
        icon: '📉',
        iconClass: 'worst-icon',
        title: 'Worst Performer',
        value: `${worstStock.pl_percent.toFixed(2)}%`,
        valueClass: 'pl-negative',
        subtext: `${worstStock.symbol} - ${worstStock.name}`
      },
      {
        icon: '🏭',
        iconClass: 'concentration-icon',
        title: 'Top Sector',
        value: `${topSectorWeight.toFixed(1)}%`,
        subtext: `${topSector} (${sectorCounts[topSector]} holdings)`
      },
      {
        icon: '🚀',
        iconClass: 'best-icon',
        title: 'Best Sector',
        value: `${bestSector.avgReturn.toFixed(2)}%`,
        valueClass: bestSector.avgReturn >= 0 ? 'pl-positive' : 'pl-negative',
        subtext: `${bestSector.sector} avg return`
      },
      {
        icon: '💎',
        iconClass: 'overview-icon',
        title: 'Top Contributor',
        value: `${topContributingSector.totalContribution.toFixed(2)}%`,
        valueClass: topContributingSector.totalContribution >= 0 ? 'pl-positive' : 'pl-negative',
        subtext: `${topContributingSector.sector} total impact`
      }
    ];

    cards.forEach(cardData => {
      const card = document.createElement('div');
      card.className = 'summary-card';
      card.innerHTML = `
        <div class="card-header">
          <div class="card-icon ${cardData.iconClass}">${cardData.icon}</div>
          <h3 class="card-title">${cardData.title}</h3>
        </div>
        <div class="card-value ${cardData.valueClass || ''}">${cardData.value}</div>
        <div class="card-subtext">${cardData.subtext}</div>
      `;
      cardsContainer.appendChild(card);
    });
  }

  // Event Handlers
  setupEventListeners() {
    document.getElementById('refresh-button').addEventListener('click', () => {
      this.fetchDataAndUpdate();
    });
  }

  // Main Function
  async fetchDataAndUpdate() {
    if (this.isFetching) return;

    this.isFetching = true;
    this.showFetchingIndicator('Fetching data, please wait...');

    const refreshButton = document.getElementById('refresh-button');
    refreshButton.disabled = true;

    try {
      // Get stocks data from Jekyll data (this needs to be passed in)
      const stocks = window.stocksData || [];
      
      await this.fetchAllPrices(stocks);
      this.calculateStocks(stocks);
      this.generateHoldingsTable(stocks);
      this.updateChart(stocks);
      this.generateSummaryTable(stocks);

      document.getElementById('holdings-table-container').style.display = 'block';
      document.getElementById('summary-table-container').style.display = 'block';

      const fetchTime = this.getCurrentPSTTime();
      this.showSuccess(`Data fetched successfully at ${fetchTime} PST`);

    } catch (error) {
      this.showError('Fetching error. Retrying in 1 minute...');
      if (this.fetchRetryTimeout) clearTimeout(this.fetchRetryTimeout);
      this.fetchRetryTimeout = setTimeout(() => {
        this.fetchDataAndUpdate();
      }, 60000);
    } finally {
      this.isFetching = false;
      refreshButton.disabled = false;
    }
  }
}

// Initialize when DOM is ready
new StockHoldings(); 