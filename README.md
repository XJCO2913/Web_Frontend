## web_frontend.xjco2013
![react](https://img.shields.io/badge/React-%20?style=for-the-badge&logo=React&color=blue)
![MUI](https://img.shields.io/badge/MUI-%20?style=for-the-badge&logo=MUI&color=white)
![Vite](https://img.shields.io/badge/VITE-%20?style=for-the-badge&logo=VITE&color=orange)
![lodash](https://img.shields.io/badge/lodash-%20?style=for-the-badge&logo=lodash&color=grey)


SE项目前端仓库

### 项目结构
src文件夹下的具体结构。

#### 1. apis
apis目录用于存放涉及axios会请求的接口，比如高德的获取行政区的接口和后端服务器的接口。
  
```
├── apis  
│   └── index.js （后期所有接口建议写在这个里面集中管理，便于维护）
```
  
#### 2. assets
  
存放静态文件或地区数据要以及icon。（没必要看）  
一些相应没用的文件后面会根据需求具体清理。
  
```
├── assets  
│   ├── data  
│   │   ├── countries.js  
│   │   └── index.js  
│   ├── icons  
│   │   ├── email-inbox-icon.jsx  
│   │   ├── index.js  
│   │   ├── new-password-icon.jsx  
│   │   ├── password-icon.jsx  
│   │   ├── plan-free-icon.jsx  
│   │   ├── plan-premium-icon.jsx  
│   │   ├── plan-starter-icon.jsx  
│   │   └── sent-icon.jsx  
│   ├── illustrations  
│   │   ├── avatar-shape.jsx  
│   │   ├── background-shape.jsx  
│   │   ├── booking-illustration.jsx  
│   │   ├── check-in-illustration.jsx  
│   │   ├── check-out-illustration.jsx  
│   │   ├── coming-soon-illustration.jsx  
│   │   ├── forbidden-illustration.jsx  
│   │   ├── index.js  
│   │   ├── maintenance-illustration.jsx  
│   │   ├── motivation-illustration.jsx  
│   │   ├── order-complete-illustration.jsx  
│   │   ├── page-not-found-illustration.jsx  
│   │   ├── seo-illustration.jsx  
│   │   ├── sever-error-illustration.jsx  
│   │   ├── upgrade-storage-illustration.jsx  
│   │   └── upload-illustration.jsx  
```
  
#### 3. auth
  
处理登陆注册逻辑，例如表单的发送，自定义错误的处理，token持久化，token过期等服务，以及后期的验证第三方登录，验证，都会存放在该目录下集中管理。
  
``` 
├── auth  
│   ├── context  
│   │   └── jwt  
│   │       ├── auth-consumer.jsx  
│   │       ├── auth-context.js  
│   │       ├── auth-provider.jsx （集中处理登陆，注册，验证（未实现））  
│   │       ├── index.js （中转出口）  
│   │       └── utils.js （token存储，持久化，过期，服务于auth-provider）  
│   └── hooks  
│       ├── index.js  
│       └── use-auth-context.js  
```
  
#### 4. components
  
封装了具体会用到的组件，比如注册模块使用到的级联表，使用react hook form封装过后的选择器，text filed等，在后续会将所有用到的组件集中封装在components里。这个部分在后面写主界面可能还会频繁要去模版库里面调，调完记得更新文档，然后看下里面在说什么，写好readme！！！
  
```
├── components  
│   ├── city-cascader   
│   │   ├── city-cascader.jsx （注册时region选择的区域的组件具体实现）  
│   │   ├── index.js （中转出口）  
│   │   └── utils.js （主要获取行政区的两个fetch函数，服务于city-cascader）  
│   ├── hook-form （MUI自己封装好的组件，后期需要自己去template调，现在只调了需要的，除非业务需要，不然不涉及修改，建议直接用）  
│   │   ├── form-provider.jsx   
│   │   ├── index.js  
│   │   ├── rhf-select.jsx  
│   │   └── rhf-text-field.jsx  
│   ├── iconify  （MUI自己封装好的组件，不建议修改，主要涉及icon动画，无需看懂）  
│   │   ├── iconify.jsx  
│   │   └── index.js  
│   ├── loading-screen （MUI自己封装好的组件，不建议修改，主要涉及加载动画的实现）  
│   │   ├── index.js  
│   │   ├── loading-screen.jsx  
│   │   └── splash-screen.jsx  
│   ├── logo  （MUI自己封装好的组件，不建议修改，主要涉及渲染logo）  
│   │   ├── index.js  
│   │   └── logo.jsx  
│   └── settings （MUI自己封装好的组件，设计主题选择，我也没仔细看建议后面研究）  
│       ├── context  
│       │   ├── index.js  
│       │   ├── settings-context.js  
│       │   └── settings-provider.jsx  
│       └── index.js  
```
  
#### 5. hooks
  
主要涉及自定的hooks，MUI自己封装好的，主要会调就可以了，最好清楚每个钩子怎么用就行。
  
```
├── hooks  
│   ├── use-boolean.js  
│   ├── use-copy-to-clipboard.js  
│   ├── use-countdown.js  
│   ├── use-debounce.js  
│   ├── use-double-click.js  
│   ├── use-event-listener.j  
│   ├── use-local-storage.js  
│   ├── use-mocked-user.j  
│   ├── use-off-set-top.j  
│   ├── use-responsive.js  
│   └── use-scroll-to-top.js  
```
  
#### 6. layouts
  
网页的设计以后集中在这块进行管理，就等于这块纯为css，写法使用MUI写好的不单独列出css文件直接写在jsx内，下次开发比如写主页了那么我们
就列出对应的文件夹。
  
```
├── layouts  
│   ├── auth  
│   │   ├── classic.jsx  （登陆注册统一继承使用的样式）  
│   ├── main              以后开发按照这个格式来 未实现）  
│   │   ├── morden.jsx   （以后开发按照这个格式来 未实现）  
│   └── config-layout.js （全局样式，无需修改）  
```
  
#### 7. pages
  
把网页的<title>和每个部分不同的视图结<view/>合起来提性能，但这个写法过于工业化了 然后导出这个组件在routes部分
和layout结合
  
```
├── pages  
│   ├── Home          （随便糊的 后面决定了要删）  
│   │   └── index.jsx （随便糊的 后面决定了要删）  
│   ├── Layout  
│   │   ├── index.jsx （随便糊的 后面决定了要删）  
│   │   └── index.scss（随便糊的 后面决定了要删）  
│   └── auth  
│       ├── login.jsx  
│       └── register.jsx 
```
  
### 8. routes
  
把pages部分导出的组件与layout部分导出的组件结合，导出成路由，方便管理。也就是说在这部分(html + js)与(css)结合。
  
```
├── routes  
│   ├── components （MUI自己封装的路由组件）  
│   │   ├── index.js  
│   │   └── router-link.jsx  
│   ├── hooks      （MUI自己定义的路由钩子）  
│   │   ├── index.js  
│   │   ├── use-active-link.js  
│   │   ├── use-params.js  
│   │   ├── use-pathname.js  
│   │   ├── use-router.js  
│   │   └── use-search-params.js  
│   ├── paths.js    （重要！！！集中管理了所有的页面路由）  
│   └── sections    （组装完成后导出成路由，以后所有页面的组装在这完成）  
│       ├── auth.jsx  
│       └── index.jsx  
```
  
### 9.sections
  
主要完成视图，简单点理解为在这里写好了html + js 然后导出。
  
```
├── sections  
│   ├── Home （随便糊的 后面改下名字开始写主页）  
│   └── auth  
│       └── jwt  
│           ├── index.js  
│           ├── jwt-login-view.jsx  
│           └── jwt-register-view.jsx  
```  
  
### 10.theme
  
MUI主题文件，以后需要可以在这里修改主题。具体参照MUI文档。
  
```
├── theme  
│   ├── css.js  
│   ├── custom-shadows.js  
│   ├── index.jsx  
│   ├── overrides  
│   │   ├── components  
│   │   │   ├── accordion.js  
│   │   │   ├── alert.js  
│   │   │   ├── appbar.js  
│   │   │   ├── autocomplete.js  
│   │   │   ├── avatar.js  
│   │   │   ├── backdrop.js  
│   │   │   ├── badge.js  
│   │   │   ├── breadcrumbs.js  
│   │   │   ├── button-group.js  
│   │   │   ├── button.js  
│   │   │   ├── card.js  
│   │   │   ├── checkbox.js  
│   │   │   ├── chip.js  
│   │   │   ├── css-baseline.js  
│   │   │   ├── data-grid.js  
│   │   │   ├── date-picker.jsx  
│   │   │   ├── dialog.js  
│   │   │   ├── drawer.js  
│   │   │   ├── fab.js  
│   │   │   ├── list.js  
│   │   │   ├── loading-button.js  
│   │   │   ├── menu.js  
│   │   │   ├── pagination.js  
│   │   │   ├── paper.js  
│   │   │   ├── popover.js  
│   │   │   ├── progress.js  
│   │   │   ├── radio.js  
│   │   │   ├── rating.js  
│   │   │   ├── select.js  
│   │   │   ├── skeleton.js  
│   │   │   ├── slider.js  
│   │   │   ├── stepper.js  
│   │   │   ├── svg-icon.js  
│   │   │   ├── switch.js  
│   │   │   ├── table.js  
│   │   │   ├── tabs.js  
│   │   │   ├── textfield.js  
│   │   │   ├── timeline.js  
│   │   │   ├── toggle-button.js  
│   │   │   ├── tooltip.js  
│   │   │   ├── tree-view.js  
│   │   │   └── typography.js  
│   │   ├── default-props.jsx  
│   │   └── index.js  
│   ├── palette.js  
│   ├── shadows.js  
│   └── typography.js  
```
  
### 11.utils
  
这个部分就是各个部分会用到的工具，最主要就是会用axios就可以了其他我来维护。
  
```
└── utils  
    ├── axios.js   （最主要的utils 设计get post delete 还有自定义error都在这个里面）  
    ├── change-case.js  （MUI自定义的大小写切换）  
    ├── format-time.js  （MUI自定义的时间统一）  
    ├── highlight.js     MUI定义的）  
    ├── storage-available.js （MUI定义的）  
    └── zh-en.js   （地区的中英文切换，可能后期还要维护）  
```
  
### 总结
整个前端项目打算主要依据MUI的template做减法，然后根据业务需要自己添加一些自定义的组件，整个项目最重要的就是弄懂结构，然后根据结构去实现功能。