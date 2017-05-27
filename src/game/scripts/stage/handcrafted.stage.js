const STAGES = [{
  name: 'basic-1',
  floors: [
    [0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0],
    [0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0],
    [0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0],
    [0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0],
    [1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,0,0,1,1,1,1,0,0,1,1,1,0],
    [0,1,1,1,0,0,0,1,1,0,0,0,1,1,1,0]
  ],
  obstacles: [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,0,0,1,0,0,1,0,1,0,0,0,0,0,0],
    [0,1,0,0,1,0,0,1,0,1,0,0,0,0,1,0],
    [0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,0,1,0,0,0,0,0,0,0],
    [0,1,0,1,0,0,1,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,0,1,0,0,0,1,1,0,0,0,0,0,0,0]
  ],
  rotors: [
    [0,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0],
    [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0]
  ],
  start: {
    x: 1,
    y: 3
  },
  end: {
    x: 1,
    y: 8
  },
  actors: [{
    name: 'Guardian',
    x: 2,
    y: 9
  }]
}, {
  name: 'basic-2',
  floors: [
    [1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0],
    [1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,0,0,0,1,1,1,1]
  ],
  obstacles: [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,1,0,0,1,1,1,0,0,0,0,0,0],
    [0,1,0,1,0,0,0,0,0,0,0,0,1,0,0,0],
    [1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0],
    [0,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,0,1,1,1,1,0,1,0,0,0,0,0,0,0],
    [0,1,0,1,0,0,1,0,1,0,0,0,1,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
    [0,1,0,1,0,0,0,1,1,0,0,0,0,0,0,0]
  ],
  rotors: [
    [0,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [0,0,1,0,1,0,0,0,0,0,0,0,0,1,0,0]
  ],
  start: {
    x: 1,
    y: 1
  },
  end: {
    x: 3,
    y: 4
  },
  actors: [{
    name: 'Guardian',
    x: 2,
    y: 9
  }, {
    name: 'Guardian',
    x: 10,
    y: 8
  }]
}];

export default STAGES;