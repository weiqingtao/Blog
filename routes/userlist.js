const UserModel = require('../models/user')
const tool = require("../libs/tool.js");
const xlsx = require('node-xlsx');
const fs = require("fs");
module.exports = {
  async create(ctx, next) {
    if (ctx.method === 'GET') {
      await ctx.render('create_user', {
        title: '新建用户'
      })
      return
    }
    let {
      name,
      email,
      password,
      repassword
    } = ctx.request.body
    let errMsg = ''
    if (name === '') {
      errMsg = '用户名不能为空'
    } else if (email === '') {
      errMsg = '邮箱不能为空'
    } else if (password === '') {
      errMsg = '密码不能为空'
    } else if (repassword === '') {
      errMsg = '确认密码不能为空'
    } else if (password != repassword) {
      errMsg = '两次输入的密码不一致'
    }

    let userIsExist = await UserModel.findOne({name});
    if(userIsExist){
      errMsg = '该用户名已被注册'
    }
    if (errMsg) {
      ctx.flash = {
        warning: errMsg
      }
      ctx.redirect('/user/new')
      return
    }
    password = tool.getMd5(password)
    let user = {name:name,password:password,email:email}
    await UserModel.create(user);
    ctx.redirect('/userlist');
  },
  async list(ctx, next) {
    const pageSize = 5
    const cname = 'd';
    const currentPage = parseInt(ctx.query.page) || 1
    const allPostsCount = await UserModel.find({}).count()
    const pageCount = Math.ceil(allPostsCount / pageSize)
    const pageStart = currentPage - 2 > 0 ? currentPage - 2 : 1
    const pageEnd = pageStart + 4 >= pageCount ? pageCount : pageStart + 4
    const users = await UserModel.find({}).sort({ _id: -1 }).skip((currentPage - 1) * pageSize).limit(pageSize)
    const baseUrl = cname ? `${ctx.path}?c=${cname}&page=` : `${ctx.path}?page=`
    await ctx.render('userlist', {
      title: '用户列表',
      users,
      pageSize,
      currentPage,
      allPostsCount,
      pageCount,
      pageStart,
      baseUrl,
      pageEnd
    })
  },
  // TODO
  // async edit (ctx, next) {
  //   if (ctx.method === 'GET') {
  //     const category = await CategoryModel.findById(ctx.params.id)
  //     await ctx.render('create_category', {
  //       title: '编辑分类',
  //       category
  //     })
  //   }
  // },
  async destroy(ctx, next) {
    const cid = ctx.params.id
    if (cid.length !== 24) {
      ctx.throw(404, '用户不存在')
    }
    const user = await UserModel.findById(cid)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    await UserModel.findByIdAndRemove(cid)
    ctx.flash = {
      success: '删除用户成功'
    }
    ctx.redirect('/userlist')
  },
  async edit(ctx,next) {
    const id = ctx.params.id
    let userdata = await UserModel.findById(id);
    if(ctx.method === 'GET'){
      await ctx.render("edituser",userdata);
      return;
    }
    let editdata = ctx.request.body;
    let edit = await UserModel.findByIdAndUpdate(id,editdata);
    if(edit){
      ctx.flash = {
        success: '修改用户成功'
      }
      ctx.redirect('/userlist')
    }else{
      ctx.throw('修改失败')
    }

  },
  async exportExcel(ctx, next) {
    let userdata = await UserModel.find({});
    let alldata = [];
    let row = ['id','姓名','邮箱','是否管理员'];
    alldata.push(row)
    for (let key in userdata) {
      let arr = [];
      arr.push(userdata[key].id);
      arr.push(userdata[key].name);
      arr.push(userdata[key].email);
      arr.push(userdata[key].isAdmin);
      
      alldata.push(arr)
    }
      var buffer = xlsx.build([{
<<<<<<< HEAD
        name: "data",
=======
        name: "mySheetName",
>>>>>>> f507bcc92d64915647a85facb9f5916120524b86
        data: alldata
      }]);
    fs.writeFileSync('./test.xlsx', buffer);
    ctx.flash = {
      success: '导出成功'
    };
    ctx.redirect('/userlist')
  }

}
