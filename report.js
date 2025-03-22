// Report Wastage Backend Handler
document.addEventListener('DOMContentLoaded', function() {
    const wasteReportForm = document.getElementById('wasteReportForm');
    const insightsContainer = document.querySelector('.insights-container');
    const reportsGrid = document.querySelector('.reports-grid');

    // Initialize reports from localStorage or use empty array
    let reports = JSON.parse(localStorage.getItem('wasteReports')) || [];
    let userReports = reports.filter(report => report.userId === localStorage.getItem('userId')) || [];

    // Handle form submission
    wasteReportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            id: Date.now(), // Unique ID for the report
            userId: localStorage.getItem('userId'),
            timestamp: new Date().toISOString(),
            itemName: document.getElementById('itemName').value,
            category: document.getElementById('category').value,
            quantity: parseFloat(document.getElementById('quantity').value),
            unit: document.getElementById('unit').value,
            reason: document.getElementById('reason').value,
            cost: document.getElementById('cost').value ? parseFloat(document.getElementById('cost').value) : null,
            location: document.getElementById('location').value,
            purchaseDate: document.getElementById('purchaseDate').value,
            disposalMethod: document.getElementById('disposalMethod').value,
            prevention: Array.from(document.getElementById('prevention').selectedOptions).map(option => option.value),
            notes: document.getElementById('notes').value,
            image: document.getElementById('image').files[0] ? URL.createObjectURL(document.getElementById('image').files[0]) : null
        };

        // Add report to storage
        reports.push(formData);
        userReports.push(formData);
        localStorage.setItem('wasteReports', JSON.stringify(reports));

        // Update UI
        updateRecentReports();
        updateAIInsights();

        // Show success message
        showNotification('Report submitted successfully!', 'success');

        // Reset form
        wasteReportForm.reset();
    });

    // Update Recent Reports
    function updateRecentReports() {
        reportsGrid.innerHTML = '';
        const recentReports = userReports.slice(-3).reverse();

        recentReports.forEach(report => {
            const reportCard = createReportCard(report);
            reportsGrid.appendChild(reportCard);
        });
    }

    // Create Report Card
    function createReportCard(report) {
        const card = document.createElement('div');
        card.className = 'report-card';
        
        const date = new Date(report.timestamp);
        const dateString = getRelativeDate(date);

        card.innerHTML = `
            <div class="report-header">
                <h3>${report.itemName}</h3>
                <span class="report-date">${dateString}</span>
            </div>
            <div class="report-details">
                <p><i class="fas fa-box"></i> ${report.quantity} ${report.unit}</p>
                <p><i class="fas fa-tag"></i> ${formatCategory(report.category)}</p>
                <p><i class="fas fa-exclamation-circle"></i> ${formatReason(report.reason)}</p>
                ${report.cost ? `<p><i class="fas fa-dollar-sign"></i> $${report.cost.toFixed(2)}</p>` : ''}
            </div>
        `;

        return card;
    }

    // Update AI Insights
    function updateAIInsights() {
        const insights = generateAIInsights();
        insightsContainer.innerHTML = '';

        insights.forEach(insight => {
            const insightCard = createInsightCard(insight);
            insightsContainer.appendChild(insightCard);
        });
    }

    // Generate AI Insights
    function generateAIInsights() {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const lastMonthReports = userReports.filter(report => 
            new Date(report.timestamp) >= lastMonth
        );

        const currentMonthReports = userReports.filter(report => 
            new Date(report.timestamp) >= new Date(new Date().setDate(1))
        );

        // Calculate waste reduction
        const lastMonthWaste = calculateTotalWaste(lastMonthReports);
        const currentMonthWaste = calculateTotalWaste(currentMonthReports);
        const reduction = lastMonthWaste > 0 ? 
            ((lastMonthWaste - currentMonthWaste) / lastMonthWaste) * 100 : 0;

        // Analyze waste patterns
        const patterns = analyzeWastePatterns(userReports);

        // Generate insights
        return [
            {
                icon: 'chart-line',
                title: 'Waste Reduction Trend',
                content: `Your food waste has ${reduction > 0 ? 'decreased' : 'increased'} by ${Math.abs(reduction).toFixed(1)}% compared to last month.`,
                details: [
                    { icon: 'calendar', text: 'Last 30 days' },
                    { icon: 'percentage', text: `${Math.abs(reduction).toFixed(1)}% ${reduction > 0 ? 'reduction' : 'increase'}` }
                ]
            },
            {
                icon: 'exclamation-triangle',
                title: 'Common Waste Patterns',
                content: `Your most frequently wasted items are ${patterns.topItems.join(', ')}.`,
                details: patterns.details
            },
            {
                icon: 'lightbulb',
                title: 'Smart Suggestions',
                content: 'Based on your waste patterns, try these tips:',
                suggestions: generateSuggestions(patterns)
            },
            {
                icon: 'dollar-sign',
                title: 'Cost Impact',
                content: `Your food waste costs approximately $${calculateMonthlyCost(userReports).toFixed(2)} per month.`,
                details: [
                    { icon: 'wallet', text: `Current: $${calculateMonthlyCost(userReports).toFixed(2)}/month` },
                    { icon: 'piggy-bank', text: `Potential savings: $${(calculateMonthlyCost(userReports) * 0.6).toFixed(2)}/month` }
                ]
            }
        ];
    }

    // Helper Functions
    function calculateTotalWaste(reports) {
        return reports.reduce((total, report) => total + report.quantity, 0);
    }

    function analyzeWastePatterns(reports) {
        const categoryCounts = {};
        reports.forEach(report => {
            categoryCounts[report.category] = (categoryCounts[report.category] || 0) + 1;
        });

        const sortedCategories = Object.entries(categoryCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 2);

        return {
            topItems: sortedCategories.map(([category]) => formatCategory(category)),
            details: sortedCategories.map(([category, count]) => ({
                icon: getCategoryIcon(category),
                text: `${formatCategory(category)}: ${((count / reports.length) * 100).toFixed(0)}%`
            }))
        };
    }

    function generateSuggestions(patterns) {
        const suggestions = [];
        if (patterns.topItems.includes('Fresh Produce')) {
            suggestions.push('Store produce in proper containers');
        }
        if (patterns.topItems.includes('Dairy & Eggs')) {
            suggestions.push('Buy dairy products in smaller quantities');
        }
        suggestions.push('Use the "First In, First Out" method');
        return suggestions;
    }

    function calculateMonthlyCost(reports) {
        const currentMonth = new Date().getMonth();
        const monthlyReports = reports.filter(report => 
            new Date(report.timestamp).getMonth() === currentMonth
        );
        return monthlyReports.reduce((total, report) => total + (report.cost || 0), 0);
    }

    function getRelativeDate(date) {
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    }

    function formatCategory(category) {
        return category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    function formatReason(reason) {
        return reason.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    function getCategoryIcon(category) {
        const icons = {
            'fresh-produce': 'apple-alt',
            'dairy-eggs': 'milk',
            'meat-seafood': 'drumstick-bite',
            'pantry': 'cookie-bite'
        };
        return icons[category] || 'box';
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Initialize UI
    updateRecentReports();
    updateAIInsights();
}); 