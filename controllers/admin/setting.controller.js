const Setting = require("../../models/setting.model")

module.exports.general = async(req, res) => {
  const setting = await Setting.findOne({})

  res.render("admin/pages/settings/general.pug", {
    pageTitle: "Cài đặt chung",
    setting: setting
  })
}

module.exports.generalPatch = async (req, res) => {
  const record = await Setting.findOne({})
  // chỉ lấy ra bản ghi đầu tiên trong database 
  // 1) nếu có rồi thì cập nhật, chứ KHÔNG tạo mới
  // 2) nếu chưa có thì tạo mới và lưu vào database
  if(record){
    await Setting.updateOne({
      _id: record._id
    }, req.body)
    req.flash("success", "Cập nhật thành công")
  }
  else{
    const newRecord = new Setting(req.body)
    await newRecord.save()
    req.flash("success", "Cập nhật thành công")
  }

  res.redirect("back")
}