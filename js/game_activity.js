var game_activity = {
	
}
game.init()
game.deal_player_cards() // => cards => game.player_1.cards[0], game.player_1.cards[1], similarly for player 2
game.get_card_image_path(card)//=> image of the card
game.get_negotiation_order()// => [player_1, player_2] or reverse

game.deal_table_cards(type) // => type is one of ['flop', 'turn', 'river'], game.table_cards would give you the cards
game.finish_round(p1, p1_points, p2, p2_points)// => To finish the round, either EOG (game)or EON (negotiations)
