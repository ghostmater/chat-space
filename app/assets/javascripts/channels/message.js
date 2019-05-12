$(function(){

  function buildHTML(message){
    var content = `<div class="message" data-id=${message.id}>
                  <div class="upper-info">
                    <p class="upper-info__user">
                      ${message.user_name}
                    </p>
                    <p class="upper-info__date">
                      ${message.created_at}
                    </p>
                  </div>
                  <p class="message__text">
                    ${message.content}
                  </p>`;
      var img = message.image.url ? `<img class="image" src=${message.image.url}></div>` : "";

      var html = content + img;
    return html;
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
    })
  });

  var reloadMessages = function() {
    //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
    last_message_id = $(".message:last").data('id'); // :lastで最後の要素
    $.ajax({
      //ルーティングで設定した通りのURLを指定
      url: `api/messages`, // 相対パス
      //ルーティングで設定した通りhttpメソッドをgetに指定
      type: 'get',
      dataType: 'json',
      //dataオプションでリクエストに値を含める
      data: {id: last_message_id}
    })
    .done(function(messages) {
      //追加するHTMLの入れ物を作る
      var insertHTML = '';
      //配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
      messages.forEach(function(message){
        insertHTML += buildHTML(message);
      });
      //メッセージを追加
      $('.messages').append(insertHTML);

      $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');
    })
    .fail(function() {
      console.log('error');
    });
  };

  setInterval(reloadMessages, 5000);
})