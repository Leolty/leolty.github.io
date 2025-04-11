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

This post records my latest holdings in select US stocks. I will regularly update it to track changes in values, industry movements, and overall returns. This is purely for personal tracking purposes.

### Holdings Breakdown

<div class="section-heading">📊 Current Portfolio Status</div>

<!-- Fetching Indicator and Refresh Button -->
<div id="fetching-container" style="display: flex; justify-content: center; align-items: center; margin-bottom: 30px;">
  <button id="refresh-button" class="refresh-button"><span class="refresh-icon">🔄</span> Refresh Data</button>
  <div id="indicator-style-selector" class="indicator-style-selector">
    <button class="style-toggle"><span class="style-toggle-icon">😀</span> Display Mode</button>
    <div class="style-options">
      <div class="indicator-option" data-style="1" title="Circular Gauge">⭕</div>
      <div class="indicator-option" data-style="2" title="Progress Bar">📊</div>
      <div class="indicator-option" data-style="3" title="Arrows">🔼</div>
      <div class="indicator-option" data-style="4" title="LED Bar">💡</div>
      <div class="indicator-option" data-style="5" title="Emoji">😀</div>
      <div class="indicator-option" data-style="6" title="Pie Slice">🥧</div>
      <div class="indicator-option" data-style="7" title="Battery">🔋</div>
      <div class="indicator-option" data-style="8" title="Traffic Light">🚦</div>
      <div class="indicator-option" data-style="9" title="Card Suits">♠️</div>
    </div>
  </div>
  <div id="fetching-indicator" class="fetching-indicator" style="margin-left: 15px;">
    Fetching data, please wait...
  </div>
</div>

<!-- Placeholder for the holdings table -->
<div id="holdings-table-container" style="display: none; margin-top: 20px;">
  <!-- The table will be generated dynamically after data retrieval -->
</div>

<!-- Optional CSS for Positive and Negative P/L -->
<style>
/* Define CSS variables for text color based on the theme */

/* Light mode */
:root {
  --table-text-color: #000000; /* Black */
  --card-bg-color: #f8f9fa;
  --card-border-color: #e9ecef;
  --hover-bg-color: #f1f3f5;
}

