// jQuery 的入口函数
$(function () {

    const nickname = getCookie('nickname')
  
    if (nickname) {
      $('.off').addClass('hide')
      $('.on').removeClass('hide').text(`欢迎您: ${nickname}`)
    } else {
      $('.off').removeClass('hide')
      $('.on').addClass('hide')
    }
  })
  

  

  const ul = document.querySelector('.sou')


  const inp = document.querySelector('input')
  inp.addEventListener('input', function () {
    const value = this.value.trim()
    if (!value) return

   
    const script = document.createElement('script')
 
    const url = `https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&sugsid=1446,32857,33124,33061,32973,33099,33101,32962,22159&wd=${value}&req=2&csor=1&cb=bindHtml&_=1605768936993`
    script.src = url
    // 把 script 标签插入到页面里面
    document.body.appendChild(script)
    
    script.remove()
    if (ul.innerHtml == null) ul.classList.remove('active')
  })

  // 全局准备一个 jsonp 的处理函数
  function bindHtml(res) {

    if (!res.g) {
      ul.classList.remove('active')
      return
    }

  
    let str = ''

    for (let i = 0; i < res.g.length; i++) {
      str += `
        <li>${ res.g[i].q }</li>
      `
    }

    ul.innerHTML = str
    
    ul.classList.add('active')
  }
