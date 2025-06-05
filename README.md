# 基于 umi4 和 antd 的 PC 端脚手架

脚手架基于 umi4, 不熟悉 umi4 的或者要查看其配置项的请阅读它的[文档](https://umijs.org/docs/guides/getting-started).

包管理工具推荐使用 **pnpm**. node 版本推荐 **v20**.

本脚手架类似于 antd pro. 但与 antd pro 不同的是网站的布局是由自已实现而不是用 ProLayout 组件. 这样做的好处是我们有了更多的控制权, 能够做更多定制化的东西来满足客户多样化的需求.

在此基础上我们还**约定**了一些开发规范, 以便于我们团队的协作.

1. **页面入口**
    我们约定 `src/layout/index.tsx` 文件为网站的入口文件. 在这个组件里可以根据 url 中的 pathname 来指定页面使用何种布局组件.
   
    比如大部分的业务页面可以使用 \<BusinessLayout /> 组件. 该布局组件是经典的 menu, header, footer 模式.
   
    登陆页或者单点登陆页可以使用 \<LoginLayout /> 组件.
   
    其它不需要布局的页面, 可以直接使用 \<[Outlet](https://umijs.org/docs/guides/routes#routes) /> 组件.
   
2. **路由**
   本脚手架约定使用约定式路由, 即 pages 文件夹中的页面会自动形成路由. 这样做的好处是可以免去在路由配置表中配置一个个页面.

   > 👉 页面中的组件请放在 `components` 文件夹下, 以避免组件文件形成路由.
   
   当然我们也还是可以在运行时动态修改路由的. 
   
   比如我们要增加首页跳转.
   
   只需要在 `src/app.tsx` 文件中的 patchClientRoutes 函数中写入逻辑即可.
   
   umi 会在收集完约定式路由后运行该函数.
   
   ```js
   import { Navigate } from 'umi'

   export function patchClientRoutes({ routes }) {
    routes[0].routes.unshift({
      path: '/',
      element: <Navigate to="/home" replace />,
    })
   }
   ```
   > 👉 注意以上使使用 Navigate 的方法存在问题, 会导致死循环. 不知道是 umi 的问题还是 react-router 的问题. 2025-1-9

   > 新的方法可以在首页中使用 `navigate('/system/setting', { replace: true })` 来实现跳转.

3. **数据流**
   本脚手架约定使用基于 `hooks` 范式的数据流方案.
   
   ```js
   // config/config.js
   // 已在配置文件中开启
   {
     plugins: [
       "@umijs/plugins/dist/initial-state.js",
       "@umijs/plugins/dist/model.js",
     ],
     initialState: {},
     model: {},
   }
   ```

   该方案包含 **全局数据** 和 **全局初始数据** 两个方面. 具体的文档在[这里](https://umijs.org/docs/max/data-flow#%E5%BC%80%E5%A7%8B%E4%BD%BF%E7%94%A8).
   
   全局初始数据其实就是一种特殊的全局数据, 只是它的执行顺序比较靠前. 可以参考这个顺序 👇
   
   > `render` 函数 -> `patchRouters` 函数 -> `getInitialState`函数 -> 全局布局组件 layout/index.tsx -> 页面布局组件 layout/businessLayout -> KeepAliveOutlet 组件
   
   在本脚手架中, 我们把路由数据, 用户信息, 用户所属的菜单数据等都放在了全局初始数据中. 可以通过 `useModel('@@initialState')` 来获取值.
   
## 关于权限控制

脚手架做好了完备的页面权限控制.

页面权限大体上分为 3 种情况:

1. 访问的是白名单页面
2. 访问时未登录
3. 访问时已登录但没有该页面的权限

当用户访问一个页面时, 代码的执行顺序如下 👇
> `render` 函数 -> `patchRouters` 函数 -> `getInitialState`函数 -> 全局布局组件 layout/index.tsx -> 页面布局组件 layout/businessLayout -> KeepAliveOutlet 组件

因此针对上面的情况, 权限的控制也应该放在相应的地方:

1. 向后端请求数据的逻辑主要放在 `getInitialState` 函数里, 因此只有已登录的用户才会在这里请求数据, 除此之外的情况会跳转到登录页去或者不请求后台直接放行.
2. 已登录用户但没有该页面访问权限的放在 KeepAliveOutlet 组件中去拦截, 因为 401 页面需要用到 businessLayout 组件.

## 仓库克隆和同步

1. **克隆**

    a. 克隆本项目到本地目录.

    b. 更改 origin 源至自已的项目路径: `git remote set-url origin http://10.10.10.10:9080/xx.git`

    c. `git push`

2. **同步本项目代码**

    a. 设置 upstream 源: `git remote add upstream https://github.com/jaykou25/react-admin-starter.git`

    b. 拉取 upstream 项目更新: `git fetch upstream`

    c. 把 upstream 中的分支合并进自已分支.

## 如何开使

1. `pnpm install`
2. 👉 **复制 `config/proxy-demo.ts` 到 `config/proxy.ts`** 👈
3. `pnpm dev`
4. 开始开发

## 开发建议

1. 文件名称建议使用连字符 `-` 连接: my-file
2. 组件名称使用大驼峰法（UpperCamelCase）：MyComp
3. 在函数组件中获取当前路由请使用 `const { pathname } = useLocation()`, 在非函数组件中使用 `getSafePathname` 方法。这两种方法会去掉路由前缀。
4. 新写的公共方法请务必写好单元测试, 这不仅对团队也对个人帮助巨大.

    a. 测试文件可以写在当前目录下, 以 `.test.js` 或 `.test.ts` 结尾.

    b. 测试文档可以参考 [jest 文档](https://jestjs.io/zh-Hans/docs/using-matchers).

    c. 运行 `pnpm test` 查看测试结果.
