document.addEventListener("DOMContentLoaded", function () {
    // Inventory Status Check
    const statusBox = document.querySelector(".hero");
    setInterval(() => {
        // Check inventory status
        const lowStockItems = inventory.filter(item => item.quantity <= 2);
        const expiringItems = inventory.filter(item => {
            const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
            return daysUntilExpiry >= 0 && daysUntilExpiry <= 3;
        });

        if (lowStockItems.length > 0 || expiringItems.length > 0) {
            statusBox.innerHTML = `<h2>⚠️ Inventory Alert: ${lowStockItems.length} items low in stock, ${expiringItems.length} items expiring soon</h2>`;
            statusBox.style.backgroundColor = "#FFA500";
        } else {
            statusBox.innerHTML = `<h2>✅ All Clear: Your inventory is well-stocked and up to date!</h2>`;
            statusBox.style.backgroundColor = "#28A745";
        }
    }, 10000); // Update every 10 seconds

    // Fetch live updates (Mock Example)
    setTimeout(() => {
        alertBox.innerHTML = "<h2>✅ All Clear: The flood warning has been lifted!</h2>";
        alertBox.style.backgroundColor = "#28A745";
    }, 10000); // Update after 10 seconds
});

// Initialize inventory from localStorage or empty array
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

// DOM Elements
const addItemModal = document.getElementById('addItemModal');
const quickScanModal = document.getElementById('quickScanModal');
const aiInsightsModal = document.getElementById('aiInsightsModal');
const addItemForm = document.getElementById('addItemForm');
const searchInput = document.getElementById('searchInput');
const filterExpiry = document.getElementById('filterExpiry');
const filterCategory = document.getElementById('filterCategory');
const alertsContainer = document.getElementById('alertsContainer');
const insightsContainer = document.getElementById('insightsContainer');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    updateInventoryDisplay();
    setupEventListeners();
    generateSmartAlerts();
    generateAIInsights();
});

function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', updateInventoryDisplay);
    
    // Filter functionality
    filterExpiry.addEventListener('change', updateInventoryDisplay);
    filterCategory.addEventListener('change', updateInventoryDisplay);
    
    // Form submission
    addItemForm.addEventListener('submit', handleAddItem);
}

// Show Add Item Modal
function showAddItemModal() {
    addItemModal.classList.add('show');
    addItemForm.reset();
}

// Close Add Item Modal
function closeAddItemModal() {
    addItemModal.classList.remove('show');
}

// Show Quick Scan Modal
function showQuickScanModal() {
    quickScanModal.classList.add('show');
}

// Close Quick Scan Modal
function closeQuickScanModal() {
    quickScanModal.classList.remove('show');
}

// Show AI Insights Modal
function showAIInsightsModal() {
    aiInsightsModal.classList.add('show');
}

// Close AI Insights Modal
function closeAIInsightsModal() {
    aiInsightsModal.classList.remove('show');
}

// Start Barcode Scanning
function startScanning() {
    // In a real application, this would access the device camera
    // For demo purposes, we'll simulate a successful scan
    setTimeout(() => {
        const mockBarcode = '123456789';
        handleScannedBarcode(mockBarcode);
    }, 2000);
}

// Handle Scanned Barcode
function handleScannedBarcode(barcode) {
    // In a real application, this would look up the product in a database
    // For demo purposes, we'll create a mock product
    const mockProduct = {
        name: 'Sample Product',
        category: 'pantry',
        defaultUnit: 'pcs',
        typicalExpiryDays: 30
    };
    
    // Pre-fill the add item form
    document.getElementById('itemName').value = mockProduct.name;
    document.getElementById('category').value = mockProduct.category;
    document.getElementById('unit').value = mockProduct.defaultUnit;
    
    // Set expiry date to typical expiry days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + mockProduct.typicalExpiryDays);
    document.getElementById('expiryDate').value = expiryDate.toISOString().split('T')[0];
    
    // Close scan modal and show add item modal
    closeQuickScanModal();
    showAddItemModal();
}

// Generate Smart Alerts
function generateSmartAlerts() {
    const alerts = [];
    
    // Check for expiring items
    const expiringItems = inventory.filter(item => {
        const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry >= 0 && daysUntilExpiry <= 3;
    });
    
    if (expiringItems.length > 0) {
        alerts.push({
            type: 'warning',
            message: `${expiringItems.length} items are expiring soon`,
            icon: 'fa-exclamation-triangle'
        });
    }
    
    // Check for low stock
    const lowStockItems = inventory.filter(item => item.quantity <= 2);
    if (lowStockItems.length > 0) {
        alerts.push({
            type: 'warning',
            message: `${lowStockItems.length} items are running low`,
            icon: 'fa-box'
        });
    }
    
    // Check for expired items
    const expiredItems = inventory.filter(item => {
        return new Date(item.expiryDate) < new Date();
    });
    
    if (expiredItems.length > 0) {
        alerts.push({
            type: 'danger',
            message: `${expiredItems.length} items have expired`,
            icon: 'fa-times-circle'
        });
    }
    
    // Update alerts display
    updateAlertsDisplay(alerts);
}