/* Dark mode */
[data-theme='dark'] {
  --table-text-color: #ffffff; /* White */
  --card-bg-color: #2d2d2d;
  --card-border-color: #444444;
  --hover-bg-color: #3a3a3a;
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

/* 1. Circular gauge indicator styles */
.gauge-indicator {
  display: inline-block;
  width: 28px;
  height: 28px;
  position: relative;
  border-radius: 50%;
  background: var(--card-bg-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.gauge-background {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #f0f0f0;
  opacity: 0.25;
}

[data-theme='dark'] .gauge-background {
  background: #5a5a5a;
}

.gauge-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: height 0.3s ease;
  border-bottom-left-radius: 14px;
  border-bottom-right-radius: 14px;
}

.gauge-positive {
  background: linear-gradient(to top, rgba(40, 167, 69, 0.9), rgba(40, 167, 69, 0.5));
}

.gauge-negative {
  background: linear-gradient(to bottom, rgba(220, 53, 69, 0.9), rgba(220, 53, 69, 0.5));
}

.gauge-value {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  line-height: 1;
}

.gauge-value-positive {
  color: #28a745;
}

.gauge-value-negative {
  color: #dc3545;
}

/* 2. Progress bar indicator styles */
.progress-indicator {
  display: inline-block;
  width: 40px;
  height: 18px;
  position: relative;
  border-radius: 9px;
  background: var(--card-bg-color);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.progress-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  transition: width 0.3s ease;
  border-radius: 9px;
}

.progress-fill-positive {
  background: linear-gradient(to right, #28a745, #75cf89);
}

.progress-fill-negative {
  background: linear-gradient(to right, #dc3545, #e47783);
}

.progress-tick {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(255, 255, 255, 0.7);
}

.progress-tick-25 { left: 25%; }
.progress-tick-50 { left: 50%; }
.progress-tick-75 { left: 75%; }

.progress-value {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}

/* 3. Arrow indicator styles */
.arrow-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 24px;
  position: relative;
}

.arrow {
  position: relative;
  display: inline-block;
  transition: all 0.3s ease;
}

.arrow-up {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 12px solid #28a745;
}

.arrow-down {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 12px solid #dc3545;
}

.arrow-value {
  position: absolute;
  font-size: 9px;
  font-weight: bold;
  color: white;
  line-height: 1;
}

.arrow-up .arrow-value {
  bottom: 1px;
}

.arrow-down .arrow-value {
  top: 1px;
}

/* 4. LED bar indicator styles */
.led-bar-indicator {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 26px;
  height: 24px;
  position: relative;
}

.led-bar-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 20px;
  justify-content: space-between;
}

.led {
  width: 20px;
  height: 3px;
  border-radius: 1px;
  margin: 0 auto;
}

.led-on {
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}

.led-positive {
  background-color: rgba(40, 167, 69, 0.3);
}

.led-positive.led-on {
  background-color: #28a745;
}

.led-negative {
  background-color: rgba(220, 53, 69, 0.3);
}

.led-negative.led-on {
  background-color: #dc3545;
}

/* 5. Emoji indicator styles */
.emoji-indicator {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 28px;
}

.performance-emoji {
  font-size: 16px;
  line-height: 1;
}

.emoji-value {
  font-size: 9px;
  font-weight: bold;
  line-height: 1;
}

.emoji-value-positive {
  color: #28a745;
}

.emoji-value-negative {
  color: #dc3545;
}

/* Trend indicator styles */
.trend-indicator {
  display: inline-block;
  width: 44px;
  height: 24px;
  position: relative;
  border-radius: 4px;
  background: var(--card-bg-color);
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  vertical-align: middle;
}

.trend-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.trend-line::after {
  content: "";
  position: absolute;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: rgba(128, 128, 128, 0.3);
}

.trend-bar {
  position: absolute;
  width: 3px;
  border-radius: 1px;
  bottom: 2px;
  transition: all 0.3s ease;
}

.trend-bar:nth-child(1) { left: 5px; }
.trend-bar:nth-child(2) { left: 12px; }
.trend-bar:nth-child(3) { left: 19px; }
.trend-bar:nth-child(4) { left: 26px; }
.trend-bar:nth-child(5) { left: 33px; }

.trend-positive .trend-bar {
  background: linear-gradient(to top, #28a745, #75cf89);
}

.trend-negative .trend-bar {
  background: linear-gradient(to bottom, #dc3545, #e47783);
}

.trend-final {
  position: absolute;
  right: 2px;
  top: 6px;
  font-size: 10px;
  font-weight: bold;
}

.trend-positive .trend-final {
  color: #28a745;
}

.trend-negative .trend-final {
  color: #dc3545;
}

/* Creative indicator styles */
.performance-indicator {
  display: inline-block;
  width: 24px;
  height: 24px;
  position: relative;
  border-radius: 4px;
  background: var(--card-bg-color);
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.performance-bar {
  position: absolute;
  bottom: 3px;
  left: 3px;
  right: 3px;
  border-radius: 2px 2px 0 0;
  transition: height 0.3s ease;
}

.performance-bar-positive {
  background: linear-gradient(to top, #28a745, #75cf89);
}

.performance-bar-negative {
  background: linear-gradient(to bottom, #dc3545, #e47783);
}

/* Intensity classes based on performance level */
.intensity-1 {
  height: 20%;
}

.intensity-2 {
  height: 40%;
}

.intensity-3 {
  height: 60%;
}

.intensity-4 {
  height: 80%;
}

.intensity-5 {
  height: 100%;
}

/* Indicator styles */
.indicator-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 0;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
}

.indicator-positive {
  background-color: #28a745;
}

.indicator-negative {
  background-color: #dc3545;
}

/* Enhanced table styling */
.bootstrap-table .table {
  border-collapse: separate !important;
  border-spacing: 0 8px !important;
  margin-top: 20px !important;
  border: none !important;
}

.bootstrap-table {
  border: none !important;
  box-shadow: none !important;
}

.bootstrap-table .fixed-table-container {
  border: none !important;
  box-shadow: none !important;
}

.bootstrap-table .table thead th {
  border: none !important;
  background-color: transparent !important;
  font-weight: bold !important;
  padding: 15px 10px !important;
  color: var(--table-text-color) !important;
  font-size: 1.1em !important;
}

.bootstrap-table .table tbody tr {
  background-color: var(--card-bg-color) !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08) !important;
  border-radius: 10px !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease !important;
  position: relative !important;
  overflow: hidden !important;
}

.bootstrap-table .table tbody tr.positive-row {
  border-left: 6px solid #28a745 !important;
}

.bootstrap-table .table tbody tr.negative-row {
  border-left: 6px solid #dc3545 !important;
}

.bootstrap-table .table tbody tr:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15) !important;
  background-color: var(--hover-bg-color) !important;
}

.bootstrap-table .table tbody td {
  border: none !important;
  padding: 15px 10px !important;
  vertical-align: middle !important;
}

.bootstrap-table .table tbody td:first-child {
  border-top-left-radius: 10px !important;
  border-bottom-left-radius: 10px !important;
  font-weight: bold !important;
  padding-left: 16px !important;
}

.bootstrap-table .table tbody td:last-child {
  border-top-right-radius: 10px !important;
  border-bottom-right-radius: 10px !important;
}

.bootstrap-table .fixed-table-border {
  display: none !important;
  border: none !important;
}

.bootstrap-table .fixed-table-container.fixed-height {
  border: none !important;
}

.bootstrap-table .pagination-detail,
.bootstrap-table .pagination {
  margin-top: 20px !important;
}

.bootstrap-table .pagination .page-item .page-link {
  border-radius: 5px !important;
  margin: 0 3px !important;
}

.bootstrap-table .pagination .page-item.active .page-link {
  background-color: #007bff !important;
  border-color: #007bff !important;
}

/* Page heading styling */
.section-heading {
  position: relative;
  margin-bottom: 40px;
  text-align: center;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-heading::before,
.section-heading::after {
  content: "";
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--table-text-color) 50%, transparent 100%);
  flex-grow: 1;
  margin: 0 20px;
  opacity: 0.3;
}

/* Styles for the summary cards */
.summary-cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin: 30px auto;
  max-width: 1000px;
}

.summary-card {
  background-color: var(--card-bg-color);
  border-radius: 12px;
  padding: 20px;
  width: 280px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.card-icon {
  margin-right: 10px;
  font-size: 1.5em;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.overview-icon {
  background-color: #007bff;
  color: white;
}

.holdings-icon {
  background-color: #6f42c1;
  color: white;
}

.win-rate-icon {
  background-color: #fd7e14;
  color: white;
}

.best-icon {
  background-color: #28a745;
  color: white;
}

.worst-icon {
  background-color: #dc3545;
  color: white;
}

.concentration-icon {
  background-color: #17a2b8;
  color: white;
}

.card-title {
  font-size: 1.1em;
  font-weight: bold;
  color: var(--table-text-color);
  margin: 0;
}

.card-value {
  font-size: 1.8em;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 10px;
}

.card-subtext {
  font-size: 0.9em;
  color: var(--table-text-color);
  opacity: 0.8;
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
  padding: 8px 15px;
  border-radius: 20px;
  background-color: var(--card-bg-color);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.fetching-indicator.success {
  color: #28a745;
  background-color: rgba(40, 167, 69, 0.1);
}

.fetching-indicator.error {
  color: #dc3545;
  background-color: rgba(220, 53, 69, 0.1);
}

.refresh-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 12px 20px;
  font-size: 1.1em;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 123, 255, 0.25);
}

.refresh-icon {
  margin-right: 8px;
  display: inline-block;
}

.refresh-button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(0, 123, 255, 0.35);
}

.refresh-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.refresh-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.3);
}

