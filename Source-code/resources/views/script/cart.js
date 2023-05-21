async function confirmRemoveCartItem(cartId, cartItemId) {
    const confirmed = confirm('Are you sure you want to remove this item from the cart?');

    if (confirmed) {
        try {
            const response = await fetch(`/story-sells/cart/remove/${cartItemId}`, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();

                if (data.success) {
                    // Item removed successfully, you can reload the cart page or update the cart dynamically
                    location.reload();
                } else {
                    throw new Error('Failed to remove cart item');
                }
            } else {
                throw new Error('Failed to remove cart item');
            }
        } catch (error) {
            console.error(error);
        }
    }
}

async function updateCartItemQuantity(cartItemId, quantity) {
    try {
        const response = await fetch(`/story-sells/cart/update/${cartItemId}`, {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify({quantity}),
        });

        if (response.ok) {
            const data = await response.json();

            if (data.success) {
                const subtotalElement = document.getElementById('subtotal');
                const totalElement = document.getElementById('total');
                subtotalElement.textContent = data.subtotal;
                totalElement.textContent = data.total;

                const quantityElement = document.getElementById(`quantity_${cartItemId}`);
                quantityElement.value = quantity;
                await updateSubtotalAndTotal();
            } else {
                throw new Error('Failed to update cart item quantity.');
            }
        } else {
            throw new Error('Request failed.');
        }
    } catch (error) {
        console.error(error);
    }
}


async function decreaseQuantityCartItem(cartId, cartItemId) {
    try {
        const response = await fetch(`/story-sells/cart/decrease/${cartItemId}`, {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();

            if (data.success) {
                const quantityElement = document.getElementById(`quantity_${cartItemId}`);
                let quantity = parseInt(quantityElement.value);

                if (quantity > 1) {
                    quantity--;
                    quantityElement.value = quantity;
                    await updateCartItemQuantity(cartItemId, quantity);
                }
                await updateSubtotalAndTotal();
            } else {
                throw new Error('Failed to decrease cart item quantity.');
            }
        } else {
            throw new Error('Request failed.');
        }
    } catch (error) {
        console.error(error);
    }
}

async function increaseQuantityCartItem(cartId, cartItemId) {
    try {
        const response = await fetch(`/story-sells/cart/increase/${cartItemId}`, {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();

            if (data.success) {
                const quantityElement = document.getElementById(`quantity_${cartItemId}`);
                let quantity = parseInt(quantityElement.value);

                if (quantity < 999) {
                    quantity++;
                    quantityElement.value = quantity;
                    await updateCartItemQuantity(cartItemId, quantity);
                } else {
                    throw new Error("Too much book quantity");
                }
                await updateSubtotalAndTotal();
            } else {
                throw new Error('Failed to increase cart item quantity.');
            }
        } else {
            throw new Error('Request failed.');
        }
    } catch (error) {
        console.error(error);
    }
}

async function updateSubtotalAndTotal() {
    try {
        const cartItems = document.querySelectorAll('.main__cart-content-table-product');
        let subtotal = 0;
        let totalQuantity = 0;

        for (const cartItem of cartItems) {
            const quantityElement = cartItem.querySelector('.main__book-product-form-quantity-added-input');
            const quantity = parseInt(quantityElement.value);
            const priceElement = cartItem.querySelector('.main__cart-content-table-product-price-amount');
            const price = parseFloat(priceElement.textContent.replace(/\$/g, ''));
            const subtotalElement = cartItem.querySelector('.main__cart-content-table-product-subtotal .main__cart-content-table-product-price-amount');

            const newSubtotal = price * quantity;
            subtotalElement.textContent = `$${newSubtotal.toFixed(2)}`;

            subtotal += newSubtotal;
            totalQuantity += quantity;
        }

        const subtotalElement = document.getElementById('subtotal');
        const totalElement = document.getElementById('total');
        subtotalElement.textContent = `${subtotal.toFixed(2)}`;
        totalElement.textContent = `${subtotal.toFixed(2)}`;

    } catch (error) {
        console.error(error);
    }
}
