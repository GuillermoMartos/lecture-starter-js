import controls from '../../constants/controls';
import createElement from './domHelper';

const attackImgEndpoint = '../../../resources/attack.png';
const defenseImgEndpoint = '../../../resources/defense.png';

function createFightingImg(source) {
    const attributes = {
        title: 'attack',
        alt: 'attackImg',
        src: source
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'visual_fx',
        attributes
    });
    return imgElement;
}

const attackImg = createFightingImg(attackImgEndpoint);
const defenseImg = createFightingImg(defenseImgEndpoint);
const specialAttackImg = createFightingImg(attackImgEndpoint);
specialAttackImg.classList.add('special_attack-img');

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
        attacker.setWaitForSpecialPower();
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

    function addVisuals(player, visual) {
        if (player.classList.value.includes('left')) {
            player.append(visual);
            setTimeout(() => {
                player.removeChild(visual);
            }, 100);
        } else {
            playerBDiv.insertBefore(visual, player);
            setTimeout(() => {
                visual.remove();
            }, 100);
        }
    }
    function keyDownPressed(event) {
        // check special hit use first
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
                if (firstFightingFighter.getSpecialPowerStatus()) {
                    addVisuals(playerAImg, specialAttackImg);
                    handleAttackScenario(
                        firstFightingFighter,
                        [secondFightingFighter, secondFighterHealthIndicator],
                        true
                    );
                }
            }
            if (controls.PlayerTwoCriticalHitCombination.every(key => lastSpecialKeysMemo.includes(key))) {
                if (secondFightingFighter.getSpecialPowerStatus()) {
                    addVisuals(playerBImg, specialAttackImg);
                    handleAttackScenario(
                        secondFightingFighter,
                        [firstFightingFighter, firstFighterHealthIndicator],
                        true
                    );
                }
            }
        }
        // handle rest of controls
        if (!pressedKeys.has(event.code)) {
            switch (event.code) {
                case controls.PlayerOneAttack:
                    addVisuals(playerAImg, attackImg);
                    handleAttackScenario(firstFightingFighter, [secondFightingFighter, secondFighterHealthIndicator]);
                    break;
                case controls.PlayerTwoAttack:
                    addVisuals(playerBImg, attackImg);
                    handleAttackScenario(secondFightingFighter, [firstFightingFighter, firstFighterHealthIndicator]);
                    break;
                case controls.PlayerOneBlock:
                    addVisuals(playerAImg, defenseImg);
                    firstFightingFighter.activateDefending();
                    break;
                case controls.PlayerTwoBlock:
                    addVisuals(playerBImg, defenseImg);
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

    window.addEventListener('keydown', keyDownPressed);
    window.addEventListener('keyup', deletePressedKeyOnKeyUp);
}
