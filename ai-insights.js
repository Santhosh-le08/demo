document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initializeCharts();
    // Set up event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Time range selector
    const timeRange = document.getElementById('timeRange');
    timeRange.addEventListener('change', updateCharts);
}

function initializeCharts() {
    // Consumption Trends Chart
    const consumptionCtx = document.getElementById('consumptionChart').getContext('2d');
    new Chart(consumptionCtx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Consumption Rate',
                data: [65, 72, 68, 75],
                borderColor: '#4CAF50',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(76, 175, 80, 0.1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Weekly Consumption Trends'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    // Category Distribution Chart
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: ['Fresh Produce', 'Dairy & Eggs', 'Meat & Seafood', 'Pantry'],
            datasets: [{
                data: [30, 25, 20, 25],
                backgroundColor: [
                    '#4CAF50',
                    '#2196F3',
                    '#FF5722',
                    '#FFC107'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Inventory Category Distribution'
                }
            }
        }
    });

    // Expiry Patterns Chart
    const expiryCtx = document.getElementById('expiryChart').getContext('2d');
    new Chart(expiryCtx, {
        type: 'bar',
        data: {
            labels: ['Good', 'Expiring Soon', 'Expired'],
            datasets: [{
                label: 'Items',
                data: [60, 25, 15],
                backgroundColor: [
                    '#4CAF50',
                    '#FFC107',
                    '#FF5722'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Expiry Status Distribution'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Cost Analysis Chart
    const costCtx = document.getElementById('costChart').getContext('2d');
    new Chart(costCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Cost Savings',
                data: [100, 150, 200, 250, 280, 300],
                borderColor: '#2196F3',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(33, 150, 243, 0.1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Monthly Cost Savings'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateCharts() {
    const timeRange = document.getElementById('timeRange').value;
    // In a real application, this would fetch new data based on the selected time range
    // For demo purposes, we'll just show a message
    showAlert(`Updating charts for ${timeRange} view...`, 'info');
}

function exportInsights() {
    // In a real application, this would generate and download a PDF report
    showAlert('Exporting insights report...', 'info');
}

function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.classList.add('show');
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 300);
        }, 3000);
    }, 100);
} 