import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getSession } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 没有重定向白名单

router.beforeEach(async (to, from, next) => {
    // 开始进度条
    NProgress.start()

    // 设置页面标题
    document.title = getPageTitle(to.meta.title)

    // 确定用户是否已经登录
    const hasSession = getSession()

    if (hasSession) {
        if (to.path === '/login') {
            // 如果已登录，则重定向到主页
            next({ path: '/' })
            NProgress.done()
        } else {
            next()
        }
    } else {
        /* 没有令牌*/

        if (whiteList.indexOf(to.path) !== -1) {
            // 在白名单中，直接访问
            next()
        } else {
            // 其他没有访问权限的页面被重定向到登录页面。
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    // 完成进度条
    NProgress.done()
})
