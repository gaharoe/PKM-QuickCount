  function $id(id) {
    return document.getElementById(id);
  }
  function $qAll(q) {
    return document.querySelectorAll(q);
  }
  function $q(q) {
    return document.querySelector(q);
  }
  function $class(classname) {
    return document.getElementsByClassName(classname);
  }
  

function sideToggle(){
    $id("side").classList.toggle("-ml-55");
}

function newTab(tableName){
  const newTab = document.createElement("button");
  newTab.className = "tab border-r border-r-slate-300 gap-4 flex shrink-0 justify-between items-center text-slate-500 px-3 text-xs"
  newTab.innerHTML = `
    <div class="flex gap-2 items-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-table2-icon lucide-table-2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg>
      <p class="table-name text-nowrap">${tableName}</p>
    </div>
    <div class="close-tab text-slate-500 bg-slate-200 rounded-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </div>
  `;
  return newTab;
}

function renderTabs(tableNames){
  $id("tab-bar").innerHTML = "";
  tableNames.forEach(tab => {
    $id("tab-bar").appendChild(newTab(tab));
  });
}

function renderList(lists){
  if (lists.length < 1) return;
  $id("tabel-pemilih").innerHTML = "";
  lists.forEach(list => {
    let listItem = document.createElement("div");
    listItem.className = "data-pemilih hover:bg-slate-200 pl-2 text-slate-600 flex items-center gap-3 h-7 w-full";
    listItem.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-table2-icon lucide-table-2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg>
      <p>${list}</p>
    `;
    $id("tabel-pemilih").appendChild(listItem);
  });
}

function tabSelected(tableName = 0){
  const tabs = Array.from($class("tab"));
  let tabSelected = "";
  tabs.forEach(tab => {
    if(tab.innerText == tableName){
      tabSelected = tab;
    }
    tab.classList.remove("bg-slate-200");
    tab.classList.add("text-slate-400");
    tab.classList.remove("text-slate-500");
  });
  if(tableName){
    tabSelected.classList.add("bg-slate-200");
    tabSelected.classList.remove("text-slate-400");
    tabSelected.classList.add("text-slate-500");
  }
}

function listSelected(tableName = 0){
  const tabelPemilih = Array.from($qAll("#tabel-pemilih .data-pemilih"));
  let listSelect = "";
  
  tabelPemilih.forEach(tab => {
      if(tab.innerText == tableName){
        listSelect = tab;
      }
      tab.classList.remove("bg-slate-200");
  });
  if(tableName){
    listSelect.classList.add("bg-slate-200");
  }
}

function closeTab(tableName){
  tabs = tabs.filter(t => t != tableName);

}

function renderTableData(tableName = 0, tableData = [], page){
  $id("table-container").innerHTML ="";
  if(!tableName){
    $id("page-buttons").classList.add("hidden");
    $id("table-container").innerHTML = `
      <div class="w-full flex flex-col items-center opacity-40 gap-3">
          <div class="text-center mt-20 text-sm  ">
              <h1>Import file CSV atau XLSX</h1>
              <h1>dengan format tabel berikut</h1>
          </div>
          <table class="border border-collapse w-80 text-xs">
              <tr>
                  <th class="border w-10 h-8 p-1">No</th>
                  <th class="border">Nama</th>
              </tr>
              <tr>
                  <td class="border h-6 text-center">1</td>
                  <td class="border pl-2">Nama siswa ke- 1</td>
              </tr>
              <tr>
                  <td class="border h-6 text-center">2</td>
                  <td class="border pl-2">Nama siswa ke- 2</td>
              </tr>
              <tr>
                  <td class="border h-6 text-center">3</td>
                  <td class="border pl-2">Nama siswa ke- 3</td>
              </tr>
              <tr>
                  <td class="border h-6 text-center">....</td>
                  <td class="border pl-2">....</td>
              </tr>
              <tr>
                  <td class="border h-6 text-center">n</td>
                  <td class="border pl-2">Nama siswa ke- n</td>
              </tr>
          </table>
      </div>
    `;
    return;
  }
  
  const tableDataGroup = tableData.filter(td => td.group == tableName);
  const totalPage = Math.ceil(tableDataGroup.length / 15) || 1;
  const pagedDataGroup = pagination(tableDataGroup, page);
  $id("total-page").innerText = totalPage;
  $id("current-page").innerText = page;
  $id("page-buttons").classList.remove("hidden");

  let index = (page - 1) * 15 + 1;

  const optionBar = document.createElement("div");
  const table = document.createElement("table");

  optionBar.className = "w-full bg-slate-200 border-b border-b-slate-300 flex items-center p-2 gap-2";
  table.className = "border-collapse  w-full";

  optionBar.innerHTML = `
    <form id="search" class="flex gap-2">
        <input class="rounded-sm h-7 text-slate-500 text-xs w-50 bg-slate-100 border border-slate-300 px-2 outline-none" type="text" name="search-data" id="search-data" placeholder="Cari nama pemilih...">
        <button class="flex gap-1 text-xs bg-slate-300 px-1 items-center justify-center rounded-sm border border-[rgb(148,163,184,.5)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
        </button>
    </form>
    <button class="flex gap-1 text-xs bg-slate-300 p-1 items-center justify-center rounded-sm border border-[rgb(148,163,184,.5)]">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-ccw-icon lucide-refresh-ccw"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
    </button>
    <button class="flex gap-1 text-xs bg-red-200 p-1 items-center justify-center rounded-sm border border-[rgb(248,113,113,.5)] text-rose-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
    </button>
  `;

  table.innerHTML = `
    <tr class="text-xs text-slate-500 bg-slate-200">
        <th class="border border-slate-300 border-t-0 border-l-0 py-1 w-10">No</th>
        <th class="border border-slate-300 border-t-0">Nama</th>
        <th class="border border-slate-300 border-t-0 w-30">Token</th>
        <th class="border border-slate-300 border-t-0 w-30">Status</th>
    </tr>
  `;

  pagedDataGroup.forEach(td => {
    const tableRow = document.createElement("tr");
    tableRow.className = "text-xs text-slate-600";
    tableRow.innerHTML = `
      <td class="border  border-slate-300 border-t-0 border-l-0 py-1 w-10 text-center">${index++}</td>
      <td class="border pl-2 border-slate-300 border-t-0">${td.nama}</td>
      <td class="border  border-slate-300 border-t-0 w-30 text-center">${td.token}</td>
      <td class="border pl-2 border-slate-300 border-t-0 w-30">${td.status}</td>
    `;
    table.appendChild(tableRow);  
  });
  $id("table-container").appendChild(optionBar);
  $id("table-container").appendChild(table);
  
  $id("search").addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData($id("search"));
    const keyword = formData.get("search-data");
    const filteredPemilih = tableData.filter(p => p.nama.toLowerCase().includes(keyword));
    renderTableData(tableName, filteredPemilih, 1);
  });
};

function pagination(pemilih, page){
  const start = (page - 1) * 15;
  return pemilih.slice(start, start + 15);
}

function refresh() {

}

function voter(){
  // dummy 
  const pemilih = [
    {no: 1, nama: "Ilham Candra Mukti", token: "873-341", status: "belum voting", group: "Kelas X IPA 1" },
    {no: 2, nama: "Dewi Lestari Putri", token: "552-119", status: "belum voting", group: "Kelas X IPA 1" },
    {no: 3, nama: "Rizki Aditya Pratama", token: "901-773", status: "belum voting", group: "Kelas X IPA 1" },
    {no: 4, nama: "Nabila Safira", token: "441-220", status: "belum voting", group: "Kelas X IPA 1" },
    {no: 5, nama: "Gilang Prakoso", token: "334-992", status: "belum voting", group: "Kelas X IPA 1" },
    {no: 6, nama: "Aulia Rahmadani", token: "129-554", status: "belum voting", group: "Kelas X IPA 1" },
    {no: 7, nama: "Faris Nur Hakim", token: "662-781", status: "belum voting", group: "Kelas X IPA 1" },
    {no: 8, nama: "Melati Anggraini", token: "205-668", status: "belum voting", group: "Kelas X IPA 1" },
    {no: 9, nama: "Bagas Kurniawan", token: "884-317", status: "belum voting", group: "Kelas X IPA 1" },
    {no: 10, nama: "Siti Rahmawati", token: "721-402", status: "belum voting", group: "Kelas X IPA 1" },
    {no: 11, nama: "M. Fahri Ramadhan", token: "557-903", status: "belum voting", group: "Kelas X IPA 1" },
    {no: 12, nama: "Citra Amelia", token: "468-120", status: "belum voting", group: "Kelas X IPA 1" },
    {no: 13, nama: "Andika Alfarizi", token: "339-550", status: "belum voting", group: "Kelas X IPA 1" },
    {no: 14, nama: "Nur Aisyah", token: "904-144", status: "belum voting", group: "Kelas X IPA 1" },
    {no: 15, nama: "Rendi Saputra", token: "611-893", status: "belum voting", group: "Kelas X IPA 1" },
    {no: 16, nama: "Putri Ayu Lestari", token: "480-233", status: "belum voting", group: "Kelas X IPA 1" },
    {no: 17, nama: "Yoga Firmansyah", token: "733-501", status: "belum voting", group: "Kelas X IPA 1" },
    {no: 18, nama: "Ayu Maharani", token: "560-444", status: "belum voting", group: "Kelas X IPA 1" },
    {no: 19, nama: "Rafli Kurnia Ramadhani", token: "212-667", status: "belum voting", group: "Kelas X IPA 1" },
    {no: 20, nama: "Shafira Zahra", token: "803-991", status: "belum voting", group: "Kelas X IPA 1" }
  ];
  let tabs = [];
  let currentPage = 1;
  let tableList = ["Kelas X IPA 1", "Kelas X IPA 2","Kelas X IPA 3","Kelas X IPA 4","Kelas X IPA 5"];
  let selectedTab = "";
  renderList(tableList);

  $id("tabel-pemilih").addEventListener('click', (e) => {
    if(e.target.closest(".data-pemilih")){
      selectedTab = e.target.innerText;
      if(!tabs.includes(selectedTab)){
        tabs.push(selectedTab);
      }
      renderTabs(tabs);
      listSelected(selectedTab);
      tabSelected(selectedTab);
      renderTableData(selectedTab, pemilih, 1);
    }
  });

  $id("tab-bar").addEventListener("click", (e) => {
    const tab = e.target.closest(".tab");
    const tableName = tab.querySelector("div p.table-name").innerText;
    if(e.target.closest(".close-tab")){
      tabToClose = e.target.closest(".tab").querySelector(".table-name").innerText;
      if(tabToClose == selectedTab){
        selectedTab = 0;
      }
      tabs = tabs.filter(t => t != tabToClose);
      renderTabs(tabs);
      tabSelected(selectedTab);
      listSelected(selectedTab);
      renderTableData(selectedTab, pemilih, 1);
    } else if(e.target.closest(".tab")){
      selectedTab = tableName;
      tabSelected(selectedTab);
      listSelected(selectedTab);
      renderTableData(selectedTab, pemilih, 1);
    } 
  });

  $id("prev-page").addEventListener("click", () => {
    if(currentPage == 1) return;
    renderTableData(selectedTab, pemilih, --currentPage);
  });
  
  $id("next-page").addEventListener("click", () => {
    const totalPage = parseInt($id("total-page").innerText)
    if(currentPage == totalPage) return;
    renderTableData(selectedTab, pemilih, ++currentPage);
  });

  $id("import-csv").addEventListener("click", () => {
    Swal.fire({
      text: "Import Data Pemilih",
      html: `
      <input type="text" id="table-name" class="w-full h-10 px-3 mb-3 outline-none text-xs rounded-sm border border-slate-300" placeholder="Nama tabel: Kelas X MIPA 1, Kelas X TKJ 3...">
      <label for="file-import" class="w-full h-30 rounded-sm  hover:bg-slate-100 border border-slate-300 border-dashed flex items-center justify-center text-xs text-slate-400 ">
          <input type="file" id="file-import" class="hidden" accept=".csv,.xlsx">
          <p id="file-name">+ Pilih file CSV/XLSX</p>
      </label>  
      `,
      showCancelButton: true,
      confirmButtonText: 'Upload',
      didOpen: () => {
        const file = document.getElementById('file-import');
        file.addEventListener("change", () => {
          $id("file-name").innerText = file.files[0].name;
        });
      },
      preConfirm: () => {
        const file = document.getElementById('file-import').files[0];
        const tableName = $id("table-name").value;
        if (!file || !tableName) {
          Swal.showValidationMessage('Isi data dengan lengkap');
          return false;
        }
        return {file, tableName};
      }
    }).then(result => {
      if (result.isConfirmed) {
        const data = result.value;
        console.log(data);
        // proses upload di sini
      }
    });

  });
}