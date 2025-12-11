// Stock Holdings Page JavaScript
class StockHoldings {
  constructor() {
    this.apiKey = 'cshj6s1r01qu99bg0oe0cshj6s1r01qu99bg0oeg';
    this.isFetching = false;
    this.fetchRetryTimeout = null;
    this.chartData = [];
    this.myChart = null;
    this.sectorData = [];
    this.sectorChart = null;
    this.isDarkMode = false;
    
    // 改进的行业颜色系统 - 确保每个行业都有独特的颜色
    this.sectorColors = {
      // Technology - 蓝色系
      'Semiconductors': '#007bff',        // 蓝色
      'Internet/Cloud': '#17a2b8',        // 青色
      'Software': '#6f42c1',              // 紫色
      'Hardware': '#495057',              // 深灰色
      'AI/ML': '#8b5cf6',                 // 淡紫色
      'Cybersecurity': '#dc3545',         // 红色
      'Gaming': '#ff6b35',                // 橙红色
      'Social Media': '#ffc107',          // 黄色
      
      // Healthcare - 绿色系
      'Healthcare': '#28a745',            // 绿色
      'Biotechnology': '#20c997',         // 青绿色
      'Pharmaceuticals': '#198754',       // 深绿色
      'Medical Devices': '#0dcaf0',       // 浅青色
      'Healthcare Services': '#10b981',   // 翠绿色
      
      // Financial - 暖色系
      'Fintech': '#f59e0b',              // 琥珀色
      'Banking': '#f97316',   // 橙色
      'Insurance': '#06b6d4',            // 天蓝色
      'Investment Banking': '#6c757d',    // 灰色
      'Real Estate': '#84cc16',          // 柠檬绿
      'REITs': '#0ea5e9',                // 蓝色
      
      // Consumer - 暖色系
      'Consumer Discretionary': '#f59e0b',
      'Consumer Staples': '#ea580c',
      'Retail': '#e11d48',
      'E-commerce': '#7c3aed',
      'Food & Beverage': '#059669',
      'Apparel': '#be185d',
      
      // Industrial - 中性色系
      'Industrial': '#64748b',
      'Manufacturing': '#475569',
      'Aerospace': '#0284c7',
      'Defense': '#991b1b',
      'Automotive': '#c2410c',
      'Transportation': '#0891b2',
      
      // Energy & Materials - 地球色系
      'Energy': '#eab308',
      'Oil & Gas': '#d97706',
      'Renewable Energy': '#16a34a',
      'Materials': '#78716c',
      'Mining': '#57534e',
      'Chemicals': '#14b8a6',
      
      // Communication & Media - 紫色系
      'Communication Services': '#8b5cf6',
      'Media': '#a855f7',
      'Entertainment': '#c084fc',
      'Telecommunications': '#7c2d12',
      
      // Utilities - 蓝绿色系
      'Utilities': '#0d9488',
      
      // ETFs & Funds - 中性色系
      'ETF': '#6366f1',
      'Index Fund': '#374151',
      'Mutual Fund': '#4b5563',
      
      // Cryptocurrency - 金色系
      'Crypto': '#f59e0b',
      'Blockchain': '#ea580c',
      
      // Other
      'Unknown': '#9ca3af',
      'Diversified': '#6b7280'
    };

    // 完整的暗色主题映射
    this.darkThemeColorMap = {
      // Technology
      '#007bff': '#60a5fa',  // 蓝色 -> 淡蓝色
      '#17a2b8': '#22d3ee',  // 青色 -> 淡青色
      '#6f42c1': '#a78bfa',  // 紫色 -> 淡紫色
      '#495057': '#9ca3af',  // 深灰色 -> 淡灰色
      '#8b5cf6': '#c084fc',  // 淡紫色 -> 更淡紫色
      '#dc3545': '#f87171',  // 红色 -> 淡红色
      '#ff6b35': '#fb7185',  // 橙红色 -> 淡橙红色
      '#ffc107': '#fbbf24',  // 黄色 -> 淡黄色
      
      // Healthcare
      '#28a745': '#4ade80',  // 绿色 -> 淡绿色
      '#20c997': '#2dd4bf',  // 青绿色 -> 淡青绿色
      '#198754': '#22c55e',  // 深绿色 -> 淡绿色
      '#0dcaf0': '#38bdf8',  // 浅青色 -> 更淡青色
      '#10b981': '#34d399',  // 翠绿色 -> 淡翠绿色
      
      // Financial
      '#f59e0b': '#fbbf24',  // 琥珀色 -> 淡琥珀色
      '#f97316': '#fb923c',  // 橙色 -> 淡橙色
      '#06b6d4': '#38bdf8',  // 天蓝色 -> 淡天蓝色
      '#6c757d': '#9ca3af',  // 灰色 -> 淡灰色
      '#84cc16': '#a3e635',  // 柠檬绿 -> 淡柠檬绿
      '#0ea5e9': '#0ea5e9',  // 蓝色保持
      
      // 其他颜色的映射
      '#64748b': '#94a3b8',
      '#475569': '#64748b',
      '#0284c7': '#0ea5e9',
      '#991b1b': '#dc2626',
      '#c2410c': '#ea580c',
      '#0891b2': '#0891b2',
      '#eab308': '#facc15',
      '#d97706': '#f59e0b',
      '#16a34a': '#22c55e',
      '#78716c': '#a8a29e',
      '#57534e': '#78716c',
      '#14b8a6': '#2dd4bf',
      '#a855f7': '#c084fc',
      '#c084fc': '#ddd6fe',
      '#7c2d12': '#a16207',
      '#0d9488': '#14b8a6',
      '#6366f1': '#818cf8',
      '#374151': '#6b7280',
      '#4b5563': '#9ca3af',
      '#ea580c': '#f97316',
      '#9ca3af': '#d1d5db',
      '#6b7280': '#9ca3af'
    };
    
    this.init();
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.detectTheme();
      this.setupEventListeners();
      this.generateSectorCSS(); // Generate CSS from centralized colors
      this.initializeCharts();
      this.loadStocksData();
    });
  }

  // Detect current theme
  detectTheme() {
    this.isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
  }

  // Initialize charts
  initializeCharts() {
    this.initChart();
  }

  // Load stocks data
  loadStocksData() {
    this.fetchDataAndUpdate();
  }

  // 改进的颜色生成函数
  generateSectorCSS() {
    const styleId = 'dynamic-sector-styles';
    let existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement('style');
    style.id = styleId;
    
    let css = `
      /* 动态生成的行业样式 - 简洁风格 */
      .sector-tag {
        font-weight: 500;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 0.78em;
        display: inline-block;
        border: none;
        white-space: nowrap;
        letter-spacing: 0.2px;
      }
    `;

    // 为每个行业生成CSS类
    Object.entries(this.sectorColors).forEach(([sector, color]) => {
      const cssClass = this.generateCSSClassName(sector);
      const rgbColor = this.hexToRgb(color);
      const darkColor = this.getDarkThemeColor(color);
      
      // 亮色主题样式 - 更柔和的背景
      css += `
        .sector-${cssClass} {
          color: ${color};
          background-color: rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.1);
        }
      `;
      
      // 暗色主题样式
      const darkRgb = this.hexToRgb(darkColor);
      css += `
        [data-theme='dark'] .sector-${cssClass} {
          color: ${darkColor};
          background-color: rgba(${darkRgb.r}, ${darkRgb.g}, ${darkRgb.b}, 0.18);
        }
      `;
    });

    // 未知行业的默认样式
    css += `
      .sector-tag:not([class*="sector-"]) {
        color: #6b7280;
        background-color: rgba(107, 114, 128, 0.08);
      }
      
      [data-theme='dark'] .sector-tag:not([class*="sector-"]) {
        color: #9ca3af;
        background-color: rgba(156, 163, 175, 0.15);
      }
    `;

    style.textContent = css;
    document.head.appendChild(style);
  }

  // 改进的CSS类名生成
  generateCSSClassName(sector) {
    return sector
      .toLowerCase()
      .replace(/[\s\/&]+/g, '-')  // 替换空格、斜杠、&符号
      .replace(/[^a-z0-9-]/g, '') // 移除其他特殊字符
      .replace(/-+/g, '-')        // 合并多个连续的短横线
      .replace(/^-|-$/g, '');     // 移除开头和结尾的短横线
  }

  // Convert hex color to RGB
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 107, g: 114, b: 128 }; // 默认灰色
  }

  // Get dark theme variant of a color
  getDarkThemeColor(hexColor) {
    return this.darkThemeColorMap[hexColor] || hexColor;
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
        color: this.sectorColors[sector] || '#6c757d'
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
      pageList: [20, 50, 'all'],
      sortName: 'pl_dollar',
      sortOrder: 'desc',
      columns: [
        {
          field: 'indicator',
          title: '',
          sortable: false,
          width: 50,
          align: 'center',
          formatter: (value, row) => {
            return this.createEmojiIndicator(row);
          }
        },
        { field: 'stock', title: 'Stock', sortable: true, width: 160,
          formatter: (value, row) => {
            const name = row.stock || '';
            const symbol = row.symbol || value || '';
            return `<div class="stock-cell">
              <span class="stock-symbol">${symbol}</span>
              <span class="stock-name">${name}</span>
            </div>`;
          }
        },
        { field: 'sector', title: 'Sector', sortable: true, width: 105,
          formatter: (value) => {
            const cssClass = this.generateCSSClassName(value);
            return `<span class="sector-tag sector-${cssClass}">${value}</span>`;
          }
        },
        { field: 'qty', title: 'Qty', sortable: true, width: 75,
          formatter: (value) => Number(value).toFixed(3).replace(/\.?0+$/,'')
        },
        { field: 'cost_price', title: 'Cost ($)', titleTooltip: 'Cost per share', sortable: true, width: 80,
          formatter: (value) => value.toFixed(2)
        },
        { field: 'curr_price', title: 'Price ($)', sortable: true, width: 80,
          formatter: (value) => value.toFixed(2)
        },
        { field: 'cost_basis', title: 'Cost Basis ($)', sortable: true, width: 110,
          formatter: (value) => value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
        },
        { field: 'value', title: 'Value ($)', sortable: true, width: 100,
          formatter: (value) => value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
        },
        { field: 'pl_dollar', title: 'P/L ($)', sortable: true, width: 100,
          formatter: (value, row) => {
            const cls = row.pl_class;
            const sign = value >= 0 ? '+' : '';
            return `<span class="${cls}">${sign}$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>`;
          }
        },
        { field: 'pl_percent', title: 'P/L (%)', sortable: true, width: 80,
          formatter: (value, row) => `<span class="${row.pl_class}">${value.toFixed(2)}%</span>`
        },
        { field: 'portfolio_weight', title: 'Weight (%)', sortable: true, width: 80,
          formatter: (value) => `${value.toFixed(1)}%`
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