import controls from '../../constants/controls';
import createElement from './domHelper';

function createAttackImg() {
    const attributes = {
        title: 'attack',
        alt: 'attackImg',
        src: '../../../resources/attack.png'
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });
    return imgElement;
}

const attackImg = createAttackImg();

function getHitPower(fighterPower) {
    // return hit power
    const criticalHitChance = Math.ceil(Math.random() * 2);
    const strikeForcePower = fighterPower * criticalHitChance;
    return strikeForcePower;
}

function getBlockPower(fighterPower) {
    // return block power
    const dodgeChance = Math.ceil(Math.random() * 2);
    const blockStrengthPower = fighterPower * dodgeChance;
    return blockStrengthPower;
}

function getDamage(attacker, defender) {
    // return damage
    const attackResult = getHitPower(attacker) - getBlockPower(defender);
    return attackResult;
}

function decreaseDefenderHealth(defenderContent, damageResult) {
    const [defender, defenderDivHealth] = defenderContent;
    const healthPercentage = ((defender.getHealthStatus() - damageResult) / defender.getStartingHealth()) * 100;
    defenderDivHealth.style.width = `${healthPercentage}%`;
    if (healthPercentage < 15) {
        defenderDivHealth.style.backgroundColor = 'red';
    }
    defender.getHurt(damageResult);
}

function handleAttackScenario(attacker, defenderContent, specialHitAttak = false) {
    const [defender, defenderDivHealth] = defenderContent;
    if (specialHitAttak) {
        const result = attacker.getfighterAttackPower() * 2;
        decreaseDefenderHealth([defender, defenderDivHealth], result);
    }
    if (defender.getDefendingStatus() === false) {
        const result = getDamage(attacker.getfighterAttackPower(), defender.getfighterDefensePower());
        if (result > 0) {
            decreaseDefenderHealth([defender, defenderDivHealth], result);
        }
    }
}

export default function handleFightControls(playersContent) {
    const playerAImg = document.querySelector('.arena___left-fighter');
    const playerBImg = document.querySelectorAll('.fighter-preview___img')[1];
    const playerBDiv = document.querySelector('.arena___right-fighter');
    const { firstFightingFighter, firstFighterHealthIndicator, secondFightingFighter, secondFighterHealthIndicator } =
        playersContent;
    const pressedKeys = new Set();
    let lastSpecialKeysMemo = [];
    let timerActive = false;
    function addVisualsAttack(player) {
        if (player.classList.value.includes('left')) {
            player.append(attackImg);
            setTimeout(() => {
                player.removeChild(attackImg);
            }, 100);
        } else {
            playerBDiv.insertBefore(attackImg, player);
            setTimeout(() => {
                attackImg.remove();
            }, 100);
        }
    }
    function keyDownPressed(event) {
        if (
            controls.PlayerOneCriticalHitCombination.concat(controls.PlayerTwoCriticalHitCombination).includes(
                event.code
            )
        ) {
            lastSpecialKeysMemo.push(event.code);
            if (!timerActive) {
                timerActive = true;
                // player got 1sec to press the critical hot combination
                setTimeout(() => {
                    lastSpecialKeysMemo = [];
                    timerActive = false;
                }, 1000);
            }
            if (controls.PlayerOneCriticalHitCombination.every(key => lastSpecialKeysMemo.includes(key))) {
                handleAttackScenario(firstFightingFighter, [secondFightingFighter, secondFighterHealthIndicator], true);
            }
            if (controls.PlayerTwoCriticalHitCombination.every(key => lastSpecialKeysMemo.includes(key))) {
                handleAttackScenario(secondFightingFighter, [firstFightingFighter, firstFighterHealthIndicator], true);
            }
        }
        if (!pressedKeys.has(event.code)) {
            switch (event.code) {
                case controls.PlayerOneAttack:
                    addVisualsAttack(playerAImg);
                    handleAttackScenario(firstFightingFighter, [secondFightingFighter, secondFighterHealthIndicator]);
                    break;
                case controls.PlayerTwoAttack:
                    addVisualsAttack(playerBImg);
                    handleAttackScenario(secondFightingFighter, [firstFightingFighter, firstFighterHealthIndicator]);
                    break;
                case controls.PlayerOneBlock:
                    firstFightingFighter.activateDefending();
                    break;
                case controls.PlayerTwoBlock:
                    secondFightingFighter.activateDefending();
                    break;
                default:
                    break;
            }
        }
    }

    function deletePressedKeyOnKeyUp(event) {
        pressedKeys.delete(event.code);
    }

    // Añadimos los listeners para keydown y keyup
    window.addEventListener('keydown', keyDownPressed);
    window.addEventListener('keyup', deletePressedKeyOnKeyUp);
}
