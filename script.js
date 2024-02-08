import { evolve } from "./backpackAlgorithm.js";
import { defaultValues, chromosome } from "./variables.js";

const calculateBtn = document.querySelector(".calculate");
const chromosomesDiv = document.querySelector(".chromosomes");

let chromosomesNumber = 6;

const addChromosomeInput = () => {
  for (let i = 1; i <= chromosomesNumber; i++) {
    const Singlechromosome = document.createElement("div");
    Singlechromosome.setAttribute("class", "chromosome");

    const chromosomeInput = document.createElement("input");
    chromosomeInput.setAttribute("type", "text");
    chromosomeInput.setAttribute("id", `ch${i}`);
    chromosomeInput.setAttribute("maxlength", 10);

    let randomChromosome = Math.floor(Math.random() * 1024);
    chromosomeInput.setAttribute(
      "placeholder",
      randomChromosome.toString(2).padStart(10, "0")
    );

    const chInputLabel = document.createElement("label");
    chInputLabel.setAttribute("for", `ch${i}`);
    chInputLabel.textContent = `Ch ${i}:`;

    Singlechromosome.append(chInputLabel);
    Singlechromosome.append(chromosomeInput);
    chromosomesDiv.append(Singlechromosome);
  }
};

addChromosomeInput();

const downloadData = () => {
  defaultValues.Pk = parseFloat(
    document.getElementById("Pk").value || defaultValues.Pk
  );
  defaultValues.Pm = parseFloat(
    document.getElementById("Pm").value || defaultValues.Pm
  );

  // for (let i = 0; i < chromosomesNumber; i++) {
  //   const chromosomeValue = document.getElementById(`ch${i + 1}`).value;
  //   chromosome[i] = chromosomeValue;
  // }

  evolve();
};

calculateBtn.addEventListener("click", downloadData);
