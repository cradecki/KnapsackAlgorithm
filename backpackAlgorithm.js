import { defaultValues, chromosome } from "./variables.js";

const functionCalculation = (chromEl) => {
  let result = 0;
  for (let i = 0; i < 10; i++) {
    result += defaultValues.values[i] * chromEl[i];
  }
  return result;
};

const weightsCalculation = (chromEl) => {
  let result = 0;
  for (let i = 0; i < 10; i++) {
    result += defaultValues.weights[i] * chromEl[i];
  }
  return result;
};

const removeRandomElement = (population) => {
  let weightsFun = population.map((el) => weightsCalculation([...el]));

  let newPopulation = population.slice();
  let drawnChromEl = 0;
  let overweightChromosomeIndex = [];

  // sprawdzamy czy któryś chromosom większą wagę od wagi maksymalnej
  while (weightsFun.some((el) => el > defaultValues.maxWeight)) {
    for (let i = 0; i < weightsFun.length; i++) {
      if (weightsFun[i] > defaultValues.maxWeight) {
        overweightChromosomeIndex.push(i);
      }
    }

    /*
      W przypadku znalezienia takiego chromosomu losujemy element chromosomu do usunięcia pod warunkiem ze dany element chromosomu wynosi '1'.
      Usuwamy element (zamieniamy 1 na 0) oraz sprawdzamy czy teraz waga jest mniejsza lub równa wadze maksymalnej, jeżeli nadal jest większa od wagi maksymalnej,
      robimy wszystko jeszcze raz, natomiast jeżeli po zamianie waga chromosomu jest mniejsza bądź równa wadze maksymalnej kończymy działanie funkcji.
    */
    newPopulation = population.slice();
    for (const index of overweightChromosomeIndex) {
      do {
        do {
          drawnChromEl = Math.floor(Math.random() * 10);
        } while (newPopulation[index][drawnChromEl] !== "1");

        newPopulation[index] =
          newPopulation[index].substring(0, drawnChromEl) +
          "0" +
          newPopulation[index].substring(drawnChromEl + 1);

        weightsFun[index] = weightsCalculation([...newPopulation[index]]);
      } while (
        weightsCalculation([...newPopulation[index]]) >= defaultValues.maxWeight
      );
    }
  }
  // drawnChrom = Math.floor(Math.random() * 6);
  return newPopulation;
};

const rouletteWheel = (population, adaptationFun) => {
  const sumOfAdaptationFun = adaptationFun.reduce((sum, el) => sum + el);

  const drawnChance = adaptationFun.map((el) =>
    ((el / sumOfAdaptationFun) * 100).toFixed(2)
  );

  const newPopulation = [];

  for (let i = 0; i < population.length; i++) {
    const random = Math.random() * 100;

    let accumulateSum = 0;
    for (let j = 0; j < population.length; j++) {
      accumulateSum += parseFloat(drawnChance[j]);
      // console.log(`Accumulate sum: ${accumulateSum}`);
      if (accumulateSum >= 99.9) accumulateSum = Math.ceil(accumulateSum);

      if (random <= accumulateSum) {
        newPopulation.push(population[j]);
        break;
      }
    }
  }

  return newPopulation;
};

const crossover = (population) => {
  const newPopulation = [];

  for (let i = 0; i < population.length; i += 2) {
    if (Math.random() < defaultValues.Pk) {
      const crossoverPoint =
        Math.floor(Math.random() * (population[i].length - 1)) + 1;
      // console.log(`Error here: ${population} i: ${i}`);
      const child1 = [
        ...population[i].slice(0, crossoverPoint),
        ...population[i + 1].slice(crossoverPoint),
      ].join("");
      const child2 = [
        ...population[i + 1].slice(0, crossoverPoint),
        ...population[i].slice(crossoverPoint),
      ].join("");
      newPopulation.push(child1, child2);
    } else {
      newPopulation.push(population[i], population[i + 1]);
    }
  }
  return newPopulation;
};

const mutation = (population) => {
  const newPopulation = population.map((chrom) => {
    if (Math.random() < defaultValues.Pm) {
      const locus = Math.floor(Math.random() * defaultValues.bits);
      chrom = [...chrom];
      chrom[locus] = chrom[locus] == "0" ? "1" : "0";
      chrom = chrom.join("");
    }
    return chrom;
  });
  return newPopulation;
};

const generateRandomChromosome = (length) => {
  let chromosome = "";
  for (let i = 0; i < length; i++) {
    // Losowo wybieramy 0 lub 1
    chromosome += Math.random() < 0.5 ? "0" : "1";
  }
  return chromosome;
};

