const colGroups = [
  { name: "Sømænd", items: ["Svend","Søren","Salvie"] },
  { name: "Arbejdsdage", items: ["Mandag","Tirsdag","Onsdag"] },
  { name: "Fisk", items: ["Torsk","Skrubbe","Makrel"] }
];

const rowGroups = [
  { name: "Arbejdstider", items: ["05-10","10-15","15-20"] },
  { name: "Fisk", items: ["Torsk","Skrubbe","Makrel"] },
  { name: "Arbejdsdage", items: ["Mandag","Tirsdag","Onsdag"] }
];

// store clicks
let gridState = {};

// VALID BLOCKS (only these are clickable)
function isActive(rg, cg) {
  return (
    (rg === 0 && cg !== 0) || // arbejdstider vs days/fish
    (rg === 0 && cg === 0) || // arbejdstider vs days/fish
    (rg === 1 && cg !== 2) || // fish vs sailors
    (rg === 2 && cg === 0)    // days vs sailors
  );
}

// SOLUTION (from your image — O positions only)
const solution = {};

// helper to mark correct cells
function setSolution(r, c) {
  solution[`${r}-${c}`] = true;
}

// Svar (række,kolonne)(0-8)

setSolution(0, 0); // 05-10 → Mandag
setSolution(0, 5); // 05-10 → Onsdag
setSolution(0, 8); // 05-10 → Makrel

setSolution(1, 2); // 10-15 → Salvie
setSolution(1, 3); // 10-15 → Mandag
setSolution(1, 7); // 10-15 → Skrubbe

setSolution(2, 1); // 15-20 → Søren
setSolution(2, 4); // 15-20 → Tirsdag
setSolution(2, 6); // 15-20 → Torsk

setSolution(3, 1); // Torsk → Søren
setSolution(3, 4); // Torsk → Tirsdag

setSolution(4, 2); // Skrubbe → Salvie
setSolution(4, 3); // Skrubbe → Mandag

setSolution(5, 0); // Makrel → Svend
setSolution(5, 5); // Makrel → Onsdag

setSolution(6, 2); // Mandag → Salvie
setSolution(7, 1); // Tirsdag → Søren
setSolution(8, 0); // Onsdag → Svend

function createGrid() {
  const table = document.getElementById("grid");

  // HEADER ROW 1 (group names)
  let tr = document.createElement("tr");
  tr.appendChild(document.createElement("th"));
  tr.appendChild(document.createElement("th"));

  colGroups.forEach(group => {
    let th = document.createElement("th");
    th.colSpan = group.items.length;
	th.className = "subhead";
    th.textContent = group.name;
    tr.appendChild(th);
  });

  table.appendChild(tr);

  // HEADER ROW 2 (items)
  tr = document.createElement("tr");
  tr.appendChild(document.createElement("th"));
  tr.appendChild(document.createElement("th"));

  colGroups.forEach(group => {
    group.items.forEach(item => {
      let th = document.createElement("th");
      th.className = "subhead";
      th.textContent = item;
      tr.appendChild(th);
    });
  });

  table.appendChild(tr);

  let rowIndex = 0;

  rowGroups.forEach((rowGroup, rg) => {

    rowGroup.items.forEach((rowItem, r) => {

      const tr = document.createElement("tr");

      if (r === 0) {
        let th = document.createElement("th");
        th.rowSpan = rowGroup.items.length;
        th.textContent = rowGroup.name;
        tr.appendChild(th);
      }

      let label = document.createElement("td");
      label.className = "label";
      label.textContent = rowItem;
      tr.appendChild(label);

      let colIndex = 0;

      colGroups.forEach((colGroup, cg) => {
        colGroup.items.forEach(() => {

          const td = document.createElement("td");

         if (!isActive(rg, cg)) {
           td.className = "inactive";
         } else {
            td.className = "cell";

         // Vertical thick lines after col 2 and 5
         if (colIndex === 2 || colIndex === 5 || colIndex === 8) {
           td.classList.add("thick-right");
         }

        // Horizontal thick lines after row 2 and 5
        if (rowIndex === 2 || rowIndex === 5 || rowIndex === 8) {
          td.classList.add("thick-bottom");
        }

            const key = `${rowIndex}-${colIndex}`;
            gridState[key] = 0;

            td.addEventListener("click", () => {
              gridState[key] = (gridState[key] + 1) % 3;
              td.textContent = gridState[key] === 1 ? "X" :
                               gridState[key] === 2 ? "O" : "";
            });
          };

          tr.appendChild(td);
          colIndex++;
        });
      });

      table.appendChild(tr);
      rowIndex++;
    });
  });
};
function checkSolution() {
  let correct = true;

  for (let key in gridState) {
    const isO = gridState[key] === 2;
    const shouldBeO = solution[key] === true;

    if (isO !== shouldBeO) {
      correct = false;
    }
  }

  document.getElementById("result").textContent =
    correct ? "✅ Correct!" : "❌ Wrong!";
}

createGrid();