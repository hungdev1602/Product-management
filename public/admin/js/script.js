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

    if(status === 'delete'){
      const isConfirm = confirm("Bạn có chắc chắn muốn xoá những bản ghi này không?")
      if(!isConfirm){
        return;
      }
    }
    
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
      return;
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

// Tính năng khôi phục sản phẩm ở trang thùng rác
const buttonRestore = document.querySelectorAll("[button-restore]")
if(buttonRestore.length > 0){
  buttonRestore.forEach(button => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn chắc chắn muốn khôi phục bản ghi này chứ")
      if(isConfirm){
        const id = button.getAttribute("button-restore")
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
// Hết Tính năng khôi phục sản phẩm ở trang thùng rác

// Tính năng xoá vĩnh viễn ở sản phẩm ở trang thùng rác
const buttonDeletePermanently = document.querySelectorAll("[button-delete-permanently]")
if(buttonDeletePermanently.length > 0){
  buttonDeletePermanently.forEach(button => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn chắc chắn muốn xoá sản phẩm này vĩnh viễn? Sẽ không khôi phục được!")
      if(isConfirm){
        const id = button.getAttribute("item-id")
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
            if(data.code === "success"){
              location.reload()
            }
          })
      }
    })
  })
}
// Hết Tính năng xoá vĩnh viễn ở sản phẩm ở trang thùng rác

// Tính năng thay đổi vị trí sản phẩm
const listInputChangePosition = document.querySelectorAll("[input-change-position]")
if(listInputChangePosition.length > 0){
  listInputChangePosition.forEach(input => {
    input.addEventListener("change", () => {
      const id = input.getAttribute("item-id")
      const position = input.value;
      const path = input.getAttribute("data-path")

      const data = {
        id: id,
        position: position
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
// Hết Tính năng thay đổi vị trí sản phẩm

// Tắt thông báo alert message sau 3s
const alertMessage = document.querySelector("[alert-message]")
if(alertMessage){
  setTimeout(() => {
    alertMessage.style.display = "none"
  }, 3000)
}
// Hết Tắt thông báo alert message sau 3s

// Tính năng preview ảnh
const uploadImage = document.querySelector("[upload-image]")
if(uploadImage){
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]")
  const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]")
  const buttonClose = uploadImage.querySelector(".image-close")

  uploadImageInput.addEventListener("change", () => {
    const [file] = uploadImageInput.files
    if(file){
      uploadImagePreview.src = URL.createObjectURL(file)
      buttonClose.style.display = "inline-block"
    }
  })

  buttonClose.addEventListener("click", () => {
    uploadImageInput.value = ""
    uploadImagePreview.src = ""
    buttonClose.style.display = "none"
  })
}
// Hết Tính năng preview ảnh

// Tính năng sắp xếp theo nhiều tiêu chí
const sortSelect = document.querySelector("[sort-select]");
if(sortSelect){
  const url = new URL(location.href); //Nhân bản URL
  sortSelect.addEventListener("change", () => {
    const value = sortSelect.value;
    
    if(value){
      const [sortKey, sortValue] = value.split("-");
      url.searchParams.set("sortKey", sortKey);
      url.searchParams.set("sortValue", sortValue);
    }
    else{
      url.searchParams.delete("sortKey");
      url.searchParams.delete("sortValue");
    }

    location.href = url.href;
  })

  const sortKeyCurrent = url.searchParams.get("sortKey");
  const sortValueCurrent = url.searchParams.get("sortValue");
  if(sortKeyCurrent && sortValueCurrent){
    sortSelect.value = `${sortKeyCurrent}-${sortValueCurrent}`
  }
}
// Hết Tính năng sắp xếp theo nhiều tiêu chí

// Phân quyền
const tablePermissions = document.querySelector("[table-permissions]");
if(tablePermissions){
  const buttonSubmit = document.querySelector("[button-submit]");
  buttonSubmit.addEventListener("click", () => {
    const dataFinal = [];

    const listElementRoleId = document.querySelectorAll("[role-id]");
    listElementRoleId.forEach((elementRoleId) => {
      const roleId = elementRoleId.getAttribute("role-id");
      const permissions = [];

      const listInputChecked = document.querySelectorAll(`input[data-id="${roleId}"]:checked`);
      listInputChecked.forEach(input => {
        const tr = input.closest(`tr[data-name]`);
        const name = tr.getAttribute("data-name");
        permissions.push(name)
      })

      dataFinal.push({
        id: roleId,
        permissions: permissions
      })
    })

    const path = buttonSubmit.getAttribute("data-path")

    fetch(path, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(dataFinal)
    })
      .then(res => res.json())
      .then(data => {
        if(data.code === "success"){
          location.reload()
        }
      })
  })

  // Hiển thị mặc định
  let dataPermissions = tablePermissions.getAttribute("table-permissions");
  dataPermissions = JSON.parse(dataPermissions)
  dataPermissions.forEach(item => {
    item.permissions.forEach(permission => {
      const input = document.querySelector(`tr[data-name="${permission}"] input[data-id="${item._id}"]`);
      input.checked = true;
    })
  })
}
// Hết Phân quyền

// Đổi trạng thái trang danh mục sản phẩm
const buttonChangeStatusCategory = document.querySelectorAll("[button-change-status-category]");
if(buttonChangeStatusCategory){
  buttonChangeStatusCategory.forEach(button => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      const status = button.getAttribute("button-change-status-category");
      const path = button.getAttribute("data-path");
      
      const data = {
        id: id,
        status: status
      };

      fetch(path, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(data => {
          if(data.code === 200){
            location.reload();
          }
        })
    })
  })
}
// Hết Đổi trạng thái trang danh mục sản phẩm

// Thay đổi thứ tự cho trang danh mục sản phẩm
const listProductCategoryChangePosition = document.querySelectorAll("[product-category-change-position]");
if(listProductCategoryChangePosition){
  listProductCategoryChangePosition.forEach(input => {
    input.addEventListener("change", () => {
      const id = input.getAttribute("data-id");
      const position = input.value;

      const path = input.getAttribute("data-path");

      const data = {
        id: id,
        position: position
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
          if(data.code === 200){
            location.reload();
          }
        })
    })
  })
}
// Hết Thay đổi thứ tự cho trang danh mục sản phẩm

