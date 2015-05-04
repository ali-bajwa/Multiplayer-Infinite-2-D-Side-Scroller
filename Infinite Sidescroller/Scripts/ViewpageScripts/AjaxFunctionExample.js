$.ajax({
  url: /game/savescore,
  type: 'POST',
traditional: true,
contentType: 'application/json',
data: { sessionid: sessionid, userid: usernames, score: score },
success: function (result) {}
});