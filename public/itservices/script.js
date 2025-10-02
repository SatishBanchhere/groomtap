
        // Global variables
        let ecgChart, stockChart, cityMap;
        let ecgData = [];
        let stockData = [];
        let alertCount = 0;
        let previousValues = { dust: 0, temperature: 0, humidity: 0 };
        
        // Switch tabs function
        function switchTab(tabName) {
            // Remove active class from all tabs and content
            document.querySelectorAll('.info-tab').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            event.target.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        }
        
        // Initialize ECG Chart with enhanced animation
        function initECGChart() {
            const ctx = document.getElementById('ecgChart').getContext('2d');
            ecgChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({length: 100}, (_, i) => i),
                    datasets: [{
                        label: 'Dust Level',
                        data: Array(100).fill(100),
                        borderColor: '#00ff88',
                        backgroundColor: 'transparent',
                        borderWidth: 3,
                        fill: false,
                        tension: 0.4, // Increased tension for smoother curves
                        pointRadius: 0,
                        segment: {
                            borderColor: ctx => {
                                const value = ctx.p0.parsed.y;
                                if (value < 50) return '#00e676'; // Good
                                if (value < 100) return '#ffeb3b'; // Moderate
                                if (value < 150) return '#ff9800'; // Unhealthy
                                if (value < 200) return '#f44336'; // Very unhealthy
                                return '#9c27b0'; // Hazardous
                            }
                        }
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: { 
                            display: false,
                            grid: { display: false }
                        },
                        y: {
                            display: true,
                            min: 0,
                            max: 300,
                            position: 'right',
                            ticks: { 
                                color: '#00ff88',
                                font: { family: 'Courier New' }
                            },
                            grid: { 
                                color: 'rgba(0, 255, 136, 0.2)',
                                drawTicks: false 
                            }
                        }
                    },
                    elements: {
                        point: { radius: 0 }
                    },
                    animation: {
                        duration: 0
                    },
                    interaction: {
                        intersect: false
                    },
                    // Add ECG-like animation
                    transitions: {
                        show: {
                            animations: {
                                x: {
                                    from: 0
                                },
                                y: {
                                    type: 'number',
                                    easing: 'linear',
                                    duration: 0
                                }
                            }
                        },
                        hide: {
                            animations: {
                                x: {
                                    from: 0
                                },
                                y: {
                                    type: 'number',
                                    easing: 'linear',
                                    duration: 0
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // Initialize Stock Chart
        function initStockChart() {
            const ctx = document.getElementById('stockChart').getContext('2d');
            stockChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Dust (µg/m³)',
                        data: [],
                        borderColor: '#ff4757',
                        backgroundColor: 'rgba(255, 71, 87, 0.1)',
                        tension: 0.1,
                        fill: true
                    }, {
                        label: 'Temperature (°C)',
                        data: [],
                        borderColor: '#ffa502',
                        backgroundColor: 'rgba(255, 165, 2, 0.1)',
                        tension: 0.1,
                        fill: false
                    }, {
                        label: 'Humidity (%)',
                        data: [],
                        borderColor: '#3742fa',
                        backgroundColor: 'rgba(55, 66, 250, 0.1)',
                        tension: 0.1,
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: { color: '#fff' }
                        }
                    },
                    scales: {
                        x: {
                            ticks: { color: '#888' },
                            grid: { color: 'rgba(255,255,255,0.1)' }
                        },
                        y: {
                            ticks: { color: '#888' },
                            grid: { color: 'rgba(255,255,255,0.1)' }
                        }
                    }
                }
            });
        }
        
        // Initialize City Map
        function initCityMap() {
            cityMap = L.map('cityMap').setView([21.1458, 79.0882], 12); // Nagpur coordinates
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(cityMap);
            
            // Custom marker styles
            const getMarkerColor = (dustLevel) => {
                if (dustLevel <= 50) return '#00e676';
                if (dustLevel <= 100) return '#ffeb3b';
                if (dustLevel <= 150) return '#ff9800';
                if (dustLevel <= 200) return '#f44336';
                return '#9c27b0';
            };
            
            // Add sample markers for Nagpur
            const nagpurLocations = [
                { lat: 21.1458, lng: 79.0882, name: "Nagpur City Center", dust: 85, temp: 32, humidity: 45 },
                { lat: 21.1358, lng: 79.0982, name: "Ambazari Lake", dust: 45, temp: 30, humidity: 50 },
                { lat: 21.1558, lng: 79.0782, name: "Seminary Hills", dust: 60, temp: 29, humidity: 55 }
            ];
            
            nagpurLocations.forEach(location => {
                const marker = L.circleMarker([location.lat, location.lng], {
                    radius: 15,
                    fillColor: getMarkerColor(location.dust),
                    color: '#fff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(cityMap);
                
                marker.bindPopup(`
                    <strong>${location.name}</strong><br>
                    Dust: ${location.dust} µg/m³<br>
                    Temperature: ${location.temp}°C<br>
                    Humidity: ${location.humidity}%
                `);
            });
        }
        
        // Update Status
        function updateStatus(value, threshold, statusId) {
            const element = document.getElementById(statusId);
            if (value > threshold) {
                element.textContent = 'CRITICAL';
                element.className = 'metric-status status-danger';
            } else if (value > threshold * 0.8) {
                element.textContent = 'WARNING';
                element.className = 'metric-status status-warning';
            } else {
                element.textContent = 'NORMAL';
                element.className = 'metric-status status-normal';
            }
        }
        
        // Enhanced ECG Chart with realistic heartbeat effect
        function updateECGChart(dustValue, tempValue, humidityValue) {
            const data = ecgChart.data.datasets[0].data;
            
            // Shift data to create scrolling effect
            data.shift();
            
            // Add realistic ECG pattern based on dust value
            let newValue = dustValue;
            
            // Create realistic ECG pattern with P, QRS, and T waves
            const dataLength = data.length;
            const position = 100 - dataLength;
            
            // ECG pattern simulation
            if (position % 20 === 0) {
                // QRS complex - sharp spike
                newValue = dustValue + 40 + Math.random() * 20;
            } else if (position % 20 === 1) {
                // Return to baseline after QRS
                newValue = dustValue - 20;
            } else if (position % 20 === 2) {
                // T wave - smaller rounded wave
                newValue = dustValue + 15 + Math.random() * 10;
            } else if (position % 20 === 3) {
                // Return to baseline
                newValue = dustValue;
            } else {
                // Baseline with slight variation
                newValue = dustValue + Math.random() * 10 - 5;
            }
            
            // Ensure value stays within reasonable bounds
            newValue = Math.max(0, Math.min(300, newValue));
            
            data.push(newValue);
            
            // Update chart with smooth animation
            ecgChart.update('none');
            
            // Update ECG values display
            document.getElementById('ecg-dust').textContent = dustValue.toFixed(1);
            document.getElementById('ecg-temp').textContent = tempValue.toFixed(1);
            document.getElementById('ecg-humidity').textContent = humidityValue.toFixed(1);
        }
        
        // Update trend indicators (stock market style)
        function updateTrendIndicators(currentValues) {
            const dustChange = currentValues.dust - previousValues.dust;
            const tempChange = currentValues.temperature - previousValues.temperature;
            const humidityChange = currentValues.humidity - previousValues.humidity;
            
            // Update dust trend
            document.getElementById('dust-trend').textContent = currentValues.dust.toFixed(1);
            const dustChangeElement = document.getElementById('dust-change');
            if (dustChange > 0) {
                dustChangeElement.textContent = `+${dustChange.toFixed(1)} ↗`;
                dustChangeElement.className = 'trend-change trend-up';
            } else if (dustChange < 0) {
                dustChangeElement.textContent = `${dustChange.toFixed(1)} ↘`;
                dustChangeElement.className = 'trend-change trend-down';
            } else {
                dustChangeElement.textContent = '0.0 →';
                dustChangeElement.className = 'trend-change trend-stable';
            }
            
            // Update temperature trend
            document.getElementById('temp-trend').textContent = currentValues.temperature.toFixed(1);
            const tempChangeElement = document.getElementById('temp-change');
            if (tempChange > 0) {
                tempChangeElement.textContent = `+${tempChange.toFixed(1)} ↗`;
                tempChangeElement.className = 'trend-change trend-up';
            } else if (tempChange < 0) {
                tempChangeElement.textContent = `${tempChange.toFixed(1)} ↘`;
                tempChangeElement.className = 'trend-change trend-down';
            } else {
                tempChangeElement.textContent = '0.0 →';
                tempChangeElement.className = 'trend-change trend-stable';
            }
            
            // Update humidity trend
            document.getElementById('humidity-trend').textContent = currentValues.humidity.toFixed(1);
            const humidityChangeElement = document.getElementById('humidity-change');
            if (humidityChange > 0) {
                humidityChangeElement.textContent = `+${humidityChange.toFixed(1)} ↗`;
                humidityChangeElement.className = 'trend-change trend-up';
            } else if (humidityChange < 0) {
                humidityChangeElement.textContent = `${humidityChange.toFixed(1)} ↘`;
                humidityChangeElement.className = 'trend-change trend-down';
            } else {
                humidityChangeElement.textContent = '0.0 →';
                humidityChangeElement.className = 'trend-change trend-stable';
            }
            
            // Store current values as previous
            previousValues = { ...currentValues };
        }
        
        // Show Alerts
        function showAlerts(alerts) {
            const container = document.getElementById('alerts-container');
            const countElement = document.getElementById('alerts-count');
            
            if (alerts && alerts.length > 0) {
                alertCount = alerts.length;
                countElement.textContent = alertCount;
                
                container.innerHTML = '';
                alerts.forEach((alert, index) => {
                    const alertCard = document.createElement('div');
                    alertCard.className = 'alert-card';
                    alertCard.innerHTML = `
                        <div class="alert-message">${alert.message}</div>
                        <div class="alert-details">
                            Value: ${alert.value} | Threshold: ${alert.threshold}
                        </div>
                    `;
                    container.appendChild(alertCard);
                });
            } else {
                alertCount = 0;
                countElement.textContent = '0';
                container.innerHTML = '<div style="color: #888; font-style: italic;">No active alerts</div>';
            }
        }
        
        // Change Timeframe
        function changeTimeframe(timeframe) {
            // Remove active class from all buttons
            document.querySelectorAll('.timeframe-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            event.target.classList.add('active');
            
            // Update chart based on timeframe (you can customize this)
            console.log('Timeframe changed to:', timeframe);
            updateStockChart();
        }
        
        // Simulate real-time data
        function simulateRealTimeData() {
            // Generate realistic data fluctuations
            const dustValue = 50 + Math.sin(Date.now() / 10000) * 30 + Math.random() * 20;
            const tempValue = 25 + Math.sin(Date.now() / 15000) * 10 + Math.random() * 5;
            const humidityValue = 50 + Math.cos(Date.now() / 20000) * 20 + Math.random() * 10;
            
            return {
                dust: Math.max(0, dustValue),
                temperature: Math.max(0, tempValue),
                humidity: Math.max(0, Math.min(100, humidityValue)),
                thresholds: {
                    dust: 100,
                    temperature: 35,
                    humidity: 80
                },
                alerts: dustValue > 100 ? [{
                    message: "High dust levels detected!",
                    value: dustValue.toFixed(1),
                    threshold: 100
                }] : []
            };
        }
        
        // Simulate historical data
        function simulateHistoricalData() {
            const now = Date.now();
            const data = [];
            
            for (let i = 0; i < 24; i++) {
                const timestamp = new Date(now - (24 - i) * 3600000);
                const dustValue = 50 + Math.sin(i / 4) * 30 + Math.random() * 20;
                const tempValue = 25 + Math.sin(i / 6) * 10 + Math.random() * 5;
                const humidityValue = 50 + Math.cos(i / 8) * 20 + Math.random() * 10;
                
                data.push({
                    timestamp: timestamp.toISOString(),
                    dust: Math.max(0, dustValue),
                    temperature: Math.max(0, tempValue),
                    humidity: Math.max(0, Math.min(100, humidityValue))
                });
            }
            
            return data;
        }
        
        // Update Real-time Data
        function updateRealTimeData() {
            const data = simulateRealTimeData();
            
            const currentValues = {
                dust: data.dust || 0,
                temperature: data.temperature || 0,
                humidity: data.humidity || 0
            };
            
            // Update metric values
            document.getElementById('dust-value').textContent = currentValues.dust.toFixed(1);
            document.getElementById('temp-value').textContent = currentValues.temperature.toFixed(1);
            document.getElementById('humidity-value').textContent = currentValues.humidity.toFixed(1);
            
            // Update status indicators
            updateStatus(currentValues.dust, data.thresholds.dust, 'dust-status');
            updateStatus(currentValues.temperature, data.thresholds.temperature, 'temp-status');
            updateStatus(currentValues.humidity, data.thresholds.humidity, 'humidity-status');
            
            // Update ECG chart
            updateECGChart(currentValues.dust, currentValues.temperature, currentValues.humidity);
            
            // Update trend indicators
            updateTrendIndicators(currentValues);
            
            // Show alerts
            showAlerts(data.alerts);
        }
        
        // Update Stock Chart
        function updateStockChart() {
            const data = simulateHistoricalData();
            
            const labels = data.map(item => 
                new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
            );
            
            stockChart.data.labels = labels;
            stockChart.data.datasets[0].data = data.map(item => item.dust);
            stockChart.data.datasets[1].data = data.map(item => item.temperature);
            stockChart.data.datasets[2].data = data.map(item => item.humidity);
            stockChart.update();
        }
        
        // Initialize everything when page loads
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize all charts and map
            initECGChart();
            initStockChart();
            initCityMap();
            
            // Initial data load
            updateRealTimeData();
            updateStockChart();
            
            // Set up real-time updates
            setInterval(() => {
                updateRealTimeData();
            }, 1000); // Update every second for smooth ECG effect
            
            // Update stock chart less frequently
            setInterval(() => {
                updateStockChart();
            }, 5000); // Update every 5 seconds
        });
  