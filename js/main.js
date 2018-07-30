function loadScrobbles(sEl, sUser, sApiKey, iLimit, iInterval) {
  var sUrl = 'https://ws.audioscrobbler.com/2.0/'

  var el = $(sEl)

  $.ajax({
    url: sUrl,
    dataType: 'json',
    beforeSend: function() {
      if (el.html() != '') {
        el.slideUp(function() {
          el.html(
            '<span id="loading_scrobbles">Loading scrobbles..</span>'
          ).slideDown()
        })
      } else {
        el.html('<span id="loading_scrobbles">Loading scrobbles..</span>')
      }
    },
    data:
      'method=user.getrecenttracks&user=' +
      sUser +
      '&api_key=' +
      sApiKey +
      '&limit=' +
      iLimit +
      '&format=json',
    success: function(obj) {
      var sHtml = '<ul class="scrobbles">\n'

      $(obj.recenttracks.track).each(function(i, t) {
        sClass = t['@attr'] && t['@attr'].nowplaying ? 'playing' : ''
        sHtml += '<li class="' + sClass + '">\n'
        sHtml += '	<a href="' + t.url + '" target="_blank">\n'
        sHtml +=
          '		<img src="' +
          (t.image[0]['#text'] != '' ? t.image[0]['#text'] : '/img/music.png') +
          '" alt="' +
          t.artist['#text'] +
          ' - ' +
          t.name +
          '" />\n'
        sHtml += '		<span class="song">' + t.name + '</span>\n'
        sHtml += '		<span class="artist">' + t.artist['#text'] + '</span>\n'
        sHtml += '	</a>\n'
        sHtml += '</li>\n'
      })

      sHtml += '</ul>\n'

      el.slideUp(function() {
        $(this)
          .html(sHtml)
          .slideDown()
      })
    }
  })

  if (iInterval > 0) {
    setTimeout(
      "loadScrobbles( '" +
        sEl +
        "', '" +
        sUser +
        "', '" +
        sApiKey +
        "', " +
        iLimit +
        ', ' +
        iInterval +
        ');',
      iInterval
    )
  }
}

function loadWeather(iWoeId) {
  var aWeather = [
    'windy',
    'wet',
    'wet &amp; windy',
    'snowy',
    'dry',
    'foggy',
    'smoky',
    'cold',
    'cloudy',
    'partly cloudy',
    'sunny',
    ''
  ]
  var aCodes = {
    0: [0, 2, 23, 24],
    1: [8, 9, 10, 11, 12, 17, 18, 40],
    2: [1, 3, 4, 5, 6, 7, 35, 37, 38, 39, 45, 47],
    3: [13, 14, 15, 16, 41, 42, 43, 46],
    4: [19],
    5: [20],
    6: [22],
    7: [25],
    8: [26, 27, 28, 29, 30],
    9: [31, 33, 34, 44],
    10: [32, 36],
    11: [3200]
  }

  sUrl = 'https://query.yahooapis.com/v1/public/yql'

  $.ajax({
    url: sUrl,
    dataType: 'json',
    data:
      'q=select%20*%20FROM%20weather.forecast%20where%20woeid%20%3D%20' +
      iWoeId +
      '&format=json&diagnostics=false',
    success: function(obj) {
      var item = obj.query.results.channel.item
      var sWeather = item.condition.text
      var weatherCode = parseInt(item.condition.code)

      $.each(aCodes, function(i, c) {
        if ($.inArray(weatherCode, c) > -1) {
          sWeather = aWeather[i]
        }
      })

      sWeather +=
        '<div class="popover" style="display:none;"><img src="http://l.yimg.com/a/i/us/we/52/' +
        weatherCode +
        '.gif" align="left"/> ' +
        obj.query.results.channel.location.city +
        '<br/>' +
        Math.round(((parseInt(item.condition.temp) - 32) * 5) / 9) +
        '&deg; C</div>'

      $('#weather')
        .html(sWeather)
        .on('mouseover', function(e) {
          $('#weather .popover').show()
        })
        .on('mouseout', function(e) {
          $('#weather .popover').hide()
        })
    }
  })
}
