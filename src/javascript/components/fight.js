/* eslint-disable no-use-before-define */
import handleFightControls from '../helpers/fightHelper';

export default async function fight(firstFighter, secondFighter) {
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
