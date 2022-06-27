export const animations = Object.freeze({
    fadeLeftOut: function () {
        return 'animation: fadeLeftOutAnimation 0.3s !important;';
    }, 
    fadeLeftIn: function () {
        return 'animation: fadeLeftInAnimation 0.3s !important;';
    },
    fadeRightOut: function () {
        return 'animation: fadeRightOutAnimation 0.3s !important;';
    },
    fadeRightIn: function () {
        return 'animation: fadeRightInAnimation 0.3s !important;';
    }
});

export function isKeyDownNumber (evt) {
    const charCode = (evt.which) ? evt.which : evt.keyCode;

    if (evt.target.selectionStart === 0 && charCode === 35) {
        return true;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }

    return true;
}

export function animateSideToMain (main, side, focus) {
    side.style = animations.fadeRightOut();

    setTimeout(() => {
        side.classList.add('hide');
        main.classList.remove('hide');

        side.style = '';
        main.style = animations.fadeLeftIn();

        requestAnimationFrame(() => { 
            focus?.focus();
            main.style = '';
        });
    }, 300);
}

export function animateMainToSide (main, side, focus) {
    main.style = animations.fadeLeftOut();

    setTimeout(() => {
        main.classList.add('hide');
        side.classList.remove('hide');

        main.style = '';
        side.style = animations.fadeRightIn();

        requestAnimationFrame(() => { 
            focus?.focus();
            side.style = ''; 
        });
    }, 300);
}