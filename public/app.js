let rooms = JSON.parse(localStorage.getItem("rooms")) || [];
let currentRoom = null;

function login() {
  const name = document.getElementById("userName").value;
  if (!name) return alert("Isi nama dulu");
  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("mainPage").classList.remove("hidden");
}

function saveData() {
  localStorage.setItem("rooms", JSON.stringify(rooms));
}

function addRoom() {
  const number = document.getElementById("roomNumber").value;
  const status = document.getElementById("statusAwal").value;
  if (!number || !status) return alert("Lengkapi data kamar");

  rooms.push({
    number,
    status1: status,
    status2: "",
    status3: "",
    timeIn: "",
    timeOut: "",
    items: {},
    done: false
  });

  saveData();
  renderRooms();
}

function renderRooms() {
  const list = document.getElementById("roomList");
  list.innerHTML = "";

  rooms.forEach((room, index) => {
    const li = document.createElement("li");
    li.className = "room-item" + (room.done ? " room-done" : "");
    li.innerHTML = `Kamar ${room.number} | ${room.status1}`;
    li.onclick = () => openDetail(index);
    list.appendChild(li);
  });

  document.getElementById("totalKredit").innerText = rooms.length;
  document.getElementById("roomProgress").innerText = rooms.filter(r => !r.done).length;
  document.getElementById("roomDone").innerText = rooms.filter(r => r.done).length;
}

function openDetail(index) {
  currentRoom = index;
  const room = rooms[index];

  document.getElementById("mainPage").classList.add("hidden");
  const page = document.getElementById("detailPage");
  page.classList.remove("hidden");

  page.innerHTML = `
    <h3>Kamar ${room.number}</h3>

    <button onclick="timeIn()">Time In</button>
    <p>${room.timeIn}</p>

    <textarea id="note" placeholder="Catatan"></textarea>

    <button onclick="timeOut()">Time Out</button>
    <p>${room.timeOut}</p>

    <select id="statusAkhir">
      <option value="">Status Akhir</option>
      <option>VC</option>
      <option>OC</option>
      <option>SO</option>
      <option>DL</option>
      <option>NS</option>
      <option>SR</option>
      <option>VCU</option>
    </select>

    <button onclick="finishRoom()">Simpan</button>
  `;
}

function timeIn() {
  rooms[currentRoom].timeIn = new Date().toLocaleTimeString();
  saveData();
  openDetail(currentRoom);
}

function timeOut() {
  rooms[currentRoom].timeOut = new Date().toLocaleTimeString();
  saveData();
  openDetail(currentRoom);
}

function finishRoom() {
  const status = document.getElementById("statusAkhir").value;
  if (!status) return alert("Pilih status akhir");

  rooms[currentRoom].status3 = status;
  rooms[currentRoom].status1 = status;
  rooms[currentRoom].done = true;

  saveData();
  document.getElementById("detailPage").classList.add("hidden");
  document.getElementById("mainPage").classList.remove("hidden");
  renderRooms();
}

function openSummary() {
  document.getElementById("mainPage").classList.add("hidden");
  const page = document.getElementById("summaryPage");
  page.classList.remove("hidden");

  let html = "<h3>Summary Shift</h3>";
  rooms.forEach(r => {
    html += `
      <p>
      Kamar ${r.number}<br>
      Time In ${r.timeIn}<br>
      Time Out ${r.timeOut}<br>
      Status ${r.status1}<br>
      </p>
    `;
  });

  html += `<p>Total Kredit ${rooms.length}</p>`;
  html += `<button onclick="window.print()">Cetak PDF</button>`;
  html += `<button onclick="backHome()">Kembali</button>`;

  page.innerHTML = html;
}

function backHome() {
  document.getElementById("summaryPage").classList.add("hidden");
  document.getElementById("mainPage").classList.remove("hidden");
}

renderRooms();
