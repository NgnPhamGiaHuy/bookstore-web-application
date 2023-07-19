class CalculateTotal {
    async calculateTotalQuantity(cartItems) {
        let totalQuantity = 0;
        for (const cartItem of cartItems) {
            totalQuantity += cartItem.quantity;
        }
        return totalQuantity;
    }


    async calculateSubtotalAndTotal(cartItems) {
        let total = 0;
        let subtotal = 0;

        for (const cartItem of cartItems) {
            if (cartItem.book.sale_price > 0) {
                cartItem.subtotal = cartItem.book.sale_price * cartItem.quantity;
                subtotal += cartItem.subtotal;
                total += cartItem.subtotal;
            } else {
                cartItem.subtotal = cartItem.book.price * cartItem.quantity;
                subtotal += cartItem.subtotal;
                total += cartItem.subtotal;
            }
        }

        return {
            subtotal: subtotal.toFixed(2), total: total.toFixed(2),
        };
    }
}

module.exports = new CalculateTotal();