export const evolve = () => {
  let generations = 0;
  let stagnation = 0;
  let startPopulation = [];

  const isEnteredChromosome = chromosome.some((ch) => ch.length > 0);

  // isEnteredChromosome
  //   ? (startPopulation = chromosome)
  //   : (startPopulation = [
  //       "0101110100",
  //       "0110101010",
  //       "1101010010",
  //       "1000101010",
  //       "1111011010",
  //       "1011101011",
  //     ]);

  if (isEnteredChromosome) {
    startPopulation = chromosome;
  } else {
    for (let i = 0; i < 6; i++) {
      startPopulation.push(generateRandomChromosome(10));
    }
  }

  let startAdaptationFun = startPopulation.map((el) =>
    functionCalculation([...el])
  );

  let startWeightsFun = startPopulation.map((el) =>
    weightsCalculation([...el])
  );

  const startAdaptationSum = startAdaptationFun.reduce((sum, el) => sum + el);

  console.log(`Start population: ${startPopulation}`);
  console.log(`Adaptation fun: ${startAdaptationFun}`);
  console.log(`Weights fun: ${startWeightsFun}`);
  console.log(`Adapt. sum: ${startAdaptationSum}`);

  let currentBestPopulation = startPopulation;
  let currentBestAdaptationFun = startAdaptationFun;
  let currentBestAdaptationSum = startAdaptationSum;
  let currentBestWeightFun = startWeightsFun;

  while (generations < 100000 && stagnation < 100) {
    generations++;
    console.log(`Gen: ${generations}`);

    let currentPopulation = removeRandomElement(currentBestPopulation);
    // console.log(`After removing: ${currentPopulation}`);
    // console.log(currentPopulation.map((el) => functionCalculation([...el])));
    // console.log(currentPopulation.map((el) => weightsCalculation([...el])));
    // console.log(
    //   currentPopulation
    //     .map((el) => functionCalculation([...el]))
    //     .reduce((sum, el) => sum + el)
    // );

    let currentAdaptationFun = currentPopulation.map((el) =>
      functionCalculation([...el])
    );

    let currentWeightFun = currentPopulation.map((el) =>
      weightsCalculation([...el])
    );

    currentPopulation = rouletteWheel(currentPopulation, currentAdaptationFun);
    // console.log(`After roulette: ${currentPopulation}`);
    // console.log(currentPopulation.map((el) => functionCalculation([...el])));
    // console.log(currentPopulation.map((el) => weightsCalculation([...el])));
    // console.log(
    //   currentPopulation
    //     .map((el) => functionCalculation([...el]))
    //     .reduce((sum, el) => sum + el)
    // );

    currentPopulation = crossover(currentPopulation);
    // console.log(`After crossover: ${currentPopulation}`);
    // console.log(currentPopulation.map((el) => functionCalculation([...el])));
    // console.log(currentPopulation.map((el) => weightsCalculation([...el])));
    // console.log(
    //   currentPopulation
    //     .map((el) => functionCalculation([...el]))
    //     .reduce((sum, el) => sum + el)
    // );

    currentPopulation = mutation(currentPopulation);
    console.log(`After mutation: ${currentPopulation}`);
    console.log(currentPopulation.map((el) => functionCalculation([...el])));
    console.log(currentPopulation.map((el) => weightsCalculation([...el])));
    console.log(
      currentPopulation
        .map((el) => functionCalculation([...el]))
        .reduce((sum, el) => sum + el)
    );

    currentAdaptationFun = currentPopulation.map((el) =>
      functionCalculation([...el])
    );

    const currentAdaptationSum = currentAdaptationFun.reduce(
      (sum, el) => sum + el
    );

    currentWeightFun = currentPopulation.map((el) =>
      weightsCalculation([...el])
    );
    // if (
    //   currentBestAdaptationSum <= currentAdaptationSum &&
    //   currentBestAdaptationSum / startPopulation.length <=
    //     currentAdaptationSum / startPopulation.length
    // ) {
    //   stagnation++;
    // } else {
    //   stagnation = 0;
    // }
    // currentBestPopulation = currentPopulation;
    // currentBestAdaptationFun = currentAdaptationFun;
    // currentBestAdaptationSum = currentAdaptationSum;
    // currentBestWeightFun = currentWeightFun;

    if (!currentWeightFun.some((weight) => weight > defaultValues.maxWeight)) {
      if (currentAdaptationSum > currentBestAdaptationSum) {
        console.log(`hej czesc siemanko`);
        stagnation = 0; // Zresetuj licznik stagnacji, ponieważ znaleziono lepsze rozwiązanie
        currentBestPopulation = currentPopulation;
        currentBestAdaptationFun = currentAdaptationFun;
        currentBestAdaptationSum = currentAdaptationSum;
        currentBestWeightFun = currentWeightFun;
      } else {
        stagnation++;
      }
    } else {
      stagnation++;
    }
  }

  console.log(`Generations: ${generations}`);
  console.log(`Stagnation: ${stagnation}`);
  console.log(`Final population ${currentBestPopulation}`);
  console.log(currentBestPopulation.map((el) => functionCalculation([...el])));
  console.log(currentBestPopulation.map((el) => weightsCalculation([...el])));
  console.log(
    currentBestPopulation
      .map((el) => functionCalculation([...el]))
      .reduce((sum, el) => sum + el)
  );
};