// Update Alerts Display
function updateAlertsDisplay(alerts) {
    alertsContainer.innerHTML = alerts.map(alert => `
        <div class="alert-item ${alert.type}">
            <i class="fas ${alert.icon}"></i>
            <p>${alert.message}</p>
        </div>
    `).join('');
}

// Generate AI Insights
function generateAIInsights() {
    const insights = [];
    
    // Analyze consumption patterns
    const consumptionInsight = analyzeConsumptionPatterns();
    if (consumptionInsight) {
        insights.push({
            title: 'Consumption Pattern',
            description: consumptionInsight,
            icon: 'fa-chart-line'
        });
    }
    
    // Suggest optimal quantities
    const quantityInsight = suggestOptimalQuantities();
    if (quantityInsight) {
        insights.push({
            title: 'Quantity Optimization',
            description: quantityInsight,
            icon: 'fa-balance-scale'
        });
    }
    
    // Predict waste reduction
    const wasteInsight = predictWasteReduction();
    if (wasteInsight) {
        insights.push({
            title: 'Waste Reduction',
            description: wasteInsight,
            icon: 'fa-leaf'
        });
    }
    
    // Update insights display
    updateInsightsDisplay(insights);
}

// Analyze Consumption Patterns
function analyzeConsumptionPatterns() {
    // In a real application, this would analyze historical data
    // For demo purposes, we'll return a mock insight
    return 'Based on your consumption patterns, you tend to use fresh produce within 5 days of purchase. Consider buying smaller quantities more frequently.';
}

// Suggest Optimal Quantities
function suggestOptimalQuantities() {
    // In a real application, this would analyze usage patterns
    // For demo purposes, we'll return a mock insight
    return 'Your household typically consumes 2kg of fresh produce per week. Adjust your shopping list accordingly.';
}

// Predict Waste Reduction
function predictWasteReduction() {
    // In a real application, this would analyze historical waste data
    // For demo purposes, we'll return a mock insight
    return 'By following our suggested quantities, you could reduce food waste by up to 30% this month.';
}

// Update Insights Display
function updateInsightsDisplay(insights) {
    insightsContainer.innerHTML = insights.map(insight => `
        <div class="insight-card">
            <i class="fas ${insight.icon}"></i>
            <h3>${insight.title}</h3>
            <p>${insight.description}</p>
        </div>
    `).join('');
}

// Show Smart Suggestions
function showSmartSuggestions() {
    generateAIInsights();
    showAIInsightsModal();
}

// Show Shopping List
function showShoppingList() {
    // In a real application, this would generate a shopping list based on inventory
    // For demo purposes, we'll show a mock list
    const shoppingList = generateShoppingList();
    alert('Shopping List:\n' + shoppingList.join('\n'));
}

// Generate Shopping List
function generateShoppingList() {
    // In a real application, this would analyze inventory and suggest items to buy
    // For demo purposes, we'll return a mock list
    return [
        'Fresh Produce:',
        '- Apples (2kg)',
        '- Bananas (1kg)',
        'Dairy & Eggs:',
        '- Milk (2L)',
        '- Eggs (12)',
        'Pantry Items:',
        '- Rice (2kg)',
        '- Pasta (1kg)'
    ];
}

// Handle Add Item Form Submission
async function handleAddItem(e) {
    e.preventDefault();
    
    const formData = new FormData(addItemForm);
    const itemImage = formData.get('itemImage');
    let imageUrl = null;
    
    // Handle image upload if provided
    if (itemImage.size > 0) {
        imageUrl = await handleImageUpload(itemImage);
    }
    
    const newItem = {
        id: Date.now(),
        name: formData.get('itemName'),
        category: formData.get('category'),
        quantity: parseInt(formData.get('quantity')),
        unit: formData.get('unit'),
        expiryDate: formData.get('expiryDate'),
        price: formData.get('price') ? parseFloat(formData.get('price')) : null,
        notes: formData.get('notes'),
        imageUrl: imageUrl,
        dateAdded: new Date().toISOString()
    };
    
    inventory.push(newItem);
    saveInventory();
    updateInventoryDisplay();
    closeAddItemModal();
}

