

function doPoll()

{
    $.post("/callinfo",
        {

        },
        function(data, status){
            if (data.error)
            {
                $('#callinfo').html('<br>Error your session timed out! <a href="/">Click here</a> to login again')
            }
            else
            {

                $('#callinfo').html(data)
            }
            setTimeout(doPoll,5000)
            $('#callMessage').html("")

        });

}

function disconnectCall(callid)
{
    $.post("/disconnect",
        {
            callid: callid
        },
        function(data, status){
            if (data.error)
            {
                $('#callinfo').html('<br>Error your session timed out! <a href="/">Click here</a> to login again')
            }
            else
            {

                $('#callinfo').html(data)
            }
            $('#callMessage').html("")

        });

}

$("#callButton").click( function () {
    $('#callMessage').html("");
    $.post("/placecall",
        {
            uri: $('#uri').val(),
            callRate: "1024"
        },
        function(data, status){
            if (data.error)
            {
                $('#callMessage').html(data.error)
            }
            else
            {
                $('#callMessage').html("Successfully placed the call.")
            }
        });

});

$("#dtmfButton").click( function () {
    $('#callMessage').html("Sending DTMF(s): "+$('#dtmf').val());
    $.post("/senddtmf",
        {
            dtmf: $('#dtmf').val()

        },
        function(data, status){
            if (data.error)
            {
                $('#callMessage').html(data.error)
            }
            else
            {
                $('#callMessage').html("Successfully sent DTMF(s) tones.")
            }
        });

    $('#dtmf').val("")
});

doPoll();

