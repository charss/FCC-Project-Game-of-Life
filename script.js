let grid_x = 50;
let grid_y = 30;
let state = true;
let generation = 0;
let timer;
let grid_arr = Array(grid_y).fill(0).map(() => Array(grid_x));
let grid_arr_copy;

let test_array = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25],
];

$("document").ready(function () {
  draw_random();
  // baby_pulsar();

  $("#grid-container").css("width", `${grid_x * 20}px`);
  run();
});

function findingNeighbors(myArray, i, j) {
  console.log({i})
  console.log({j})

  var rowLimit = myArray.length - 1;
  var columnLimit = myArray[0].length - 1;
  let sum = 0;

  for (var x = Math.max(0, i - 1); x <= Math.min(i + 1, rowLimit); x++) {
    for (var y = Math.max(0, j - 1); y <= Math.min(j + 1, columnLimit); y++) {
      if (x !== i || y !== j) {
        sum += myArray[x][y];
        console.log(myArray[x][y], [x, y]);
      }
    }
  }
  console.log(sum);
  return sum;
}

function toggle_state() {
  state = !state;
  if (state == false) {
    clearInterval(timer);
  } else {
    run();
  }
  console.log(state);
  // run(state);
}

function tick() {
  grid_arr_copy = grid_arr.map(function(arr) {
    return arr.slice();
  });

  for (let i = 0; i < grid_y; i++) {
    for (let j = 0; j < grid_x; j++) {
      let total = findingNeighbors(grid_arr_copy, i, j)
      console.log(total);
      if (grid_arr_copy[i][j] == 1) {
        // IF ALIVE
        if (total < 2) {
          // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
          grid_arr[i][j] = 0;
          die(i, j);
        } else if (total == 2 || total == 3) {
          // Any live cell with two or three live neighbours lives on to the next generation.
          // DO NOTHING
        } else if (total > 3) {
          // Any live cell with more than three live neighbours dies, as if by overpopulation.
          grid_arr[i][j] = 0;
          die(i, j);
        }
      } else if (grid_arr_copy[i][j] == 0 && total == 3) {
        // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
        grid_arr[i][j] = 1;
        revive(i, j);
      }
      // console.log('-------------------------------------------------')
    }
    // console.log('####################################')
  }

  $('#generation').html(generation++);
  console.log('GENERATION: ', generation);
  console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
}

function run() {
  timer = setInterval(function () {
    if (state == false) {
      clearInterval(timer);
    }
    tick();
  }, 50);
}

function die(i, j) {
  console.log("DIE", i, j);
  $(`#cell${i}x${j}`).addClass('dead');
  $(`#cell${i}x${j}`).removeClass('alive');
}

function revive(i, j) {
  console.log("REVIVE", i, j);
  $(`#cell${i}x${j}`).addClass('alive');
  $(`#cell${i}x${j}`).removeClass('dead');
}

function draw_random() {
  for (let i = 0; i < grid_y; i++) {
    for (let j = 0; j < grid_x; j++) {
      let x = Math.random() * 100;
      let status = '';
      if (x < 50) {
        grid_arr[i][j] = 0;
        status = 'dead';
      } else {
        grid_arr[i][j] = 1;
        status = 'alive';
      }
      $("#grid-container").append(`<div class="cell ${status}" id="cell${i}x${j}" onclick="cell_click(this)"></div>`);
    }
  }
}

function baby_pulsar() {
  let values = {
    13: [24],
    14: [23, 24, 25],
    15: [23, 25],
    16: [23, 24, 25],
    17: [24]
  };

  // let values = {
  //   6: [7],
  //   7: [6, 7, 8],
  //   8: [6, 8],
  //   9: [6, 7, 8],
  //   10: [7]
  // };

  for (let i = 0; i < grid_y; i++) {
    for (let j = 0; j < grid_x; j++) {
      let status = '';
      if (values[i]) {
        if (values[i].includes(j)) {
          grid_arr[i][j] = 1;
          status = 'alive';
        } else {
          grid_arr[i][j] = 0;
          status = 'dead';
        }
      } else {
        grid_arr[i][j] = 0;
        status = 'dead';
      }
      $("#grid-container").append(`<div class="cell ${status}" id="cell${i}x${j}" onclick="cell_click(this)"></div>`);
    }
  }
}

function cell_click(element) {
  let index = element.id.substr(4).split('x');

  let i = parseInt(index[0])
  let j = parseInt(index[1])
  console.log(element.id)
  total = findingNeighbors(grid_arr_copy, i, j)

  console.log('TOTAL: ', total);

  if (grid_arr_copy[i][j] == 1) {
    // IF ALIVE
    if (total < 2) {
      // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
      grid_arr[i][j] = 0;
      die(i, j);
    } else if (total == 2 || total == 3) {
      // Any live cell with two or three live neighbours lives on to the next generation.
      // DO NOTHING
      console.log("SURVIVE")
    } else if (total > 3) {
      // Any live cell with more than three live neighbours dies, as if by overpopulation.
      grid_arr[i][j] = 0;
      die(i, j);
    }
  } else if (grid_arr_copy[i][j] == 0 && total == 3) {
    // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    grid_arr[i][j] = 1;
    revive(i, j);
  }
  console.log('ORIGINAL: ', grid_arr)
  console.log('COPY: ', grid_arr_copy)
}

function create_copy() {
  grid_arr_copy = grid_arr.map(function(arr) {
    return arr.slice();
  });
  grid_arr_copy[0][0] = 100;
  grid_arr[0][1] = 200;
  console.log("COPY CREATED")
  console.log('ORIGINAL: ', grid_arr)
  console.log('COPY: ', grid_arr_copy)
}