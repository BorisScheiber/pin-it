let titles = [];
let notes = [];
let trashTitles = [];
let trashNotes = [];

load();

// Body onload
function init() {
  render();
  renderTrash();
}

function render() {
  let content = document.getElementById("contentNotes");
  let titleInput = document.getElementById("title");
  let noteInput = document.getElementById("note");
  content.innerHTML = "";
  titleInput.value = "";
  noteInput.value = "";

  for (let i = 0; i < titles.length; i++) {
    const title = titles[i];
    const note = notes[i];

    content.innerHTML += renderHtml(title, note, i);
  }
}

// Render HTML
function renderHtml(title, note, i) {
  return /*html*/ `
  <div class="content_note">
  <div class="title">
      <input class="content_title_input" type="text" value="${title}" readonly>
      <img class="clear_title" onclick="deleteNote(${i})" src="./img/trash-can-solid.svg" alt="">
  </div>
  <div class="text_container" id="textContainer${i}">
      <textarea class="text_area" maxlength="300" readonly>${note}</textarea>
      <button onclick="editNote(${i})"  class="edit_button">Bearbeiten</button>
  </div>
  </div> 
      `;
}

function renderTrash() {
  let trashContent = document.getElementById("contentTrash");
  trashContent.innerHTML = "";

  for (let i = 0; i < trashTitles.length; i++) {
    const trashTitle = trashTitles[i];
    const trashNote = trashNotes[i];

    trashContent.innerHTML += renderTrashHtml(trashTitle, trashNote, i);
  }
}

// Render Trash HTML
function renderTrashHtml(trashTitle, trashNote, i) {
  return /*html*/ `
  <div class="content_note">
  <div class="trash_title">
      <input class="trash_title_input" type="text" value="${trashTitle}" readonly>
  </div>
  <div class="text_container">
      <textarea class="text_area" maxlength="300" readonly>${trashNote}</textarea>
      <button class="restore_button"><img onclick="restoreTrashNote(${i})" src="./img/rotate-solid.svg" alt=""><img onclick="openConfirmation(${i})" src="./img/trash-solid (1).svg" alt=""></button>
  </div>
  </div>
  `;
}

// Notiz erstellen
function addNote() {
  let title = document.getElementById("title").value;
  let note = document.getElementById("note").value;
  if (title == "") {
    alert("Bitte einen Titel eingeben");
  } else {
    if (note == "") {
      alert("Bitte eine Notiz eingeben");
    } else {
      titles.push(title);
      notes.push(note);

      render();
      save();
    }
  }
}
// Notiz löschen
function deleteNote(i) {
  trashTitles.push(titles[i]);
  trashNotes.push(notes[i]);
  renderTrash();

  titles.splice(i, 1);
  notes.splice(i, 1);
  render();
  save();
}

// Gelöschte Notiz löschen
function deleteTrashNote(i) {
  trashTitles.splice(i, 1);
  trashNotes.splice(i, 1);
  renderTrash();
  save();
  closeConfirmation();
}

// Gelöschte Notiz wiederherstellen
function restoreTrashNote(i) {
  titles.push(trashTitles[i]);
  notes.push(trashNotes[i]);
  render();

  trashTitles.splice(i, 1);
  trashNotes.splice(i, 1);
  renderTrash();
  save();
}

// Notiz entgültig löschen Abfrage --> ÖFFNEN
function openConfirmation(i) {
  document.getElementById("popUp").style.display = "flex";

  document.getElementById("popUp").innerHTML = openConfirmationHtml(i);
}
// Render openConfirmation HTML
function openConfirmationHtml(i) {
  return /*html*/ `
  <div class="pop_up_box">
      <h3>Willst du diese Notiz entgültig löschen?</h3>
      <div class="permanent_delete">
          <button onclick="deleteTrashNote(${i})" class="permanent_delete_buttons"><img
                  src="./img/check-solid.svg"></button>
          <button onclick="closeConfirmation()" class="permanent_delete_buttons"><img
                  src="./img/xmark-solid.svg"></button>
      </div>
  </div>
`;
}

// Notiz engültig löschen Abfrage --> SCHLIEßEN
function closeConfirmation() {
  document.getElementById("popUp").style.display = "none";
}

// Notizen bearbeiten
function editNote(i) {
  const titleInput = document.querySelector(
    `.content_note:nth-child(${i + 1}) .content_title_input`
  );
  const noteTextarea = document.querySelector(`#textContainer${i} .text_area`);
  titleInput.removeAttribute("readonly");
  noteTextarea.removeAttribute("readonly");

  const textContainer = document.getElementById(`textContainer${i}`);
  textContainer.innerHTML += `<button onclick="saveEditedNote(${i})" class="save_button">Speichern</button>`;
  textContainer.querySelector(".edit_button").style.display = "none";

  titleInput.focus();
}

// Bearbeitete Notiz speichern
function saveEditedNote(i) {
  const titleInput = document.querySelector(
    `.content_note:nth-child(${i + 1}) .content_title_input`
  );
  const noteTextarea = document.querySelector(`#textContainer${i} .text_area`);

  const title = titleInput.value.trim();
  const note = noteTextarea.value.trim();

  if (title === "") {
    alert("Bitte einen Titel eingeben");
    return;
  } else if (note === "") {
    alert("Bitte eine Notiz eingeben");
    return;
  }

  titles[i] = title;
  notes[i] = note;

  titleInput.setAttribute("readonly", true);
  noteTextarea.setAttribute("readonly", true);

  render();
  save();
}

// Arrays im Local Storage speichern
function save() {
  let titlesAsText = JSON.stringify(titles);
  localStorage.setItem("titles", titlesAsText);

  let notesAsText = JSON.stringify(notes);
  localStorage.setItem("notes", notesAsText);

  let trashTitlesAsText = JSON.stringify(trashTitles);
  localStorage.setItem("trashTitles", trashTitlesAsText);

  let trashNotesAsText = JSON.stringify(trashNotes);
  localStorage.setItem("trashNotes", trashNotesAsText);
}

// Arrays aus dem Local Storage laden
function load() {
  let titlesAsText = localStorage.getItem("titles");
  let notesAsText = localStorage.getItem("notes");
  let trashTitlesAsText = localStorage.getItem("trashTitles");
  let trashNotesAsText = localStorage.getItem("trashNotes");

  // Text umwandeln in ein Array
  // & prüfen ob ("trash")titels & ("trash")notes exestiert
  if (titlesAsText && notesAsText) {
    titles = JSON.parse(titlesAsText);
    notes = JSON.parse(notesAsText);
  }

  if (trashTitlesAsText && trashNotesAsText) {
    trashTitles = JSON.parse(trashTitlesAsText);
    trashNotes = JSON.parse(trashNotesAsText);
  }
}

// Eingabefeld Notiz leeren
function cleanNote() {
  document.getElementById("title").value = "";
  document.getElementById("note").value = "";
}

// Ansicht wechseln zwischen Papierkorb & Home
function trash() {
  document.getElementById("createNote").style.display = "none";
  document.getElementById("trashButton").style.display = "none";
  document.getElementById("contentNotes").style.display = "none";
  document.getElementById("backButton").style.display = "inline-flex";
  document.getElementById("contentTrash").style.display = "flex";
}
function backHome() {
  document.getElementById("createNote").style.display = "flex";
  document.getElementById("contentNotes").style.display = "flex";
  document.getElementById("trashButton").style.display = "inline-flex";
  document.getElementById("backButton").style.display = "none";
  document.getElementById("contentTrash").style.display = "none";
}
