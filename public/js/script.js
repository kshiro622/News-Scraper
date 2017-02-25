$(document).ready(function() {
    // When "Article Notes" button is clicked, show modal
    $('.article-notes').on('click', function() {
        var title = $(this).data("title");
        var articleId = $(this).attr("id");
        $('#save-note-btn').attr('data-id', articleId);
        $('.modal-title').html('<p>Add Note for</p><h5>"' + title + '"</h5>');
        $('#comment-modal').modal('show');
    });

    $('#save-note-btn').on('click', function() {
        var newComment = $('#comment').val().trim();
        var articleId = $(this).data('id');

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

    $(document.body).on('click', '.remove-comment', function() {
        var commentId = $(this).attr('id');
        var articleId = $(this).attr('data-articleId');

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
