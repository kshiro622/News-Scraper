$(document).ready(function() {

    // When "Article Notes" button is clicked, show modal
    $('.article-notes').on('click', function() {
        var title = $(this).data("title");
        var articleId = $(this).attr("id");
        $('#save-note-btn').attr('data-id', articleId);
        $('.modal-title').html('<p>Add Note for</p><h5>"' + title + '"</h5>');
        $('#comment-modal').modal('show');
    });

    // When "Save Note" is clicked, add comment to database
    $('#save-note-btn').on('click', function() {
        var newComment = $('#comment').val().trim();
        var articleId = $(this).data('id');

        // AJAX call to update the database
        $.ajax({
            url: '/saved/save_comment',
            type: 'PUT',
            data: {
                id: articleId,
                comment: newComment
            },
            success: function(response) {
                if (response === "fail") {
                    console.log("failed");
                } else {
                    location.reload();
                }
            }
        });
    });

    // When "X" is clicked, remove comment from database
    $(document.body).on('click', '.remove-comment', function() {
        var commentId = $(this).attr('id');
        var articleId = $(this).attr('data-articleId');

        // AJAX call to remove comment from database
        $.ajax({
            url: '/saved/delete_comment',
            type: 'PUT',
            data: {
                id: commentId,
                articleId: articleId

            },
            success: function(response) {
                if (response === "fail") {
                    console.log("failed");
                } else {
                    location.reload();
                }
            }
        });
    });
});
