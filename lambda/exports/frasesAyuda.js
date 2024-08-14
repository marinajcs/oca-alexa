const reglasInfo = "Claro, con mucho gusto. Hay dos objetivos principales en este juego. El primero consiste \
                    en ser el jugador más rápido en llegar a la última casilla del tablero, la número 63. \
                    El segundo objetivo, acumular el mayor número de puntos, que se pueden conseguir ganando \
                    los minijuegos de las casillas sorpresa del tablero. En cada turno, el jugador actual tendrá \
                    que tirar el dado, diciendo 'tirar dado' y avanzar su ficha por el tablero, diciendo \
                    'mover ficha'. Si quiere saber más información acerca de las casillas disponibles, los \
                    comandos de voz o los minijuegos, siéntase libre de preguntarme.";
                
const casillasInfo = "Claro, con mucho gusto. El tablero tiene 63 casillas y hay 5 tipos distintos. En primer lugar, las \
                      casillas normales, representadas por distintos elementos, que no desencadenan ningún evento \
                      especial pero reciben a los jugadores de distintas formas. En segundo lugar, las casillas \
                      de oca en oca, que permiten al jugador avanzar a la siguiente casilla de oca, incluida \
                      la última, y volver a tirar el dado. En tercer lugar,  la casilla de puente a puente, \
                      que mueven al jugador al otro puente del tablero, pero sin darle un turno extra. \
                      En cuarto lugar, las casillas de penalización, como el pozo y el laberinto, que hacen que el \
                      jugador pierda un número determinado de turnos, sin poder avanzar. En último lugar, las casillas \
                      de minijuegos. Hay 5 variantes, cada una inicia un minijuego distinto con la posibilidad de ganar \
                      puntos. Para más información acerca de los minijuegos disponibles, pídame que se lo explique. \
                      También puedo explicarle las reglas del juego y los comandos disponibles.";
                      
const minijuegosInfo = "Claro, con mucho gusto. Los minijuegos disposibles son: ...";
            
const comandosInfo = "Claro, con mucho gusto. Los comandos de voz disponibles son: nueva partida, \
                      tirar dado, mover ficha, ayuda y terminar partida";
                      
module.exports = { 
    reglasInfo, 
    casillasInfo,
    minijuegosInfo,
    comandosInfo
};