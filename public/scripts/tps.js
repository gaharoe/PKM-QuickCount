function tpsRequestData(){
    let lastTps = "";
    socket.off("admin-tps-update-tps")
    socket.emit("admin-tps-request-tps");
    socket.on("admin-tps-update-tps", (tps) => {
        let index = 0;
        $id("tps-table").innerHTML = `
            <tr class="bg-sky-900 text-neutral-200 h-6">
                <td width="40" height="35" class="text-center">#</td>
                <td>TPS ID</td>
                <td width="150">Token</td>
                <td width="150">Perolehan Suara</td>
                <td width="100">Status</td>
            </tr>
        `;
        $id("tps-cards").innerHTML = "";
        for(id in tps) {
            lastTps = `TPS-${parseInt(id.split("-")[1])+1}`;
            let status = !tps[id].status ? {color: "bg-red-600", name: "offline", checked: ""} : {color: "bg-emerald-500", name:"online", checked: "checked"};
            let card = document.createElement("div");
            let table = document.createElement("tr");
            
            card.className = "p-2 bg-white rounded-sm shadow-md/15 w-[250px] min-w-[240px]";
            table.className = `h-6 bg-slate-${++index%2==0?"100":"200"}`;

            card.innerHTML = `
                <div class="flex items-center p-0 text-xs text-neutral-700"><div class="w-2 h-2 ${status.color} mr-2 rounded-full"></div> ${status.name} </div>
                <div class="w-60 h-56 flex flex-col justify-center items-center text-lg text-neutral-600">
                    <svg width="45px" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24.6876 16.2809L24.7119 16.3503L24.7379 16.4638L24.7479 16.5748V23.9063C24.7479 24.3334 24.4304 24.6865 24.0186 24.7424L23.9041 24.75H3.09375C2.66659 24.75 2.31357 24.4325 2.25771 24.0208L2.25 23.9063V16.5944L2.25207 16.5349L2.2643 16.4387C2.27571 16.3782 2.29321 16.3206 2.31631 16.2661L5.42052 9.49505C5.54082 9.23266 5.78526 9.05269 6.06547 9.01179L6.1875 9.00294L9.0448 9.00207L8.15725 10.5436L8.08067 10.6896L6.72862 10.6898L4.40775 15.7498H22.5787L20.2982 10.8606L21.2683 9.17611C21.3433 9.23333 21.4089 9.30328 21.4617 9.38375L21.5209 9.48999L24.6876 16.2809ZM15.0359 2.31262L15.1387 2.36321L20.9753 5.74173C21.3445 5.95544 21.4912 6.40713 21.3341 6.79195L21.2835 6.89503L18.126 12.3761L19.4062 12.3768C19.8722 12.3768 20.25 12.7546 20.25 13.2206C20.25 13.6477 19.9325 14.0008 19.5208 14.0567L19.4062 14.0643L17.154 14.0636L17.153 14.067H12.5652L12.5618 14.0636L7.59375 14.0643C7.12776 14.0643 6.75 13.6865 6.75 13.2206C6.75 12.7934 7.06742 12.4404 7.47926 12.3846L7.59375 12.3768L9.64462 12.3761L9.44038 12.2584C9.07118 12.0446 8.92446 11.5929 9.08168 11.2081L9.13215 11.105L13.9884 2.67229C14.2014 2.30214 14.652 2.15503 15.0359 2.31262ZM15.0254 4.24722L11.0113 11.2176L13.0117 12.3761H16.1809L19.404 6.78172L15.0254 4.24722Z" fill="#505050"/>
                    </svg>
                    <p>${ id }</p>
                </div>
                <div class="flex items-center">
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="switch sr-only peer" data-id="${id}" ${status.checked}>
                        <div class="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors"></div>
                        <div class="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-all peer-checked:translate-x-7 shadow"></div>
                    </label>
                    <button data-id="${id}" class="deleteTps inline-flex items-center justify-center rounded-sm w-7 h-7 ml-2 cursor-pointer">
                        <svg width="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 11V17" stroke="#a00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M14 11V17" stroke="#a00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M4 7H20" stroke="#a00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="#a00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#a00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            `;
            table.innerHTML = `
                <tr class="bg-slate-200 h-6 text-center">
                    <td class="text-center">${index}</td>
                    <td>${id}</td>
                    <td>${tps[id].token}</td>
                    <td>${tps[id].suara}</td>
                    <td>${tps[id].status ? "online": "offline"}</td>
                </tr>
            `;
            $id("tps-cards").appendChild(card);
            $id("tps-table").appendChild(table);
        }
            
    });
    $id("tps-cards").addEventListener("click", (e) => {
        const tpsID = e.target.closest(".deleteTps").dataset.id;
        Swal.fire({
            icon: "question",
            text: `Hapus ${tpsID}?`,
            showCancelButton: true,
        }).then(result => {
            result.value ?
                socket.emit("admin-tps-delete-tps", tpsID) : 0;
        });
    });
    $id("tps-cards").addEventListener("change", (e) => {
        e.preventDefault();
        let sw = e.target.closest(".switch");
        let tpsID = sw.dataset.id;
        if(sw){
            sw.checked ? 
                Swal.fire({
                    icon: "question",
                    text: `Nyalakan ${tpsID}?`,
                    showCancelButton: true
                }).then(result => {
                    result.value ?
                        socket.emit("admin-tps-send-status", {id: tpsID, status: 1}) :
                        sw.checked = false
                })
                :
                Swal.fire({
                    icon: "question",
                    text: `Matikan ${tpsID}?`,
                    showCancelButton: true
                }).then(result => {
                    result.value ?
                        socket.emit("admin-tps-send-status", {id: tpsID, status: 0}) :
                        sw.checked = true;
                });
        }
    });

    $id("add-tps").addEventListener("click", (e) => {
        Swal.fire({
            icon: "question",
            text: `Tambahkan ${lastTps}?`,
            showCancelButton: true,
        }).then(result => {
            result.value ?
                socket.emit("admin-tps-add-tps", lastTps) : 0;
        });
    });
}