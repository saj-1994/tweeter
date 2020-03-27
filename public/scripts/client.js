/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
const escape = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// injects tweet html markup into the html file
const renderTweets = tweets => {
  for (const tweet of tweets) {
    const $tweet = createTweetElement(tweet);
    $("#tweets-container").prepend($tweet);
  }
};

// creates the html markup using the tweet data
const createTweetElement = tweet => {
  const { name, avatars, handle } = tweet.user;
  const { text } = tweet.content;
  const { created_at } = tweet;
  const daysSincePost = getNumberOfDays(created_at);
  const $tweetMarkup = `
  <article class="tweet">
          <header>
            <img src="${avatars}" alt="user avatar">
            <p>${name}</p>
            <span>${handle}</span>
          </header>
          <section>
            <p>
              ${escape(text)}
            </p>  
          </section>
          <footer>
            <span id="day-counter">${daysSincePost} days ago</span>
            <span id="symbol">
              <span>&#9873</span>
              <span>&#8633</span>
              <span>&#10084</span>
            </span>
          </footer>
        </article>
        `;
  return $tweetMarkup;
};

// calculates number of days between given time in ms and current date and time
const getNumberOfDays = timeInMs => {
  const today = new Date();
  const diffInTime = today.getTime() - timeInMs;
  return Math.floor(diffInTime / (1000 * 3600 * 24));
};

// sends a POST request to the server with the tweet data
const postTweets = (form, callback) => {
  const $form = form;
  const data = $form.serialize();
  $.ajax({
    url: $form.attr("action"),
    type: "POST",
    data: data
  }).then(() => {
    callback();
  });
};

const getTweetErrMsg = (tweet, counter) => {
  if (tweet === "" || tweet === null) {
    return "The tweet field is empty, please enter a valid tweet.";
  } else if (counter < 0) {
    return "The tweet is too long, please enter tweet below 140 characters.";
  }
};

// sends a GET request to get all the tweets stored in the DB
const loadTweets = callback => {
  $.ajax({
    url: "/tweets/",
    type: "GET",
    dataType: "JSON"
  }).then(res => {
    callback(res);
  });
};

// gets the last tweet posted in the DB
const loadLastTweet = () => {
  loadTweets(tweets => {
    const lastTweetInd = tweets.length - 1;
    const lastTweet = [];
    lastTweet.push(tweets[lastTweetInd]);
    renderTweets(lastTweet);
  });
};

// executes only when the DOM is fully loaded
$(document).ready(() => {
  loadTweets(tweets => {
    renderTweets(tweets);
  });

  // executes when the form tries to submit
  $("#new-tweet-form").on("submit", function(evt) {
    evt.preventDefault();
    const form = $(this);
    // traverses to the children nodes of the current node
    const counter = form.children("#counter").val();
    const tweet = form.children("#tweet-text").val();
    const tweetErr = getTweetErrMsg(tweet, counter);

    $("#error").slideUp();
    // checks user input for errors and posts if no errors else shows error msg
    if (!tweetErr) {
      postTweets(form, () => {
        loadLastTweet();
      });
      $(form)[0].reset();
      $(form.children("#counter")).text(140);
    } else {
      $("#error-msg").text(tweetErr);
      $("#error").slideDown();
    }
  });

  // toggles the new tweet form when new tweet button clicked
  $("#new-tweet-toggle, #navbar-arrow").on("click", function() {
    const $newTweet = $("#new-tweet");
    if ($newTweet.is(":visible")) {
      $newTweet.slideUp();
    } else {
      $newTweet.slideDown(() => {
        $("#tweet-text").focus();
      });
    }
  });
});
