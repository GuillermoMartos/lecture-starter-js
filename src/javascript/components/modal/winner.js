import createElement from '../../helpers/domHelper';
import { createFighterImage } from '../fighterPreview';
import showModal from './modal';

function createWinnerModal(fighter, player) {
    const divWrapper = createElement({ tagName: 'div', className: 'winner_modalWrapper' });
    const textWinner = createElement({ tagName: 'p', className: 'winner_modalName' });
    textWinner.innerText = `${player} wins!`;
    const winnerImg = createFighterImage(fighter);
    divWrapper.append(winnerImg, textWinner);
    return divWrapper;
}

export default function showWinnerModal(fighter, player) {
    // call showModal function
    const winnerElement = createWinnerModal(fighter, player);
    showModal({ title: `${fighter.name} wins`, bodyElement: winnerElement });
}
