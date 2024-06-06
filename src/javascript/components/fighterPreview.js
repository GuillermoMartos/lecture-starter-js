import createElement from '../helpers/domHelper';

function createConfimationFighterButton(fighter) {
    const buttonsDivWrapper = createElement({
        tagName: 'div',
        className: 'btns_wrapper'
    });
    const chooseAgainButton = createElement({
        tagName: 'button',
        className: 'preview-container___fight-btn custom_choose'
    });
    chooseAgainButton.innerText = `Choose again`;
    const onClickReload = () => {
        window.location.reload();
    };
    const confirmFighterButton = createElement({
        tagName: 'button',
        className: 'preview-container___fight-btn custom_choose'
    });
    confirmFighterButton.innerText = `Confirm ${fighter.name}`;
    const onClickConfirm = () => {
        confirmFighterButton.remove();
        chooseAgainButton.remove();
        fighter.setConfirmed();
    };
    confirmFighterButton.addEventListener('click', onClickConfirm, false);
    chooseAgainButton.addEventListener('click', onClickReload, false);
    buttonsDivWrapper.append(confirmFighterButton, chooseAgainButton);
    return buttonsDivWrapper;
}

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    // todo: show fighter info (image, name, health, etc.)
    if (fighter) {
        const previewFighterDivWrapper = createElement({ tagName: 'div', className: 'preview_figther_wrap' });
        const confirmFighterButton = createConfimationFighterButton(fighter);
        // eslint-disable-next-line no-use-before-define
        previewFighterDivWrapper.append(...createFighterPreviewData(fighter), confirmFighterButton);
        fighterElement.append(previewFighterDivWrapper);
    }
    return fighterElement;
}

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}

function createFighterPreviewData(fighter) {
    const fighterImg = createFighterImage(fighter);
    const fighterName = createElement({ tagName: 'h3', className: 'name_preview-span' });
    fighterName.innerText = `${fighter.name}`;
    const fighterHealth = createElement({ tagName: 'span', className: 'health-span' });
    fighterHealth.innerText = `Health: ${fighter.health}`;
    const fighterAttack = createElement({ tagName: 'span', className: 'attack-span' });
    fighterAttack.innerText = `Attack: ${fighter.attack}`;
    const fighterDefense = createElement({ tagName: 'span', className: 'defense-span' });
    fighterDefense.innerText = `Defense: ${fighter.defense}`;

    return [fighterImg, fighterName, fighterHealth, fighterAttack, fighterDefense];
}
