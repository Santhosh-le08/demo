document.addEventListener('DOMContentLoaded', function() {
    // Initialize scan history
    loadScanHistory();
    // Set up form submission handler
    setupFormHandler();
});

// Mock product database
const productDatabase = {
    '123456789': {
        name: 'Organic Bananas',
        category: 'fresh-produce',
        defaultUnit: 'kg',
        typicalExpiryDays: 7
    },
    '987654321': {
        name: 'Whole Milk',
        category: 'dairy-eggs',
        defaultUnit: 'l',
        typicalExpiryDays: 7
    },
    '456789123': {
        name: 'Chicken Breast',
        category: 'meat-seafood',
        defaultUnit: 'kg',
        typicalExpiryDays: 3
    }
};

function startScanning() {
    // In a real application, this would access the device camera
    // For demo purposes, we'll simulate a scan
    showAlert('Starting camera...', 'info');
    
    // Simulate camera access
    setTimeout(() => {
        showAlert('Camera ready! Position the barcode in frame.', 'info');
        
        // Simulate successful scan after 2 seconds
        setTimeout(() => {
            simulateSuccessfulScan('123456789');
        }, 2000);
    }, 1000);
}

function simulateSuccessfulScan(barcode) {
    const product = productDatabase[barcode];
    if (product) {
        // Pre-fill the form with product details
        document.getElementById('barcode').value = barcode;
        document.getElementById('itemName').value = product.name;
        document.getElementById('category').value = product.category;
        document.getElementById('unit').value = product.defaultUnit;
        
        // Set expiry date to typical expiry days from now
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + product.typicalExpiryDays);
        document.getElementById('expiryDate').value = expiryDate.toISOString().split('T')[0];
        
        showAlert('Barcode scanned successfully!', 'success');
        addToScanHistory(product);
    } else {
        showAlert('Product not found in database. Please enter details manually.', 'warning');
    }
}

function setupFormHandler() {
    const form = document.getElementById('manualEntryForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const item = {
            id: Date.now(),
            barcode: formData.get('barcode'),
            name: formData.get('itemName'),
            category: formData.get('category'),
            quantity: parseInt(formData.get('quantity')),
            unit: formData.get('unit'),
            expiryDate: formData.get('expiryDate'),
            price: formData.get('price') ? parseFloat(formData.get('price')) : null,
            notes: formData.get('notes'),
            dateAdded: new Date().toISOString()
        };
        
        // Add to inventory
        addToInventory(item);
        
        // Add to scan history
        addToScanHistory(item);
        
        // Reset form
        form.reset();
        
        showAlert('Item added successfully!', 'success');
    });
}

function addToInventory(item) {
    // Get existing inventory or initialize empty object
    let inventory = JSON.parse(localStorage.getItem('inventory')) || {
        'fresh-produce': [],
        'dairy-eggs': [],
        'meat-seafood': [],
        'pantry': []
    };
    
    // Add item to appropriate category
    inventory[item.category].push(item);
    
    // Save updated inventory
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

function addToScanHistory(item) {
    // Get existing scan history or initialize empty array
    let scanHistory = JSON.parse(localStorage.getItem('scanHistory')) || [];
    
    // Add new scan to history
    scanHistory.unshift({
        ...item,
        scanDate: new Date().toISOString()
    });
    
    // Keep only last 10 scans
    scanHistory = scanHistory.slice(0, 10);
    
    // Save updated history
    localStorage.setItem('scanHistory', JSON.stringify(scanHistory));
    
    // Update display
    updateScanHistoryDisplay();
}

function loadScanHistory() {
    updateScanHistoryDisplay();
}

function updateScanHistoryDisplay() {
    const historyList = document.querySelector('.history-list');
    const scanHistory = JSON.parse(localStorage.getItem('scanHistory')) || [];
    
    historyList.innerHTML = scanHistory.map(item => `
        <div class="history-item">
            <div class="history-item-header">
                <h3>${item.name}</h3>
                <span class="scan-date">${new Date(item.scanDate).toLocaleString()}</span>
            </div>
            <div class="history-item-details">
                <p><i class="fas fa-barcode"></i> ${item.barcode}</p>
                <p><i class="fas fa-box"></i> ${item.quantity} ${item.unit}</p>
                <p><i class="fas fa-calendar"></i> Expires: ${new Date(item.expiryDate).toLocaleDateString()}</p>
            </div>
        </div>
    `).join('');
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