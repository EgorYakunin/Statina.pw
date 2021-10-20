 // #heroSection
$(window).on("load", function () {
    setTimeout(() => {
        $('.top').addClass('top-opacity');
        setTimeout(() => {
            $('.hero-wrapper').addClass('hero-wrapper-display');
            setTimeout(() => {
                $('body').addClass('can-scroll');
            }, 500);
        }, 500);
    }, 500);
});