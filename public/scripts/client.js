/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
} 

const renderTweets = tweets => {
  for (const tweet of tweets) {
    const $tweet = createTweetElement(tweet);
    $('#tweets-container').prepend($tweet);
  }
}

const createTweetElement = tweet => {
  const {name, avatars, handle} = tweet.user;
  const {text} = tweet.content;
  const {created_at} = tweet;
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
}

const getNumberOfDays = timeInMs => {
  const today = new Date();
  const diffInTime = today.getTime() - timeInMs;
  return Math.floor(diffInTime / (1000 * 3600 * 24));
}

const postTweets = (form, callback) => {
  const $form = form;
  const data = $form.serialize();
  $.ajax({
    url: $form.attr('action'),
    type: "POST",
    data: data
  })
  .then(() => {
    callback();
  })
}

const getTweetErrMsg = (tweet, counter) => {
  if(tweet === '' || tweet === null) {
    return 'The tweet field is empty, please enter a valid tweet.';
  } else if(counter < 0) {
    return 'The tweet is too long, please enter tweet below 140 characters.';
  }
}

const loadTweets = () => {
  $.ajax({
    url: '/tweets/',
    type: 'GET',
    dataType: 'JSON'
  })
  .then (res => {
    renderTweets(res);
  });
}

const loadLastTweet = () => {
  $.ajax({
    url: '/tweets/',
    type: 'GET',
    dataType: 'JSON'
  })
  .then (res => {
    const lastTweetInd = res.length - 1;
    const lastTweet = [];
    lastTweet.push(res[lastTweetInd]);
    renderTweets(lastTweet);
  })
}

$(document).ready(() => { 
  loadTweets();

  $('#new-tweet-form').on('submit', function(evt) {
    event.preventDefault();
    const form = $(this);
    const counter = form.children('#counter').val();
    const tweet = form.children('#tweet-text').val();
    const tweetErr = getTweetErrMsg(tweet, counter);
    
    $('#error').slideUp();
    if(!tweetErr) {
      postTweets(form, () => {
        loadLastTweet();
      });
      $(form)[0].reset();
      $(form.children('#counter')).text(140);
    } else {
      $('#error-msg').text(tweetErr);
      $('#error').slideDown();
    }
    
  });

  $('#new-tweet-toggle, #navbar-arrow').on('click', function(evt) {
    const $newTweet = $('#new-tweet');
    if ($newTweet.is(':visible')) {
      $newTweet.slideUp();
    } else {
      $newTweet.slideDown(() => {
        $('#tweet-text').focus();
      });
    }
    
  })

});