.refresh-button:active {
  background-color: #0056b3;
  transform: translateY(1px);
}

/* Portfolio chart container styling */
#portfolioChartContainer {
  background-color: var(--card-bg-color);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 30px auto;
  height: auto !important;
  min-height: 520px;
}

#portfolioChart {
  width: 850px;
  height: 480px;
  margin: 0 auto;
}

/* Indicator style selector - more subtle design */
.indicator-style-selector {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 15px;
}

.style-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 12px 20px;
  font-size: 1.1em;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 123, 255, 0.25);
}

.style-toggle:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(0, 123, 255, 0.35);
}

.style-toggle-icon {
  margin-right: 8px;
  display: inline-block;
}

.style-options {
  position: absolute;
  right: 0;
  top: 50px;
  background: var(--card-bg-color);
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  display: none;
  z-index: 100;
  padding: 8px;
  width: 180px;
}

.style-options.show {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.indicator-option {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  background: var(--card-bg-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
}

.indicator-option:hover {
  transform: translateY(-2px);
  background-color: rgba(0, 123, 255, 0.1);
}

.indicator-option.active {
  background: rgba(0, 123, 255, 0.2);
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.3);
}

/* 6. Pie slice indicator */
.pie-indicator {
  display: inline-block;
  width: 26px;
  height: 26px;
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  background: var(--card-bg-color);
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.1);
}

.pie-slice {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: center;
}

