$(function() {
    $('.burger').on('click', function(e) {
        $(this).toggleClass('active');
        $(".burger-open").toggleClass('active');
    });
});


