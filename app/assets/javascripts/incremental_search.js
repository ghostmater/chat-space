$(function(){
  var search_list = $("#user-search-result"); // 検索結果リスト
  var search_list_name = [];

  var member_list = $("#chat-group-users");   // チャットメンバリスト
  var member_list_name = [];


  function appendUser(user){
    var searchedUserHTML = `
      <div class="chat-group-user clearfix">
        <p class="chat-group-user__name">${user.name}</p>
        <div class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id=${user.id} data-user-name=${user.name}>追加</div>
      </div>`
    search_list.append(searchedUserHTML);
    search_list_name.push(user.name);
  }

  function addMember(id, name){
    var addMemberHTML = `
      <div class='chat-group-user clearfix js-chat-member' id='chat-group-user-${id}'>
        <input name='group[user_ids][]' type='hidden' value=${id}>
        <p class='chat-group-user__name'>${name}</p>
        <div class='user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn'>削除</div>
      </div>`
    member_list.append(addMemberHTML);
    member_list_name.push(name);
  }

  function appendErrMsgToHTML(msg){
    var errMsgHTML = `<div class="chat-group-user clearfix">${msg}</div>`
    search_list.append(errMsgHTML);
  }

  $('#user-search-field').on('keyup', function(){
    var input = $('#user-search-field').val();

    $.ajax({
      type:     'GET',
      url:      '/users',
      data:     { user_name: input },
      dataType: 'json'
    })

    .done(function(users){
      search_list.empty(); // リストを空にする
      if (users.length !== 0) {
        // 一致するユーザがある時
        if(input === "") {
          // 入力が空文字の時は何もしない
        } else {
          users.forEach(function(user){
            if(member_list_name.indexOf(user.name) === -1) {
              appendUser(user);
            }
          });
        }
      } else {
        appendErrMsgToHTML('一致するユーザーはありません');
      }
    })
    .fail(function(){
      alert('ユーザー検索に失敗しました');
    });
  });

  $(document).on('click', ".chat-group-user__btn--add", function(){
    $(this).parent().remove();
    var user_id = $(this).data("user-id")
    var user_name = $(this).data("user-name")
    addMember( user_id, user_name ); // チャットメンバーに追加
  });

  $(document).on('click', ".chat-group-user__btn--remove", function(){
    $(this).parent().remove(); // 削除
  });
})