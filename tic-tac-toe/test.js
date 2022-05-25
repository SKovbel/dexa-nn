class Test {
    test = {
        '0': [
            [
                -1, -1, -1,
                -1,  1, -1,
                 0,  1,  0
            ]
        ],
        'X': [
            [
                1,  1,  1,
                1, -1, -1,
               -1,  1,  0
           ],
           [
                -1, -1,  1,
                -1,  1, -1,
                 1,  1,  1
           ],
           [
                1, -1, 1,
                -1, -1, 1,
                -1,  1, 0
            ],
            [
                1, -1, -1,
                -1, -1,  1,
                1,  1,  0
            ],

        ],
        'C': [
            [
                -1,  1,  0,
                 1, -1,  0,
                -1,  1,  0
            ]
        ],
        'D': [
            [
               -1,  1, -1,
                1,  1, -1,
                1, -1,  0
            ],
            [
                -1,  1,  1,
                 1,  1, -1,
                -1, -1,  0
            ],
            [
                1, -1,  1,
               -1, -1,  1,
                0,  1, -1
            ],
            [
                1, -1,  0,
               -1, -1,  1,
                1,  1, -1
            ]

        ]
    };

    run() {
        const game = new Game();
        for (const type in this.test) {
            for (const index in this.test[type]) {
                game.fields = this.test[type][index];
                const status = game.gameStatus();
                const gameType = 
                    (status == 1     ? 'X' : '') +
                    (status == -1    ? '0' : '') +
                    (status === 0    ? 'D' : '') +
                    (status === null ? 'C' : '');
                let msg = type + '#' + index + ' == ' +  (gameType != type ? '? ' : '  ') + gameType;
                console.log(msg);
            }
        }
    }
}
