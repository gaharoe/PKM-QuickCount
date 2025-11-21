function candidateRequestData(){

    socket.emit("admin-candidate-request-candidate");
    socket.off("admin-candidate-update-candidate");
    socket.on("admin-candidate-update-candidate", (candidates) => {
        $id("candidate-table").innerHTML = `
            <tr class="bg-sky-900 text-neutral-200 h-6">
                <td width="40" height="35" class="text-center">#</td>
                <td>Nama Kandidat</td>
                <td>Kelas</td>
                <td>Visi</td>
                <td>Misi</td>
                <td>Aksi</td>
            </tr>
        `;
        $id("candidate-gallery").innerHTML = "";
        let index = 0;
        for(id in candidates){
            let galery = document.createElement("div");
            galery.className = "min-w-[250px] max-w-[250px] p-3 bg-neutral-50 flex flex-col overflow-hidden snap-start";
            galery.innerHTML = `
                <img class="w-full h-[220px] object-cover" src="${candidates[id].foto}" alt="">
                <div class="mt-2">
                    <p class="mb-3 text-[11px] bg-emerald-600 w-fit rounded-full px-2 text-white">${id}</p>
                    <h1 class="font-bold text-neutral-700">${candidates[id].nama}</h1>
                    <p class="text-xs">${candidates[id].kelas}</p>
                </div>
            `;

            let table = document.createElement("tr");
            table.className = `h-6 bg-slate-${index%2==0?"200":"100"}`;
            table.innerHTML = `
                <td height="35" class="text-center">${++index}</td>
                <td>${candidates[id].nama}</td>
                <td>${candidates[id].kelas}</td>
                <td>${candidates[id].visi.slice(0, 31)}${candidates[id].visi.length > 30 ? "...":""}</td>
                <td>${candidates[id].misi.slice(0, 31)}${candidates[id].misi.length > 30 ? "...":""}</td>
                <td>
                    <button data-id="${id}" class="view-candidate inline-flex items-center justify-center rounded-sm border-b-3 border-blue-600 w-7 h-7 bg-blue-500">
                        <svg width="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9ZM11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12Z" fill="#fff"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M21.83 11.2807C19.542 7.15186 15.8122 5 12 5C8.18777 5 4.45796 7.15186 2.17003 11.2807C1.94637 11.6844 1.94361 12.1821 2.16029 12.5876C4.41183 16.8013 8.1628 19 12 19C15.8372 19 19.5882 16.8013 21.8397 12.5876C22.0564 12.1821 22.0536 11.6844 21.83 11.2807ZM12 17C9.06097 17 6.04052 15.3724 4.09173 11.9487C6.06862 8.59614 9.07319 7 12 7C14.9268 7 17.9314 8.59614 19.9083 11.9487C17.9595 15.3724 14.939 17 12 17Z" fill="#fff"/>
                        </svg>
                    </button>
                    <button data-id="${id}" class="edit-candidate inline-flex items-center justify-center rounded-sm border-b-3 border-green-600 w-7 h-7 bg-green-500">
                        <svg width="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z" fill="#fff"/>
                        </svg>
                    </button>
                    <button data-id="${id}" class="delete-candidate inline-flex items-center justify-center rounded-sm border-b-3 border-red-600 w-7 h-7 bg-red-500">
                        <svg width="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 11V17" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M14 11V17" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M4 7H20" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </td>
            `;
      
            $id("candidate-gallery").appendChild(galery);
            $id("candidate-table").appendChild(table);
        }
        
    });

    $id("add-candidate").addEventListener("click", (e) =>{
        window.location.href = "/admin/add-candidate";
    });

    $id("candidate-table").addEventListener("click", (e) =>{
        if(e.target.closest(".delete-candidate")){
            const candidateID = e.target.closest(".delete-candidate").dataset.id;
            Swal.fire({
                text: `Yakin menghapus ${candidateID}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#d33',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const req = await fetch("/forms/candidate/delete", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({candidateID})
                    });
                    const data = await req.json();
                    if(data.result){
                        Swal.fire({
                            text: `${candidateID} berhasil dihapus.`,
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false
                        });
                    }
                }
            });
        } else if(e.target.closest(".edit-candidate")){
            const candidateID = e.target.closest(".edit-candidate").dataset.id;
            window.location.href = `/admin/edit-candidate?id=${candidateID}`;
        }
    });
}