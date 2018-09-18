const UserModel = require('../models/user')
const tool = require("../libs/tool.js");
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
    const users = await UserModel.find({})
    await ctx.render('userlist', {
      title: '用户列表',
      users
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
  }
}
