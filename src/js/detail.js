

// jQuery 的入口函数
$(function () {

    
    let info = null
  
    
    const id = getCookie('goods_id')
  
    getGoodsInfo()
    async function getGoodsInfo() {
      const goodsInfo = await $.get('/yt/getGoodsInfo.php', { goods_id: id }, null, 'json')
  
  
      bindHtml(goodsInfo.info)
  
      info = goodsInfo.info
    }
  
    function bindHtml(info) {
      console.log(info)
  
      $('.enlargeBox').html(`
        <div class="show">
          <img src="../images/show.jpg" alt="">
        </div>
        <div class="list">
          <p class="active">
            <img src="../images/small.jpg" alt="">
          </p>
        </div>
      `)
  
      $('.goodsInfo').html(`
        <p class="desc">星座经典 - 经典11支星座守护色 </p>
       <h3> ·此款产品为预售商品，预计发货时间为12月3日，详情可于下单前联系在线客服，敬请谅解。</h3>
        <div class="btn-group size">
          <h6>服务承诺：官方正品   免邮配送   同城速递</h6>
        </div>
        <p class="price">
           价格:￥<span class="text-danger">${ info.goods_price }</span>
        </p>
       
        <div class="num">
        <input type="text" value="1" class="cartNum">
        <button class="addNum">+</button>
        <button class="subNum">-</button>
        </div>
        <div>
          <button class="btn btn-success addCart">加购物车</button>
          <button class="btn btn-warning continue"><a href="../pages/gouwuche.html">立即购买</a></button>
        </div>
      `)
    }
  
    $('.goodsInfo').on('click', '.addCart', function () {
 
      const cart = JSON.parse(window.localStorage.getItem('cart')) || []

      const flag = cart.some(item => item.goods_id === id)
      if (flag) {
   
        const cart_goods = cart.filter(item => item.goods_id === id)[0]
        cart_goods.cart_number = cart_goods.cart_number - 0 + ($('.cartNum').val() - 0)
      } else {
        info.cart_number = 1
    
        cart.push(info)
      }
  
      window.localStorage.setItem('cart', JSON.stringify(cart))
    })

    $('.goodsInfo')
      .on('click', '.subNum', function () {
    
        let num = $('.cartNum').val() - 0
 
        if (num === 1) return
     
        $('.cartNum').val(num - 1)
      })
      .on('click', '.addNum', function () {
  
        let num = $('.cartNum').val() - 0
    
        $('.cartNum').val(num + 1)
      })
  })
  
