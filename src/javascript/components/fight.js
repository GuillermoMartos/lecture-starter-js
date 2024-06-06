/* eslint-disable no-use-before-define */
import controls from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
    const [firstFighterHealthIndicator, secondFighterHealthIndicator] =
        document.querySelectorAll('.arena___health-bar');
    const firstFightingFighter = createFigthingFigther(firstFighter);
    const secondFightingFighter = createFigthingFigther(secondFighter);
    handleFightControls({
        firstFightingFighter,
        firstFighterHealthIndicator,
        secondFightingFighter,
        secondFighterHealthIndicator
    });

    return new Promise(resolve => {
        // resolve the promise with the winner when fight is over
        const timer = setInterval(() => {
            if (firstFightingFighter.getHealthStatus() <= 0) {
                clearInterval(timer);
                resolve(secondFighter);
            }
            if (secondFightingFighter.getHealthStatus() <= 0) {
                resolve(firstFighter);
                clearInterval(timer);
            }
        }, 100);
    });
}

export function getHitPower(fighterPower) {
    // return hit power
    const criticalHitChance = Math.ceil(Math.random() * 2);
    const strikeForcePower = fighterPower * criticalHitChance;
    return strikeForcePower;
}

export function getBlockPower(fighterPower) {
    // return block power
    const dodgeChance = Math.ceil(Math.random() * 2);
    const blockStrengthPower = fighterPower * dodgeChance;
    return blockStrengthPower;
}

export function getDamage(attacker, defender) {
    // return damage
    const attackResult = getHitPower(attacker) - getBlockPower(defender);
    return attackResult;
}

function handleFightControls(playersContent) {
    const { firstFightingFighter, firstFighterHealthIndicator, secondFightingFighter, secondFighterHealthIndicator } =
        playersContent;
    const pressedKeys = new Set();
    let lastSpecialKeysMemo = [];
    let timerActive = false;
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
                    handleAttackScenario(firstFightingFighter, [secondFightingFighter, secondFighterHealthIndicator]);
                    break;
                case controls.PlayerTwoAttack:
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

function createFigthingFigther(fighter) {
    let fighterHealth = fighter.health;
    const startHealthFighter = fighter.health;
    const { defense: fighterDefensePower, attack: fighterAttackPower } = fighter;
    let defending = false;
    return {
        getHealthStatus: () => {
            return fighterHealth;
        },
        getStartingHealth: () => {
            return startHealthFighter;
        },
        getHurt: damage => {
            fighterHealth -= damage;
        },
        getfighterDefensePower: () => {
            return fighterDefensePower;
        },
        getfighterAttackPower: () => {
            return fighterAttackPower;
        },
        activateDefending: () => {
            defending = true;
            setTimeout(() => {
                defending = false;
            }, 1000);
        },
        getDefendingStatus: () => {
            return defending;
        }
    };
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

function decreaseDefenderHealth(defenderContent, damageResult) {
    const [defender, defenderDivHealth] = defenderContent;
    const healthPercentage = ((defender.getHealthStatus() - damageResult) / defender.getStartingHealth()) * 100;
    defenderDivHealth.style.width = `${healthPercentage}%`;
    if (healthPercentage < 15) {
        defenderDivHealth.style.backgroundColor = 'red';
    }
    defender.getHurt(damageResult);
}
