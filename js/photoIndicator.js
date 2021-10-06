$(document).ready(function () {
    $(':file').change(function () {
        $('#files-selected').text(this.files.length + " Фото");
    });
});