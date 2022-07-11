export const isPhone = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
export const isDesktop = !isPhone;
export const domCache = {
    app: {},
    menus: {},
    threads: {},
    settings: {},
    user: {},
    navi: {},
    header: {},
    bottomNavi: {},
    toast: {}
};