// Xoá sản phẩm trang danh mục sản phẩm
const buttonDeleteCategory = document.querySelectorAll("[button-delete-category]");
if(buttonDeleteCategory){
  buttonDeleteCategory.forEach(button => {
    button.addEventListener("click", () => {
      const isConfirm = confirm(`Bạn có chắc muốn xoá bản ghi này?`)

      if(isConfirm){
        const id = button.getAttribute("item-id");
        const path = button.getAttribute("data-path");

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
            if(data.code === 200){
              location.reload();
            }
          })
      }
    })
  })
}
// Hết Xoá sản phẩm trang danh mục sản phẩm

// Khôi phục bản ghi danh mục sản phẩm trong thùng rác
const buttonRestoreCategory = document.querySelectorAll("[button-restore-category]");
if(buttonRestoreCategory){
  buttonRestoreCategory.forEach(button => {
    button.addEventListener("click", () => {
      const isConfirm = confirm(`Bạn có chắc muốn hồi phục lại bản ghi này chứ?`)
      if(isConfirm){
        const id = button.getAttribute("button-restore-category")
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
            if(data.code === 200){
              location.reload();
            }
          })
        }
    })
  })
}
// Hết Khôi phục bản ghi danh mục sản phẩm trong thùng rác

// Xoá vĩnh viễn bản ghi trong danh mục sản phẩm trang thùng rác
const buttonPermanentlyDeleteCategory = document.querySelectorAll("[button-permanently-delete-category]");
if(buttonPermanentlyDeleteCategory){
  buttonPermanentlyDeleteCategory.forEach(button => {
    button.addEventListener("click", () => {
      const isConfirm = confirm(`Bạn có chắc chắn muốn xoá bản ghi này VĨNH VIỄN?`)
      if(isConfirm){
        const id = button.getAttribute("button-permanently-delete-category");
        const path = button.getAttribute("data-path");

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
              location.reload();
            }
          })
        }
    })
  })
}
// Hết Xoá vĩnh viễn bản ghi trong danh mục sản phẩm trang thùng rác

// Xoá nhóm quyền
const buttonDeleteRole = document.querySelectorAll("[button-delete-role]");
if(buttonDeleteRole){
  buttonDeleteRole.forEach((button) => {
    button.addEventListener("click", () => {
      const isConfirm = confirm(`Bạn có chắc muốn xoá quyền này vĩnh viễn?`)
      if(isConfirm){
        const id = button.getAttribute("data-id")
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
      }
    })
  })
}
// Hết Xoá nhóm quyền