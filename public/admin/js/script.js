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