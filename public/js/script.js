const cartTable = document.querySelector("[cart-table]")
if(cartTable){
  // Xoá sản phẩm ở giỏ hàng
  const listDeleteFromCart = cartTable.querySelectorAll("[delete-from-cart]")
  listDeleteFromCart.forEach(button => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("delete-from-cart")
      const path = button.getAttribute("data-path")
      
      fetch(path, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
        body: JSON.stringify({
          id: id
        })
      })
        .then(res => res.json())
        .then(data => {
          if(data.code === 200){
            location.reload()
          }
        })
    })
  })
  // Hết Xoá sản phẩm ở giỏ hàng

  // Cập nhật số lượng sản phẩm ở giỏ hàng
  const listChangeQuantity = cartTable.querySelectorAll("input[name='quantity']")
  listChangeQuantity.forEach(input => {
    input.addEventListener("change", () => {
      const quantity = input.value
      const productId = input.getAttribute("item-id")
      const path = input.getAttribute("data-path")

      fetch(path, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({
          productId: productId,
          quantity: quantity
        })
      })
        .then(res => res.json())
        .then(data => {
          if(data.code === 200){
            location.reload()
          }
        })
    })
  })
  // Hết Cập nhật số lượng sản phẩm ở giỏ hàng
}