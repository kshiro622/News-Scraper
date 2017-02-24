$(document).ready(function() {
    // When "Article Notes" button is clicked, show modal
    $(".article-notes").on('click', function() {
        var title = $(this).data("title");
        $('.modal-title').html('<p>Article Notes</p><h5>"' + title + '"</h5>');
        $('#comment-modal').modal('show');
    });
});
