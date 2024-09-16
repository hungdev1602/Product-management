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