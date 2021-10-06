$('window').ready(() => {
    $('.nav-menu').click(function (e) {
        $('.menu').css("display", "block");
        $('.blur-layer').css("display", "block");

        $('.blur-layer').click(function (e) {
            $('.menu').css("display", "none");
            $('.blur-layer').css("display", "none");
        });
    });
});