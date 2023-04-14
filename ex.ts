let arr: number[] = [3, 2, 2, 1, 4, 5, 3, 2, 2, 1, 1];

// Do some preprocessing first...
let counts = arr.reduce<string[]>((counts, num) => {
  counts[num] = (counts[num] || 0) + 1;
  return counts;
}, {});

console.log(counts);