// Handle Image Upload
async function handleImageUpload(file) {
    return new Promise((resolve, reject) => {
        // Check file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            reject(new Error('Invalid file type'));
            return;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            reject(new Error('File too large'));
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            // Create a temporary image to check dimensions
            const img = new Image();
            img.onload = () => {
                // Create canvas for image optimization
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Set maximum dimensions
                const maxWidth = 800;
                const maxHeight = 800;
                
                // Calculate new dimensions
                let width = img.width;
                let height = img.height;
                
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }
                
                // Set canvas dimensions
                canvas.width = width;
                canvas.height = height;
                
                // Draw and optimize image
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to optimized JPEG
                const optimizedImageUrl = canvas.toDataURL('image/jpeg', 0.8);
                resolve(optimizedImageUrl);
            };
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

// Update Inventory Display
function updateInventoryDisplay() {
    const searchTerm = searchInput.value.toLowerCase();
    const expiryFilter = filterExpiry.value;
    const categoryFilter = filterCategory.value;
    
    // Filter inventory based on search and filters
    let filteredInventory = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
        const matchesExpiry = filterExpiry === 'all' || getExpiryStatus(item) === expiryFilter;
        return matchesSearch && matchesCategory && matchesExpiry;
    });
    
    // Sort by expiry date
    filteredInventory.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
    
    // Update statistics
    updateStatistics(filteredInventory);
    
    // Clear existing items
    document.querySelectorAll('.items-container').forEach(container => {
        container.innerHTML = '';
    });
    
    // Add filtered items to appropriate category sections
    filteredInventory.forEach(item => {
        const container = document.getElementById(item.category);
        if (container) {
            container.appendChild(createItemCard(item));
        }
    });
}

// Create Item Card
function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    
    const imageHtml = item.imageUrl 
        ? `<img src="${item.imageUrl}" alt="${item.name}" class="item-image" loading="lazy">`
        : `<div class="item-image"><i class="fas fa-box"></i></div>`;
    
    const priceHtml = item.price 
        ? `<p class="item-price">Price: $${item.price.toFixed(2)}</p>`
        : '';
    
    const notesHtml = item.notes 
        ? `<p class="item-notes">${item.notes}</p>`
        : '';
    
    const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    const expiryClass = getExpiryStatus(item);
    const expiryText = getExpiryStatusText(item);
    
    card.innerHTML = `
        ${imageHtml}
        <div class="item-content">
            <div class="item-header">
                <h3>${item.name}</h3>
                <span class="quantity">${item.quantity} ${item.unit}</span>
            </div>
            <div class="item-details">
                <p>Expires: ${new Date(item.expiryDate).toLocaleDateString()}</p>
                <p class="expiry-status ${expiryClass}">
                    ${expiryText}
                    ${daysUntilExpiry > 0 ? `(${daysUntilExpiry} days)` : ''}
                </p>
                ${priceHtml}
                ${notesHtml}
            </div>
            <div class="item-actions">
                <button class="action-btn edit" onclick="editItem(${item.id})" title="Edit Item">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteItem(${item.id})" title="Delete Item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    // Add hover effect for image
    const imageElement = card.querySelector('.item-image');
    if (imageElement) {
        imageElement.addEventListener('mouseenter', () => {
            imageElement.style.transform = 'scale(1.1)';
        });
        imageElement.addEventListener('mouseleave', () => {
            imageElement.style.transform = 'scale(1)';
        });
    }
    
    return card;
}

// Get Expiry Status
function getExpiryStatus(item) {
    const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 3) return 'expiring-soon';
    return 'good';
}

// Get Expiry Status Text
function getExpiryStatusText(item) {
    const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry < 0) return 'Expired';
    if (daysUntilExpiry <= 3) return 'Expiring Soon';
    return 'Good';
}

// Update Statistics
function updateStatistics(items) {
    const totalItems = items.length;
    const expiringSoon = items.filter(item => getExpiryStatus(item) === 'expiring-soon').length;
    const goodItems = items.filter(item => getExpiryStatus(item) === 'good').length;
    const wasteReduction = totalItems > 0 ? Math.round((goodItems / totalItems) * 100) : 0;
    
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('expiringSoon').textContent = expiringSoon;
    document.getElementById('goodItems').textContent = goodItems;
    document.getElementById('wasteReduction').textContent = `${wasteReduction}%`;
}

// Edit Item
function editItem(id) {
    const item = inventory.find(item => item.id === id);
    if (!item) return;
    
    // Populate form with item data
    document.getElementById('itemName').value = item.name;
    document.getElementById('category').value = item.category;
    document.getElementById('quantity').value = item.quantity;
    document.getElementById('unit').value = item.unit;
    document.getElementById('expiryDate').value = item.expiryDate;
    document.getElementById('price').value = item.price || '';
    document.getElementById('notes').value = item.notes || '';
    
    // Show modal
    showAddItemModal();
    
    // Remove old item
    inventory = inventory.filter(item => item.id !== id);
    saveInventory();
    updateInventoryDisplay();
}

// Delete Item
function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        inventory = inventory.filter(item => item.id !== id);
        saveInventory();
        updateInventoryDisplay();
    }
}

// Save Inventory to localStorage
function saveInventory() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
}