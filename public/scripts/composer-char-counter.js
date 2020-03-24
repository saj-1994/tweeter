$(document).ready(() => {
  $('#tweet-text').on('keyup', function(evt) {
    let output = 140 - this.value.length;
    let counter = $(this).parents('.new-tweet-form').children('.counter');
    if(output < 0) {
      counter.text(output);
      counter.addClass("red");
    } else {
      counter.removeClass("red");
      counter.text(output);
    }
  })
})