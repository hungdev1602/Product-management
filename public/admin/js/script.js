// Bộ lọc
const boxFilter = document.querySelector("[box-filter]")
if(boxFilter){
  let url = new URL(location.href); //Nhân bản url

  // bắt sự kiện onChange
  boxFilter.addEventListener("change", () => {
    const value = boxFilter.value

    if(value){
      url.searchParams.set("status", value)
    }
    else if(value === ""){
      url.searchParams.delete("status")
    }
    
    // có 2 cách để chuyển hướng
    // cách 1
    // window.location.href = url

    // cách 2
    location.href = url
  })

  // Hiển thị lựa chọn mặc định sau khi load trang
  // mặc định nó hiện thị cái đầu, nếu đã chọn Hoạt Động hoặc Dừng hoạt động thì những lần đó mặc định là cái đầu
  // thì lúc này change nó ko dc 
  const statusCurrent = url.searchParams.get("status")
  if(statusCurrent){
    boxFilter.value = statusCurrent
  }
}
// Hết bộ lọc

// Tìm kiếm
const formSearch = document.querySelector("[form-search]")
if(formSearch){
  let url = new URL(location.href); //Nhân bản url
  formSearch.addEventListener("submit", (event) => {
    event.preventDefault()

    const value = event.target.keyword.value
    if(value){
      url.searchParams.set("keyword", value)
    }
    else{
      url.searchParams.delete("keyword")
    }

    location.href = url
  })

  // Hiển thị từ khoá tìm kiếm mặc định (nếu người dùng đã search)
  if(url.searchParams.get("keyword")){
    formSearch.keyword.value = url.searchParams.get("keyword")
  }
}
// Hết Tìm kiếm

// Phân trang
const listButtonPagination = document.querySelectorAll("[button-pagination]")
if(listButtonPagination.length > 0){
  let url = new URL(location.href); //Nhân bản url
  listButtonPagination.forEach(button => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination")
      
      if(page){
        url.searchParams.set("page", page)
      }
      else{
        url.searchParams.delete("page")
      }

      location.href = url.href
    })
  })

  // Hiển thị nút trang active mặc định
  const pageCurrent = url.searchParams.get("page") || 1; //Nếu ko có sẽ lấy 1, hiển thị trang 1 active mặc định
  const buttonCurrent = document.querySelector(`[button-pagination="${pageCurrent}"]`)
  if(buttonCurrent){
    buttonCurrent.parentNode.classList.add("active")
  }
}
// Hết Phân trang

// Thay đổi trạng thái sản phẩm
const listButtonChangeStatus = document.querySelectorAll("[button-change-status]")
if(listButtonChangeStatus.length > 0){
  listButtonChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const itemId = button.getAttribute("item-id")
      const statusChange = button.getAttribute("button-change-status")
      const path = button.getAttribute("data-path")

      const data = {
        id: itemId,
        status: statusChange
      }

      fetch(path, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(data => {
          if(data.code === "success"){
            location.reload()
          }
        })
    })
  })
}
// Hết Thay đổi trạng thái sản phẩm

// Thay đổi trạng thái cho NHIỀU bản ghi
const formChangeMulti = document.querySelector("[form-change-multi]")
if(formChangeMulti){
  formChangeMulti.addEventListener("submit", (event) => {
    event.preventDefault();
    const path = formChangeMulti.getAttribute("data-path")
    // trạng thái cần đổi
    const status = formChangeMulti.status.value
    
    // tạo mảng lưu các id sản phẩm muốn đổi
    const ids = []
    
    // Lấy ra các ô input đã check
    const listInputChange = document.querySelectorAll("[input-change]:checked")
    if(listInputChange.length > 0){
      listInputChange.forEach(input => {
        const id = input.getAttribute("input-change")
        ids.push(id)
      })
    }
    else{
      return
    }
    const data = {
      ids: ids,
      status: status
    }

    fetch(path, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => {
        if(data.code === "success"){
          location.reload()
        }
      })
  })
}
// Hết Thay đổi trạng thái cho NHIỀU bản ghi

// Tính năng xoá bản ghi
const listButtonDelete = document.querySelectorAll("[button-delete]")
if(listButtonDelete.length > 0){
  listButtonDelete.forEach(button => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn có chắc muốn xoá bản ghi này?")
      if(isConfirm){
        const id = button.getAttribute("item-id")
        const path = button.getAttribute("data-path")
        
        fetch(path, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "PATCH",
          body: JSON.stringify({
            id: id
          })
        })
          .then(res => res.json())
          .then(data => {
            if(data.code === "success"){
              location.reload()
            }
          })
      }
    })
  })
}
// Hết Tính năng xoá bản ghi