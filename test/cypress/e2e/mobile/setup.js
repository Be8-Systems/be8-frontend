import LANG from '../../../../lib/js/data/lang';

export default function () {
    globalThis.LANG = LANG;
    
    return before(() => {
        cy.viewport('iphone-8');
    });
}
