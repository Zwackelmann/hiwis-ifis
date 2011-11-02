$(document).ready(function() {
  var railscasts = $('a#header audio');
  
  if($.browser.webkit) {
    railscasts = $('a#header audio[type="audio/mp3"]')[0];
    railscasts.load();
    
    $('a#header').hover(function() {
      railscasts.play();
    }, function() {
      railscasts.pause();
      railscasts.load();
    });
  } else if($.browser.mozilla) {
    railscasts = $('a#header audio[type="audio/ogg"]')[0];
    railscasts.load();
    
    $('a#header').hover(function() {
      railscasts.play();
    }, function() {
      railscasts.pause();
      railscasts.load();
    });
  }
  
  /* TODO: these need to be specified as "em"s! */
  $('nav#sidebar > ul > li > a').click(function() { scrollToX(500); });
  $('nav#progress ul > li > a').click(function() { scrollToX(0); });
  $('ul.lightbox > li > article > section > a').click(function() { scrollToX(0); });
  $('article.post > a').click(function() { scrollToX(205); });
  $('article.post dd > a.iconic').click(function() { scrollToX(205); });
  
//MathJax.Hub.Config({
//  tex2jax: {
//    inlineMath: [ ['$','$'] ],
//    processEscapes: true,
//    webFont: "TeX"
//  }
//});
});

function scrollToX(x) {
  setTimeout(function() {
    window.scrollTo(0,x);
  }, 1);
}