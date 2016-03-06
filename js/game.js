var game  = {
  /* <Constants> */
  /* </Constants> */

  /* <Variables> */
  numbers: ['ace', '2', '3', '4', '5', '6', '7', '8' , '9', '10', 'jack', 'queen', 'king'],
  suits: ['spades', 'hearts', 'clubs', 'diamonds'],
  deck_cards: [],
  player_1: {
    cards: [],
    score: 0,
    temp_score: 0,
    reset: function(){
      this.cards = []
      this.score = 0
      this.temp_score = 0
    },
    get_max_card_number: function(){
      var max_card_number = Math.max(
                          this.get_numeric_value(this.cards[0]),
                          this.get_numeric_value(this.cards[1])
                        )
      return max_card_number
    },
    get_min_card_number: function(){
      var min_card_number = Math.min(
                          this.get_numeric_value(this.cards[0]),
                          this.get_numeric_value(this.cards[1])
                        )
      return min_card_number
    }
  },
  player_2: {
    cards: [],
    score: 0,
    temp_score: 0,
    reset: function(){
      this.cards = []
      this.score = 0
      this.temp_score = 0
    },
    get_max_card_number: function(){
      max_card_number = Math.max(
                          this.get_numeric_value(this.cards[0]),
                          this.get_numeric_value(this.cards[1])
                        )
      return max_card_number
    },
    get_min_card_number: function(){
      var min_card_number = Math.min(
                          this.get_numeric_value(this.cards[0]),
                          this.get_numeric_value(this.cards[1])
                        )
      return min_card_number
    }
  },
  table_cards: [],
  rounds: [],
  /* </Variables> */

  /* <Functions> */
  init: function(){
    this.deck_cards = this.get_all_cards()
    this.player_1.reset()
    this.player_2.reset()
  },
  get_all_cards: function(){
    numbers = this.numbers
    suits = this.suits
    cards = []
    for(i in suits)
      for(j in numbers)
        cards.push({number: numbers[j],suit: suits[i]})
    return cards;
  },
  get_random_cards_from_deck: function(num_of_cards){
    random_cards = []
    for(var i = 0; i < num_of_cards; ++i){
      max_index = this.deck_cards.length
      random_index = Math.floor((Math.random() * max_index));
      card = this.deck_cards.splice(random_index, 1)[0]
      random_cards.push(card)
    }
    return random_cards
  },
  get_card_image_path: function(card){
    basename = card.number + '_of_' + card.suit + '.png'
    path = 'images/' + basename
    return path
  },
  get_numeric_value: function(card){
    if(card == undefined)
      debugger
    number = card.number
    numeric_value = null
    digit_regex = /^\d+$/;
    if(number == 'ace')
      numeric_value = 14
    else if(number == 'king')
      numeric_value = 13
    else if(number == 'queen')
      numeric_value = 12
    else if(number == 'jack')
      numeric_value = 11
    else if(digit_regex.test(number))
      numeric_value = parseInt(number)
    else
      alert('Incorrect card number')
    return numeric_value
  },
  deal_player_cards: function(){
    this.player_1.cards = this.get_random_cards_from_deck(2)
    this.player_2.cards = this.get_random_cards_from_deck(2)
  },
  deal_table_cards: function(deal_type){
    if(deal_type == 'flop')
      this.table_cards = this.table_cards.concat(this.get_random_cards_from_deck(3))
    else if(deal_type == 'turn' || deal_type == 'river')
      this.table_cards = this.table_cards.concat(this.get_random_cards_from_deck(1))
    else
      alert('Incorrect Deal type')
  },
  get_game_state: function(){ /* [null, 'preflop', 'flop', 'turn', 'river']*/
    total_player_cards_count = this.player_1.cards.length = this.player_2.cards.length
    table_cards_count = this.table_cards.length
    if (table_cards_count == 0 && total_player_cards_count == 0)
      state = null
    else if(table_cards_count == 0 && total_player_cards_count !=0 )
      state = 'preflop'
    else if(table_cards_count == 3)
      state = 'flop'
    else if(table_cards_count == 4)
      state = 'turn'
    else if(table_cards_count == 5)
      state = 'river'
    else 
      alert('Incorrect Game State')

    return state
  },
  finish_round: function(p1, p1_points, p2, p2_points){
    if (p1_points + p2_points != 100)
      alert('Incorrect points distribution')
    p1.score += p1_points
    p2.score += p2_points
  },
  tie_breaker: function(p1, p2){
    var negotiation_order = []
    for(i = 0; i < 2; ++i )
      if(p1.get_max_card_number() > p2.get_max_card_number())
        negotiation_order = [p1, p2]
      else if(p1.get_max_card_number() < p2.get_max_card_number())
        negotiation_order = [p2, p1]
      else if(p1.get_min_card_number() > p2.get_min_card_number())
        negotiation_order = [p1, p2]
      else if(p1.get_min_card_number() < p2.get_min_card_number())
        negotiation_order = [p2, p1]
      else
        negotiation_order = [p1, p2]
      return negotiation_order
  },
  sort_cards: function(cards){
    return cards.sort(function(a,b){ return game.get_numeric_value(b) - game.get_numeric_value(a)})
  },
  get_negotiation_order: function(){
    state = this.get_game_state()
    dealt_states = ['flop', 'turn', 'river']
    negotiation_order = null
    if(state == 'preflop')
      negotiation_order = get_preflop_negotiation_order()
    else if(dealt_states.indexOf(state) > -1)
      negotiation_order = get_dealt_cards_negotiation_order()
    else
      alert('Incorrect Game State')
    return negotiation_order
  },
  get_preflop_negotiation_order: function(){
    var negotiation_order = []
    players = [player_1, player_2]
    for( i in players){
      player = players[i]
      player.temp_score = 0
      if(player.cards.length == 2){
        max_card_number = player.get_max_card_number()
        if(player.cards[0].number = player.cards[1].number)
          player.temp_score += 15
        if(player.cards[0].suit == player.cards[1].suit)
          player.temp_score += 0.5
        player.temp_score += max_card_number
      }
    }
    if(player_1.temp_score >= player_2.temp_score)
      negotiation_order = [player_1, player_2]
    else
      negotiation_order = [player_2, player_1]

    return negotiation_order
  },
  get_dealt_cards_negotiation_order: function(){
    var negotiation_order = []
    p1_rank = get_hand_strength(player_1)
    p2_rank = get_hand_strength(player_2)
    if(p1_rank > p2_rank)
      negotiation_order = [player_1, player_2]
    else if(p1_rank < p2_rank)
      negotiation_order = [player_2, player_1]
    else
      negotiation_order = this.tie_breaker(player_1, player_2)

    return negotiation_order
  },
  get_hand_strength: function(player){
    state = this.get_game_state()
    total_cards = this.deal_table_cards.concat(player.cards)
    dealt_states = ['flop', 'turn', 'river']
    if (dealt_states.indexOf(state) == -1)
      return -1;
    hand_type = get_hand_type(total_cards)
    return hand_type.rank
  },
  /* <FALTU CODE> :( */
  get_hand_type: function(cards){
    sorted_cards = this.sort_cards(cards)
    if(this.is_royal_flush(sorted_cards))
      return {type: 'royal_flush', rank: 1}
    if(this.is_straight_flush(sorted_cards))
      return {type: 'straight_flush', rank: 2}
    if (this.is_four_of_a_kind(sorted_cards))
      return {type: 'four_of_a_kind', rank: 3}
    if (this.is_full_house(sorted_cards))
      return {type: 'full_house', rank: 4}
    if (this.is_flush(sorted_cards))
      return {type: 'flush', rank: 5}
    if (this.is_straight(sorted_cards))
      return {type: 'straight', rank: 6}
    if (this.is_three_of_a_kind(sorted_cards))
      return {type: 'three_of_a_kind', rank: 7}
    if (this.is_two_pair(sorted_cards))
      return {type: 'two_pair', rank: 8}
    if (this.is_one_pair(sorted_cards))
      return {type: 'one_pair', rank: 9}
    
    return {type:'high_card', rank: 10}

  },
  is_royal_flush: function(cards){
    royal_cards = ['ace', 'king', 'queen', 'jack', '10']
    cards = cards.slice(0,5)
    card_numbers = []
    card_suits = []
    for(i in cards){
      card_numbers.push(cards[i].number)
      card_suits.push(cards[i].suit)
    }
    royal_cards_flag = royal_cards.sort().toString() == card_numbers.sort().toString()
    same_suit_flag = $.unique(card_suits).length == 1
    return royal_cards_flag && same_suit_flag
  },
  is_straight_flush: function(cards){
    card_count = cards.length
    for(i = 0,j = i + 4; j < card_count ; ++i, ++j)
    {
      max_number = this.get_numeric_value(cards[i])
      min_number = this.get_numeric_value(cards[j])
      same_suit_flag = true
      suit = cards[i].suit
      for(var k = i; k<=j; ++k)
        same_suit_flag = same_suit_flag && (suit == cards[k].suit)
      if((max_number - min_number == 4) && same_suit_flag == true)
        return true;
    }
    return false
  },
  is_four_of_a_kind: function(cards){
    bool = false
    count_of_numbers = new Array(15).fill(0)
    for(var i = 0; i < cards.length; ++i)
    {
      count_of_numbers[this.get_numeric_value(cards[i])]++
    }

    for(var i = 0; i < count_of_numbers.length; ++i)
      if(count_of_numbers[i] == 4)
        bool = true
    return bool
  },
  is_full_house: function(cards){
    count_of_numbers = new Array(15).fill(0)
    for(var i = 0; i < cards.length; ++i)
      count_of_numbers[this.get_numeric_value(cards[i])]++

    for(var i = 0; i < count_of_numbers.length; ++i)
      for(var j = 0; j < count_of_numbers.length; ++j)
        if(count_of_numbers[i] == 3 && count_of_numbers[j] == 2)
          return true
    return false
  },
  is_flush: function(cards){
    suit_count = {}
    suits = []
    for(i in cards){
      suits.push(cards[i].suit)
    }
    suits.forEach(function(x) { suit_count[x] = (suit_count[x] || 0)+1; });
    for(suit in suit_count)
      if(suit_count[suit] == 5)
        return true;
    return false

  },
  is_straight: function(cards){
    card_count = cards.length
    for(i = 0,j = i + 4; j < card_count ; ++i, ++j)
    {
      max_number = this.get_numeric_value(cards[i])
      min_number = this.get_numeric_value(cards[j])
      if(max_number - min_number == 4)
        return true;
    }
    return false
  },
  is_three_of_a_kind: function(cards){
    count_of_numbers = new Array(15).fill(0)
    for(var i = 0; i < cards.length; ++i)
      count_of_numbers[this.get_numeric_value(cards[i])]++

    for(var i = 0; i < count_of_numbers.length; ++i)
      if(count_of_numbers[i] == 3)
        return true
    return false
  },
  is_two_pair: function(cards){
    count_of_numbers = new Array(15).fill(0)
    for(var i = 0; i < cards.length; ++i)
      count_of_numbers[this.get_numeric_value(cards[i])]++

    for(var i = 0; i < count_of_numbers.length; ++i)
      for(var j = 0; j < i; ++j)
        if(count_of_numbers[i] == 2 && count_of_numbers[j] == 2)
          return true
    return false
  },
  is_one_pair: function(cards){
    count_of_numbers = new Array(15).fill(0)
    for(var i = 0; i < cards.length; ++i)
      count_of_numbers[this.get_numeric_value(cards[i])]++

    for(var i = 0; i < count_of_numbers.length; ++i)
      if(count_of_numbers[i] == 2)
        return true
    return false
  }
  /* </FALTU CODE> :( */
  /* </Functions> */

}
game.init();