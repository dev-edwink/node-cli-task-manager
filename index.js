import readline from "node:readline";
import fs from "node:fs";

const FILE = "notes.json"; // file name

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function loadNotes() {
  if (!fs.existsSync(FILE)) return [];

  const raw = fs.readFileSync(FILE, "utf-8");
  if (!raw.trim()) return [];
  return [];
}

function saveNotes() {
  fs.writeFileSync(FILE, JSON.stringify(notes, null, 2), "utf-8");
}

function findNotes(q) {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  return notes
    .map((note, index) => ({ id: index + 1, note }))
    .filter(({ note }) => note.toLowerCase().includes(query));
}

const notes = loadNotes();

function showMenu() {
  console.log("\n1: Save Note");
  console.log("2: View Note List");
  console.log("3: Delete Note");
  console.log("4: Search Note");
  console.log("5: Exit");
  rl.question("Choose an option: ", handleInput);
}

function handleInput(input) {
  const option = input.trim();

  if (option === "1") {
    rl.question("\nEnter note: ", (note) => {
      const text = note.trim();
      if (!text) {
        console.log("\nNote cannot be empty");
        return showMenu();
      }
      notes.push(text);
      saveNotes();
      console.log("Saved:", text);
      showMenu();
    });
  } else if (option === "2") {
    console.log("\nSaved Notes");
    if (notes.length === 0) {
      console.log("No Notes Yet!");
      return showMenu();
    }
    notes.forEach((note, index) => {
      console.log(`${index + 1}: ${note}`);
    });
    showMenu();
  } else if (option === "3") {
    rl.question("Enter Note ID: ", (answer) => {
      const id = Number(answer.trim());

      if (!Number.isInteger(id) || id < 1 || id > notes.length) {
        console.log("\nInvalid id");
        return showMenu();
      }
      const [deleted] = notes.splice(id - 1, 1);
      saveNotes();
      console.log("Deleted:", deleted);
      showMenu();
    });
  } else if (option === "4") {
    rl.question("\nSearch Notes: ", (q) => {
      if (!q.trim()) {
        console.log("\n Enter something to search for.");
        return showMenu();
      }
      const matches = findNotes(q);
      if (matches.length <= 0) {
        console.log(`\n No notes found for "${q.trim()}".`);
        return showMenu();
      }
      console.log(`\n Found ${matches.length} matching note(s):`);
      matches.forEach(({ id, note }) => {
        console.log(`${id}:${note}`);
      });
      showMenu();
    });
  } else if (option === "5") {
    console.log("Thanks for using Notes App");
    rl.close();
  } else {
    console.log("Incorrect Input");
    showMenu();
  }
}

showMenu();
