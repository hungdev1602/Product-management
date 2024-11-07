const cartTable = document.querySelector("[cart-table]")
if(cartTable){
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
}