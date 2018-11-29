// stripe.js API 불러오는 함수
var stripe = Stripe('pk_test_3nIISsyJU2XY9HI6glcoj1Tb');

var $form = $('#checkout-form');


$form.submit(function (event) {
    $form.find('button').prop('disabled', true);
    stripe.tokens.create({
        card: {
            number: $('#card-number').val(),
            cvc: $('#card-cvc').val(),
            exp_month: $('#card-expiry-month').val(),
            exp_year: $('#card-expiry-year').val()
        }
    }, function(err, token) {
        if (err) {
            $('#charge-error').text(err.message);
            $('#charge-error').removeClass('hidden');
            $form.find('button').prop('disabled', false);
        } else {
            var token = token.id;
            $form.append($(<input type="hidden" name="stripeToken" />).val(token));
            $form.get(0).submit();
        }
    });
    return false;
});