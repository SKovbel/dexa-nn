class simpleData {
    //"sepal.length"], outputs: ["sepal.width"], outputs: ["petal.length"], outputs: ["petal.width"], outputs: ["variety"], train: true},
    // Setosa = [1, 0, 0]
    // Versicolor = [0, 1, 0]
    // Virginica = [0, 0, 1]
    static data =  [
        {inputs: [5.1, 3.5, 1.4, .2], outputs: [1, 0, 0], train: false},
        {inputs: [4.9, 3, 1.4, .2],   outputs: [1, 0, 0], train: true},
        {inputs: [4.7, 3.2, 1.3, .2], outputs: [1, 0, 0], train: true},
        {inputs: [4.6, 3.1, 1.5, .2], outputs: [1, 0, 0], train: true},
        {inputs: [5, 3.6, 1.4, .2],   outputs: [1, 0, 0], train: true},
        {inputs: [5.4, 3.9, 1.7, .4], outputs: [1, 0, 0], train: true},
        {inputs: [4.6, 3.4, 1.4, .3], outputs: [1, 0, 0], train: true},
        {inputs: [5, 3.4, 1.5, .2],   outputs: [1, 0, 0], train: true},
        {inputs: [4.4, 2.9, 1.4, .2], outputs: [1, 0, 0], train: true},
        {inputs: [4.9, 3.1, 1.5, .1], outputs: [1, 0, 0], train: true},
        {inputs: [5.4, 3.7, 1.5, .2], outputs: [1, 0, 0], train: true},
        {inputs: [4.8, 3.4, 1.6, .2], outputs: [1, 0, 0], train: true},
        {inputs: [4.8, 3, 1.4, .1],   outputs: [1, 0, 0], train: true},
        {inputs: [4.3, 3, 1.1, .1],   outputs: [1, 0, 0], train: true},
        {inputs: [5.8, 4, 1.2, .2],   outputs: [1, 0, 0], train: true},
        {inputs: [5.7, 4.4, 1.5, .4], outputs: [1, 0, 0], train: true},
        {inputs: [5.4, 3.9, 1.3, .4], outputs: [1, 0, 0], train: true},
        {inputs: [5.1, 3.5, 1.4, .3], outputs: [1, 0, 0], train: true},
        {inputs: [5.7, 3.8, 1.7, .3], outputs: [1, 0, 0], train: true},
        {inputs: [5.1, 3.8, 1.5, .3], outputs: [1, 0, 0], train: true},
        {inputs: [5.4, 3.4, 1.7, .2], outputs: [1, 0, 0], train: true},
        {inputs: [5.1, 3.7, 1.5, .4], outputs: [1, 0, 0], train: true},
        {inputs: [4.6, 3.6, 1, .2],   outputs: [1, 0, 0], train: true},
        {inputs: [5.1, 3.3, 1.7, .5], outputs: [1, 0, 0], train: true},
        {inputs: [4.8, 3.4, 1.9, .2], outputs: [1, 0, 0], train: true},
        {inputs: [5, 3, 1.6, .2],     outputs: [1, 0, 0], train: true},
        {inputs: [5, 3.4, 1.6, .4],   outputs: [1, 0, 0], train: true},
        {inputs: [5.2, 3.5, 1.5, .2], outputs: [1, 0, 0], train: true},
        {inputs: [5.2, 3.4, 1.4, .2], outputs: [1, 0, 0], train: true},
        {inputs: [4.7, 3.2, 1.6, .2], outputs: [1, 0, 0], train: true},
        {inputs: [4.8, 3.1, 1.6, .2], outputs: [1, 0, 0], train: true},
        {inputs: [5.4, 3.4, 1.5, .4], outputs: [1, 0, 0], train: true},
        {inputs: [5.2, 4.1, 1.5, .1], outputs: [1, 0, 0], train: true},
        {inputs: [5.5, 4.2, 1.4, .2], outputs: [1, 0, 0], train: true},
        {inputs: [4.9, 3.1, 1.5, .2], outputs: [1, 0, 0], train: true},
        {inputs: [5, 3.2, 1.2, .2],   outputs: [1, 0, 0], train: true},
        {inputs: [5.5, 3.5, 1.3, .2], outputs: [1, 0, 0], train: true},
        {inputs: [4.9, 3.6, 1.4, .1], outputs: [1, 0, 0], train: true},
        {inputs: [4.4, 3, 1.3, .2],   outputs: [1, 0, 0], train: true},
        {inputs: [5.1, 3.4, 1.5, .2], outputs: [1, 0, 0], train: true},
        {inputs: [5, 3.5, 1.3, .3],   outputs: [1, 0, 0], train: true},
        {inputs: [4.5, 2.3, 1.3, .3], outputs: [1, 0, 0], train: true},
        {inputs: [4.4, 3.2, 1.3, .2], outputs: [1, 0, 0], train: true},
        {inputs: [5, 3.5, 1.6, .6],   outputs: [1, 0, 0], train: true},
        {inputs: [5.1, 3.8, 1.9, .4], outputs: [1, 0, 0], train: true},
        {inputs: [4.8, 3, 1.4, .3],   outputs: [1, 0, 0], train: true},
        {inputs: [5.1, 3.8, 1.6, .2], outputs: [1, 0, 0], train: true},
        {inputs: [4.6, 3.2, 1.4, .2], outputs: [1, 0, 0], train: true},
        {inputs: [5.3, 3.7, 1.5, .2], outputs: [1, 0, 0], train: true},
        {inputs: [5, 3.3, 1.4, .2],   outputs: [1, 0, 0], train: true},
        {inputs: [7, 3.2, 4.7, 1.4],  outputs: [0, 1, 0], train: false},
        {inputs: [6.4, 3.2, 4.5, 1.5],outputs: [0, 1, 0], train: true},
        {inputs: [6.9, 3.1, 4.9, 1.5],outputs: [0, 1, 0], train: true},
        {inputs: [5.5, 2.3, 4, 1.3],  outputs: [0, 1, 0], train: true},
        {inputs: [6.5, 2.8, 4.6, 1.5],outputs: [0, 1, 0], train: true},
        {inputs: [5.7, 2.8, 4.5, 1.3],outputs: [0, 1, 0], train: true},
        {inputs: [6.3, 3.3, 4.7, 1.6],outputs: [0, 1, 0], train: true},
        {inputs: [4.9, 2.4, 3.3, 1],  outputs: [0, 1, 0], train: true},
        {inputs: [6.6, 2.9, 4.6, 1.3],outputs: [0, 1, 0], train: true},
        {inputs: [5.2, 2.7, 3.9, 1.4],outputs: [0, 1, 0], train: true},
        {inputs: [5, 2, 3.5, 1],      outputs: [0, 1, 0], train: true},
        {inputs: [5.9, 3, 4.2, 1.5],  outputs: [0, 1, 0], train: true},
        {inputs: [6, 2.2, 4, 1],      outputs: [0, 1, 0], train: true},
        {inputs: [6.1, 2.9, 4.7, 1.4],outputs: [0, 1, 0], train: true},
        {inputs: [5.6, 2.9, 3.6, 1.3],outputs: [0, 1, 0], train: true},
        {inputs: [6.7, 3.1, 4.4, 1.4],outputs: [0, 1, 0], train: true},
        {inputs: [5.6, 3, 4.5, 1.5],  outputs: [0, 1, 0], train: true},
        {inputs: [5.8, 2.7, 4.1, 1],  outputs: [0, 1, 0], train: true},
        {inputs: [6.2, 2.2, 4.5, 1.5],outputs: [0, 1, 0], train: true},
        {inputs: [5.6, 2.5, 3.9, 1.1],outputs: [0, 1, 0], train: true},
        {inputs: [5.9, 3.2, 4.8, 1.8],outputs: [0, 1, 0], train: true},
        {inputs: [6.1, 2.8, 4, 1.3],  outputs: [0, 1, 0], train: true},
        {inputs: [6.3, 2.5, 4.9, 1.5],outputs: [0, 1, 0], train: true},
        {inputs: [6.1, 2.8, 4.7, 1.2],outputs: [0, 1, 0], train: true},
        {inputs: [6.4, 2.9, 4.3, 1.3],outputs: [0, 1, 0], train: true},
        {inputs: [6.6, 3, 4.4, 1.4],  outputs: [0, 1, 0], train: true},
        {inputs: [6.8, 2.8, 4.8, 1.4],outputs: [0, 1, 0], train: true},
        {inputs: [6.7, 3, 5, 1.7],    outputs: [0, 1, 0], train: true},
        {inputs: [6, 2.9, 4.5, 1.5],  outputs: [0, 1, 0], train: true},
        {inputs: [5.7, 2.6, 3.5, 1],  outputs: [0, 1, 0], train: true},
        {inputs: [5.5, 2.4, 3.8, 1.1],outputs: [0, 1, 0], train: true},
        {inputs: [5.5, 2.4, 3.7, 1],  outputs: [0, 1, 0], train: true},
        {inputs: [5.8, 2.7, 3.9, 1.2],outputs: [0, 1, 0], train: true},
        {inputs: [6, 2.7, 5.1, 1.6],  outputs: [0, 1, 0], train: true},
        {inputs: [5.4, 3, 4.5, 1.5],  outputs: [0, 1, 0], train: true},
        {inputs: [6, 3.4, 4.5, 1.6],  outputs: [0, 1, 0], train: true},
        {inputs: [6.7, 3.1, 4.7, 1.5],outputs: [0, 1, 0], train: true},
        {inputs: [6.3, 2.3, 4.4, 1.3],outputs: [0, 1, 0], train: true},
        {inputs: [5.6, 3, 4.1, 1.3],  outputs: [0, 1, 0], train: true},
        {inputs: [5.5, 2.5, 4, 1.3],  outputs: [0, 1, 0], train: true},
        {inputs: [5.5, 2.6, 4.4, 1.2],outputs: [0, 1, 0], train: true},
        {inputs: [6.1, 3, 4.6, 1.4],  outputs: [0, 1, 0], train: true},
        {inputs: [5.8, 2.6, 4, 1.2],  outputs: [0, 1, 0], train: true},
        {inputs: [5, 2.3, 3.3, 1],    outputs: [0, 1, 0], train: true},
        {inputs: [5.6, 2.7, 4.2, 1.3],outputs: [0, 1, 0], train: true},
        {inputs: [5.7, 3, 4.2, 1.2],  outputs: [0, 1, 0], train: true},
        {inputs: [5.7, 2.9, 4.2, 1.3],outputs: [0, 1, 0], train: true},
        {inputs: [6.2, 2.9, 4.3, 1.3],outputs: [0, 1, 0], train: true},
        {inputs: [5.1, 2.5, 3, 1.1],  outputs: [0, 1, 0], train: true},
        {inputs: [5.7, 2.8, 4.1, 1.3],outputs: [0, 1, 0], train: true},
        {inputs: [6.3, 3.3, 6, 2.5],  outputs: [0, 0, 1], train: false},
        {inputs: [5.8, 2.7, 5.1, 1.9],outputs: [0, 0, 1], train: true},
        {inputs: [7.1, 3, 5.9, 2.1],  outputs: [0, 0, 1], train: true},
        {inputs: [6.3, 2.9, 5.6, 1.8],outputs: [0, 0, 1], train: true},
        {inputs: [6.5, 3, 5.8, 2.2],  outputs: [0, 0, 1], train: true},
        {inputs: [7.6, 3, 6.6, 2.1],  outputs: [0, 0, 1], train: true},
        {inputs: [4.9, 2.5, 4.5, 1.7],outputs: [0, 0, 1], train: true},
        {inputs: [7.3, 2.9, 6.3, 1.8],outputs: [0, 0, 1], train: true},
        {inputs: [6.7, 2.5, 5.8, 1.8],outputs: [0, 0, 1], train: true},
        {inputs: [7.2, 3.6, 6.1, 2.5],outputs: [0, 0, 1], train: true},
        {inputs: [6.5, 3.2, 5.1, 2],  outputs: [0, 0, 1], train: true},
        {inputs: [6.4, 2.7, 5.3, 1.9],outputs: [0, 0, 1], train: true},
        {inputs: [6.8, 3, 5.5, 2.1],  outputs: [0, 0, 1], train: true},
        {inputs: [5.7, 2.5, 5, 2],    outputs: [0, 0, 1], train: true},
        {inputs: [5.8, 2.8, 5.1, 2.4],outputs: [0, 0, 1], train: true},
        {inputs: [6.4, 3.2, 5.3, 2.3],outputs: [0, 0, 1], train: true},
        {inputs: [6.5, 3, 5.5, 1.8],  outputs: [0, 0, 1], train: true},
        {inputs: [7.7, 3.8, 6.7, 2.2],outputs: [0, 0, 1], train: true},
        {inputs: [7.7, 2.6, 6.9, 2.3],outputs: [0, 0, 1], train: true},
        {inputs: [6, 2.2, 5, 1.5],    outputs: [0, 0, 1], train: true},
        {inputs: [6.9, 3.2, 5.7, 2.3],outputs: [0, 0, 1], train: true},
        {inputs: [5.6, 2.8, 4.9, 2],  outputs: [0, 0, 1], train: true},
        {inputs: [7.7, 2.8, 6.7, 2],  outputs: [0, 0, 1], train: true},
        {inputs: [6.3, 2.7, 4.9, 1.8],outputs: [0, 0, 1], train: true},
        {inputs: [6.7, 3.3, 5.7, 2.1],outputs: [0, 0, 1], train: true},
        {inputs: [7.2, 3.2, 6, 1.8],  outputs: [0, 0, 1], train: true},
        {inputs: [6.2, 2.8, 4.8, 1.8],outputs: [0, 0, 1], train: true},
        {inputs: [6.1, 3, 4.9, 1.8],  outputs: [0, 0, 1], train: true},
        {inputs: [6.4, 2.8, 5.6, 2.1],outputs: [0, 0, 1], train: true},
        {inputs: [7.2, 3, 5.8, 1.6],  outputs: [0, 0, 1], train: true},
        {inputs: [7.4, 2.8, 6.1, 1.9],outputs: [0, 0, 1], train: true},
        {inputs: [7.9, 3.8, 6.4, 2],  outputs: [0, 0, 1], train: true},
        {inputs: [6.4, 2.8, 5.6, 2.2],outputs: [0, 0, 1], train: true},
        {inputs: [6.3, 2.8, 5.1, 1.5],outputs: [0, 0, 1], train: true},
        {inputs: [6.1, 2.6, 5.6, 1.4],outputs: [0, 0, 1], train: true},
        {inputs: [7.7, 3, 6.1, 2.3],  outputs: [0, 0, 1], train: true},
        {inputs: [6.3, 3.4, 5.6, 2.4],outputs: [0, 0, 1], train: true},
        {inputs: [6.4, 3.1, 5.5, 1.8],outputs: [0, 0, 1], train: true},
        {inputs: [6, 3, 4.8, 1.8],    outputs: [0, 0, 1], train: true},
        {inputs: [6.9, 3.1, 5.4, 2.1],outputs: [0, 0, 1], train: true},
        {inputs: [6.7, 3.1, 5.6, 2.4],outputs: [0, 0, 1], train: true},
        {inputs: [6.9, 3.1, 5.1, 2.3],outputs: [0, 0, 1], train: true},
        {inputs: [5.8, 2.7, 5.1, 1.9],outputs: [0, 0, 1], train: true},
        {inputs: [6.8, 3.2, 5.9, 2.3],outputs: [0, 0, 1], train: true},
        {inputs: [6.7, 3.3, 5.7, 2.5],outputs: [0, 0, 1], train: true},
        {inputs: [6.7, 3, 5.2, 2.3],  outputs: [0, 0, 1], train: true},
        {inputs: [6.3, 2.5, 5, 1.9],  outputs: [0, 0, 1], train: true},
        {inputs: [6.5, 3, 5.2, 2],    outputs: [0, 0, 1], train: true},
        {inputs: [6.2, 3.4, 5.4, 2.3],outputs: [0, 0, 1], train: true},
        {inputs: [5.9, 3, 5.1, 1.8],  outputs: [0, 0, 1], train: true},
    ]
}