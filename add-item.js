document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('addItemForm');
    
    // Set minimum date for expiry date input to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expiryDate').min = today;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            barcode: document.getElementById('barcode').value,
            name: document.getElementById('itemName').value,
            category: document.getElementById('category').value,
            quantity: document.getElementById('quantity').value,
            unit: document.getElementById('unit').value,
            expiryDate: document.getElementById('expiryDate').value,
            price: document.getElementById('price').value || null,
            notes: document.getElementById('notes').value || null,
            scanDate: new Date().toISOString(),
            image: null
        };

        // Handle image upload if present
        const imageInput = document.getElementById('itemImage');
        if (imageInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function(e) {
                formData.image = e.target.result;
                saveItem(formData);
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            saveItem(formData);
        }
    });
});

function saveItem(itemData) {
    // Get existing inventory
    let inventory = JSON.parse(localStorage.getItem('inventory')) || {};
    
    // Get existing scan history
    let scanHistory = JSON.parse(localStorage.getItem('scanHistory')) || [];
    
    // Add item to inventory
    if (!inventory[itemData.category]) {
        inventory[itemData.category] = [];
    }
    inventory[itemData.category].push(itemData);
    
    // Add to scan history
    scanHistory.unshift(itemData);
    
    // Save updated data
    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('scanHistory', JSON.stringify(scanHistory));
    
    // Show success message
    showAlert('Item added successfully!', 'success');
    
    // Redirect back to scan page after a short delay
    setTimeout(() => {
        window.location.href = 'scan.html';
    }, 1500);
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