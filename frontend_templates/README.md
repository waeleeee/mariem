# Radio Equipment Sales Dashboard

A responsive dashboard for tracking sales and inventory of radio equipment like microphones, transmitters, headphones, speakers, cables, and accessories.

## Features

- Overview of equipment by category
- Sales trends visualization for the last 7 days
- Equipment type distribution chart
- Light/dark mode toggle
- Responsive design for desktop and mobile
- Sample inventory database

## How to Use

1. Simply open the `index.html` file in any modern web browser
2. Click on any card to see the inventory details for that category in the console (in a real application, this would open a detailed view)
3. Toggle between dark and light mode using the moon/sun icon in the top bar

## Customization

### Adding Real Data

To replace the sample data with your actual inventory:

1. Edit the `inventory` array in `script.js`
2. Update the chart data in the `salesData` and `equipmentData` variables

### Adding New Features

- **Inventory Management**: Expand the `showInventory` function in `script.js` to display detailed inventory views or create forms for adding/editing items
- **User Authentication**: Add login functionality for different user roles
- **Order Processing**: Implement sales order creation and tracking
- **Supplier Management**: Add functionality to track suppliers and orders

## Technologies Used

- HTML5
- CSS3 with CSS Variables for theming
- Vanilla JavaScript
- Chart.js for data visualization

## Browser Compatibility

This dashboard works in all modern browsers:
- Chrome
- Firefox
- Safari
- Edge 