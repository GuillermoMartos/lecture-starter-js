import createElement from '../helpers/domHelper';
import renderArena from './arena';
import versusImg from '../../../resources/versus.png';
import { createFighterPreview } from './fighterPreview';
import fighterService from '../services/fightersService';

const fighterDetailsMap = new Map();

export async function getFighterInfo(fighterId) {
    // get fighter info from fighterDetailsMap or from service and write it to fighterDetailsMap
    if (fighterDetailsMap.has(fighterId)) {
        return fighterDetailsMap.get(fighterId);
    }
    const fighterDetailsInfo = await fighterService.getFighterDetails(fighterId);
    fighterDetailsInfo.confirmed = false;
    fighterDetailsInfo.setConfirmed = () => {
        fighterDetailsInfo.confirmed = true;
    };
    fighterDetailsMap.set(fighterId, fighterDetailsInfo);
    return fighterDetailsInfo;
}

function checkFightersReady(selectedFighters) {
    return (
        selectedFighters.filter(Boolean).length === 2 && selectedFighters.every(fighter => fighter.confirmed === true)
    );
}

function createAndDisplayFightErrorMessage(versusBlock) {
    const messageSign = createElement({
        tagName: 'span',
        className: 'preview-container___fight-btn',
        attributes: { style: 'max-width: 20%; position: absolute; font-size:14px' }
    });
    messageSign.innerText = 'Select and confirm all fighters';
    versusBlock.append(messageSign);
    setTimeout(() => {
        versusBlock.removeChild(messageSign);
    }, 3000);
}

function startFight(selectedFighters) {
    if (checkFightersReady(selectedFighters)) {
        renderArena(selectedFighters);
    } else {
        const versusBlock = document.querySelector('.preview-container___versus-block');
        createAndDisplayFightErrorMessage(versusBlock);
    }
}

function createVersusBlock(selectedFighters) {
    const onClick = () => startFight(selectedFighters);
    const container = createElement({ tagName: 'div', className: 'preview-container___versus-block' });
    const image = createElement({
        tagName: 'img',
        className: 'preview-container___versus-img',
        attributes: { src: versusImg }
    });
    const fightBtn = createElement({
        tagName: 'button',
        className: 'preview-container___fight-btn',
        attributes: { id: 'fight_btn' }
    });

    fightBtn.addEventListener('click', onClick, false);
    fightBtn.innerText = 'Fight';
    container.append(image, fightBtn);

    return container;
}

function renderSelectedFighters(selectedFighters) {
    const fightersPreview = document.querySelector('.preview-container___root');
    const [playerOne, playerTwo] = selectedFighters;
    const firstPreview = createFighterPreview(playerOne, 'left');
    const secondPreview = createFighterPreview(playerTwo, 'right');
    const versusBlock = createVersusBlock(selectedFighters);

    fightersPreview.innerHTML = '';
    fightersPreview.append(firstPreview, versusBlock, secondPreview);
}

export function createFightersSelector() {
    let selectedFighters = [];
    // extra: add confirm player button to be able to choose again (confirmed boolean into selected fihters :))
    return async (event, fighterId) => {
        const fighter = await getFighterInfo(fighterId);
        const [playerOne, playerTwo] = selectedFighters;
        const firstFighter = playerOne ?? fighter;
        const secondFighter = playerOne ? playerTwo ?? fighter : playerTwo;
        selectedFighters = [firstFighter, secondFighter];

        renderSelectedFighters(selectedFighters);
    };
}
