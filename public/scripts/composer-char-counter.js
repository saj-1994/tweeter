$(document).ready(() => {
  $("#new-tweet-text").on("keyup", function() {
    const output = 140 - $(this).val().length;
    const $counter = $(this)
      .parents("#new-tweet-form")
      .children("#counter");

    if (output < 0) {
      $counter.text(output);
      $counter.addClass("new-tweet-negative-counter");
    } else {
      $counter.removeClass("new-tweet-negative-counter");
      $counter.text(output);
    }
  });
});
