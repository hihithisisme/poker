const solver = require('javascript-lp-solver');

enum ConstraintKeywords {
    equal = 'equal'
}

type IConstraints = {
    [key: string]: { [key in ConstraintKeywords]: number };
};

type IVariables = {
    [key: string]: { [key: string]: number };
}

interface IProblem {
    constraints: IConstraints
    variables: IVariables
}

export function solve(problem: IProblem): { [key: string]: number } {
    const results = solver.Solve({
        optimize: "idkman",
        opType: "min",
        constraints: problem.constraints,
        variables: problem.variables,
    });


    delete results.feasible;
    delete results.result;
    delete results.bounded;

    console.log('results is ', JSON.stringify(results, null, 2));
    return results
}


// const problem = {
//     constraints: {
//         "p0": { equal: 34.2 },
//         "p1": { equal: 7.9 },
//         "p2": { equal: -12.4 },
//         "p3": { equal: -3.5 },
//         "p5": { equal: -20 },
//         "p6": { equal: -6.2 },
//     },
//     variables: {
//         // "f01": {
//         //     "p0": 1,
//         //     "p1": -1,
//         // },
//         "f02": {
//             "p0": 1,
//             "p2": -1,
//         },
//         "f03": {
//             "p0": 1,
//             "p3": -1,
//         },
//         "f04": {
//             "p0": 1,
//             "p4": -1,
//         },
//         "f05": {
//             "p0": 1,
//             "p5": -1,
//         },
//         "f12": {
//             "p1": 1,
//             "p2": -1,
//         },
//         "f13": {
//             "p1": 1,
//             "p3": -1,
//         },
//         "f14": {
//             "p1": 1,
//             "p4": -1,
//         },
//         "f15": {
//             "p1": 1,
//             "p5": -1,
//         },
//         // "f12": {
//         //     "p1": 1,
//         //     "p2": -1,
//         // },
//         // "f13": {
//         //     "p1": -1,
//         //     "p3": 1,
//         // },
//         // "f23": {
//         //     "p2": -1,
//         //     "p3": 1,
//         // },
//     }
// }

interface Player {
    name: string
    profit: number
}

// const players = [
//     {
//         "name": "nyssa",
//         "profit": 34.2,
//     },
//     {
//         "name": "weepz",
//         "profit": -20,
//     },
//     {
//         "name": "lx",
//         "profit": -3.5,
//     },
//     {
//         "name": "yx",
//         "profit": -12.4,
//     },
//     {
//         "name": "royboy",
//         "profit": 7.9,
//     },
//     {
//         "name": "eug",
//         "profit": -6.2,
//     },
// ];

const players = [
    {
        "name": "ny",
        "profit": -5.5,
    },
    {
        "name": "weepz",
        "profit": 12.4,
    },
    {
        "name": "lx",
        "profit": -9.8,
    },
    {
        "name": "yx",
        "profit": -15.4,
    },
    {
        "name": "ly",
        "profit": 1.5,
    },
    {
        "name": "eug",
        "profit": 15.4,
    },
];

function buildConstraintKey(playerName: string) {
    return `p--${playerName}`
}

function buildVariableKey(posName: string, negName: string) {
    return `${posName}<--${negName}`
}

export function parseVariableKey(key: string) {
    const [posP, negP] = key.split("<--");
    return {
        toPay: negP,
        recipient: posP,
    }
}

export function convertZeroSumFlowToLP(players: Player[]): IProblem {

    const buildConstraints = (): IConstraints => {
        const res: IConstraints = {}
        for (const player of players) {
            const key = buildConstraintKey(player.name);
            res[key] = { equal: player.profit }
        }

        return res;
    };

    const buildVariables = (): IVariables => {
        const res: IVariables = {}
        const posPlayers = players.filter((player) => player.profit >= 0);
        const negPlayers = players.filter((player) => player.profit < 0);

        for (const posP of posPlayers) {
            for (const negP of negPlayers) {
                const key = buildVariableKey(posP.name, negP.name);
                res[key] = {
                    [buildConstraintKey(posP.name)]: 1,
                    [buildConstraintKey(negP.name)]: -1,
                }
            }
        }

        return res
    };


    return {
        constraints: buildConstraints(),
        variables: buildVariables(),
    }
}

// const problem = convertZeroSumFlowToLP(players);

// console.log('problem: ', (problem))
// console.log('solve: ', solve(problem))

