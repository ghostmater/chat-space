$(function(){

  function buildHTML(message){
    var image = message.image.url ? message.image.url : "";
    var html = `<div class="message" data-id=${message.id}>
                  <div class="upper-info">
                    <p class="upper-info__user">
                      ${message.user_name}
                    </p>
                    <p class="upper-info__date">
                      ${message.created_at}
                    </p>
                  </div>`;
    var content = message.content ? `<p class="message__text">
                                       ${message.content}
                                     </p>` : "";

    return html + content + `<img class="image" src=${image}></div>`;
  }

  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');

    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.messages').append(html);
      $('#new_message')[0].reset(); // 入力欄クリア
      $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast'); // スクロール
    })
    .fail(function(){
      alert('error');
    })
    .always(function() { // ボタンをenableにする処理
      $('.send__button').removeAttr('disabled');
    });
  });
})