$(function () {
    $('#submit').submit(function (event) {
        event.preventDefault(); // Stops browser from navigating away from page
        // build a json object or do something with the form, store in data
        let data = {
            title: $('#title')[0].value,
            date: $('#date')[0].value,
            duration: $('#duration')[0].value,
        }


        $.ajax({
            type: 'POST',
            url: '/db/classes',
            data: data,
            success: function (resp) {
                alert(JSON.stringify(resp));
            },
            error: function (err) {
                alert('error' + JSON.stringify(err));
            }
        });
    });
});