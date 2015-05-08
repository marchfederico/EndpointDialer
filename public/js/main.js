

$(document).ready(function() {
    $("#loginButton").click(function() {
        var username = $('#username').val()
        var password = $('#password').val()
        var ipaddress = $('#ipaddress').val()

        if (username == "")
        {
            $('#username').focus()
            $('#info').html('<br>Invalid username!')
            return
        }
        if (password == "")
        {
            $('#password').focus()
            $('#info').html('<br>Invalid password!')
            return
        }
        if (!ipaddress.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/))
        {
            $('#ipaddress').focus()
            $('#info').html('<br>Invalid IP Address!')
            return
        }
        $.post("/login",
            {
                username: username,
                password: password,
                ipaddress:ipaddress
            },
            function(data, status){
                if (data.error)
                {
                    $('#info').html('<br>Error logging in.  Check the username, password and ip address and try again')
                }
                else
                {

                    $('#main-info').html(data)
                }


            });
    });
});



