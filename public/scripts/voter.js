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

function voter(){
    $id("tabel-pemilih").addEventListener('click', (e) => {
        const tabelPemilih = Array.from($qAll("#tabel-pemilih .data-pemilih"));
        tabelPemilih.forEach(tab => {
            tab.classList.remove("bg-slate-200");
        });
        e.target.classList.add("bg-slate-200")
    });
}