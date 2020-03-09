$(document).ready(function () {
    $('#checkoutAccordion').on('show.bs.collapse', function (event) {
        //console.log(event.target.id);
        //console.log($('#'+event.target.id).offset());
        //let scrollT=parseInt($('#headingTwo').offset().top);
        //$(document).animate({ scrollTop: scrollT }, 500);
        console.log(event.target.id)
        $('#checkoutAccordion').on('hidden.bs.collapse', function (event) {
            let active_element= $('#breadcrumbSteps').find('li .active');
            active_element.removeAttr('aria-current');
            active_element.removeClass('active');
        })
    });
    $("#buttonEmailRegister").on('click', function (e) {
        /* regular expression to check email*/
        var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var email_data = $('#emailRegister').val().toString().toLowerCase();
        if (emailReg.test(email_data)) {
            e.preventDefault();
            $("#email_send").val(email_data);
            $(".email-success").show();
            $("#checkoutStep3").collapse('show');
            $.ajax({
                type: 'POST',
                url: "/res_billet/email_register",
                data: {'email_register':email_data.toString()},
                dataType: "text",
                success: function(resultData) { console.log('save email complete: '+resultData.data) },
                error: function(xhr,status) { console.log('save email fail :'+xhr+' '+status)}
            });
        } else {
            e.preventDefault();
            $(".email-error").show();
            setTimeout(function () {
                $(".email-error").hide();
            }, 3000);
        }
    });
    $('#validateStep3').on('click',function(e){
        e.preventDefault();
        $("#checkoutStep4").collapse('show');
    });
    $('#validatePaymentMode').on('click',function(e){
        var radioValue = $("input[name='optPayment']:checked"). val();
        if(radioValue =='paypal'){
            $('#btnPaypal').show();
        }
        if(radioValue == 'mvola'){
            $('#btnPaypal').hide();

        }
        if(radioValue == 'airtelMoney'){
            $('#btnPaypal').hide();

        }
    });
});