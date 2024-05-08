document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const rideId = this.getAttribute('data-ride-id');
            addToCart(rideId);
        });
    });

    document.getElementById('addTicketToCart').addEventListener('click', function() {
        const ticketDate = document.getElementById('ticketDate').value;
        if (!ticketDate) {
            alert('Please select a date for your ticket.');
            return;
        }
        addTicketToCart(ticketDate);
    });

    document.getElementById('checkout').addEventListener('click', function() {
        checkoutCart();
    });
});

function addToCart(rideId) {
    fetch('/cart/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ rideId })
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
    })
    .then(data => updateCartDisplay(data.cart))
    .catch(error => console.error('Error adding item to cart:', error));
}


function addTicketToCart(ticketDate) {
    fetch('/tickets/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ date: ticketDate })
    })
    .then(response => response.json())
    .then(data => {
        alert('Ticket added to cart!');
        console.log(data);
    })
    .catch(error => console.error('Error adding ticket to cart:', error));
}

function checkoutCart() {
    fetch('/cart/checkout', { method: 'GET' })
    .then(response => response.text())
    .then(data => alert('Checkout successful!'))
    .catch(error => console.error('Error during checkout:', error));
}

function updateCartDisplay(cart) {
    const cartItemsList = document.getElementById('cart-items');
    cartItemsList.innerHTML = '';
    let totalPrice = 0;
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - £${item.price.toFixed(2)}`;
        cartItemsList.appendChild(li);
        totalPrice += item.price;
    });
    document.getElementById('total-price').textContent = `Total Price: £${totalPrice.toFixed(2)}`;
}
