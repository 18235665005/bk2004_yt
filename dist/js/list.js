$(function () {

    let list = null
  
    //  准备一个对象
    const list_info = {
      cat_one: 'all',
      cat_two: 'all',
      cat_three: 'all',
      sort_method: '综合',
      sort_type: 'ASC',
      current: 1,
      pagesize: 12
    }
  
    //  请求一级分类列表
    getCateOne()
    async function getCateOne() {
      const cat_one_list = await $.get('/yt/getCateOne.php', null, null, 'json')
      let str = `<span data-type="all" class="active">全部</span>`
  
      cat_one_list.list.forEach(item => {
        str += `
          <span data-type="${ item.cat_one_id }">${ item.cat_one_id }</span>
        `
      })
  
      $('.cateOneBox > .right').html(str)
    }
  
    // 请求二级分类列表
    async function getCateTwo() {
      const cate_two_list = await $.get('/yt/getCateTwo.php', { cat_one: list_info.cat_one }, null, 'json')
      let str = '<span data-type="all" class="active">全部</span>'
      cate_two_list.list.forEach(item => {
        str += `<span data-type="${ item.cat_two_id }">${ item.cat_two_id }</span>`
      })
      $('.catTwoBox .right').html(str)
  
    }
  
    // 请求三级分类列表
    async function getCateThree() {
      const cate_three_list = await $.get('/yt/getCateThree.php', { cat_one: list_info.cat_one, cat_two: list_info.cat_two }, null, 'json')
      let str = '<span data-type="all" class="active">全部</span>'
      cate_three_list.list.forEach(item => {
        str += `<span data-type="${ item.cat_three_id }">${ item.cat_three_id }</span>`
      })
      $('.catThreeBox .right').html(str)
  
    }
  
    //  请求总页数, 回来渲染分页器
    getTotalPage()
    async function getTotalPage() {
      const totalInfo = await $.get('/yt/getTotalPage.php', list_info, null, 'json')
  
      // 渲染分页内容
      // jquery-pagination 插件
      $('.pagination').pagination({
        pageCount: totalInfo.total,
        callback (index) {
          list_info.current = index.getCurrent()
          // 从新请求商品列表
          getGoodsList()
        }
      })
    }
  
    //  请求商品列表数据
    getGoodsList()
    async function getGoodsList() {
    //    请求商品列表
      const goodsList = await $.get('/yt/getGoodsList.php', list_info, null, 'json')
  
      // 给全局变量 list 进行赋值
      list = goodsList.list
  
      // 渲染页面
      let str = ''
      goodsList.list.forEach(item => {
        str += `
          <li class="thumbnail">
            <img src="${ item.goods_big_logo }" alt="...">
            <div class="caption">
              <h3 data-id="${ item.goods_id }">${ item.goods_name }</h3>
              <p class="price">￥
                <span class="text-danger">${ item.goods_price }</span>
                <span> ID: ${ item.goods_id } </span>
              </p>
              <p>
                <a href="javascript:;" class="btn btn-danger addCart" role="button" data-id="${ item.goods_id }">加入购物车</a>
                <a href="./gouwuche.html" class="btn btn-warning" role="button">去结算</a>
              </p>
            </div>
          </li>
        `
      })
      $('.goodsList > ul').html(str)
    }
  
    // 一级分类的点击事件
    //  事件委托的形式进行事件绑定
    $('.cateOneBox').on('click', 'span', function () {
      //  操作类名
      $(this).addClass('active').siblings().removeClass('active')
  
      //  拿到你点击的是哪一个
      const type = $(this).data('type')
  
      //  只要一级分类进行切换, 修改二级分类为 all
      //  只要一级分类进行切换, 修改三级分类为 all
      list_info.cat_two = 'all'
      list_info.cat_three = 'all'
      // 让当前页回到第一页
      list_info.current = 1
  
      //  修改 list_info
      list_info.cat_one = type
      // 从新渲染分类信息和列表数据
      getTotalPage()
      getGoodsList()
      $('.catThreeBox .right').html('<span data-type="all" class="active">全部</span>')
  
      //  判断 type 是否为 all 信息
      if (type === 'all') {
        // 让二级列表回到 全部 状态
        // 改变结构
        $('.catTwoBox .right').html('<span data-type="all" class="active">全部</span>')
      } else {
        // 根据一级分类 请求 二级分类列表 渲染
        getCateTwo()
      }
    })
  
    // 二级分类的点击事件
    // 事件委托的形式进行事件绑定
    $('.catTwoBox').on('click', 'span', function () {
      const type = $(this).data('type')
  
      //  切换类名
      $(this).addClass('active').siblings().removeClass('active')
  
      //  切换三级分类
      list_info.cat_three = 'all'
      // 让当前页回到第一页
      list_info.current = 1
  
      //  修改对象信息
      list_info.cat_two = type
      // 从新渲染分类信息和列表数据
      getTotalPage()
      getGoodsList()
  
      // 根据 type 属性决定是否请求三级分类
      if (type === 'all') {
        // 让二级列表回到 全部 状态
        // 改变结构
        $('.catThreeBox .right').html('<span data-type="all" class="active">全部</span>')
      } else {
        // 根据一级分类 请求 二级分类列表 渲染
        getCateThree()
      }
    })
  
    // 三级分类的点击事件
    // 事件委托
    $('.catThreeBox').on('click', 'span', function () {
      const type = $(this).data('type')
  
      $(this).addClass('active').siblings().removeClass('active')
  
      list_info.cat_three = type
      // 让当前页回到第一页
      list_info.current = 1
      getTotalPage()
      getGoodsList()
    })
  
    //  排序方式的点击事件
    $('.sortBox').on('click', 'span', function () {
      // 7-2. 拿到信息
      const method = $(this).attr('data-method')
      const type = $(this).attr('data-type')
  
      //  切换类名
      $(this).addClass('active').siblings().removeClass('active')
  
      // 修改对象信息
      list_info.sort_method = method
      list_info.sort_type = type
  
      //  从新请求
      getTotalPage()
      getGoodsList()
  
      // 修改 data-type 属性
      // 为下一次准备的
      $(this)
        .attr('data-type', type === 'ASC' ? 'DESC' : 'ASC')
        .siblings()
        .attr('data-type', 'ASC')
    })
  
    // 点击跳转到详情页
    $('.goodsList ul').on('click', 'h3', function () {
      const id = $(this).data('id')
      setCookie('goods_id', id)
      window.location.href = './detail.html'
    })
  
    //  加入购物车的操作
    $('.goodsList').on('click', '.addCart', function () {
      const cart = JSON.parse(window.localStorage.getItem('cart')) || []
  
      const id = $(this).data('id')
  
      const flag = cart.some(item => item.goods_id == id)
      if (flag) {
        const cart_goods = cart.filter(item => item.goods_id == id)[0]
        cart_goods.cart_number = cart_goods.cart_number - 0 + 1
      } else {
        const info = list.filter(item => item.goods_id == id)[0]
        info.cart_number = 1
        cart.push(info)
      }
  
     
      window.localStorage.setItem('cart', JSON.stringify(cart))
    })
  
  })
  