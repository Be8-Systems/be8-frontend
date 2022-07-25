export const isPhone = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
export const isFirefox = (navigator.userAgent.indexOf('Firefox') !== -1);
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