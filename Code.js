        document.addEventListener('DOMContentLoaded', function(event){
			let WhoseTurnIsIt = 1;				//1 - white, 0 - black
			let AmInCheck = 0;	
			let CurrentlyPromoting = 0;				
			let MyCoordinates = ['', '', ''];
			let TakenFigures = [];
			let CurrentDanger = [];
			let moves = [];
			let OldCoordinates;
			let Positions = [];
			let WTimer = 6000;
			let BTimer = 6000;
			let board = [
						  ['BlackRookL', 'BlackKnight', 'BlackBishop', 'BlackQueen', 'BlackCar', 'BlackBishop', 'BlackKnight', 'BlackRookR'],
						  ['BlackPawn', 'BlackPawn', 'BlackPawn', 'BlackPawn', 'BlackPawn', 'BlackPawn', 'BlackPawn', 'BlackPawn'],
						  ['', '', '', '', '', '', '', ''],
						  ['', '', '', '', '', '', '', ''],
						  ['', '', '', '', '', '', '', ''],
						  ['', '', '', '', '', '', '', ''],
						  ['WhitePawn', 'WhitePawn', 'WhitePawn', 'WhitePawn', 'WhitePawn', 'WhitePawn', 'WhitePawn', 'WhitePawn'],
						  ['WhiteRookL', 'WhiteKnight', 'WhiteBishop', 'WhiteQueen', 'WhiteCar', 'WhiteBishop', 'WhiteKnight', 'WhiteRookR']
						];
			let Kvadrati = document.querySelectorAll('.board-square');

			let EnPassant = 0;
			let FiftyMoveRuleCounter = 0;

			let BlackCastleLong = 1;
			let WhiteCastleLong = 1;
			let BlackCastleShort = 1;
			let WhiteCastleShort = 1;


			let PieceSet = 'Set-1';
			let ColorPalate = 1;


			const VisualiseSquares = () => {
				for(let i = 0; i < 8; i++){
					for(let j = 0; j < 8; j++){
						if(ColorPalate ==1){
							if((parseInt(i)+parseInt(j))%2==0){
								document.querySelector('#Tabl1 tr:nth-child(' + (parseInt(i)+1) + ') td:nth-child(' + (parseInt(j)+1) + ')').firstElementChild.style.background = '#F0D9B5';
							} else{
								document.querySelector('#Tabl1 tr:nth-child(' + (parseInt(i)+1) + ') td:nth-child(' + (parseInt(j)+1) + ')').firstElementChild.style.background = '#B58863';								
							}
						}
						else if(ColorPalate ==2){
							if((parseInt(i)+parseInt(j))%2==0){
								document.querySelector('#Tabl1 tr:nth-child(' + (parseInt(i)+1) + ') td:nth-child(' + (parseInt(j)+1) + ')').firstElementChild.style.background = '#DCDCDC';
							} else{
								document.querySelector('#Tabl1 tr:nth-child(' + (parseInt(i)+1) + ') td:nth-child(' + (parseInt(j)+1) + ')').firstElementChild.style.background = '#ABABAB';							
							}							
						}
						else if(ColorPalate ==3){
							if((parseInt(i)+parseInt(j))%2==0){
								document.querySelector('#Tabl1 tr:nth-child(' + (parseInt(i)+1) + ') td:nth-child(' + (parseInt(j)+1) + ')').firstElementChild.style.background = '#F0D8BF';
							} else{
								document.querySelector('#Tabl1 tr:nth-child(' + (parseInt(i)+1) + ') td:nth-child(' + (parseInt(j)+1) + ')').firstElementChild.style.background = '#BA5546';							
							}							
						}
					}
				}
			}

			const VisualiseBoard = () => {
				for(let i = 0; i < 8; i++){
					for(let j = 0; j < 8; j++){
						if(board[i][j] != ''){
							document.querySelector('#Tabl1 tr:nth-child(' + (parseInt(i)+1) + ') td:nth-child(' + (parseInt(j)+1) + ')').firstElementChild.style.backgroundImage = "url(" + PieceSet + '/' + board[i][j].substring(0, 6) + '.png)';
							}else{
							document.querySelector('#Tabl1 tr:nth-child(' + (parseInt(i)+1) + ') td:nth-child(' + (parseInt(j)+1) + ')').firstElementChild.style.backgroundImage = "url()";							
						}
					} 
				}
			}

			VisualiseSquares();
			VisualiseBoard();

			Kvadrati.forEach(item => {
				item.addEventListener('click', (e) => {
					if(!CurrentlyPromoting){
						if(!AmInCheck && e.target.classList.contains('GREENSQUARE')){
							//Green square - move figure, end of turn
							RemGreenSquares();
							EndOfTurn(MyCoordinates, e.target);
						}

						else if(AmInCheck && e.target.classList.contains('GREENSQUARE')){
							//Green square - move figure, end of turn
							//Check
							RemGreenSquares();

							let MovingFigure = MyCoordinates[2];
							if(CurrentDanger == 'double danger' && MovingFigure.split('')[5] != 'C'){
								//Double check - can't be blocked, must move the king
							}
							else if (MovingFigure.split('')[5] != 'C'){
								if(!document.querySelector('#Tabl1 tr:nth-child(' + (parseInt(GetCoordinates(e.target)[0])+1) + ') td:nth-child(' + (parseInt(GetCoordinates(e.target)[1])+1) + ')').firstElementChild.classList.contains('PURPLESQUARE')){
									//Not blocking the check
								}
								else{
									//Blocking
									EndOfTurn(MyCoordinates, e.target);
								}
							}
							else if (MovingFigure.split('')[5] == 'C'){
								//Moving the king
								EndOfTurn(MyCoordinates, e.target);
							}
						}

						else{
							RemGreenSquares();
							MyCoordinates = GetCoordinates(e.target);

							if (MyCoordinates[2] == ''){
								//Clicked on empty square
							}
							else if (WhoseTurnIsIt && MyCoordinates[2].split('')[0]=='B'){
								//Square has enemy figure
							}
							else if (!WhoseTurnIsIt && MyCoordinates[2].split('')[0]=='W'){
								//Square has enemy figure
							}

							else if (WhoseTurnIsIt && MyCoordinates[2].split('')[0]=='W'){	
								//Square has owned figure - show where it can move	
								switch(MyCoordinates[2].split('')[5]){
									case 'P':
										WhitePawnMovement(MyCoordinates);
										break;
									case 'B':
										BishopMovement(MyCoordinates);
										break;
									case 'R':
										RookMovement(MyCoordinates);
										break;
									case 'K':
										KnightMovement(MyCoordinates);
										break;
									case 'C':
										KingMovement(MyCoordinates);
										break;
									case 'Q':
										BishopMovement(MyCoordinates);
										RookMovement(MyCoordinates);
										break;
								}
							}
							else if (!WhoseTurnIsIt && MyCoordinates[2].split('')[0]=='B'){
								//Square has owned figure - show where it can move	
								switch(MyCoordinates[2].split('')[5]){
									case 'P':
										BlackPawnMovement(MyCoordinates);
										break;
									case 'B':
										BishopMovement(MyCoordinates);
										break;
									case 'R':
										RookMovement(MyCoordinates);
										break;
									case 'K':
										KnightMovement(MyCoordinates);
										break;
									case 'C':
										KingMovement(MyCoordinates);
										break;
									case 'Q':
										BishopMovement(MyCoordinates);
										RookMovement(MyCoordinates);
										break;
								}
							}
						}
						ColorisePurpleAndGreen();
					}
				});
			});

			let BoardRadioButtons = document.querySelectorAll('.board-radio');
			BoardRadioButtons.forEach(item => {
				item.addEventListener('change', (e) => {
					if(item.classList.contains('board-brown')){
						ColorPalate = 1;
					}else if (item.classList.contains('board-grey')){
						ColorPalate = 2;
					}else if (item.classList.contains('board-red')){
						ColorPalate = 3;
					}

					VisualiseSquares();
					VisualiseBoard();
					ColorisePurpleAndGreen();
				});
			});

			let PieceButtons = document.querySelectorAll('.pieces-radio');
			PieceButtons.forEach(item => {
				item.addEventListener('change', (e) => {
					if(item.classList.contains('piece-type-1')){
						PieceSet = 'Set-1';
					}
					else if(item.classList.contains('piece-type-2')){
						PieceSet = 'Set-2';
					}					
					else if(item.classList.contains('piece-type-3')){
						PieceSet = 'Set-3';
					}
					VisualiseSquares();
					VisualiseBoard();	
					ColorisePurpleAndGreen();
				});
			});


			let ResetButton = document.querySelector('.reset');
			ResetButton.addEventListener('click', (e) => {
				WhoseTurnIsIt = 1;
				AmInCheck = 0;					
				MyCoordinates = ['', '', ''];
				TakenFigures = [];
				CurrentDanger = [];
				moves = [];
				Positions = [];
				WTimer = 6000;
				BTimer = 6000;
				board = [
							  ['BlackRookL', 'BlackKnight', 'BlackBishop', 'BlackQueen', 'BlackCar', 'BlackBishop', 'BlackKnight', 'BlackRookR'],
							  ['BlackPawn', 'BlackPawn', 'BlackPawn', 'BlackPawn', 'BlackPawn', 'BlackPawn', 'BlackPawn', 'BlackPawn'],
							  ['', '', '', '', '', '', '', ''],
							  ['', '', '', '', '', '', '', ''],
							  ['', '', '', '', '', '', '', ''],
							  ['', '', '', '', '', '', '', ''],
							  ['WhitePawn', 'WhitePawn', 'WhitePawn', 'WhitePawn', 'WhitePawn', 'WhitePawn', 'WhitePawn', 'WhitePawn'],
							  ['WhiteRookL', 'WhiteKnight', 'WhiteBishop', 'WhiteQueen', 'WhiteCar', 'WhiteBishop', 'WhiteKnight', 'WhiteRookR']
							];

				EnPassant = 0;
				FiftyMoveRuleCounter = 0;

				BlackCastleLong = 1;
				WhiteCastleLong = 1;
				BlackCastleShort = 1;
				WhiteCastleShort = 1;
				VisualiseSquares();
				VisualiseBoard();
				document.querySelector('#OpeningNameDiv').innerText = 'Starting position';


				let WhiteBar = document.querySelector('.white-taken-figures');
				let BlackBar = document.querySelector('.black-taken-figures');
				[...WhiteBar.children].forEach(item => {
					item.remove();
				});
				[...BlackBar.children].forEach(item => {
					item.remove();
				});

				let MoveListDiv = document.querySelector('.movelist');
				[...MoveListDiv.children].forEach(item => {
					item.remove();
				});
			});



			let TimerButtons = document.querySelectorAll('.timer-button');
			TimerButtons.forEach(item => {
				item.addEventListener('click', (e) => {
					if(item.dataset.color == 'white'){
						if(item.dataset.time.substring(0,1) == '='){
							WTimer = parseInt(item.dataset.time.substring(1,item.dataset.time.length));
						}else if(item.dataset.time.substring(0,1) == '+'){
							WTimer += parseInt(item.dataset.time.substring(1,item.dataset.time.length));
						}				
					}
					else if(item.dataset.color == 'black'){
						if(item.dataset.time.substring(0,1) == '='){
							BTimer = parseInt(item.dataset.time.substring(1,item.dataset.time.length));
						}else if(item.dataset.time.substring(0,1) == '+'){
							BTimer += parseInt(item.dataset.time.substring(1,item.dataset.time.length));
						}				
					}					
				});
			});

			let TimerCheckbox = document.querySelector('#TimerCheckbox');
			let intervalId;
			let WhiteTimer = document.querySelector('.white-timer');
			let BlackTimer = document.querySelector('.black-timer');

			TimerCheckbox.addEventListener('change', (e) => {
			  if (TimerCheckbox.checked) {
			    TimerButtons.forEach(item => {
			      item.style.display = 'block';
			    });
			    intervalId = setInterval(function() {
			      if (WhoseTurnIsIt) {
			        WTimer -= 1;
			      } else {
			        BTimer -= 1;
			      }
			      if (WTimer == 0) {
			        //Block movement
			        alert('White ran out of time!');
			        AmInCheck = 1;
				    clearInterval(intervalId);
			        Kvadrati.forEach(item1 => {
			          if (item.classList.contains('PURPLESQUARE')) item.classList.remove('PURPLESQUARE');
			        });
			      } else if (BTimer == 0) {
			        //Block movement
			        alert('Black ran out of time!');
			        AmInCheck = 1;
				    clearInterval(intervalId);
			        Kvadrati.forEach(item1 => {
			          if (item.classList.contains('PURPLESQUARE')) item.classList.remove('PURPLESQUARE');
			        });
			      }
			      WhiteTimer.innerText = Math.floor(parseInt(WTimer) / 600) + ':' + (parseInt(WTimer) % 600)/10;
			      BlackTimer.innerText = Math.floor(parseInt(BTimer) / 600) + ':' + (parseInt(BTimer) % 600)/10;

			    }, 100);
			  } else {
			    clearInterval(intervalId);
			    TimerButtons.forEach(item => {
			      item.style.display = 'none';
			    });
			  }
			});



			let ColorisePurpleAndGreen = () => {
				//Show the green and purple squares
				let WasPurple = 0;
				Kvadrati.forEach(item => {
					if(!item.classList.contains('GREENSQUARE')){
						if(item.style.backgroundImage.substring(0,19) == 'url("Purple.png"), '){
							item.style.backgroundImage = item.style.backgroundImage.substring(19, item.style.backgroundImage.length);
							WasPurple = 1;
						}

						if( item.style.backgroundImage.substring(0,18) == 'url("Green.png"), '){
							item.style.backgroundImage = item.style.backgroundImage.substring(18, item.style.backgroundImage.length);
						}

						if(WasPurple){
							item.style.backgroundImage = 'url("Purple.png"), ' + item.style.backgroundImage;
							WasPurple = 0;
						}
					}
					else{

						if(item.style.backgroundImage.substring(0,19) == 'url("Purple.png"), '){
							item.style.backgroundImage = item.style.backgroundImage.substring(19, item.style.backgroundImage.length);
							WasPurple = 1;
						}

						if( item.style.backgroundImage.substring(0,18) != 'url("Green.png"), '){
							item.style.backgroundImage = 'url("Green.png"), ' + item.style.backgroundImage;
						}

						if(WasPurple){
							item.style.backgroundImage = 'url("Purple.png"), ' + item.style.backgroundImage;
							WasPurple = 0;
						}								
					}
					if(item.classList.contains('PURPLESQUARE')){
						if(item.style.backgroundImage.substring(0,19) != 'url("Purple.png"), '){
							item.style.backgroundImage = 'url("Purple.png"), ' + item.style.backgroundImage;
						}
					}
				});
			}


			const GenerateFEN = () => {
				let FEN = '';
				let FENrow = '';
				for(let i = 0; i < 8; i++){
					let EmptySquareCounter = 0; 
					for(let j = 0; j < 8; j++){
						switch(board[i][j]){
							case '':
								EmptySquareCounter += 1;
								break;
							case 'BlackRookR':
								if(EmptySquareCounter != 0){
									FENrow += EmptySquareCounter;
									EmptySquareCounter = 0;
								}
								FENrow += 'r';
								break;
							case 'BlackRookL':
								if(EmptySquareCounter != 0){
									FENrow += EmptySquareCounter;
									EmptySquareCounter = 0;
								}
								FENrow += 'r';
								break;
							case 'WhiteRookR':
								if(EmptySquareCounter != 0){
									FENrow += EmptySquareCounter;
									EmptySquareCounter = 0;
								}
								FENrow += 'R';
								break;
							case 'WhiteRookL':
								if(EmptySquareCounter != 0){
									FENrow += EmptySquareCounter;
									EmptySquareCounter = 0;
								}
								FENrow += 'R';
								break;
							case 'BlackKnight':
								if(EmptySquareCounter != 0){
									FENrow += EmptySquareCounter;
									EmptySquareCounter = 0;
								}
								FENrow += 'n';
								break;
							case 'WhiteKnight':
								if(EmptySquareCounter != 0){
									FENrow += EmptySquareCounter;
									EmptySquareCounter = 0;
								}
								FENrow += 'N';
								break;
							case 'BlackBishop':
								if(EmptySquareCounter != 0){
									FENrow += EmptySquareCounter;
									EmptySquareCounter = 0;
								}
								FENrow += 'b';
								break;
							case 'WhiteBishop':
								if(EmptySquareCounter != 0){
									FENrow += EmptySquareCounter;
									EmptySquareCounter = 0;
								}
								FENrow += 'B';
								break;
							case 'BlackCar':
								if(EmptySquareCounter != 0){
									FENrow += EmptySquareCounter;
									EmptySquareCounter = 0;
								}
								FENrow += 'k';
								break;
							case 'WhiteCar':
								if(EmptySquareCounter != 0){
									FENrow += EmptySquareCounter;
									EmptySquareCounter = 0;
								}
								FENrow += 'K';
								break;
							case 'BlackQueen':
								if(EmptySquareCounter != 0){
									FENrow += EmptySquareCounter;
									EmptySquareCounter = 0;
								}
								FENrow += 'q';
								break;
							case 'WhiteQueen':
								if(EmptySquareCounter != 0){
									FENrow += EmptySquareCounter;
									EmptySquareCounter = 0;
								}
								FENrow += 'Q';
								break;
							case 'BlackPawn':
								if(EmptySquareCounter != 0){
									FENrow += EmptySquareCounter;
									EmptySquareCounter = 0;
								}
								FENrow += 'p';
								break;
							case 'WhitePawn':
								if(EmptySquareCounter != 0){
									FENrow += EmptySquareCounter;
									EmptySquareCounter = 0;
								}
								FENrow += 'P';
								break;
						}
						if(board[i][j] == '' && j == 7){
							FENrow += EmptySquareCounter;
						}						
					}
					if(i != 7){
						FENrow += '/';
					}
					FEN += FENrow;
					FENrow = '';
				}
				if(WhoseTurnIsIt){
					FEN += ' w ';
				}else{
					FEN += ' b ';
				}
				let FENCastle = '';
				if(WhiteCastleShort) FENCastle += 'K';
				if(WhiteCastleLong) FENCastle += 'Q';
				if(BlackCastleShort) FENCastle += 'k';
				if(BlackCastleLong) FENCastle += 'q';
				if(FENCastle == '') FENCastle = '-';

				FEN += FENCastle;

				return FEN;
			}


			const GetOpeningName = () => {
				let FEN = GenerateFEN();
				fetch('https://raw.githubusercontent.com/hayatbiralem/eco.json/master/eco.json')
	                 .then(r => r.json())
	                 .then(data => {
	                 	for(let i = 0; i<data.length; i++){
	                 		if(data[i].fen == FEN){
	                 			document.querySelector('#OpeningNameDiv').innerText = data[i].name;
	                 			break;
	                 		}
	                 	}	
	               	});
			}

			function indexOf2dArray(array2d, itemtofind) {
			    index = [].concat.apply([], ([].concat.apply([], array2d))).indexOf(itemtofind);
			    if (index === -1) { return false; }
			    numColumns = array2d[0].length;
			    row = parseInt(index / numColumns)
			    col = index % numColumns;
			    return [row, col]; 
			}

			const MakeSquareGreen = (red, kol) => {
				document.querySelector('#Tabl1 tr:nth-child(' + (parseInt(red)+1) + ') td:nth-child(' + (parseInt(kol)+1) + ')').firstElementChild.classList.add('GREENSQUARE');			
			}

			const GetCoordinates = (target) => {
				//Target - clicked div, not the table cell it is located in
				let ColIndex =Array.prototype.indexOf.call(target.parentNode.parentNode.children, target.parentNode);
				let RowIndex =Array.prototype.indexOf.call(target.parentNode.parentNode.parentNode.children, target.parentNode.parentNode);
				let Coordinates = [RowIndex, ColIndex, board[RowIndex][ColIndex] ];
				return Coordinates;
			}

			const RemGreenSquares = () => {
				Kvadrati.forEach(item => {
					if (item.classList.contains('GREENSQUARE')){
						item.classList.remove('GREENSQUARE');
					}
				});
			}

			const EndOfTurn = (MyCoordinates1, BUTON) => {
				//End of turn - promotion, en passant, opening name, show board, add turn to list
				let move = '';
				let DidITakeAFigure = 0;

				//Move figure
				let MovingFigure = MyCoordinates1[2];
				board[MyCoordinates1[0]][MyCoordinates1[1]]= '';
				OldCoordinates = [MyCoordinates1[0], MyCoordinates1[1]];
				MyCoordinates = GetCoordinates(BUTON);
				if (board[MyCoordinates[0]][MyCoordinates[1]] != ''){
					DidITakeAFigure = 1;
					TakenFigures.push(board[MyCoordinates[0]][MyCoordinates[1]]);
				}
				board[MyCoordinates[0]][MyCoordinates[1]] = MovingFigure;
				

				//If this resulted in check, return the figure back to where it was 
				if(WhoseTurnIsIt && CheckForDanger(indexOf2dArray(board, 'WhiteCar'), 'B') != 'safe'){
					board[OldCoordinates[0]][OldCoordinates[1]] = MovingFigure;
					if(DidITakeAFigure){
						board[MyCoordinates[0]][MyCoordinates[1]] = TakenFigures[TakenFigures.length];						
						TakenFigures = TakenFigures.pop();
					}
					else{
						board[MyCoordinates[0]][MyCoordinates[1]] = '';												
					}
					DidITakeAFigure = 0;
				}
				else if(!WhoseTurnIsIt && CheckForDanger(indexOf2dArray(board, 'BlackCar'), 'W') != 'safe') {
					board[OldCoordinates[0]][OldCoordinates[1]] = MovingFigure;
					if(DidITakeAFigure){
						board[MyCoordinates[0]][MyCoordinates[1]] = TakenFigures[TakenFigures.length];						
						TakenFigures = TakenFigures.pop();
					}
					else{
						board[MyCoordinates[0]][MyCoordinates[1]] = '';												
					}
					DidITakeAFigure = 0;
				}
				else{
					if(MovingFigure.split('')[5]=='P' &&  MovingFigure.split('')[0] == 'W' && WhoseTurnIsIt && MyCoordinates[0]=='0'){
						FiftyMoveRuleCounter = 0;
						EnPassant = [];
						CurrentlyPromoting = 1;
						//Promotion
						document.querySelector('#Tabl1').style.filter = 'brightness(10%)';
						
						Promotion(DidITakeAFigure);
					}
					else if (!WhoseTurnIsIt && MovingFigure.split('')[5]=='P' &&  MovingFigure.split('')[0] == 'B' &&  MyCoordinates[0]=='7'){
						FiftyMoveRuleCounter = 0;
						EnPassant = [];
						CurrentlyPromoting = 1;
						//Promotion
						document.querySelector('#Tabl1').style.filter = 'brightness(10%)';
						
						Promotion(DidITakeAFigure);
					}
					else{
						//Moving pawn
						if(MovingFigure.split('')[5]=='P'){
							FiftyMoveRuleCounter = 0;
							if(EnPassant[0] == MyCoordinates[0] && EnPassant[1] == MyCoordinates[1]){
								if(WhoseTurnIsIt){
									TakenFigures.push(board[parseInt(MyCoordinates[0])+1][MyCoordinates[1]]);
									board[parseInt(MyCoordinates[0])+1][MyCoordinates[1]] = '';
									DidITakeAFigure = 1;

								}else{
									TakenFigures.push(board[parseInt(MyCoordinates[0])-1][MyCoordinates[1]]);
									board[parseInt(MyCoordinates[0])-1][MyCoordinates[1]] = '';
									DidITakeAFigure = 1;
								}
							}
						}
						else{
							FiftyMoveRuleCounter += 1;
						}

						//En-passant
						if(MovingFigure.split('')[5]=='P' &&  MovingFigure.split('')[0] == 'W' && WhoseTurnIsIt && MyCoordinates[0]=='4' && OldCoordinates[0] == '6'){
							EnPassant = [parseInt(MyCoordinates[0])+1, MyCoordinates[1]];
						}
						else if(MovingFigure.split('')[5]=='P' &&  MovingFigure.split('')[0] == 'B' && !WhoseTurnIsIt && MyCoordinates[0]=='3' && OldCoordinates[0] == '1'){
							EnPassant = [parseInt(MyCoordinates[0])-1, MyCoordinates[1]];
						} else{
							EnPassant = [];
						}


						//Castle
						if(WhoseTurnIsIt && WhiteCastleLong && MyCoordinates[1] == '2' && MovingFigure.split('')[5]=='C'){
							board[7][0]='';
							board[7][3]='WhiteRookL';
							WhiteCastleLong = 0;							
							WhiteCastleShort = 0;							
							move = '0-0-0';						
						}
						if(WhoseTurnIsIt && WhiteCastleShort && MyCoordinates[1] == '6' && MovingFigure.split('')[5]=='C'){
							board[7][7]='';
							board[7][5]='WhiteRookR';
							WhiteCastleLong = 0;							
							WhiteCastleShort = 0;							
							move = '0-0';						
						}
						if(!WhoseTurnIsIt && BlackCastleLong && MyCoordinates[1] == '2' && MovingFigure.split('')[5]=='C'){
							board[0][0]='';
							board[0][3]='BlackRookL';
							BlackCastleLong = 0;							
							BlackCastleShort = 0;	
							move = '0-0-0';						
						}
						if(!WhoseTurnIsIt && BlackCastleShort && MyCoordinates[1] == '6' && MovingFigure.split('')[5]=='C'){
							board[0][7]='';
							board[0][5]='BlackRookR';
							BlackCastleLong = 0;							
							BlackCastleShort = 0;							
							move = '0-0';						
						}
						if(MovingFigure.split('')[0]=='B' && MovingFigure.split('')[5]=='R' && MovingFigure.split('')[9]=='L'){
							BlackCastleLong = 0;
						}
						if(MovingFigure.split('')[0]=='B' && MovingFigure.split('')[5]=='R' && MovingFigure.split('')[9]=='R'){
							BlackCastleShort = 0;
						}
						if(MovingFigure.split('')[0]=='W' && MovingFigure.split('')[5]=='R' && MovingFigure.split('')[9]=='L'){
							WhiteCastleLong = 0;
						}						
						if(MovingFigure.split('')[0]=='W' && MovingFigure.split('')[5]=='R' && MovingFigure.split('')[9]=='R'){
							WhiteCastleShort = 0;
						}
						if(MovingFigure.split('')[0]=='W' && MovingFigure.split('')[5]=='C'){
							WhiteCastleLong = 0;							
							WhiteCastleShort = 0;
						}											
						if(MovingFigure.split('')[0]=='B' && MovingFigure.split('')[5]=='C'){
							BlackCastleLong = 0;							
							BlackCastleShort = 0;
						}
					}	
					let CurrentCoordinates = [MyCoordinates[0], MyCoordinates[1]]
					if(!CurrentlyPromoting){

						WhoseTurnIsIt = !WhoseTurnIsIt;
						//In check?
						if(WhoseTurnIsIt){
							if(CheckForDanger(indexOf2dArray(board, 'WhiteCar'), 'B') != 'safe'){
								AmInCheck = 1;
								CurrentDanger = CheckForDanger(indexOf2dArray(board, 'WhiteCar'), 'B');
								console.log('Check!');
								if(CurrentDanger != 'double danger'){
									CurrentDanger.forEach(item => {
										document.querySelector('#Tabl1 tr:nth-child(' + (parseInt(item[0])+1) + ') td:nth-child(' + (parseInt(item[1])+1) + ')').firstElementChild.classList.add('PURPLESQUARE');
									});									
								}
							}
							else{
								AmInCheck = 0;
								CurrentDanger = [];
								Kvadrati.forEach(item => {
									if(item.classList.contains('PURPLESQUARE')){
										item.classList.remove('PURPLESQUARE');
									}
								});
							}
						}else {
							if(CheckForDanger(indexOf2dArray(board, 'BlackCar'), 'W') != 'safe'){
								AmInCheck = 1;
								CurrentDanger = CheckForDanger(indexOf2dArray(board, 'BlackCar'), 'W');
								console.log('Check!');
								if(CurrentDanger != 'double danger'){
									CurrentDanger.forEach(item => {
										document.querySelector('#Tabl1 tr:nth-child(' + (parseInt(item[0])+1) + ') td:nth-child(' + (parseInt(item[1])+1) + ')').firstElementChild.classList.add('PURPLESQUARE');
									});									
								}
							}
							else{
								AmInCheck = 0;
								CurrentDanger = [];
								Kvadrati.forEach(item => {
									if(item.classList.contains('PURPLESQUARE')){
										item.classList.remove('PURPLESQUARE');
									}
								});
							}
						}

						if(move == ''){
							//'turn' is empty - it wasn't a castle
							let column;
							let column1;
							switch(OldCoordinates[1]){
									case 0:
										column1 = 'a';
										break;
									case 1:
										column1 = 'b';
										break;
									case 2:
										column1 = 'c';
										break;
									case 3:
										column1 = 'd';
										break;
									case 4:
										column1 = 'e';
										break;
									case 5:
										column1 = 'f';
										break;
									case 6:
										column1 = 'g';
										break;
									case 7:
										column1 = 'h';
										break;
								}

							switch(CurrentCoordinates[1]){
									case 0:
										column = 'a';
										break;
									case 1:
										column = 'b';
										break;
									case 2:
										column = 'c';
										break;
									case 3:
										column = 'd';
										break;
									case 4:
										column = 'e';
										break;
									case 5:
										column = 'f';
										break;
									case 6:
										column = 'g';
										break;
									case 7:
										column = 'h';
										break;
								}
							//Create turn name
							if(MovingFigure.split('')[5] == 'P'){}
							else if (MovingFigure.split('')[5] == 'C') move += 'K';
							else if (MovingFigure.split('')[5] == 'K') move += 'N';
							else move += MovingFigure.split('')[5];
							if(DidITakeAFigure){
								//Show pawn column
								if(MovingFigure.split('')[5] == 'P') move += column1;
								
								move += 'x';
								//50 move rule resets if it was a pawn	
								FiftyMoveRuleCounter = 0;
							} 
							move += column;
							move += (7 - parseInt(CurrentCoordinates[0]) + 1);
							if(AmInCheck){
								if(CheckForMate()) move += '#';
								else move += '+';
							}
						}

						moves.push(move);

						console.log(board);
						LoadMoves();
						VisualiseBoard();
						LoadTakenFigures();
						GetOpeningName();
						if(FiftyMoveRuleCounter == 100){
							//Lock board
							AmInCheck = 1;
							Kvadrati.forEach(item1 => {
								if(item.classList.contains('PURPLESQUARE')) item.classList.remove('PURPLESQUARE');
							});
							alert('Draw by the 50 move rule');
						}
						if(AmInCheck){
							if(CheckForMate()){
								let s;
								if(WhoseTurnIsIt){
									s = 'The White'
								}
								else{
									s = 'The Black';
								}
								Kvadrati.forEach(item => {
										if(item.classList.contains('PURPLESQUARE')){
											item.classList.remove('PURPLESQUARE');
										}
									});
								alert(s + ' king is checkmated!');
							}
						}
						else{
							if(CheckForStalemate()){
								Kvadrati.forEach(item => {
									if(item.classList.contains('PURPLESQUARE')){
										item.classList.remove('PURPLESQUARE');
									}
								});						
								alert('The king is stalemated!');							
							}
						}
						Positions.push(GenerateFEN());
						console.log(Positions);
						let ThreefoldRpeptitionCounter = 0;
						for(let i =0; i< Positions.length -1; i++){
							console.log(Positions[i]);
							console.log(Positions[Positions.length-1]);
							if(Positions[i]==(Positions[Positions.length-1])){
								ThreefoldRpeptitionCounter += 1;
								if(ThreefoldRpeptitionCounter == 3){
									AmInCheck = 1;
									Kvadrati.forEach(item1 => {
										if(item.classList.contains('PURPLESQUARE')) item.classList.remove('PURPLESQUARE');
									});
									alert('Draw by threefold repetition!');
									break;
								}
							}
							console.log(ThreefoldRpeptitionCounter);

						}
						ThreefoldRpeptitionCounter = 0;
					}
				}
			}


			const LoadTakenFigures = () => {

				let WhiteBar = document.querySelector('.white-taken-figures');
				let BlackBar = document.querySelector('.black-taken-figures');

				[...WhiteBar.children].forEach(item => {
					item.remove();
				});
				[...BlackBar.children].forEach(item => {
					item.remove();
				});

				for(let i = 0; i < TakenFigures.length; i++){
					let img = document.createElement('img');
					img.src = PieceSet + '/Small' + TakenFigures[i].substring(0, 6) + '.png';

					if(TakenFigures[i].split('')[0]=='W'){
						WhiteBar.appendChild(img);
					} else{
						BlackBar.appendChild(img);
					}
				}
			}


			const LoadMoves = () => {
				let MoveListDiv = document.querySelector('.movelist');
				[...MoveListDiv.children].forEach(item => {
					item.remove();
				});
				for(let i = 0; i < moves.length; i++){
					if(i%2==0){
						let div1 = document.createElement('div');
						div1.classList.add('movelist-row');
						MoveListDiv.appendChild(div1);
					}
					let div2 = document.createElement('div');
					div2.classList.add('movelist-item');
					div2.innerText = moves[i];
					MoveListDiv.lastElementChild.appendChild(div2);
					MoveListDiv.lastElementChild.appendChild(div2);
				}
				//Increase div height
				if([...MoveListDiv.children].length > 15 && !WhoseTurnIsIt){
					//only if it's black's turn
					MoveListDiv.parentNode.style.height = (parseInt(window.getComputedStyle(MoveListDiv.parentNode).height) + 30) + 'px';
				}
			}

			const Promotion = (DidITakeAFigure) => {
				let CurrentColor = '';
				let MovingFigure;
				let move1 = '';

				if(WhoseTurnIsIt){
					CurrentColor = 'White';
				}else{
					CurrentColor = 'Black';
				}
				let PromAlert = document.querySelector('.overlap');
				PromAlert.style.display = 'block';
				let PromotionSquares = document.querySelectorAll('.promotion-button');
				PromotionSquares.forEach(item => {
					item.style.background = '#B58863';
					if(item.classList.contains('promotion-Bishop')){
						item.style.backgroundImage= "url(" + PieceSet + '/' + CurrentColor + 'B.png)';
					}
					else if(item.classList.contains('promotion-Knight')){
						item.style.backgroundImage= "url(" + PieceSet + '/' + CurrentColor + 'K.png)';
					}
					else if(item.classList.contains('promotion-Rook')){
						item.style.backgroundImage= "url(" + PieceSet + '/' + CurrentColor + 'R.png)';
					}
					else if(item.classList.contains('promotion-Queen')){
						item.style.backgroundImage= "url(" + PieceSet + '/' + CurrentColor + 'Q.png)';
					}
					item.addEventListener('click', (e) => {
						//Promote
						CurrentlyPromoting = 0;
						if(item.classList.contains('promotion-Bishop')){
							MovingFigure = CurrentColor + 'Bishop';
						}
						else if(item.classList.contains('promotion-Knight')){
							MovingFigure = CurrentColor + 'Knight';
						}
						else if(item.classList.contains('promotion-Rook')){
							MovingFigure = CurrentColor + 'Rook';
						}
						else if(item.classList.contains('promotion-Queen')){
							MovingFigure = CurrentColor + 'Queen';
						}						
						board[MyCoordinates[0]][MyCoordinates[1]] = MovingFigure;
						if(TakenFigures.includes(MovingFigure)){
							for(let i =0; i<= TakenFigures.length; i++){
								if(TakenFigures[i] == MovingFigure){
									TakenFigures.splice(i,1);
								}
							}
						}
						VisualiseBoard();
						PromAlert.style.display = 'none';

						document.querySelector('#Tabl1').style.filter = 'brightness(100%)';
						WhoseTurnIsIt = !WhoseTurnIsIt;
						if(WhoseTurnIsIt){
							if(CheckForDanger(indexOf2dArray(board, 'WhiteCar'), 'B') != 'safe'){
								AmInCheck = 1;
								CurrentDanger = CheckForDanger(indexOf2dArray(board, 'WhiteCar'), 'B');
								console.log('Check!');
								if(CurrentDanger != 'double danger'){
									CurrentDanger.forEach(item => {
										document.querySelector('#Tabl1 tr:nth-child(' + (parseInt(item[0])+1) + ') td:nth-child(' + (parseInt(item[1])+1) + ')').firstElementChild.classList.add('PURPLESQUARE');
									});									
								}
							}
							else{
								AmInCheck = 0;
								CurrentDanger = [];
								Kvadrati.forEach(item => {
									if(item.classList.contains('PURPLESQUARE')){
										item.classList.remove('PURPLESQUARE');
									}
								});
							}
						}else {
							if(CheckForDanger(indexOf2dArray(board, 'BlackCar'), 'W') != 'safe'){
								AmInCheck = 1;
								CurrentDanger = CheckForDanger(indexOf2dArray(board, 'BlackCar'), 'W');
								console.log('Check!');
								if(CurrentDanger != 'double danger'){
									CurrentDanger.forEach(item => {
										document.querySelector('#Tabl1 tr:nth-child(' + (parseInt(item[0])+1) + ') td:nth-child(' + (parseInt(item[1])+1) + ')').firstElementChild.classList.add('PURPLESQUARE');
									});									
								}
							}
							else{
								AmInCheck = 0;
								CurrentDanger = [];
								Kvadrati.forEach(item => {
									if(item.classList.contains('PURPLESQUARE')){
										item.classList.remove('PURPLESQUARE');
									}
								});
							}
						}

						let column;
						let column1;
							switch(OldCoordinates[1]){
									case 0:
										column1 = 'a';
										break;
									case 1:
										column1 = 'b';
										break;
									case 2:
										column1 = 'c';
										break;
									case 3:
										column1 = 'd';
										break;
									case 4:
										column1 = 'e';
										break;
									case 5:
										column1 = 'f';
										break;
									case 6:
										column1 = 'g';
										break;
									case 7:
										column1 = 'h';
										break;
								}


						switch(MyCoordinates[1]){
								case 0:
									column = 'a';
									break;
								case 1:
									column = 'b';
									break;
								case 2:
									column = 'c';
									break;
								case 3:
									column = 'd';
									break;
								case 4:
									column = 'e';
									break;
								case 5:
									column = 'f';
									break;
								case 6:
									column = 'g';
									break;
								case 7:
									column = 'h';
									break;
							}
							if(DidITakeAFigure){
								move1 += column1;								
								move1 += 'x';
								FiftyMoveRuleCounter = 0;
							} 
							move1 += column;
							move1 += (7 - parseInt(MyCoordinates[0]) + 1);
							move1 += MovingFigure.split('')[5];
							if(AmInCheck){
								if(CheckForMate()) move1 += '#';
								else move1 += '+';
							}
						moves.push(move1);

						console.log(board);
						LoadMoves();
						VisualiseBoard();
						LoadTakenFigures();
						GetOpeningName();
						if(FiftyMoveRuleCounter == 100){
							AmInCheck = 1;
							Kvadrati.forEach(item1 => {
								if(item.classList.contains('PURPLESQUARE')) item.classList.remove('PURPLESQUARE');
							});
							alert('Draw by the 50 move rule!');
						}
						if(AmInCheck){
							if(CheckForMate()){
								let s;
								if(WhoseTurnIsIt){
									s = 'The White'
								}
								else{
									s = 'The Black';
								}
								Kvadrati.forEach(item => {
										if(item.classList.contains('PURPLESQUARE')){
											item.classList.remove('PURPLESQUARE');
										}
									});
								alert(s + ' king is checkmated!');
							}
						}
						else{
							if(CheckForStalemate()){
								Kvadrati.forEach(item => {
									if(item.classList.contains('PURPLESQUARE')){
										item.classList.remove('PURPLESQUARE');
									}
								});						
								alert('The king is stalemated!');							
							}
						}
						Positions.push(GenerateFEN());
						console.log(Positions);


					});
				});
			}

			const CheckForStalemate = () => {
				let event = new Event('click');
				let ImStaleMated = 1;
				let CarCoordinates = [];
				for(let i = 0; i<8; i++){
					for(let j = 0; j < 8; j++){
						if(WhoseTurnIsIt && board[i][j].split('')[0] == 'W' && board[i][j].split('')[5] == 'C'){
							//White king can be moved
							CarCoordinates = [i, j];
							document.querySelector('#Tabl1 tr:nth-child(' + (parseInt(i)+1) + ') td:nth-child(' + (parseInt(j)+1) + ')').firstElementChild.dispatchEvent(event);
							Kvadrati.forEach(item => {
								if (item.classList.contains('GREENSQUARE')) ImStaleMated = 0;
							});
						}
						else if(!WhoseTurnIsIt && board[i][j].split('')[0] == 'B' && board[i][j].split('')[5] == 'C'){
							//Blakc king, can be moved
							CarCoordinates = [i, j];
							document.querySelector('#Tabl1 tr:nth-child(' + (parseInt(i)+1) + ') td:nth-child(' + (parseInt(j)+1) + ')').firstElementChild.dispatchEvent(event);
							Kvadrati.forEach(item => {
								if (item.classList.contains('GREENSQUARE')) ImStaleMated = 0;
							});							
						}
						else{
							//Figure can move
							document.querySelector('#Tabl1 tr:nth-child(' + (parseInt(i)+1) + ') td:nth-child(' + (parseInt(j)+1) + ')').firstElementChild.dispatchEvent(event);
							Kvadrati.forEach(item => {
								if (item.classList.contains('GREENSQUARE')) ImStaleMated = 0;

							});
						}
						RemGreenSquares();
					}
				}
				if(ImStaleMated){
					if(AmInCheck){
						document.querySelector('#Tabl1 tr:nth-child(' + (parseInt(CarCoordinates[0])+1) + ') td:nth-child(' + (parseInt(CarCoordinates[1])+1) + ')').firstElementChild.classList.add('REDSQUARE');
					}
					return true;
				}
				else{
					return false;
				}

			}

			const CheckForMate = () => {
				let event = new Event('click');
				let ImMated = 1;
				let CarCoordinates = [];
				for(let i = 0; i<8; i++){
					for(let j = 0; j < 8; j++){
						if(WhoseTurnIsIt && board[i][j].split('')[0] == 'W' && board[i][j].split('')[5] == 'C'){
							//White king can be moved
							CarCoordinates = [i, j];
							document.querySelector('#Tabl1 tr:nth-child(' + (parseInt(i)+1) + ') td:nth-child(' + (parseInt(j)+1) + ')').firstElementChild.dispatchEvent(event);
							Kvadrati.forEach(item => {
								if (item.classList.contains('GREENSQUARE')) ImMated = 0;
							});
						}
						else if(!WhoseTurnIsIt && board[i][j].split('')[0] == 'B' && board[i][j].split('')[5] == 'C'){
							//Blakc king, can be moved
							CarCoordinates = [i, j];
							document.querySelector('#Tabl1 tr:nth-child(' + (parseInt(i)+1) + ') td:nth-child(' + (parseInt(j)+1) + ')').firstElementChild.dispatchEvent(event);
							Kvadrati.forEach(item => {
								if (item.classList.contains('GREENSQUARE')) ImMated = 0;
							});							
						}
						else{
							//Figure can block
							document.querySelector('#Tabl1 tr:nth-child(' + (parseInt(i)+1) + ') td:nth-child(' + (parseInt(j)+1) + ')').firstElementChild.dispatchEvent(event);
							Kvadrati.forEach(item => {
								if (item.classList.contains('GREENSQUARE') && item.classList.contains('PURPLESQUARE') ) ImMated = 0;

							});
						}
						RemGreenSquares();
					}
				}
				RemGreenSquares();
				if(ImMated){
					if(AmInCheck){
						document.querySelector('#Tabl1 tr:nth-child(' + (parseInt(CarCoordinates[0])+1) + ') td:nth-child(' + (parseInt(CarCoordinates[1])+1) + ')').firstElementChild.classList.add('REDSQUARE');
					}
					return true;
				}
				else{
					return false;
				}
			}

			const CheckForDanger = (target, BorW) => {
				let red = parseInt(target[0]);
				let kol = parseInt(target[1]);
				let danger = [];
				let TempDanger = [];
				let dangercounter = 0;
				let oppositeOfBorW;

				if(BorW == 'B'){
					oppositeOfBorW = 'W';
				}
				else if (BorW == 'W'){
					oppositeOfBorW = 'B';
				} else{
					return('error');
				}

				//Pawns
				if(red >=1 && kol >=1 && board[red-1][kol-1].split('')[0] == BorW && board[red-1][kol-1].split('')[5]=='P' && BorW == 'B'){
					let i = [red-1, kol-1];
					danger.push(i);
					dangercounter +=1;
				}
				if(red >=1 && kol <=6 && board[red-1][kol+1].split('')[0] == BorW && board[red-1][kol+1].split('')[5]=='P' && BorW == 'B'){
					let i = [red-1, kol+1];
					danger.push(i);
					dangercounter +=1;
				}
				if(red <=6 && kol >=1 && board[red+1][kol-1].split('')[0] == BorW && board[red+1][kol-1].split('')[5]=='P' && BorW == 'W'){
					let i = [red+1, kol-1];
					danger.push(i);
					dangercounter +=1;
				}
				if(red <=6 && kol <=6 && board[red+1][kol+1].split('')[0] == BorW && board[red+1][kol+1].split('')[5]=='P' && BorW == 'W'){
					let i = [red+1, kol+1];
					danger.push(i);
					dangercounter +=1;
				}


				//Bishops
				//Bottom right diagonal
				for(let i = 1; i <= 7;i++){
					if((parseInt(red)+parseInt(i)) >= 8 || (parseInt(kol)+parseInt(i)) >=8){
						TempDanger = [];
						break;
					}
					else if(board[parseInt(red)+parseInt(i)][parseInt(kol)+parseInt(i)] == ''){
						let j = [red+parseInt(i), kol+parseInt(i)];
						TempDanger.push(j);
					}
					else if(board[parseInt(red)+parseInt(i)][parseInt(kol)+parseInt(i)].split('')[0] == BorW && board[parseInt(red)+parseInt(i)][parseInt(kol)+parseInt(i)].split('')[5] == 'B'){
						let j = [red+parseInt(i), kol+parseInt(i)];
						TempDanger.push(j);						
						dangercounter +=1;
						break;		
					}
					else if(board[parseInt(red)+parseInt(i)][parseInt(kol)+parseInt(i)].split('')[0] == BorW && board[parseInt(red)+parseInt(i)][parseInt(kol)+parseInt(i)].split('')[5] == 'Q'){
						let j = [red+parseInt(i), kol+parseInt(i)];
						TempDanger.push(j);						
						dangercounter +=1;
						break;		
					}
					else{
						TempDanger = [];
						break;		
					}
				}

				danger = [...danger, ...TempDanger];
				TempDanger = [];

				//Bottom left diagonal
				for(let i = 1; i <= 7;i++){
					if((parseInt(red)+parseInt(i)) >= 8 || (parseInt(kol)-parseInt(i)) < 0){
						TempDanger = [];
						break;
						//Overflow
					}
					else if(board[parseInt(red)+parseInt(i)][parseInt(kol)-parseInt(i)] == ''){
						//Empty					
						let j = [red+parseInt(i), kol-parseInt(i)];
						TempDanger.push(j);
					}
					else if(board[parseInt(red)+parseInt(i)][parseInt(kol)-parseInt(i)].split('')[0] == BorW && board[parseInt(red)+parseInt(i)][parseInt(kol)-parseInt(i)].split('')[5] == 'B'){
						//Enemy figure
						let j = [red+parseInt(i), kol-parseInt(i)];
						TempDanger.push(j);
						dangercounter +=1;
						break;		
					}
					else if(board[parseInt(red)+parseInt(i)][parseInt(kol)-parseInt(i)].split('')[0] == BorW && board[parseInt(red)+parseInt(i)][parseInt(kol)-parseInt(i)].split('')[5] == 'Q'){
						//Enemy figure
						let j = [red+parseInt(i), kol-parseInt(i)];
						TempDanger.push(j);
						dangercounter +=1;
						break;		
					}
					else{
						TempDanger = [];
						break;		
					}
				}

				danger = [...danger, ...TempDanger];
				TempDanger = [];

				//Top right diagonal
				for(let i = 1; i <= 7;i++){
					if((parseInt(red)-parseInt(i)) < 0 || (parseInt(kol)+parseInt(i)) >=8){
						TempDanger = [];
						break;
						//Overflow
					}
					else if(board[parseInt(red)-parseInt(i)][parseInt(kol)+parseInt(i)] == ''){
						let j = [red-parseInt(i), kol+parseInt(i)];
						TempDanger.push(j);
						//Empty					
					}
					else if(board[parseInt(red)-parseInt(i)][parseInt(kol)+parseInt(i)].split('')[0] == BorW && board[parseInt(red)-parseInt(i)][parseInt(kol)+parseInt(i)].split('')[5] == 'B'){
						let j = [red-parseInt(i), kol+parseInt(i)];
						TempDanger.push(j);
						dangercounter +=1;
						break;		
						//Enemy figure
					}
					else if(board[parseInt(red)-parseInt(i)][parseInt(kol)+parseInt(i)].split('')[0] == BorW && board[parseInt(red)-parseInt(i)][parseInt(kol)+parseInt(i)].split('')[5] == 'Q'){
						let j = [red-parseInt(i), kol+parseInt(i)];
						TempDanger.push(j);
						dangercounter +=1;
						break;		
						//Enemy figure
					}
					else{
						TempDanger = [];
						break;		
						//Owned figure
					}
				}

				danger = [...danger, ...TempDanger];
				TempDanger = [];

				//Top left diagonal
				for(let i = 1; i <= 7;i++){
					if((parseInt(red)-parseInt(i)) < 0 || (parseInt(kol)-parseInt(i)) < 0){
						TempDanger = [];
						break;
					}
					else if(board[parseInt(red)-parseInt(i)][parseInt(kol)-parseInt(i)] == ''){
						let j = [red-parseInt(i), kol-parseInt(i)];
						TempDanger.push(j);
					}
					else if(board[parseInt(red)-parseInt(i)][parseInt(kol)-parseInt(i)].split('')[0] == BorW && board[parseInt(red)-parseInt(i)][parseInt(kol)-parseInt(i)].split('')[5] == 'B'){
						let j = [red-parseInt(i), kol-parseInt(i)];
						dangercounter +=1;
						TempDanger.push(j);
						break;		
					}
					else if(board[parseInt(red)-parseInt(i)][parseInt(kol)-parseInt(i)].split('')[0] == BorW && board[parseInt(red)-parseInt(i)][parseInt(kol)-parseInt(i)].split('')[5] == 'Q'){
						let j = [red-parseInt(i), kol-parseInt(i)];
						dangercounter +=1;
						TempDanger.push(j);
						break;		
					}
					else{
						TempDanger = [];
						break;		
					}
				}

				danger = [...danger, ...TempDanger];
				TempDanger = [];

				//Rooks
				//down
				for(let i = red+1; i<=7;i++){
					if (board[i][kol]==''){
						let j = [i, kol];
						TempDanger.push(j);
						if(i ==7){
							TempDanger = [];
						}
					}
					else if (board[i][kol].split('')[0] == BorW && board[i][kol].split('')[5] == 'R'){
						let j = [i, kol];
						dangercounter +=1;
						TempDanger.push(j);
						break;
					}
					else if (board[i][kol].split('')[0] == BorW && board[i][kol].split('')[5] == 'Q'){
						let j = [i, kol];
						dangercounter +=1;
						TempDanger.push(j);
						break;
					}
					else{
						TempDanger = [];
						break;
					}
				}

				danger = [...danger, ...TempDanger];
				TempDanger = [];

				//up
				for(let i = red-1; i>=0;i--){
					if (board[i][kol]==''){
						let j = [i, kol];
						TempDanger.push(j);
						if(i == 0){
							TempDanger = [];
						}
					}
					else if (board[i][kol].split('')[0] == BorW && board[i][kol].split('')[5] == 'R'){
						let j = [i, kol];
						dangercounter +=1;
						TempDanger.push(j);
						break;
					}
					else if (board[i][kol].split('')[0] == BorW && board[i][kol].split('')[5] == 'Q'){
						let j = [i, kol];
						dangercounter +=1;
						TempDanger.push(j);
						break;
					}
					else{
						TempDanger = [];
						break;
					}
				}

				danger = [...danger, ...TempDanger];
				TempDanger = [];

				//left
				for(let i = kol-1; i>=0;i--){
					if (board[red][i]==''){
						let j = [red, i];
						TempDanger.push(j);
						if (i == 0){
							TempDanger = [];
						}
					}
					else if (board[red][i].split('')[0] == BorW && board[red][i].split('')[5] == 'R'){
						let j = [red, i];
						TempDanger.push(j);
						dangercounter +=1;
						break;
					}
					else if (board[red][i].split('')[0] == BorW && board[red][i].split('')[5] == 'Q'){
						let j = [red, i];
						TempDanger.push(j);
						dangercounter +=1;
						break;
					}
					else{
						TempDanger = [];
						break;
					}
				}

				danger = [...danger, ...TempDanger];
				TempDanger = [];

				//right
				for(let i = kol+1; i <=7;i++){
					if (board[red][i]==''){
						let j = [red, i];
						TempDanger.push(j);
						if(i ==7){
							TempDanger = [];
						}
					}
					else if (board[red][i].split('')[0] == BorW && board[red][i].split('')[5] == 'R'){
						let j = [red, i];
						TempDanger.push(j);
						dangercounter +=1;
						break;
					}
					else if (board[red][i].split('')[0] == BorW && board[red][i].split('')[5] == 'Q'){
						let j = [red, i];
						TempDanger.push(j);
						dangercounter +=1;
						break;
					}
					else{
						TempDanger = [];
						break;
					}
				}

				danger = [...danger, ...TempDanger];
				TempDanger = [];


				//Knights
				if( red >= 2 && kol <= 6){
					if(board[red-2][kol+1].split('')[0] == BorW && board[red-2][kol+1].split('')[5] == 'K'){
						let j = [red-2,kol+1];
						danger.push(j);
						dangercounter +=1;
					}
				}
				if( red >= 1 && kol <= 5){
					if(board[red-1][kol+2].split('')[0] == BorW && board[red-1][kol+2].split('')[5] == 'K'){
						let j = [red-1,kol+2];
						danger.push(j);
						dangercounter +=1;
					}
				}
				if( red <=6 && kol <= 5){
					if(board[red+1][kol+2].split('')[0] == BorW && board[red+1][kol+2].split('')[5] == 'K'){
						let j = [red+1,kol+2];
						danger.push(j);
						dangercounter +=1;
					}
				}
				if( red <=5 && kol <= 6){
					if(board[red+2][kol+1].split('')[0] == BorW && board[red+2][kol+1].split('')[5] == 'K'){
						let j = [red+2,kol+1];
						danger.push(j);
						dangercounter +=1;
					}
				}
				if( red <=5 && kol >=1){
					if(board[red+2][kol-1].split('')[0] == BorW && board[red+2][kol-1].split('')[5] == 'K'){
						let j = [red+2,kol-1];
						dangercounter +=1;
						danger.push(j);
					}
				}
				if( red <=6 && kol >=2){
					if(board[red+1][kol-2].split('')[0] == BorW && board[red+1][kol-2].split('')[5] == 'K'){
						let j = [red+1,kol-2];
						dangercounter +=1;
						danger.push(j);
					}
				}
				if( red >=1 && kol >=2){
					if(board[red-1][kol-2].split('')[0] == BorW && board[red-1][kol-2].split('')[5] == 'K'){
						let j = [red-1,kol-2];
						danger.push(j);
						dangercounter +=1;
					}
				}
				if( red >=2 && kol >=1){
					if(board[red-2][kol-1].split('')[0] == BorW && board[red-2][kol-1].split('')[5] == 'K'){
						let j = [red-2,kol-1];
						danger.push(j);
						dangercounter +=1;
					}
				}


				//Kings
				for(let i = 0; i < 3; i ++){
					for(let j = 0; j < 3; j++){
						if( parseInt(red)-1+i >=0 && parseInt(red)-1+i <=7 && parseInt(kol)-1+j >=0 && parseInt(kol)-1+j <=7){
							if (board[parseInt(red)-1+i][parseInt(kol)-1+j].split('')[0] == BorW && board[parseInt(red)-1+i][parseInt(kol)-1+j].split('')[5] == 'C'){
								let k = [red-1+i, kol-1+j];
								danger.push(k);
								dangercounter += 1;
							}
							else if (board[parseInt(red)-1+i][parseInt(kol)-1+j].split('')[0] == BorW && board[parseInt(red)-1+i][parseInt(kol)-1+j].split('')[5] == 'C'){
								let k = [red-1+i, kol-1+j];
								danger.push(k);
								dangercounter += 1;
							}						
						}
					}
				}



				if(dangercounter >1){
					return 'double danger';
				}
				else if (dangercounter == 1){
					return danger;
				}
				else if (dangercounter == 0){
					return 'safe';
				}
			}


			const WhitePawnMovement = (target) => {
				let red = target[0];
				let kol = target[1];

				//Take enemy figure to the left
				if(kol>0){
					if (board[red-1][kol-1].split('')[0] == 'B'){
						MakeSquareGreen(red-1, kol-1);
					}
					//En-passant
					if(EnPassant[0] == red-1 && EnPassant[1] == kol-1){
						MakeSquareGreen(red-1, kol-1);
					}
				}
				//Take enemy figure to the right
				if(kol<7){
					if (board[red-1][kol+1].split('')[0] == 'B'){
						MakeSquareGreen(red-1, kol+1);
					}
					//En-passant
					if(EnPassant[0] == red-1 && EnPassant[1] == kol+1){
						MakeSquareGreen(red-1, kol+1);
					}
				}
				//1 forward
				if(board[red-1][kol] == ''){
					MakeSquareGreen(red-1, kol);
				}
				//2 forward	
				if(red == '6' &&board[red-1][kol] == '' && board[red-2][kol] == ''){
					MakeSquareGreen(red-2, kol);
				}
			}

			const BlackPawnMovement = (target) => {
				let red = target[0];
				let kol = target[1];

				if(kol>0){
					if (board[red+1][kol-1].split('')[0] == 'W'){
						MakeSquareGreen(red+1, kol-1);
					}						
					if(EnPassant[0] == red+1 && EnPassant[1] == kol-1){
						MakeSquareGreen(red+1, kol-1);
					}
				}
				if(target[1]<7){
					if (board[red+1][kol+1].split('')[0] == 'W'){
						MakeSquareGreen(red+1, kol+1);
						}
					if(EnPassant[0] == red+1 && EnPassant[1] == kol+1){
						MakeSquareGreen(red+1, kol+1);
					}
				}
				if(board[red+1][kol] == ''){
						MakeSquareGreen(red+1, kol);
				}
				if(red == '1' && board[red+1][kol] == '' && board[red+2][kol] == ''){
						MakeSquareGreen(red+2, kol);
				}
			}
			const BishopMovement = (target) => {
				let red = parseInt(target[0]);
				let kol = parseInt(target[1]);

				for(let i = 1; i <= 7;i++){
					if((red+i) >= 8 || (kol+i) >=8){
						break;
					}
					else if(board[parseInt(red)+parseInt(i)][parseInt(kol)+parseInt(i)] == ''){
						MakeSquareGreen(red+i, kol+i);						
					}
					else if(WhoseTurnIsIt && board[parseInt(red)+parseInt(i)][parseInt(kol)+parseInt(i)].split('')[0] == 'B'){
						MakeSquareGreen(red+i, kol+i);						
						break;		
					}
					else if(WhoseTurnIsIt && board[parseInt(red)+parseInt(i)][parseInt(kol)+parseInt(i)].split('')[0] == 'W'){
						break;		
					}						
					else if(!WhoseTurnIsIt && board[parseInt(red)+parseInt(i)][parseInt(kol)+parseInt(i)].split('')[0] == 'W'){
						MakeSquareGreen(red+i, kol+i);						
						break;			
					}	
					else if(!WhoseTurnIsIt && board[parseInt(red)+parseInt(i)][parseInt(kol)+parseInt(i)].split('')[0] == 'B'){
						break;			
					}
				}

				for(let i = 1; i <= 7;i++){
					if((parseInt(red)+parseInt(i)) >= 8 || (parseInt(kol)-parseInt(i)) < 0){
						break;
					}
					else if(board[parseInt(red)+parseInt(i)][parseInt(kol)-parseInt(i)] == ''){
						MakeSquareGreen(red+i, kol-i);						
					}
					else if(WhoseTurnIsIt && board[parseInt(red)+parseInt(i)][parseInt(kol)-parseInt(i)].split('')[0] == 'B'){
						MakeSquareGreen(red+i, kol-i);						
						break;		
					}
					else if(WhoseTurnIsIt && board[parseInt(red)+parseInt(i)][parseInt(kol)-parseInt(i)].split('')[0] == 'W'){
						break;		
					}
					else if(!WhoseTurnIsIt && board[parseInt(red)+parseInt(i)][parseInt(kol)-parseInt(i)].split('')[0] == 'W'){
						MakeSquareGreen(red+i, kol-i);						
						break;			
					}	
					else if(!WhoseTurnIsIt && board[parseInt(red)+parseInt(i)][parseInt(kol)-parseInt(i)].split('')[0] == 'B'){
					break;			
					}
				}
				for(let i = 1; i <= 7;i++){
					if((parseInt(red)-parseInt(i)) < 0 || (parseInt(kol)+parseInt(i)) >=8){
						break;
					}
					else if(board[parseInt(red)-parseInt(i)][parseInt(kol)+parseInt(i)] == ''){
						MakeSquareGreen(red-i, kol+i);	
					}
					else if(WhoseTurnIsIt && board[parseInt(red)-parseInt(i)][parseInt(kol)+parseInt(i)].split('')[0] == 'B'){
						MakeSquareGreen(red-i, kol+i);						
						break;		
					}
					else if(WhoseTurnIsIt && board[parseInt(red)-parseInt(i)][parseInt(kol)+parseInt(i)].split('')[0] == 'W'){
						break;		
					}
					else if(!WhoseTurnIsIt && board[parseInt(red)-parseInt(i)][parseInt(kol)+parseInt(i)].split('')[0] == 'W'){
						MakeSquareGreen(red-i, kol+i);						
						break;			
					}
					else if(!WhoseTurnIsIt && board[parseInt(red)-parseInt(i)][parseInt(kol)+parseInt(i)].split('')[0] == 'B'){
						break;			
					}	
				}

				for(let i = 1; i <= 7;i++){
					if((parseInt(red)-parseInt(i)) < 0 || (parseInt(kol)-parseInt(i)) < 0){
						break;
					}
					else if(board[parseInt(red)-parseInt(i)][parseInt(kol)-parseInt(i)] == ''){
						MakeSquareGreen(red-i, kol-i);						
					}
					else if(WhoseTurnIsIt && board[parseInt(red)-parseInt(i)][parseInt(kol)-parseInt(i)].split('')[0] == 'B'){
						MakeSquareGreen(red-i, kol-i);						
						break;		
					}
					else if(WhoseTurnIsIt && board[parseInt(red)-parseInt(i)][parseInt(kol)-parseInt(i)].split('')[0] == 'W'){
						break;		
					}
					else if(!WhoseTurnIsIt && board[parseInt(red)-parseInt(i)][parseInt(kol)-parseInt(i)].split('')[0] == 'W'){
						MakeSquareGreen(red-i, kol-i);						
						break;			
					}
					else if(!WhoseTurnIsIt && board[parseInt(red)-parseInt(i)][parseInt(kol)-parseInt(i)].split('')[0] == 'B'){
						break;			
					}							
				}
			}

			const RookMovement = (target) => {
				let red = target[0];
				let kol = target[1];

				for(let i = red+1; i<=7;i++){
					if (board[i][kol]==''){
						MakeSquareGreen(i,kol);
					}
					else if (WhoseTurnIsIt && board[i][kol].split('')[0] == 'B'){
						MakeSquareGreen(i,kol);
						break;
					}
					else if (WhoseTurnIsIt && board[i][kol].split('')[0] == 'W'){
						break;
					}
					else if (!WhoseTurnIsIt && board[i][kol].split('')[0] == 'W'){
						MakeSquareGreen(i,kol);
						break;
					}
					else if (!WhoseTurnIsIt && board[i][kol].split('')[0] == 'B'){
						break;
					}
				}
				for(let i = red-1; i>=0;i--){
					if (board[i][kol]==''){
						MakeSquareGreen(i,kol);
					}
					else if (WhoseTurnIsIt && board[i][kol].split('')[0] == 'B'){
						MakeSquareGreen(i,kol);
						break;
					}
					else if (WhoseTurnIsIt && board[i][kol].split('')[0] == 'W'){
						break;
					}
					else if (!WhoseTurnIsIt && board[i][kol].split('')[0] == 'W'){
						MakeSquareGreen(i,kol);
						break;
					}
					else if (!WhoseTurnIsIt && board[i][kol].split('')[0] == 'B'){
						break;
					}
				}
				for(let i = kol-1; i>=0;i--){
					if (board[red][i]==''){
						MakeSquareGreen(red, i);
					}
					else if (WhoseTurnIsIt && board[red][i].split('')[0] == 'B'){
						MakeSquareGreen(red, i);
						break;
					}
					else if (WhoseTurnIsIt && board[red][i].split('')[0] == 'W'){
						break;
					}
					else if (!WhoseTurnIsIt && board[red][i].split('')[0] == 'W'){
						MakeSquareGreen(red, i);
						break;
					}
					else if (!WhoseTurnIsIt && board[red][i].split('')[0] == 'B'){
						break;
					}
				}
				for(let i = kol+1; i <=7;i++){
					if (board[red][i]==''){
						MakeSquareGreen(red, i);
					}
					else if (WhoseTurnIsIt && board[red][i].split('')[0] == 'B'){
						MakeSquareGreen(red, i);
						break;
					}
					else if (WhoseTurnIsIt && board[red][i].split('')[0] == 'W'){
						break;
					}
					else if (!WhoseTurnIsIt && board[red][i].split('')[0] == 'W'){
						MakeSquareGreen(red, i);
						break;
					}
					else if (!WhoseTurnIsIt && board[red][i].split('')[0] == 'B'){
						break;
					}
				}
			}

			const KnightMovement = (target) => {
				let red = target[0];
				let kol = target[1];

				if( red >= 2 && kol <= 6){
					if(board[red-2][kol+1]=='' ){
						MakeSquareGreen(red-2, kol+1);
					}
					else if(!WhoseTurnIsIt && board[red-2][kol+1].split('')[0] == 'W' ){
						MakeSquareGreen(red-2, kol+1);
					}
					else if(WhoseTurnIsIt && board[red-2][kol+1].split('')[0] == 'B' ){
						MakeSquareGreen(red-2, kol+1);
					}
				}
				if( red >= 1 && kol <= 5){
					if(board[red-1][kol+2]=='' ){
						MakeSquareGreen(red-1, kol+2);
					}
					else if(!WhoseTurnIsIt && board[red-1][kol+2].split('')[0] == 'W' ){
						MakeSquareGreen(red-1, kol+2);
					}
					else if(WhoseTurnIsIt && board[red-1][kol+2].split('')[0] == 'B' ){
						MakeSquareGreen(red-1, kol+2);
					}
				}
				if( red <=6 && kol <= 5){
					if(board[red+1][kol+2]=='' ){
						MakeSquareGreen(red+1, kol+2);
					}
					else if(!WhoseTurnIsIt && board[red+1][kol+2].split('')[0] == 'W' ){
						MakeSquareGreen(red+1, kol+2);
					}
					else if(WhoseTurnIsIt && board[red+1][kol+2].split('')[0] == 'B' ){
						MakeSquareGreen(red+1, kol+2);
					}
				}
				if( red <=5 && kol <= 6){
					if(board[red+2][kol+1]=='' ){
						MakeSquareGreen(red+2, kol+1);
					}
					else if(!WhoseTurnIsIt && board[red+2][kol+1].split('')[0] == 'W' ){
						MakeSquareGreen(red+2, kol+1);
					}
					else if(WhoseTurnIsIt && board[red+2][kol+1].split('')[0] == 'B' ){
						MakeSquareGreen(red+2, kol+1);
					}
				}
				if( red <=5 && kol >=1){
					if(board[red+2][kol-1]=='' ){
						MakeSquareGreen(red+2, kol-1);
					}
					else if(!WhoseTurnIsIt && board[red+2][kol-1].split('')[0] == 'W' ){
						MakeSquareGreen(red+2, kol-1);
					}
					else if(WhoseTurnIsIt && board[red+2][kol-1].split('')[0] == 'B' ){
						MakeSquareGreen(red+2, kol-1);
					}
				}
				if( red <=6 && kol >=2){
					if(board[red+1][kol-2]=='' ){
						MakeSquareGreen(red+1, kol-2);
					}
					else if(!WhoseTurnIsIt && board[red+1][kol-2].split('')[0] == 'W' ){
						MakeSquareGreen(red+1, kol-2);
					}
					else if(WhoseTurnIsIt && board[red+1][kol-2].split('')[0] == 'B' ){
						MakeSquareGreen(red+1, kol-2);
					}
				}
				if( red >=1 && kol >=2){
					if(board[red-1][kol-2]=='' ){
						MakeSquareGreen(red-1, kol-2);
					}
					else if(!WhoseTurnIsIt && board[red-1][kol-2].split('')[0] == 'W' ){
						MakeSquareGreen(red-1, kol-2);
					}
					else if(WhoseTurnIsIt && board[red-1][kol-2].split('')[0] == 'B' ){
						MakeSquareGreen(red-1, kol-2);
					}
				}
				if( red >=2 && kol >=1){
					if(board[red-2][kol-1]=='' ){
						MakeSquareGreen(red-2, kol-1);
					}
					else if(!WhoseTurnIsIt && board[red-2][kol-1].split('')[0] == 'W' ){
						MakeSquareGreen(red-2, kol-1);
					}
					else if(WhoseTurnIsIt && board[red-2][kol-1].split('')[0] == 'B' ){
						MakeSquareGreen(red-2, kol-1);
					}
				}
			}

			const KingMovement = (target) => {
				let red = parseInt(target[0]);
				let kol = parseInt(target[1]);
				if(WhoseTurnIsIt){
					check = 'W';
					opposite = 'B';
				}else {
					check = 'B';
					opposite = 'W';
				}


				//King can't "hide" behind himself - remove him from the board and then check for danger
				let currentfigure = board[red][kol];
				board[red][kol] = '';
				
				for(let i = 0; i < 3; i ++){
					for(let j = 0; j < 3; j++){
						if( red-1+i >=0 && red-1+i <=7 && kol-1+j >=0 && kol-1+j <=7){
							if (board[red-1+i][kol-1+j].split('')[0] == check){
								//Can't move to sqyare with owned figure
							}
							else if (CheckForDanger([red-1+i, kol-1+j], opposite) == 'safe'){
								//King can move to safe space
								if(i==1 && j==1){
									//King can't move to the same place
								}else{
									MakeSquareGreen(red-1+i, kol-1+j);
								}
							}			
						}
					}
				}

				board[red][kol] = currentfigure;


				//Castles
				if(WhoseTurnIsIt && WhiteCastleShort && CheckForDanger([7, 5],opposite) == 'safe' && CheckForDanger([7, 6],opposite) == 'safe' && board[7][5] == '' && board[7][6] == ''){
					MakeSquareGreen(7, 6);
				}
				if(WhoseTurnIsIt && WhiteCastleLong && CheckForDanger([7, 4],opposite) == 'safe' && CheckForDanger([7, 3],opposite) == 'safe' && board[7][1] == '' && board[7][2] == '' && board[7][3] == ''){
					MakeSquareGreen(7, 2);
				}
				if(!WhoseTurnIsIt && BlackCastleShort && CheckForDanger([0, 5],opposite) == 'safe' && CheckForDanger([0, 6],opposite) == 'safe' && board[0][5] == '' && board[0][6] == ''){
					MakeSquareGreen(0, 6);
				}
				if(!WhoseTurnIsIt && BlackCastleLong && CheckForDanger([0, 4],opposite) == 'safe' && CheckForDanger([0, 3],opposite) == 'safe' && board[0][1] == '' && board[0][2] == '' && board[0][3] == ''){
					MakeSquareGreen(0, 2);
				}
			}
		});