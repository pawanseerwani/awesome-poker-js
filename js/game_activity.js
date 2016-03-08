var game_activity = {
  init: function(){
    game.init()
    $('.start-game').show()
    $('.game-container').hide()
    this.add_event_handlers()
  },
  add_event_handlers: function(){
    $('.start-game').on('click',function(){
      $('.start-game').hide()
      $('.game-container').show()
      game_activity.start_round()
    })
  },
  update_negotiator_dom: function(player){
    var div_class = player.div_class
    $(['.', div_class, ' .score'].join('')).html(player.score)
    $(['.', div_class, ' .c1 img'].join('')).attr('src', game.get_card_image_path(player.cards[0]))
    $(['.', div_class, ' .c2 img'].join('')).attr('src', game.get_card_image_path(player.cards[1]))
    $(['.', div_class, ' .c2 img'].join(''))
    $(['.', div_class, ' .make_offer_value_input'].join('')).prop('disabled', false);
    $(['.', div_class, ' .accept_offer'].join('')).hide()
    $(['.', div_class, ' .make_offer'].join('')).show()

    $(['.', div_class, ' .make_offer_value_button'].join('')).unbind();
    $(['.', div_class, ' .make_offer_value_button'].join('')).on('click', this.make_offer)
  },
  update_other_player_dom: function(player){
    var div_class = player.div_class
    $(['.', div_class, ' .score'].join('')).html(player.score)
    $(['.', div_class, ' .c1 img'].join('')).attr('src', game.get_card_image_path(player.cards[0]))
    $(['.', div_class, ' .c2 img'].join('')).attr('src', game.get_card_image_path(player.cards[1]))
    $(['.', div_class, ' .make_offer_value_input'].join('')).prop('disabled', true);
    $(['.', div_class, ' .accept_offer'].join('')).hide()
    $(['.', div_class, ' .make_offer'].join('')).hide()
  },
  update_table_cards_dom: function(){
    table_cards = game.table_cards
    card_images_dom = ''
    for(var i=0; i < table_cards.length; ++i)
      card_images_dom += '<img src = "' + game.get_card_image_path(table_cards[i])+'"/>'
    $('.table-cards-images').html(card_images_dom)
  },
  make_offer: function(){
    var div_class = game.negotiator.div_class
    var offer_string = $(['.', div_class, ' .make_offer_value_input'].join('')).val();
    var offer_value = parseInt(offer_string);
    game.deal_offered = offer_value

    var other_div_class = game.other_player.div_class
    $(['.', other_div_class, ' .accept_offer .value'].join('')).html(offer_value)
    $(['.', other_div_class, ' .accept_offer_button'].join('')).unbind();
    $(['.', other_div_class, ' .accept_offer_button'].join('')).on('click', game_activity.accept_offer);
    $(['.', other_div_class, ' .accept_offer'].join('')).show()
  },
  accept_offer: function(){
    game.finish_hand()
    game_activity.start_round()
  },
  no_offer: function(){
    if(game.get_game_state() == 'river')
      game.finish_hand()
    game_activity.start_round()
  },
  /** <Event Handlers> **/
  start_round: function(){
    game.deal_cards()
    players_order = game.get_negotiation_order()
    negotiator = players_order[0]
    other_player = players_order[1]
    this.update_negotiator_dom(negotiator)
    this.update_other_player_dom(other_player)
    this.update_table_cards_dom()
    $('.no_offer').on('click', game_activity.no_offer)
  }
  /** </Event Handlers> **/
}
game_activity.init();
$('.start-game').click();
/*
game.init()
game.deal_player_cards() // => cards => game.player_1.cards[0], game.player_1.cards[1], similarly for player 2
game.get_card_image_path(card)//=> image of the card
game.get_negotiation_order()// => [player_1, player_2] or reverse

game.deal_table_cards(type) // => type is one of ['flop', 'turn', 'river'], game.table_cards would give you the cards
game.finish_hand(p1, p1_points, p2, p2_points)// => To finish the round, either EOG (game)or EON (negotiations)
*/