.pie-slice-positive {
  background: conic-gradient(#28a745 var(--angle), transparent 0);
}

.pie-slice-negative {
  background: conic-gradient(#dc3545 var(--angle), transparent 0);
}

.pie-bg {
  position: absolute;
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  border-radius: 50%;
  background: var(--card-bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pie-text {
  font-size: 9px;
  font-weight: bold;
}

.pie-text-positive {
  color: #28a745;
}

.pie-text-negative {
  color: #dc3545;
}

/* 7. Battery indicator styles */
.battery-indicator {
  display: inline-block;
  width: 26px;
  height: 20px;
  position: relative;
  border: 2px solid #999;
  border-radius: 3px;
  padding: 1px;
}

.battery-tip {
  position: absolute;
  width: 3px;
  height: 8px;
  background: #999;
  right: -5px;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 0 2px 2px 0;
}

.battery-fill {
  height: 100%;
  border-radius: 1px;
  transition: width 0.3s ease;
}

.battery-positive {
  background: linear-gradient(to right, #28a745, #75cf89);
}

.battery-negative {
  background: linear-gradient(to right, #dc3545, #e47783);
}

.battery-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 9px;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}

/* 8. Traffic light indicator styles */
.traffic-light {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 26px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  padding: 2px 0;
}

.light {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin: 1px 0;
  background: rgba(255, 255, 255, 0.3);
}

.light-on {
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

.red-light.light-on {
  background-color: #dc3545;
}

.yellow-light.light-on {
  background-color: #ffc107;
}

.green-light.light-on {
  background-color: #28a745;
}

/* 9. Card suit indicator styles */
.card-suit-indicator {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
}

.card-suit {
  font-size: 16px;
  line-height: 1;
}

.card-text {
  font-size: 9px;
  font-weight: bold;
  line-height: 1;
}

.suit-positive {
  color: #28a745;
}

.suit-negative {
  color: #dc3545;
}

/* 10. Star rating indicator styles */
.star-indicator {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 26px;
}

.star-container {
  display: flex;
  justify-content: center;
}

.star {
  font-size: 8px;
  color: rgba(128, 128, 128, 0.3);
}

.star.filled {
  color: gold;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}

.star-text {
  font-size: 9px;
  margin-top: 1px;
}

.star-positive {
  color: #28a745;
}

.star-negative {
  color: #dc3545;
}

/* Enhanced table styling */
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
  var currentIndicatorStyle = 5; // Default indicator style (emoji)

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
    // Special handling for Bitcoin
    const symbol = stock.symbol === "BTC" ? "BINANCE:BTCUSDT" : stock.symbol;
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
    let retries = 0;
    const maxRetries = 5;
    const baseDelay = 300; // Start with a 300ms delay
    
    while (retries <= maxRetries) {
    try {
      const response = await fetch(url);
        
        // Check for rate limit response
        if (response.status === 429) {
          retries++;
          if (retries > maxRetries) {
            throw new Error(`Rate limit exceeded for ${stock.symbol} after ${maxRetries} retries`);
          }
          
          // Exponential backoff with jitter
          const delay = baseDelay * Math.pow(2, retries) + Math.random() * 100;
          console.log(`Rate limited for ${stock.symbol}, retrying after ${delay.toFixed(0)}ms (retry ${retries}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
      const data = await response.json();
      if (data.c) {
        stock.curr_price = data.c;
          return; // Success, exit the function
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
        
        // Exponential backoff
        const delay = baseDelay * Math.pow(2, retries) + Math.random() * 100;
        console.log(`Error for ${stock.symbol}, retrying after ${delay.toFixed(0)}ms (retry ${retries}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // Function to fetch prices for all stocks with concurrency limit
  async function fetchAllPrices(stocks) {
    const concurrencyLimit = 3; // Process 3 stocks at a time to avoid rate limits
    const results = [];
    
    // Process stocks in batches
    for (let i = 0; i < stocks.length; i += concurrencyLimit) {
      const batch = stocks.slice(i, i + concurrencyLimit);
      const promises = batch.map(stock => fetchCurrentPrice(stock));
      
      // Wait for the current batch to complete before moving to the next
      await Promise.all(promises).catch(err => console.error('Batch error:', err));
      
      // Small delay between batches to avoid rate limits
      if (i + concurrencyLimit < stocks.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
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

    // Calculate total value for proportions
    const totalValue = stocks.reduce((sum, stock) => sum + stock.value, 0);

    // Find max performance value for normalization (to determine fill amount)
    const maxPerformance = Math.max(...stocks.map(stock => Math.abs(stock.pl_percent)));
    
    // Calculate portfolio weights and add to stocks data
    stocks.forEach(stock => {
      stock.portfolio_weight = (stock.value / totalValue) * 100;
      
      // Add indicator properties
      stock.performance_type = stock.pl_percent >= 0 ? 'positive' : 'negative';
      
      // Calculate normalized value (0-1 range)
      const normalizedValue = Math.abs(stock.pl_percent) / maxPerformance;
      
      // Set fill percentages for different indicators
      stock.gauge_fill = 5 + (normalizedValue * 95); // Minimum 5% fill, maximum 100%
      stock.progress_fill = Math.min(100, normalizedValue * 100);
      
      // Calculate LED intensity (how many LEDs are lit)
      const ledCount = 5;
      stock.led_count = Math.max(1, Math.ceil(normalizedValue * ledCount));
      
      // For pie slice - calculate degrees (0-90 for the quarter circle)
      stock.pie_degrees = Math.max(5, Math.min(90, normalizedValue * 90));
    });

    // Initialize the Bootstrap Table with modified columns
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
          formatter: function(value, row) {
            switch(currentIndicatorStyle) {
              case 1: return createCircularGauge(row);
              case 2: return createProgressBar(row);
              case 3: return createArrowIndicator(row);
              case 4: return createLedBar(row);
              case 5: return createEmojiIndicator(row);
              case 6: return createPieSlice(row);
              case 7: return createBattery(row);
              case 8: return createTrafficLight(row);
              case 9: return createCardSuit(row);
              default: return createCircularGauge(row);
            }
          }
        },
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
    
    // Event handlers are set up by the setupIndicatorStyleSelectors function
  }
  
  // 1. Circular gauge indicator
  function createCircularGauge(row) {
    const gaugeType = row.performance_type;
    const fillHeight = row.gauge_fill;
    const displayValue = Math.abs(Math.round(row.pl_percent));
    const prefix = gaugeType === 'positive' ? '+' : '-';
    
    return `<div class="gauge-indicator">
              <div class="gauge-background"></div>
              <div class="gauge-fill gauge-${gaugeType}" style="height: ${fillHeight}%;"></div>
              <div class="gauge-value gauge-value-${gaugeType}">${prefix}${displayValue}%</div>
            </div>`;
  }
  
  // 2. Progress bar indicator
  function createProgressBar(row) {
    const type = row.performance_type;
    const fillWidth = row.progress_fill;
    const displayValue = Math.abs(Math.round(row.pl_percent));
    
    return `<div class="progress-indicator">
              <div class="progress-fill progress-fill-${type}" style="width: ${fillWidth}%;"></div>
              <div class="progress-tick progress-tick-25"></div>
              <div class="progress-tick progress-tick-50"></div>
              <div class="progress-tick progress-tick-75"></div>
              <div class="progress-value">${displayValue}%</div>
            </div>`;
  }
  
  // 3. Arrow indicator
  function createArrowIndicator(row) {
    const type = row.performance_type;
    const displayValue = Math.abs(Math.round(row.pl_percent));
    const arrowClass = type === 'positive' ? 'arrow-up' : 'arrow-down';
    
    // Scale arrow size based on performance (50-100% of original size)
    const scale = 0.5 + (0.5 * (row.progress_fill / 100));
    const scaleStyle = `transform: scale(${scale.toFixed(2)});`;
    
    return `<div class="arrow-indicator">
              <div class="arrow ${arrowClass}" style="${scaleStyle}">
                <div class="arrow-value">${displayValue}</div>
              </div>
            </div>`;
  }
  
  // 4. LED bar indicator
  function createLedBar(row) {
    const type = row.performance_type;
    const ledCount = row.led_count;
    
    let leds = '';
    for (let i = 5; i >= 1; i--) {
      const isOn = i <= ledCount ? 'led-on' : '';
      leds += `<div class="led led-${type} ${isOn}"></div>`;
    }
    
    return `<div class="led-bar-indicator">
              <div class="led-bar-container">
                ${leds}
              </div>
            </div>`;
  }
  
  // 5. Emoji indicator
  function createEmojiIndicator(row) {
    const type = row.performance_type;
    const displayValue = Math.abs(Math.round(row.pl_percent));
    const prefix = type === 'positive' ? '+' : '-';
    
    // Select emoji based on performance level and type with finer gradations
    let emoji;
    const normalizedValue = row.progress_fill / 100;
    
    if (type === 'positive') {
      if (normalizedValue >= 0.9) emoji = '🤩'; // Star-struck
      else if (normalizedValue >= 0.75) emoji = '😁'; // Grinning face with smiling eyes
      else if (normalizedValue >= 0.6) emoji = '😄'; // Grinning face with smiling eyes
      else if (normalizedValue >= 0.45) emoji = '😊'; // Smiling face with smiling eyes
      else if (normalizedValue >= 0.3) emoji = '🙂'; // Slightly smiling face
      else if (normalizedValue >= 0.15) emoji = '😏'; // Smirking face
      else emoji = '😐'; // Neutral face
    } else {
      if (normalizedValue >= 0.9) emoji = '😭'; // Loudly crying face
      else if (normalizedValue >= 0.75) emoji = '😢'; // Crying face
      else if (normalizedValue >= 0.6) emoji = '😞'; // Disappointed face
      else if (normalizedValue >= 0.45) emoji = '😕'; // Confused face
      else if (normalizedValue >= 0.3) emoji = '😟'; // Worried face
      else if (normalizedValue >= 0.15) emoji = '😑'; // Expressionless face
      else emoji = '😐'; // Neutral face
    }
    
    return `<div class="emoji-indicator">
              <div class="performance-emoji">${emoji}</div>
              <div class="emoji-value emoji-value-${type}">${prefix}${displayValue}%</div>
            </div>`;
  }
  
  // 6. Pie slice indicator
  function createPieSlice(row) {
    const type = row.performance_type;
    const displayValue = Math.abs(Math.round(row.pl_percent));
    const prefix = type === 'positive' ? '+' : '-';
    
    // Calculate angle based on performance (0-360 degrees)
    // For normalized display, we'll use up to 270 degrees (3/4 of a circle) as maximum
    const maxAngle = 270;
    const angle = Math.max(5, Math.min(maxAngle, (row.progress_fill / 100) * maxAngle));
    
    // For positive, we start at top right and go clockwise
    // For negative, we start at bottom left and go counter-clockwise
    let startAngle = type === 'positive' ? 0 : 180;
    
    return `<div class="pie-indicator">
              <div class="pie-slice pie-slice-${type}" style="--angle: ${angle}deg;"></div>
              <div class="pie-bg">
                <div class="pie-text pie-text-${type}">${prefix}${displayValue}</div>
              </div>
            </div>`;
  }
  
  // 7. Battery indicator
  function createBattery(row) {
    const type = row.performance_type;
    const fillWidth = Math.max(10, row.progress_fill);
    const displayValue = Math.abs(Math.round(row.pl_percent));
    
    return `<div class="battery-indicator">
              <div class="battery-fill battery-${type}" style="width: ${fillWidth}%;"></div>
              <div class="battery-tip"></div>
              <div class="battery-text">${displayValue}</div>
            </div>`;
  }
  
  // 8. Traffic light indicator
  function createTrafficLight(row) {
    const type = row.performance_type;
    const normalizedValue = row.progress_fill / 100;
    let redOn = '', yellowOn = '', greenOn = '';
    
    if (type === 'positive') {
      if (normalizedValue > 0.7) {
        greenOn = 'light-on';
      } else if (normalizedValue > 0.3) {
        yellowOn = 'light-on';
      } else {
        redOn = 'light-on';
      }
    } else {
      if (normalizedValue > 0.7) {
        redOn = 'light-on';
      } else if (normalizedValue > 0.3) {
        yellowOn = 'light-on';
      } else {
        greenOn = 'light-on';
      }
    }
    
    return `<div class="traffic-light">
              <div class="light red-light ${redOn}"></div>
              <div class="light yellow-light ${yellowOn}"></div>
              <div class="light green-light ${greenOn}"></div>
            </div>`;
  }
  
  // 9. Card suit indicator
  function createCardSuit(row) {
    const type = row.performance_type;
    const displayValue = Math.abs(Math.round(row.pl_percent));
    const prefix = type === 'positive' ? '+' : '-';
    
    // Choose suit based on type and magnitude
    let suit;
    const normalizedValue = row.progress_fill / 100;
    
    if (type === 'positive') {
      suit = normalizedValue > 0.5 ? '♣' : '♦';
    } else {
      suit = normalizedValue > 0.5 ? '♠' : '♥';
    }
    
    return `<div class="card-suit-indicator">
              <div class="card-suit suit-${type}">${suit}</div>
              <div class="card-text suit-${type}">${prefix}${displayValue}%</div>
            </div>`;
  }
  
  // 10. Star rating indicator
  function createStarRating(row) {
    const type = row.performance_type;
    const stars = row.stars;
    const displayValue = Math.abs(Math.round(row.pl_percent));
    const prefix = type === 'positive' ? '+' : '-';
    
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= stars ? 'filled' : '';
      starsHtml += `<div class="star ${isFilled}">★</div>`;
    }
    
    return `<div class="star-indicator">
              <div class="star-container">
                ${starsHtml}
              </div>
              <div class="star-text star-${type}">${prefix}${displayValue}%</div>
            </div>`;
  }

  // Function to generate the simplified summary table with better styling
  function generateSummaryTable(stocks) {
    // Clear previous table if exists
    const container = document.getElementById('summary-table-container');
    container.innerHTML = '';

    // Calculate metrics
    const totalStocks = stocks.length;
    const total_cost = stocks.reduce((sum, stock) => sum + stock.cost_basis, 0);
    const total_value = stocks.reduce((sum, stock) => sum + stock.value, 0);
    const profit_margin = ((total_value - total_cost) / total_cost) * 100;
    
    // Find best and worst performing stocks
    const sortedByPerformance = [...stocks].sort((a, b) => b.pl_percent - a.pl_percent);
    const bestStock = sortedByPerformance[0];
    const worstStock = sortedByPerformance[sortedByPerformance.length - 1];
    
    // Count winners and losers
    const winners = stocks.filter(stock => stock.pl_percent > 0).length;
    const losers = stocks.filter(stock => stock.pl_percent < 0).length;
    const winRate = (winners / totalStocks) * 100;
    
    // Calculate sector diversity (using first word of stock name as crude approximation of sector)
    const sectorMap = {};
    stocks.forEach(stock => {
      const sector = stock.name.split(' ')[0];
      if (!sectorMap[sector]) {
        sectorMap[sector] = 0;
      }
      sectorMap[sector] += stock.portfolio_weight;
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

    // Create summary cards container
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'summary-cards-container';
    container.appendChild(cardsContainer);

    // Create Overall Return card
    const overallCard = document.createElement('div');
    overallCard.className = 'summary-card';
    overallCard.innerHTML = `
      <div class="card-header">
        <div class="card-icon overview-icon">📈</div>
        <h3 class="card-title">Overall Return</h3>
      </div>
      <div class="card-value ${profit_margin >= 0 ? 'pl-positive' : 'pl-negative'}">${profit_margin.toFixed(2)}%</div>
      <div class="card-subtext">Since inception</div>
    `;
    cardsContainer.appendChild(overallCard);

    // Create Total Holdings card
    const holdingsCard = document.createElement('div');
    holdingsCard.className = 'summary-card';
    holdingsCard.innerHTML = `
      <div class="card-header">
        <div class="card-icon holdings-icon">🔢</div>
        <h3 class="card-title">Total Holdings</h3>
      </div>
      <div class="card-value">${totalStocks}</div>
      <div class="card-subtext">Unique stocks</div>
    `;
    cardsContainer.appendChild(holdingsCard);

    // Create Win Rate card
    const winRateCard = document.createElement('div');
    winRateCard.className = 'summary-card';
    winRateCard.innerHTML = `
      <div class="card-header">
        <div class="card-icon win-rate-icon">🎯</div>
        <h3 class="card-title">Win Rate</h3>
      </div>
      <div class="card-value">${winRate.toFixed(1)}%</div>
      <div class="card-subtext">${winners} winners, ${losers} losers</div>
    `;
    cardsContainer.appendChild(winRateCard);

    // Create Best Performer card
    const bestCard = document.createElement('div');
    bestCard.className = 'summary-card';
    bestCard.innerHTML = `
      <div class="card-header">
        <div class="card-icon best-icon">🏆</div>
        <h3 class="card-title">Best Performer</h3>
      </div>
      <div class="card-value pl-positive">+${bestStock.pl_percent.toFixed(2)}%</div>
      <div class="card-subtext">${bestStock.symbol} (${bestStock.name})</div>
    `;
    cardsContainer.appendChild(bestCard);

    // Create Worst Performer card
    const worstCard = document.createElement('div');
    worstCard.className = 'summary-card';
    worstCard.innerHTML = `
      <div class="card-header">
        <div class="card-icon worst-icon">📉</div>
        <h3 class="card-title">Worst Performer</h3>
      </div>
      <div class="card-value pl-negative">${worstStock.pl_percent.toFixed(2)}%</div>
      <div class="card-subtext">${worstStock.symbol} (${worstStock.name})</div>
    `;
    cardsContainer.appendChild(worstCard);

    // Create Highest Concentration card
    const concentrationCard = document.createElement('div');
    concentrationCard.className = 'summary-card';
    concentrationCard.innerHTML = `
      <div class="card-header">
        <div class="card-icon concentration-icon">⚖️</div>
        <h3 class="card-title">Highest Concentration</h3>
      </div>
      <div class="card-value">${topSectorWeight.toFixed(1)}%</div>
      <div class="card-subtext">in ${topSector}</div>
    `;
    cardsContainer.appendChild(concentrationCard);
  }

  // Function to update the chart
  function updateChart(stocks) {
    // Generate portfolioData
    chartData = stocks.map(stock => ({
      name: stock.name,
      symbol: stock.symbol,
      value: stock.value
    }));

    // Update the chart options
    myChart.setOption({
      series: [{
        data: chartData.map(item => ({
          name: item.symbol,
          value: item.value,
          fullName: item.name
        }))
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

      // Set up indicator style selectors after everything is loaded
      setupIndicatorStyleSelectors();

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
  
  // Function to set up indicator style selectors
  function setupIndicatorStyleSelectors() {
    // Toggle the options menu
    const toggle = document.querySelector('.style-toggle');
    const options = document.querySelector('.style-options');
    
    if (!toggle || !options) return;
    
    // Set active class on the current style option
    const currentStyleOption = document.querySelector(`.indicator-option[data-style="${currentIndicatorStyle}"]`);
    if (currentStyleOption) {
      currentStyleOption.classList.add('active');
    }
    
    // Add click handler for the toggle button
    toggle.onclick = function(e) {
      options.classList.toggle('show');
      e.stopPropagation();
    };
    
    // Hide the menu when clicking elsewhere
    document.addEventListener('click', function(e) {
      if (!options.contains(e.target) && e.target !== toggle) {
        options.classList.remove('show');
      }
    });
    
    // Set up the option click handlers
    const optionElements = document.querySelectorAll('.indicator-option');
    optionElements.forEach(option => {
      option.onclick = function(e) {
        // Get style number
        const newStyle = parseInt(this.getAttribute('data-style'));
        if (newStyle === currentIndicatorStyle) return; // No change needed
        
        // Update current style
        currentIndicatorStyle = newStyle;
        
        // Update active class
        optionElements.forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        
        // Close the dropdown
        options.classList.remove('show');
        
        // Force table refresh - recreate it
        const tableData = $('#holdings-table').bootstrapTable('getData');
        $('#holdings-table').bootstrapTable('destroy');
        $('#holdings-table').bootstrapTable({
          data: tableData,
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
              formatter: function(value, row) {
                switch(currentIndicatorStyle) {
                  case 1: return createCircularGauge(row);
                  case 2: return createProgressBar(row);
                  case 3: return createArrowIndicator(row);
                  case 4: return createLedBar(row);
                  case 5: return createEmojiIndicator(row);
                  case 6: return createPieSlice(row);
                  case 7: return createBattery(row);
                  case 8: return createTrafficLight(row);
                  case 9: return createCardSuit(row);
                  default: return createEmojiIndicator(row);
                }
              }
            },
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
        
        e.stopPropagation();
      };
    });
  }

  // Initialize the chart (Needs to be global for updateChart function)
  var chartDom = document.getElementById('portfolioChart');
  var myChart = echarts.init(chartDom);

  // Initial chart options (will be updated later)
  function getChartOptions(isDarkMode) {
    // Define a larger color palette with distinct colors
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
        right: "5%",
        top: "middle",
        itemGap: 10,
        textStyle: {
          fontFamily: '"EB Garamond", serif',
          fontSize: 14,
          color: isDarkMode ? "#ffffff" : "#000000"
        },
        formatter: function(name) {
          // Find the full name in chartData
          const item = chartData.find(item => item.symbol === name);
          return item ? item.name : name;
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
<div id="portfolioChartContainer" style="width: 100%; overflow: visible; max-width: 900px; margin: 40px auto;">
  <div id="portfolioChart" style="width: 850px; height: 480px; margin: 0 auto;"></div>
</div>

&nbsp;

### Investment Summary

<div class="section-heading">💼 Portfolio Performance</div>

<!-- Placeholder for the summary table -->
<div id="summary-table-container" style="display: none;">
  <!-- The summary table will be generated dynamically after data retrieval -->
</div>

&nbsp;

