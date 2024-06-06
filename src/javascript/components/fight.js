/* eslint-disable no-use-before-define */
import controls from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
    const [firstFighterHealthIndicator, secondFighterHealthIndicator] =
        document.querySelectorAll('.arena___health-bar');
    console.warn('divs!', firstFighterHealthIndicator, secondFighterHealthIndicator);
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
    function keyDownPressed(event) {
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
                case controls.PlayerOneCriticalHitCombination:
                    break;
                case controls.PlayerTwoCriticalHitCombination:
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

function handleAttackScenario(attacker, defenderContent) {
    const [defender, defenderDivHealth] = defenderContent;
    if (defender.getDefendingStatus() === false) {
        const result = getDamage(attacker.getfighterAttackPower(), defender.getfighterDefensePower());
        if (result > 0) {
            console.warn(defender.getHealthStatus());
            const healthPercentage = (defender.getHealthStatus() / defender.getStartingHealth()) * 100;
            defenderDivHealth.style.width = `${healthPercentage}%`;
            if (healthPercentage < 15) {
                defenderDivHealth.style.backgroundColor = 'red';
            }
            defender.getHurt(result);
        }
    }
}
