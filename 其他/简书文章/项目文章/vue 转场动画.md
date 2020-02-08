## 前言

移动端, 使用vue为了良好的用户体验, 会需要实现APP形式的切换页面的左滑和右滑效果

实现原理, vue的过渡 & 动画

技术栈: vue + vue-router

## 解决思路

* 区分前进 和 后退的路由

  > 网上搜索的资料, 找到了两种
  >
  > * 监听popstate事件
  >
  >   ```javascript
  >   window.addEventListener('popstate', function (e) {
  >       // 用来判断是否是后退, 在判断后需要在其他地方重置
  >       router.isBack = true
  >   },false)
  >   
  >   ```
  >
  > * 在注册路由的时, 添加 meta对象 ( 路由元信息)中添加索引, 这样做就需要注意索引的大小
  >
  >   ```javascript
  >   {
  >         path: "/login",
  >         component: resolve => require(["@/pages/login"], resolve),
  >         meta: {
  >           title: "登录",
  >           keepAlive: false,
  >           index: 1
  >         }
  >       },
  >       {
  >         path: "/forward",
  >         name: "Forward",
  >         component: resolve => require(["@/pages/forward"], resolve),
  >         meta: {
  >           title: "前进",
  >           keepAlive: true,
  >           index: 2
  >         }
  >       },
  >   ```

* 根据切换方向设置不同的动画效果

## 方案

1. 路由注册

   ```javascript
   	{
         path: "/login",
         component: resolve => require(["@/pages/login"], resolve),
         meta: {
           title: "登录",
           keepAlive: false, // 用来判断是否缓存, 当判断为缓存时, 则路由信息的name和组件的name选项需一致
           index: 1, // 通过比较不同的索引, 来判断是前进动画还是后退动画
         }
       },
       {
         path: "/forward",
         name: "Forward",
         component: resolve => require(["@/pages/forward"], resolve),
         meta: {
           title: "前进",
           keepAlive: true,
           index: 2
         }
       },
   ```

2. 在App.vue(根组件)中, 判断动画方向

   ```vue
   <template>
     <div id="project">
     	<!-- 
   		<keep-alive>
         		<router-view v-if="$route.meta.keepAlive"></router-view>
       	</keep-alive>
       	<router-view v-if="!$route.meta.keepAlive"></router-view>
   		这种情况下, 
   		:include: 因为若是使用transition包裹两个keep-alive, vue会出现报错
   				  用两个transition分别包裹keep-alive, 会让transition的动画name出现问题
   	--> 
       <transition :name="transitionName">
         <keep-alive :include="cachedViews">
           <router-view :key="1"></router-view>
         </keep-alive>
       </transition>
     </div>
   </template>
   
   <script>
   export default {
     name: "App",
     data() {
       return {
         transitionName: "slide-right", // 初始过渡动画方向
         cachedViews: [] // 缓存组件
       };
     },
     components: {},
     created() {},
     watch: {
       $route(to, from) {
         if (to.meta.keepAlive && !this.cachedViews.includes(to.name)) {
           // 将需要缓存的组件信息, 添加进其中, 其中to.name的值应该和匹配组件的name选项一致
           this.cachedViews.push(to.name);
         }
         //如果to索引大于from索引,判断为前进状态,反之则为后退状态
         if (to.meta.index > from.meta.index) {
           //设置动画名称
           this.transitionName = "slide-left";
         } else {
           this.transitionName = "slide-right";
         }
       }
     },
     methods: {}
   };
   </script>
   
   
   <style lang="scss" scoped>
   .slide-right-enter-active,
   .slide-right-leave-active,
   .slide-left-enter-active,
   .slide-left-leave-active {
     will-change: transform;
     transition: all 0.5s;
     <!-- 
       这个是必须的, 是为了让页面脱离文档流, 不然的话, 后进入的页面会从页面底部出来
       这个定位会直接添加到路由匹配的组件根元素上, 所以页面根组件最好设定其宽度为100vw
     -->
     width: 100vw;
     position: absolute;
   }
   .slide-right-enter {
     opacity: 0;
     transform: translate3d(-100%, 0, 0);
   }
   .slide-right-leave-active {
     opacity: 0;
     transform: translate3d(100%, 0, 0);
   }
   .slide-left-enter {
     opacity: 0;
     transform: translate3d(100%, 0, 0);
   }
   .slide-left-leave-active {
     opacity: 0;
     transform: translate3d(-100%, 0, 0);
   }
   </style>
   ```


## 待解决问题

* 子路由问题

  > 子路由还没有考虑到

* 缓存组件问题

  > 使用上述方式, 缓存组件需要注意组件的name选项要和路由的name选项一致, 容易疏忽填写组件的name选项问题

