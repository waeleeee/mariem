document.addEventListener('DOMContentLoaded', function() {
    // Sample data - replace with your actual data source
    const salesData = {
        labels: ['Apr 13', 'Apr 14', 'Apr 15', 'Apr 16', 'Apr 17', 'Apr 18', 'Apr 19'],
        datasets: [
            {
                label: 'Units Sold',
                data: [42, 55, 80, 120, 160, 220, 280],
                borderColor: '#1dd6c9',
                backgroundColor: 'rgba(29, 214, 201, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Revenue ($)',
                data: [1200, 1500, 2300, 3800, 5100, 8200, 12000],
                borderColor: '#ff6b6b',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y1'
            }
        ]
    };

    const equipmentData = {
        labels: ['Microphones', 'Transmitters', 'Headphones', 'Speakers', 'Cables', 'Accessories'],
        datasets: [{
            data: [24, 12, 36, 18, 124, 87],
            backgroundColor: [
                '#1dd6c9',
                '#1b9c8f',
                '#ff6b6b',
                '#c74848',
                '#8269ea',
                '#5941a9'
            ],
            borderWidth: 0,
            borderRadius: 5
        }]
    };

    // Sales Chart
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    new Chart(salesCtx, {
        type: 'line',
        data: salesData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#d0d0d0'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#d0d0d0'
                    }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        color: '#ff6b6b'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#d0d0d0'
                    }
                }
            }
        }
    });

    // Equipment Type Chart
    const equipmentCtx = document.getElementById('equipmentTypeChart').getContext('2d');
    new Chart(equipmentCtx, {
        type: 'doughnut',
        data: equipmentData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#d0d0d0',
                        padding: 10
                    }
                }
            },
            cutout: '60%'
        }
    });

    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    let isDarkMode = true;

    themeToggle.addEventListener('click', function() {
        isDarkMode = !isDarkMode;
        if (isDarkMode) {
            document.documentElement.style.setProperty('--bg-color', '#1e2130');
            document.documentElement.style.setProperty('--card-bg', '#2a2e43');
            document.documentElement.style.setProperty('--text-color', '#ffffff');
            document.documentElement.style.setProperty('--border-color', '#3d4157');
            themeToggle.innerHTML = '<span class="icon">🌙</span>';
        } else {
            document.documentElement.style.setProperty('--bg-color', '#f5f5f7');
            document.documentElement.style.setProperty('--card-bg', '#ffffff');
            document.documentElement.style.setProperty('--text-color', '#333333');
            document.documentElement.style.setProperty('--border-color', '#e0e0e0');
            themeToggle.innerHTML = '<span class="icon">☀️</span>';
        }
    });

    // Sample inventory database
    const inventory = [
        { id: 1, category: 'Microphones', name: 'SM58 Vocal Microphone', price: 99.99, stock: 12, sales: 8 },
        { id: 2, category: 'Microphones', name: 'Beta 87A Condenser Mic', price: 249.99, stock: 5, sales: 3 },
        { id: 3, category: 'Microphones', name: 'AT2020 Studio Microphone', price: 149.99, stock: 7, sales: 4 },
        { id: 4, category: 'Transmitters', name: 'ULX Wireless System', price: 599.99, stock: 3, sales: 2 },
        { id: 5, category: 'Transmitters', name: 'QLX-D Digital System', price: 899.99, stock: 4, sales: 1 },
        { id: 6, category: 'Headphones', name: 'HD 280 Pro', price: 99.99, stock: 15, sales: 7 },
        { id: 7, category: 'Headphones', name: 'MDR-7506 Professional', price: 129.99, stock: 10, sales: 6 },
        { id: 8, category: 'Speakers', name: 'EON615 Powered Speaker', price: 499.99, stock: 6, sales: 3 },
        { id: 9, category: 'Speakers', name: 'K12 Powered Speaker', price: 549.99, stock: 4, sales: 2 },
        { id: 10, category: 'Cables', name: 'XLR Cable 25ft', price: 29.99, stock: 40, sales: 15 },
        { id: 11, category: 'Accessories', name: 'Microphone Stand', price: 39.99, stock: 30, sales: 12 },
        { id: 12, category: 'Accessories', name: 'Pop Filter', price: 19.99, stock: 25, sales: 10 }
    ];

    // This could be expanded with more functionality for inventory management
    window.showInventory = function(category) {
        console.log(`Showing inventory for ${category}`);
        // This would filter and display inventory items based on the category
        const filteredItems = inventory.filter(item => item.category === category);
        console.table(filteredItems);
        // In a real application, this would populate a modal or page with the data
    };

    // Adding click events to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const title = card.querySelector('h2').textContent;
        card.addEventListener('click', () => {
            window.showInventory(title);
        });
    });
}); 